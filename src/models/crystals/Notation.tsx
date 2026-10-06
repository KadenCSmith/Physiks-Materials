import type { V3 } from './calculation'
export function Indices({ values, kind = 'direction' }: { values: V3; kind?: 'direction' | 'plane' | 'directionFamily' | 'planeFamily' }) {
  const brackets = kind === 'plane' ? ['(', ')'] : kind === 'planeFamily' ? ['{', '}'] : kind === 'directionFamily' ? ['⟨', '⟩'] : ['[', ']']
  return <span className="crystal-indices" aria-label={brackets[0] + values.join(', ') + brackets[1]}>{brackets[0]}{values.map((value, i) => <span key={i}>{i > 0 && ' '}<span className={value < 0 ? 'index-negative' : undefined}>{Math.abs(value)}</span></span>)}{brackets[1]}</span>
}
export function SvgIndices({ values, plane = false }: { values: V3; plane?: boolean }) {
  return <>{plane ? '(' : '['}{values.map((value, i) => <tspan key={i}><tspan>{i > 0 ? ' ' : ''}</tspan><tspan textDecoration={value < 0 ? 'overline' : undefined}>{Math.abs(value)}</tspan></tspan>)}{plane ? ')' : ']'}</>
}
