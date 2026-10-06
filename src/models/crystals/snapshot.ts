import type { NumericParameters, NumericSnapshot } from '../../framework/types'
import { cubicFamily, directionPoints, integerIndices, indexText, planeData, planePolygon } from './calculation'
export function snapshotNotes(p: NumericParameters, s: NumericSnapshot, format: (value: number) => string = String): string[] {
  if (p.view === 0) return ['Boundary sharing: corners belong to eight cells; face centers to two; interior atoms to one. Counts, nearest neighbors and a/R use the selected cubic structure.']
  if (p.view === 3) return ['BCC (200) is x = a/2. The cell-clipped square has one interior body-center atom and no corner centers. Its repeat area is a²; atom density is 1/a² = 3/(16R²). The area packing fraction is 3π/16, dimensionless.']
  if (p.view === 1) {
    if (!s.validDirection) return ['Direction undefined: different tail/head points or nonzero integer indices are required.']
    const { start, end } = directionPoints(p)
    return [
      p.directionMode === 1 ? `Input method: signed integer indices. Exact entered [uvw] = [${p.du} ${p.dv} ${p.dw}], before reduction or fitting into the cell.` : `Input method: tail/head coordinates. Exact entered tail = (${p.sx}, ${p.sy}, ${p.sz}); head = (${p.ex}, ${p.ey}, ${p.ez}), in units of a.`,
      `Tail (${start.join(', ')}) to head (${end.join(', ')}), in lattice units a. Displacement (${end.map((value, i) => value - start[i]).join(', ')}) a. Reduced direction ${indexText([s.u, s.v, s.w])}.`,
      `Unit direction (${format(s.unitX)}, ${format(s.unitY)}, ${format(s.unitZ)}); angles to positive x, y, z: ${format(s.angleX)}°, ${format(s.angleY)}°, ${format(s.angleZ)}°. Cubic family ⟨${cubicFamily([s.u, s.v, s.w]).join(' ')}⟩.`,
      'Direction indices describe orientation, not length. Indices input is scaled to an in-cell arrow. Reported length belongs to the drawn segment, not necessarily a primitive lattice translation.',
    ]
  }
  if (!s.validPlane) return ['Plane undefined: select a nonzero normal or at least one finite nonzero intercept.']
  const data = planeData(p)
  return [
    p.planeCase === 0 ? p.planeInput === 1 ? `User-created plane; exact entered (hkl) = (${p.ph} ${p.pk} ${p.pl}), level q = ${p.planeLevel}.` : `User-created plane; exact entered axis intercepts = (${[p.ix, p.iy, p.iz].map(value => value === 0 ? '∞' : String(value)).join(', ')}), in units of a.` : `Reference plane ${p.planeCase === 1 ? 'B' : 'C'}; level and cell follow the currently selected example.`,
    `Integer plane indices ${indexText(data.indices, true)}; slice equation ${data.indices[0]}(x/a) + ${data.indices[1]}(y/a) + ${data.indices[2]}(z/a) = ${data.indexLevel}. Normal direction ${indexText(integerIndices(data.indices))}.`,
    `Axis intercepts: ${data.normal.map((value, i) => `${'xyz'[i]} = ${value === 0 ? data.level === 0 ? 'axis contained in plane' : '∞ (parallel)' : data.level / value + ' a'}`).join('; ')}. Cubic family {${cubicFamily(data.indices).join(' ')}}.`,
    `Cell-clipped vertices in lattice units: ${planePolygon(data.normal, data.level).map((point, i) => `V${i + 1}=(${point.join(', ')})`).join('; ') || 'no positive-area patch'}.`,
    'Index-vector spacing is a/√(h²+k²+l²). Slice distance from the origin is |q| times this spacing, using the integer-normal equation. Clearing reciprocal fractions changes the level as well as the normal. Keep (200) distinct from (100).',
    'Area means the geometric intersection with this cubic cell, not a planar repeat area or atom density. Arbitrary indices/levels do not guarantee occupied atomic layers. A valid slice may have zero positive-area intersection with the cell.',
    ...(data.level === 0 ? ['This slice crosses the origin; translate it before taking reciprocal intercepts.'] : []),
  ]
}
