import { useId, useMemo } from 'react'
import { useNumberFormat } from '../../framework/formatting'
import type { SimulationSceneProps } from '../../framework/types'
import { MathFormula } from '../../framework/Math'
import { Choice } from '../shared/StudyPanel'
import { reactions, kvTex, energyComparison, KB, species, sites, speciesValences, siteValences } from './calculation'
import { inventory, reactionAtoms, reactionStage, reactionSteps, scientificTex, termLabel, termTex, topicTitles } from './presentation'

const colors: Record<string, string> = { Pt: '#9db8e8', O: '#a2b8a4', Ta: '#d4b184' }
const energyColors = ['#9db8e8', '#d4b184', '#a2b8a4']
const energyNames = ['Anion Frenkel', 'Cation Frenkel', 'Schottky cluster']

export function Scene({ parameters: p, snapshot: s, display, onParameterChange: change, onSeek }: SimulationSceneProps) {
  const { format: n } = useNumberFormat(), id = useId(), topic = Math.round(p.topic ?? 0)
  const r = Math.round(p.reaction), reaction = reactions[r], stage = reactionStage(s.progress)
  const speciesId = Math.round(p.species), siteId = Math.round(p.site)
  const expected = speciesValences[speciesId] - siteValences[siteId]
  const sign = (value: number) => `${value > 0 ? '+' : ''}${n(value)}`
  const formation = p.energyMode === 1, energy = energyComparison(p.temperature, formation)
  const logMin = formation ? -25 : -75
  const graphX = (temperature: number) => 100 + (temperature - 300) / 1700 * 580
  const graphY = (logValue: number) => 285 - (Math.max(logMin, logValue) - logMin) / -logMin * 210
  const curves = useMemo(() => [0, 1, 2].map(i => Array.from({ length: 101 }, (_, j) => {
    const temperature = 300 + 17 * j, log = energyComparison(temperature, formation)[i].logFraction
    return `${100 + j * 5.8},${285 - (Math.max(formation ? -25 : -75, log) - (formation ? -25 : -75)) / (formation ? 25 : 75) * 210}`
  }).join(' ')), [formation])
  const allocations = useMemo(() => reactionAtoms(r), [r])
  const before = inventory(reaction.left), after = inventory(reaction.right)
  const stageCopy = reactionSteps[r][(['before', 'change', 'after'] as const)[stage.index]]

  return <>
    <div className="materials-scene-controls">
      <Choice label="What would you like to understand?" value={topic} options={topicTitles} onChange={value => change('topic', value)} />
      {topic === 0 && <>
        <Choice label="Species X · what occupies the site" value={p.species} options={['Pt', 'O', 'Ta', 'Vacancy V']} onChange={value => change('species', value)} />
        <Choice label="Site Y · which kind of position" value={p.site} options={['Pt site', 'O site', 'Interstitial i']} onChange={value => change('site', value)} />
        <div className="materials-tabs"><button onClick={() => { change('species', 3); change('site', 1); change('charge', 2) }}>Try an oxygen vacancy</button><button onClick={() => { change('species', 2); change('site', 0); change('charge', -1) }}>Exam example · Ta on Pt</button></div>
        <label className="defects-charge-input">Your proposed effective charge <select aria-label="Proposed effective charge in scene" value={p.charge} onChange={event => change('charge', Number(event.target.value))}>{Array.from({length:17}, (_, index) => index - 8).map(value => <option key={value} value={value}>{sign(value)} · {value === 0 ? '×' : value > 0 ? '•'.repeat(value) : '′'.repeat(-value)}</option>)}</select><span>Whole units: dot = +1, prime = −1, × = 0</span></label>
      </>}
      {topic === 1 && <>
        <label className="defects-reaction-select">Balanced reaction <select aria-label="Balanced reaction in scene" value={r} onChange={event => { change('reaction', Number(event.target.value)); change('reference', 0) }}>{reactions.map((entry, index) => <option key={entry.title} value={index}>{entry.title}</option>)}</select></label>
        <div className="materials-tabs"><button onClick={() => { change('reference', 0); change('reaction', 1) }}>Q2a · cation Frenkel</button><button onClick={() => { change('reference', 1); change('reaction', 3) }}>Inspected lecture · Ta substitution</button></div>
        <nav className="materials-tabs defects-stage-buttons" aria-label="Freeze reaction at a stage">{['1 · Before', '2 · Change', '3 · Check products'].map((label, index) => <button key={label} aria-pressed={stage.index === index} onClick={() => onSeek?.([0, 6, 12][index])}>{label}</button>)}</nav>
      </>}
      {topic === 2 && <>
        <Choice label="What do the supplied energies mean?" value={p.energyMode} options={['Exam activation barriers', 'Conditional formation assumption']} onChange={value => change('energyMode', value)} />
        <label className="defects-charge-input">Absolute temperature <input aria-label="Temperature in scene" type="number" min="300" max="2000" step="10" value={p.temperature} onChange={event => { if (event.target.value.trim()) change('temperature', Number(event.target.value)) }} /><span>K · kBT = {n(KB * p.temperature)} eV</span></label>
      </>}
    </div>

    {topic === 0 && <>
      <svg className="materials-scene defects-symbol-scene" viewBox="0 0 760 300" role="img" aria-labelledby={id}>
        <title id={id}>Species minus normal site charge gives the effective Kröger–Vink charge</title>
        {[{ x: 45, title: `X · SPECIES ${species[speciesId]}`, value: sign(speciesValences[speciesId]), detail: 'Ionic charge' }, { x: 295, title: `Y · ${siteId === 2 ? 'INTERSTITIAL' : `${sites[siteId]} SITE`}`, value: `(${sign(siteValences[siteId])})`, detail: 'Normal occupant' }, { x: 545, title: 'q · EFFECTIVE', value: sign(expected), detail: 'Relative charge' }].map((card, index) => <g key={card.title}>
          <rect x={card.x} y="50" width="170" height="160" rx="8" fill="#111" stroke={Math.min(2, Math.floor(s.progress * 3)) === index ? '#9db8e8' : '#444'} strokeWidth="2" />
          <text x={card.x + 85} y="83" textAnchor="middle" className="defects-svg-small">{card.title}</text><text x={card.x + 85} y="140" textAnchor="middle" className="large-label">{card.value}</text><text x={card.x + 85} y="182" textAnchor="middle" className="defects-svg-small">{card.detail}</text>
        </g>)}
        <text x="255" y="145" textAnchor="middle" className="large-label">−</text><text x="505" y="145" textAnchor="middle" className="large-label">=</text>
        {display.labels && <text x="380" y="260" textAnchor="middle">Charge is relative to the normal occupant of Y.</text>}
      </svg>
      <div className="materials-kv-symbol defects-symbol-work">
        <h3>Build the superscript from the charge subtraction</h3>
        <MathFormula tex={`q=${speciesValences[speciesId]}-(${siteValences[siteId]})=${expected}`} />
        <div className="defects-symbol-pair"><div><span>Your proposed symbol</span>{Number.isInteger(p.charge) ? <MathFormula tex={kvTex(speciesId, siteId, p.charge)} /> : <p>Choose a whole charge; charge marks cannot be fractional.</p>}</div><div><span>Calculated symbol</span><MathFormula tex={kvTex(speciesId, siteId, expected)} /></div></div>
        <p role="status">{s.chargeValid ? 'Your superscript is correct for this species and site.' : `Use effective charge ${sign(expected)} for this species and site.`} Each dot is +1; each prime is −1; × is zero.</p>
        <p>A host atom can be X: Pt on a Pt site is neutral relative to that site. A vacancy is species V. Its site Y is Pt, O or i; there is no site type called “vacancy.”</p>
      </div>
      <p className="materials-note">Formal host: PtO₃ gives Pt⁶⁺ and O²⁻; Ta₂O₅ gives Ta⁵⁺. For an interstitial, the normal occupant is absent and its reference charge is zero. This is the exam's formal ionic exercise.</p>
    </>}

    {topic === 1 && <>
      <div className="defects-stage-caption materials-note"><strong>{stage.label} · {reaction.title}</strong><p>{stageCopy}</p><p>{reactionSteps[r].lesson}</p></div>
      <svg className="materials-scene defects-reaction-scene" viewBox="0 0 760 375" role="img" aria-labelledby={id}>
        <title id={id}>{reaction.title}: conserved atoms allocated from reactant terms to product terms; {stage.label}</title>
        <text x="45" y="34">REACTANT INVENTORY</text><text x="425" y="34">PRODUCT INVENTORY</text>
        {[reaction.left, reaction.right].map((terms, side) => terms.map((term, index) => <g key={`${side}-${index}`} opacity={side === 1 && stage.index === 0 ? .45 : 1}>
          <rect x={side === 0 ? 45 : 425} y={55 + index * 82} width="290" height="72" rx="5" fill="#101010" stroke="#444" />
          <text x={side === 0 ? 58 : 438} y={75 + index * 82} className="defects-svg-small">{termLabel(term)}</text>
          {!Object.keys(term.atoms).length && <text x={side === 0 ? 58 : 438} y={104 + index * 82} className="defects-svg-small">{term.name === 'h•' ? `Electronic charge: +${n(term.coefficient)}` : `Site count: ${n(Object.values(term.sites).reduce((sum, count) => sum + count, 0) * term.coefficient)} · no atom`}</text>}
        </g>))}
        {allocations.map((atom, index) => <g key={index}><circle cx={atom.from[0] + (atom.to[0] - atom.from[0]) * stage.movement} cy={atom.from[1] + (atom.to[1] - atom.from[1]) * stage.movement} r="10" fill={colors[atom.element]} />{display.labels && <text x={atom.from[0] + (atom.to[0] - atom.from[0]) * stage.movement} y={atom.from[1] + (atom.to[1] - atom.from[1]) * stage.movement + 3} textAnchor="middle" className="defects-atom-label">{atom.element}</text>}</g>)}
        <text x="45" y="330" className="defects-svg-small">Blue Pt · green O · gold Ta · each moving circle is one conserved atom.</text>
        <text x="45" y="353" className="defects-svg-small">Term allocation is a bookkeeping reveal, not a physical lattice or migration path.</text>
      </svg>
      <div className="defects-reaction-equation materials-note"><h3>Full balanced reaction</h3><MathFormula tex={reaction.tex} /><p>Normal sites and explicit empty interstitials account for site inventory. PtO₃(s) is an external surface/solid reservoir. A hole carries charge but contains no atoms.</p></div>
      <div className="defects-products-work"><h3>What each product contributes</h3><div className="defects-table-scroll"><table className="materials-facts defects-product-table"><thead><tr><th scope="col">Product</th><th scope="col">Count</th><th scope="col">q each</th><th scope="col">Count × q</th><th scope="col">Meaning</th></tr></thead><tbody>{reaction.right.map(term => <tr key={term.name}><td><MathFormula tex={termTex(term)} /></td><td>{n(term.coefficient)}</td><td>{sign(term.charge)}</td><td>{sign(term.coefficient * term.charge)}</td><td>{termLabel({...term, coefficient:1})}</td></tr>)}</tbody></table></div><p className="materials-note">The superscript gives q for one defect. Multiplying by its count gives that term's charge contribution. The contributions add to zero in these neutral examples; reservoirs carry atoms without extra site charge.</p></div>
      <div className="defects-balance-work"><h3>Check the same totals on both sides</h3><table className="materials-facts"><thead><tr><th scope="col">Conserved quantity</th><th scope="col">Reactants</th><th scope="col">Products</th></tr></thead><tbody>{([['Pt atoms', 'Pt'], ['O atoms', 'O'], ['Ta atoms', 'Ta'], ['Effective charge', 'charge'], ['Pt sites', 'PtSites'], ['O sites', 'OSites'], ['Interstitial sites', 'iSites']] as const).map(([label, key]) => <tr key={key}><th scope="row">{label}</th><td>{n(before[key])}</td><td>{n(after[key])}</td></tr>)}</tbody></table><p className="materials-note">Atom residual {n(s.massResidual)} · charge residual {n(s.chargeResidual)} · site residual {n(s.siteResidual)}. These fixed reactions are formal balanced examples; selecting one does not identify the preferred real doping mechanism.</p></div>
      {p.reference === 1 && r === 3 && <p className="materials-note">Inspected lecture, 3:35: two Ta-on-Pt defects, one oxygen vacancy and normal oxygen ions are visible. The app independently adds the displaced-host reservoir for full atom and site balance. The unfinished interstitial line is not attributed.</p>}
    </>}

    {topic === 2 && <>
      <div className="materials-note defects-energy-summary"><strong>{formation ? 'Additional assumption: treat the numbers as formation energies' : 'Exam answer: compare activation barriers with equal prefactors'}</strong><p>{formation ? 'Frenkel pairs use K½; the one-Pt/three-O Schottky cluster uses K¼. These are conditional dilute estimates, not established equilibrium concentrations.' : 'The 0.1 eV anion barrier gives the largest kinetic weight at this temperature. Barrier data alone cannot establish which defect has the largest equilibrium population.'}</p></div>
      <svg className="materials-scene defects-energy-scene" viewBox="0 0 760 365" role="img" aria-labelledby={id}>
        <title id={id}>{formation ? 'Conditional site fractions' : 'Equal-prefactor kinetic weights'} on a conventional logarithmic vertical axis</title>
        <text x="100" y="35">{formation ? 'log₁₀ conditional site fraction' : 'log₁₀ kinetic weight k/k₀'}</text>
        {[0, 1, 2, 3, 4].map(index => { const log = logMin * index / 4, y = graphY(log); return <g key={index}><line x1="100" x2="680" y1={y} y2={y} stroke="#303030" /><text x="85" y={y + 4} textAnchor="end" className="defects-svg-small">{n(log)}</text></g> })}
        <path d="M100 75 V285 H680" fill="none" stroke="#777" />
        {curves.map((points, index) => <polyline key={index} points={points} stroke={energyColors[index]} fill="none" strokeWidth="2" />)}
        <line x1={graphX(p.temperature)} x2={graphX(p.temperature)} y1="75" y2="285" stroke="#ccc" strokeDasharray="4 4" />
        {energy.map((entry, index) => <circle key={index} cx={graphX(p.temperature)} cy={graphY(entry.logFraction)} r="5" fill={energyColors[index]} />)}
        <text x="100" y="310" className="defects-svg-small">300 K</text><text x="680" y="310" textAnchor="end" className="defects-svg-small">2000 K</text><text x="390" y="310" textAnchor="middle" className="defects-svg-small">Temperature · higher curves mean larger values</text>
        {energyNames.map((name, index) => <text key={name} x={100 + index * 205} y="344" style={{fill: energyColors[index]}} className="defects-svg-small">{name}</text>)}
      </svg>
      <div className="defects-energy-work"><h3>At {n(p.temperature)} K · kBT = {n(KB * p.temperature)} eV</h3><MathFormula tex={formation ? String.raw`K=\exp(-E_f/k_BT),\quad c_F\simeq K^{1/2},\quad c_S\simeq K^{1/4}` : String.raw`k=k_0\exp(-E_a/k_BT),\qquad w=k/k_0`} /><table className="materials-facts defects-energy-table"><thead><tr><th scope="col">Process</th><th scope="col">Energy (eV)</th><>{formation && <th scope="col">log₁₀ K</th>}</><th scope="col">log₁₀ {formation ? 'c' : 'w'}</th><th scope="col">{formation ? 'Conditional c' : 'Weight w'}</th></tr></thead><tbody>{energy.map((entry, index) => <tr key={index}><th scope="row">{energyNames[index]}</th><td>{n(entry.energy)}</td>{formation && <td>{n(entry.logK)}</td>}<td>{n(entry.logFraction)}</td><td><MathFormula inline tex={scientificTex(entry.fraction, n)} /></td></tr>)}</tbody></table>
        <p className="materials-note">{formation ? `Anion estimate c ≈ ${n(energy[0].fraction)} is too large for the dilute approximation. Assumptions: formation energy per pair/cluster, unit entropy factors, ideal dilute activities, and equal normalized site capacities. Schottky site fractions are equal because there are three O sites per Pt site.` : 'k₀ is an attempt-rate prefactor; Eₐ is an activation barrier; kB is Boltzmann’s constant; T is absolute temperature. Equal prefactors allow a relative comparison of k/k₀; no actual rate in s⁻¹ is supplied.'}</p>
      </div>
    </>}
  </>
}
