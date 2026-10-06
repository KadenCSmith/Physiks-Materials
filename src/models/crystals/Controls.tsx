import { useEffect, useId, useState } from 'react'
import { useNumberFormat } from '../../framework/formatting'
import type { SimulationControlsProps, SimulationLessonProps } from '../../framework/types'
import { cubicFamily, direction, directionPoints, integerIndices, parseCoordinate, planeData, type V3 } from './calculation'
import { Indices } from './Notation'
import { planeEquation } from './planeAnimation'

function VectorFields({ labels, values, setValue }: { labels: string[]; values: string[]; setValue: (index: number, value: string) => void }) {
  return <div className="crystal-vector-fields">{labels.map((label, i) => <label key={label}>{label}<input aria-label={label} inputMode="decimal" type="text" autoComplete="off" value={values[i]} onChange={event => setValue(i, event.target.value)} /></label>)}</div>
}
function DirectionEditor({ parameters: p, onParametersChange: change }: SimulationControlsProps) {
  const mode = p.directionMode
  const keys = mode === 1 ? ['du', 'dv', 'dw'] : ['sx', 'sy', 'sz', 'ex', 'ey', 'ez']
  const serialized = keys.map(key => p[key]).join(',')
  const [draft, setDraft] = useState(serialized.split(','))
  const [feedback, setFeedback] = useState('')
  const feedbackId = useId()
  useEffect(() => { setDraft(serialized.split(',')) }, [serialized])
  const edit = (index: number, value: string) => { setDraft(old => old.map((item, i) => i === index ? value : item)); setFeedback('') }
  return <form className="crystal-editor" aria-describedby={feedbackId} onSubmit={event => {
    event.preventDefault()
    const values = draft.map(parseCoordinate)
    if (values.some(v => v === null)) { setFeedback('Enter a finite number or fraction in every field, such as 1/2.'); return }
    const numbers = values as number[]
    if (mode === 1 && numbers.some(v => !Number.isInteger(v) || Math.abs(v) > 12)) { setFeedback('Use integer indices from −12 to 12.'); return }
    if (mode === 0 && numbers.some(v => v < 0 || v > 1)) { setFeedback('Tail and head coordinates must lie between 0 and 1 in this cell. Use indices for any signed orientation.'); return }
    const start: V3 = mode === 1 ? [0, 0, 0] : numbers.slice(0, 3) as V3
    const end: V3 = mode === 1 ? numbers as V3 : numbers.slice(3, 6) as V3
    try { if (direction(start, end).every(v => v === 0)) { setFeedback('A direction needs two different points, or at least one nonzero index.'); return } }
    catch { setFeedback('Use rational fractions with denominators up to 1000.'); return }
    change({ ...Object.fromEntries(keys.map((key, i) => [key, numbers[i]])), view: 1, reference: 0 })
    setFeedback('Direction applied. The diagram and calculated values now use your input.')
  }}>
    {mode === 1 ? <><p>Signed integers describe an orientation. The arrow is scaled to fit one cell; proportional indices reduce to the same direction.</p><VectorFields labels={['u', 'v', 'w']} values={draft} setValue={edit} /></> : <><p>Coordinates are fractions of a, from 0 to 1. Decimals and fractions such as 1/3 work. The arrow runs from tail to head.</p><VectorFields labels={['Tail x', 'Tail y', 'Tail z']} values={draft.slice(0, 3)} setValue={edit} /><VectorFields labels={['Head x', 'Head y', 'Head z']} values={draft.slice(3)} setValue={(i, value) => edit(i + 3, value)} /></>}
    <button className="crystal-apply" type="submit">Calculate direction</button><p id={feedbackId} role="status" className="crystal-feedback">{feedback}</p>
  </form>
}
function PlaneEditor({ parameters: p, onParametersChange: change }: SimulationControlsProps) {
  const mode = p.planeInput
  const keys = mode === 1 ? ['ph', 'pk', 'pl', 'planeLevel'] : ['ix', 'iy', 'iz']
  const serialized = keys.map(key => p[key]).join(',')
  const [draft, setDraft] = useState(serialized.split(','))
  const [parallel, setParallel] = useState([p.ix === 0, p.iy === 0, p.iz === 0])
  const [feedback, setFeedback] = useState('')
  const feedbackId = useId()
  useEffect(() => { setDraft(serialized.split(',')); if (mode === 0) setParallel(serialized.split(',').map(value => Number(value) === 0)) }, [serialized, mode])
  const edit = (index: number, value: string) => { setDraft(old => old.map((item, i) => i === index ? value : item)); setFeedback('') }
  return <form className="crystal-editor" aria-describedby={feedbackId} onSubmit={event => {
    event.preventDefault()
    const values = draft.map((value, i) => mode === 0 && parallel[i] ? 0 : parseCoordinate(value))
    if (values.some(v => v === null)) { setFeedback('Enter a finite number or fraction in every active field.'); return }
    const numbers = values as number[]
    if (numbers.some(v => Math.abs(v) > 12)) { setFeedback('Use values between −12 and 12.'); return }
    if (mode === 1 && numbers.slice(0, 3).some(v => !Number.isInteger(v))) { setFeedback('Miller indices h, k, l must be integers. The plane level can be fractional.'); return }
    if (mode === 0 && numbers.some((v, i) => v === 0 && !parallel[i])) { setFeedback('A zero intercept lies at the origin and cannot be inverted. Use Miller indices with level 0 for an origin-crossing plane, or choose Parallel.'); return }
    if (numbers.slice(0, 3).every(v => v === 0)) { setFeedback('At least one index or nonparallel intercept must be nonzero.'); return }
    const valuesToApply = { ...Object.fromEntries(keys.map((key, i) => [key, numbers[i]])), planeCase: 0, reference: 0, view: 2 }
    try { planeData({ ...p, ...valuesToApply }) } catch { setFeedback('Use simple rational intercepts whose reciprocals have denominators up to 1000.'); return }
    change(valuesToApply)
    setFeedback('Plane applied. Its normal, offset and intersection with the cell are recalculated.')
  }}>
    {mode === 1 ? <><p>The slice satisfies h(x/a) + k(y/a) + l(z/a) = q. Use q = 1 for the usual (hkl) intercepts, q = 0 through the origin, or another q to translate it.</p><VectorFields labels={['h', 'k', 'l']} values={draft.slice(0, 3)} setValue={edit} /><label className="crystal-level">Plane level q<input aria-label="Plane level q" inputMode="decimal" value={draft[3]} onChange={e => edit(3, e.target.value)} /></label></> : <><p>Axis intercepts are in units of a. Choose Parallel for an infinite intercept; its reciprocal is zero. Negative intercepts keep their sign.</p><div className="crystal-intercepts">{['x', 'y', 'z'].map((axis, i) => <div key={axis}><label>{axis} intercept<input aria-label={`${axis} intercept`} inputMode="decimal" disabled={parallel[i]} value={parallel[i] ? '∞' : draft[i]} onChange={e => edit(i, e.target.value)} /></label><label className="crystal-parallel"><input aria-label={`Parallel to ${axis}`} type="checkbox" checked={parallel[i]} onChange={e => { setParallel(old => old.map((value, j) => j === i ? e.target.checked : value)); if (!e.target.checked && Number(draft[i]) === 0) edit(i, '1'); setFeedback('') }} />Parallel</label></div>)}</div></>}
    <button className="crystal-apply" type="submit">Calculate plane</button><p id={feedbackId} role="status" className="crystal-feedback">{feedback}</p>
  </form>
}
export function GeometryResults({ parameters: p, snapshot: s }: SimulationLessonProps) {
  const { format: n } = useNumberFormat()
  const view = Math.round(p.view)
  if (view !== 1 && view !== 2) return <section className="crystal-results" aria-label="Calculated geometry"><p>{view === 3 ? 'BCC (200): one interior atom in repeat area a². Atom density is 1/a²; area packing fraction is 3π/16.' : 'Corner atoms contribute 1/8 each; face-center atoms contribute 1/2 each; interior atoms belong wholly to the cell.'}</p></section>
  let pd: ReturnType<typeof planeData> | null = null
  try { pd = planeData(p) } catch { /* Invalid plane is explained below. */ }
  const { start, end } = directionPoints(p)
  const delta = end.map((value, i) => value - start[i]) as V3
  const values: V3 = view === 1 ? [s.u, s.v, s.w] : [s.h, s.k, s.l]
  return <section className="crystal-results" aria-label="Calculated geometry"><span className="eyebrow">CURRENT CALCULATION</span>{view === 1 ? s.validDirection ? <>
    <h3><Indices values={values} /> <small>direction</small></h3><p>Tail ({start.map(n).join(', ')}) → head ({end.map(n).join(', ')})</p><p>Displacement ({delta.map(n).join(', ')}) a → reduce proportions → <Indices values={values} />.</p><dl><div><dt>Unit direction</dt><dd>({[s.unitX, s.unitY, s.unitZ].map(n).join(', ')})</dd></div><div><dt>Drawn arrow length</dt><dd>{n(s.directionLength)} Å</dd></div><div><dt>Angles to +x, +y, +z</dt><dd>{[s.angleX, s.angleY, s.angleZ].map(n).join('°, ')}°</dd></div><div><dt>Cubic symmetry family</dt><dd><Indices kind="directionFamily" values={cubicFamily(values)} /></dd></div></dl><p>Indices give orientation, not the drawn segment’s length. Negative numbers carry an overbar over the whole number.</p>
  </> : <p role="status">Direction undefined: use different tail/head points or nonzero integer indices.</p> : s.validPlane && pd ? <>
    <h3><Indices values={values} kind="plane" /> <small>plane indices</small></h3><p>Equivalent slice equation: {planeEquation(values, pd.indexLevel, [1, 1, 1], n).replace(/([xyz])/g, '($1/a)')}.</p><p>Intercepts: {pd.normal.map((value, i) => `${'xyz'[i]}: ${value === 0 ? pd.level === 0 ? 'axis contained in plane' : '∞ (parallel)' : n(pd.level / value) + ' a'}`).join('; ')}.</p><dl><div><dt>Normal direction</dt><dd><Indices values={integerIndices(values)} /></dd></div><div><dt>Index-vector spacing d</dt><dd>{n(s.spacing)} Å</dd></div><div><dt>Slice distance from origin</dt><dd>{n(s.originDistance)} Å</dd></div><div><dt>Area inside this cell</dt><dd>{n(s.sliceArea)} Å²</dd></div><div><dt>Cubic symmetry family</dt><dd><Indices kind="planeFamily" values={cubicFamily(values)} /></dd></div></dl><p>d = a/√(h² + k² + l²) for a cubic cell. The drawn slice is at distance |q|d when its equation uses integer h, k, l. For arbitrary indices, this is a geometric spacing, not a promise of occupied atom layers. Its area is the cell-clipped geometric area; it is not a planar repeat area or atom density.</p>{s.sliceArea === 0 && <p role="status">This is a valid orientation, but the chosen level has no positive-area patch inside this cell. Change q or an intercept to bring the slice into view.</p>}{pd.level === 0 && <p>At q = 0 this plane crosses the origin. Translate it to a nonzero parallel level before taking reciprocal intercepts.</p>}
  </> : <p role="status">Plane undefined: choose at least one nonzero Miller index or finite nonzero intercept.</p>}</section>
}
export function Controls(props: SimulationControlsProps) {
  const { parameters: p, onParametersChange: change } = props
  const id = useId()
  if (p.view !== 1 && p.view !== 2) return <p className="crystal-help">{p.view === 3 ? 'This density calculation fixes BCC and the (200) slice. Use atomic radius to change a and 1/a².' : 'Inspect the shared-atom contributions in the diagram. Choose Direction or Plane to create your own geometry.'}</p>
  return <fieldset className="parameter-group crystal-customization"><legend>{p.view === 1 ? 'Build a direction' : 'Build a plane'}</legend>{p.view === 1 ? <>
    <div className="crystal-editor-tabs" aria-label="Direction input method">{['Tail and head', 'Direction indices'].map((name, i) => <button key={name} aria-pressed={p.directionMode === i} onClick={() => change({ directionMode: i })}>{name}</button>)}</div>
    <DirectionEditor {...props} key={`direction-${p.directionMode}`} />
    <div className="crystal-editor-tabs"><button onClick={() => change({ directionMode: 1, du: 1, dv: 1, dw: 1, reference: 0 })}>Try [111]</button><button onClick={() => change(p.directionMode === 1 ? { du: -p.du, dv: -p.dv, dw: -p.dw } : { sx: p.ex, sy: p.ey, sz: p.ez, ex: p.sx, ey: p.sy, ez: p.sz })}>Reverse arrow</button></div>
  </> : <>
    <label htmlFor={id}>Plane example</label><select id={id} aria-label="Plane example" value={p.reference === 1 && p.planeCase === 1 ? 3 : p.planeCase} onChange={e => {
      const choice = Number(e.target.value)
      change(choice === 0 ? { planeCase: 0, reference: 0 } : choice === 2 ? { planeCase: 2, structure: 1, reference: 0 } : { planeCase: 1, structure: 2, translate: choice === 3 ? 1 : 0, reference: choice === 3 ? 1 : 0 })
    }}><option value={0}>My plane</option><option value={1}>Exam B · origin-crossing FCC</option><option value={2}>Exam C · BCC (011)</option><option value={3}>Lecture B · translated FCC</option></select>
    {p.planeCase === 0 ? <><div className="crystal-editor-tabs" aria-label="Plane input method">{['Axis intercepts', 'Miller indices'].map((name, i) => <button key={name} aria-pressed={p.planeInput === i} onClick={() => change({ planeInput: i })}>{name}</button>)}</div><PlaneEditor {...props} key={`plane-${p.planeInput}`} /><div className="crystal-editor-tabs"><button onClick={() => change({ planeInput: 1, ph: 1, pk: 1, pl: 0, planeLevel: 1 })}>Try (110)</button><button onClick={() => change({ planeInput: 1, ph: 2, pk: 0, pl: 0, planeLevel: 1 })}>Try (200)</button></div></> : <><p className="crystal-help">{p.planeCase === 1 ? 'B has normal [2 1 −1]. Translate its origin-crossing slice to level 1 to reveal the intercept method.' : 'C has y = a, z = a and is parallel to x; its indices are (011).'}</p>{p.planeCase === 1 && <button className="crystal-apply" aria-pressed={p.translate === 1} onClick={() => change({ translate: 1 - p.translate })}>{p.translate === 1 ? 'Show original plane through origin' : 'Translate to level 1'}</button>}<button className="crystal-apply" onClick={() => { const data = planeData(p); change({ planeCase: 0, reference: 0, planeInput: 1, ph: data.indices[0], pk: data.indices[1], pl: data.indices[2], planeLevel: data.indexLevel }) }}>Edit this plane</button></>}
  </>}<GeometryResults parameters={p} snapshot={props.snapshot} time={0} /></fieldset>
}
