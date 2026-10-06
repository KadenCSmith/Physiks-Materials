import type { NumericParameters } from '../../framework/types'
export type V3 = [number, number, number]
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a)
export const norm = (v: V3) => Math.hypot(...v)
const dot = (a: V3, b: V3) => a.reduce((sum, value, i) => sum + value * b[i], 0)
function fraction(x: number): [number, number] {
  if (!Number.isFinite(x)) throw new Error('Use a finite coordinate.')
  for (let d = 1; d <= 1000; d++) {
    const a = Math.round(x * d)
    if (Math.abs(a / d - x) < 1e-8) return [a, d]
  }
  throw new Error('Use a fraction or a decimal with a rational denominator up to 1000.')
}
function integerize(values: V3) {
  const fractions = values.map(fraction)
  const scale = fractions.reduce((a, [, d]) => a * d / gcd(a, d), 1)
  return { indices: fractions.map(([a, d]) => a * scale / d) as V3, scale }
}
export function integerIndices(values: V3, reduce = true): V3 {
  const { indices } = integerize(values)
  const divisor = reduce ? indices.reduce((a, b) => gcd(a, b), 0) || 1 : 1
  return indices.map(x => x / divisor) as V3
}
export function direction(start: V3, end: V3) {
  return integerIndices(end.map((v, i) => v - start[i]) as V3)
}
/** Zero is the stored parallel-axis sentinel; the editor presents it as ∞. */
export function miller(intercepts: V3) {
  return integerIndices(intercepts.map(v => v === 0 ? 0 : 1 / v) as V3, false)
}
/** Plain signed text for accessible names/answers; visual components render full overbars. */
export function indexText(v: V3, plane = false) {
  return (plane ? '(' : '[') + v.map(x => x < 0 ? `−${-x}` : String(x)).join(' ') + (plane ? ')' : ']')
}
export function indexAnswer(answer: string, v: V3) {
  const t = answer.replace(/−/g, '-').replace(/\d[\d\u0305]*\u0305[\d\u0305]*/g, token => '-' + token.replace(/\u0305/g, ''))
    .replace(/[[\]()]/g, '').trim()
  let numbers = t.split(/[ ,]+/).map(Number)
  if (numbers.length === 1 && /^-?\d-?\d-?\d$/.test(t)) numbers = (t.match(/-?\d/g) || []).map(Number)
  return numbers.length === 3 && numbers.every((x, i) => x === v[i])
}
export const structures = [
  { name: 'SC', atoms: 1, nn: 6, factor: 2, count: '8 × 1/8 = 1', dense: '⟨100⟩ touching chains; {100} densest. No close-packed plane.' },
  { name: 'BCC', atoms: 2, nn: 8, factor: 4 / Math.sqrt(3), count: '8 × 1/8 + 1 = 2', dense: '⟨111⟩ touching chains; {110} densest. BCC is not close packed.' },
  { name: 'FCC', atoms: 4, nn: 12, factor: 2 * Math.sqrt(2), count: '8 × 1/8 + 6 × 1/2 = 4', dense: '⟨110⟩ close-packed directions; {111} close-packed planes.' },
]
export const examArrows: { name: string; start: V3; end: V3 }[] = [
  { name: 'A · upper arrow', start: [0, 1, 1], end: [1, .5, 1] },
  { name: 'A · left arrow', start: [1, 0, 1], end: [1, .5, 0] },
  { name: 'A · right arrow', start: [0, 1, 0], end: [1, 1, 1] },
  { name: 'A · lower arrow', start: [.5, 1, 0], end: [0, 0, 0] },
  { name: 'D · exam [1 0 −2]', start: [0, 0, 1], end: [.5, 0, 0] },
]
export function directionPoints(p: NumericParameters): { start: V3; end: V3 } {
  if (p.directionMode === 1) {
    const indices: V3 = [p.du, p.dv, p.dw]
    const scale = Math.max(...indices.map(Math.abs)) || 1
    const delta = indices.map(v => v / scale) as V3
    const start = delta.map(v => v < 0 ? -v : 0) as V3
    return { start, end: start.map((v, i) => v + delta[i]) as V3 }
  }
  return { start: [p.sx, p.sy, p.sz], end: [p.ex, p.ey, p.ez] }
}
export function getDirection(p: NumericParameters) {
  if (p.directionMode === 1 && ![p.du, p.dv, p.dw].every(Number.isInteger)) throw new Error('Direction indices must be integers.')
  const { start, end } = directionPoints(p)
  return direction(start, end)
}
export function planeData(p: NumericParameters) {
  const c = Math.round(p.planeCase)
  if (c === 1) return { normal: [2, 1, -1] as V3, level: p.translate >= .5 ? 1 : 0, indices: [2, 1, -1] as V3, indexLevel: p.translate >= .5 ? 1 : 0 }
  if (c === 2) return { normal: [0, 1, 1] as V3, level: 1, indices: [0, 1, 1] as V3, indexLevel: 1 }
  if (p.planeInput === 1) {
    const indices: V3 = [p.ph, p.pk, p.pl]
    if (!indices.every(Number.isInteger)) throw new Error('Miller indices must be integers.')
    return { normal: indices, level: p.planeLevel, indices, indexLevel: p.planeLevel }
  }
  const normal = [p.ix, p.iy, p.iz].map(v => v === 0 ? 0 : 1 / v) as V3
  const { indices, scale } = integerize(normal)
  return { normal, level: 1, indices, indexLevel: scale }
}
export function cubicFamily(v: V3): V3 {
  return v.map(Math.abs).sort((a, b) => b - a) as V3
}
export function parseCoordinate(text: string): number | null {
  const cleaned = text.trim().replace(/−/g, '-')
  if (!cleaned) return null
  const fractionMatch = cleaned.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/)
  const value = fractionMatch ? Number(fractionMatch[1]) / Number(fractionMatch[2]) : Number(cleaned)
  return Number.isFinite(value) ? value : null
}
export const corners: V3[] = Array.from({ length: 8 }, (_, i) => [i & 1, (i >> 1) & 1, (i >> 2) & 1])
export const edges = corners.flatMap((v, i) => corners.flatMap((w, j) => j > i && v.reduce((s, x, k) => s + Math.abs(x - w[k]), 0) === 1 ? [[v, w]] : []))
export function planePolygon(normal: V3, level: number): V3[] {
  if (norm(normal) === 0) return []
  const pts: V3[] = []
  for (const [a, b] of edges) {
    const da = dot(a, normal) - level, db = dot(b, normal) - level
    for (const [v, d] of [[a, da], [b, db]] as [V3, number][]) {
      if (Math.abs(d) < 1e-8 && !pts.some(p => p.every((x, i) => Math.abs(x - v[i]) < 1e-8))) pts.push(v)
    }
    if (da * db < 0) {
      const f = da / (da - db)
      const v = a.map((x, i) => x + f * (b[i] - x)) as V3
      if (!pts.some(p => p.every((x, i) => Math.abs(x - v[i]) < 1e-8))) pts.push(v)
    }
  }
  if (pts.length < 3) return []
  const center = pts[0].map((_, i) => pts.reduce((s, v) => s + v[i], 0) / pts.length) as V3
  const axis = normal.findIndex(x => Math.abs(x) > 1e-8), other = [0, 1, 2].filter(i => i !== axis)
  return pts.sort((a, b) => Math.atan2(a[other[1]] - center[other[1]], a[other[0]] - center[other[0]]) - Math.atan2(b[other[1]] - center[other[1]], b[other[0]] - center[other[0]]))
}
export function polygonArea(points: V3[]) {
  const cross: V3 = [0, 0, 0]
  points.forEach((v, i) => {
    const w = points[(i + 1) % points.length]
    cross[0] += v[1] * w[2] - v[2] * w[1]
    cross[1] += v[2] * w[0] - v[0] * w[2]
    cross[2] += v[0] * w[1] - v[1] * w[0]
  })
  return norm(cross) / 2
}
export function sampleModel(p: NumericParameters, time: number) {
  const st = structures[Math.round(p.view) === 3 ? 1 : Math.round(p.structure)]
  let v: V3 = [0, 0, 0], h: V3 = [0, 0, 0], validDirection = 1, validPlane = 1
  let normal: V3 = [0, 0, 0], level = 0, indexLevel = 0
  try { v = getDirection(p); if (v.every(x => x === 0)) validDirection = 0 } catch { validDirection = 0 }
  try { const data = planeData(p); h = data.indices; normal = data.normal; level = data.level; indexLevel = data.indexLevel; if (h.every(x => x === 0)) validPlane = 0 } catch { validPlane = 0 }
  const a = st.factor * p.radius
  const { start, end } = directionPoints(p)
  const delta = end.map((value, i) => value - start[i]) as V3
  const length = norm(delta), unit = delta.map(value => length ? value / length : 0) as V3
  const angles = unit.map(value => length ? Math.acos(Math.max(-1, Math.min(1, value))) * 180 / Math.PI : 0)
  const normalLength = norm(normal), indexLength = norm(h)
  const angle = length && normalLength ? Math.asin(Math.min(1, Math.abs(dot(delta, normal)) / (length * normalLength))) * 180 / Math.PI : 0
  return {
    progress: Math.min(1, Math.max(0, Number.isFinite(time) ? time / getPlayback(p).duration : 0)),
    atoms: st.atoms, neighbors: st.nn, aOverR: st.factor, a, planarDensity: 3 / (16 * p.radius ** 2),
    u: v[0], v: v[1], w: v[2], h: h[0], k: h[1], l: h[2], validDirection, validPlane,
    directionLength: a * length, unitX: unit[0], unitY: unit[1], unitZ: unit[2],
    angleX: angles[0], angleY: angles[1], angleZ: angles[2], directionPlaneAngle: angle,
    spacing: indexLength ? a / indexLength : 0, originDistance: normalLength ? a * Math.abs(level) / normalLength : 0,
    planeLevel: indexLevel, sliceArea: polygonArea(planePolygon(normal, level)) * a * a,
  }
}
export const getPlayback = (p: NumericParameters) => ({ duration: Math.round(p.view) === 1 ? 6 : 12, loop: false, note: Math.round(p.view) === 1 ? 'A 6-second direction reveal (2× faster); no physical time or automatic loop. Drag the cell or use the rotation slider.' : 'A 12-second construction reveal; no physical time or automatic loop. Drag the cell or use the rotation slider.' })
