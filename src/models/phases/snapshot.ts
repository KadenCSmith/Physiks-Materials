import type { NumericParameters, NumericSnapshot } from '../../framework/types'
import { chemicalPotentials, envelope, phaseNames, tangentContacts } from './calculation'
import { congruent, events } from './boundaries'

export function getSnapshotNotes(p: NumericParameters, s: NumericSnapshot, format: (value: number) => string = String): string[] {
  const view = Math.round(p.view)
  const notes = [
    'Components are Cr and Pt. The diagram temperature axis is °C; the bottom composition axis is atomic percent Pt and the top is weight percent Pt. The exam’s unspecified 10% is explicitly interpreted as 10 at% Pt; a weight-percent interpretation gives a different state.',
    'Phase fractions calculated from this atomic-percent axis are atomic/mole fractions, not automatically mass or volume fractions. Full PDF figures and lecture captures remain local reference assets; this report contains recreated app geometry.',
  ]
  if (view < 2) {
    notes.push(`Current evaluated solid slice: ${format(s.temperature)} °C, overall composition ${format(s.composition)} at% Pt. ${view === 1 ? 'The Gibbs view fixes 1400 °C regardless of the inactive temperature setting.' : 'The numerical solver is limited to 1400–1530 °C and 0–35 at% Pt.'}`)
    const names = s.phases === 3 ? 'Cr₄Pt + L + (Pt)' : s.phases === 1 ? phaseNames[s.phaseA] : `${phaseNames[s.phaseA]} + ${phaseNames[s.phaseB]}`
    notes.push(`Current phase field: ${names}; participating phase count P = ${format(s.phases)}, fixed-pressure binary phase rule F = 3 − P = ${format(s.freedom)}.`)
    if (!s.fractionValid) {
      notes.push('At the 1530 °C eutectic interior, three phase fractions are withheld because overall composition alone does not determine them. The stored zero placeholders are not physical phase amounts; a transformation extent or another independent constraint is required. Invariant liquid composition is about 28.1 at% Pt.')
    } else if (s.phases === 1) {
      notes.push(`Single phase ${phaseNames[s.phaseA]} has composition ${format(s.composition)} at% Pt and atom fraction 1. The two readout endpoint fields coincide and do not form a nonzero tie line. F = 2 at fixed pressure; imposing temperature and this single-phase composition fixes those two intensive variables.`)
    } else {
      notes.push(`Left phase ${phaseNames[s.phaseA]}: ${format(s.left)} at% Pt, atom fraction ${format(s.fA)}. Right phase ${phaseNames[s.phaseB]}: ${format(s.right)} at% Pt, atom fraction ${format(s.fB)}. Fractions sum to ${format(s.fA + s.fB)}; composition residual ${format(s.conservation)} at% Pt.`)
      notes.push(`Lever rule: right fraction = (c₀ − cLeft)/(cRight − cLeft); left fraction = 1 − right fraction. Overall composition is conserved. F = 1 for two phases at fixed pressure; imposing temperature consumes that intensive freedom, while overall composition determines phase amounts.`)
    }
    notes.push('Solid boundaries are visually read from the exam and linearly interpolated between stored slices. Each endpoint carries approximately ±0.5 at% uncertainty, so phase amounts near boundaries are sensitive. At the exam 10 at% / 1500 °C point, the Cr₄Pt fraction is about 0.324, or roughly 0.279–0.369 when both endpoints vary within those bounds.')
    if (view === 1) {
      const left = chemicalPotentials(0, tangentContacts[0]), right = chemicalPotentials(1, tangentContacts[2])
      notes.push(`Schematic left common tangent joins (Cr) at ${format(100 * tangentContacts[0])} at% Pt to Cr₄Pt at ${format(100 * tangentContacts[1])} at% Pt. Its equal component potentials at those contacts are μCr = ${format(left.Cr)}, μPt = ${format(left.Pt)}; slope μPt − μCr = ${format(left.Pt - left.Cr)}.`)
      notes.push(`Schematic right common tangent joins Cr₄Pt at ${format(100 * tangentContacts[2])} at% Pt to (Pt) at ${format(100 * tangentContacts[3])} at% Pt. Its equal component potentials at those contacts are μCr = ${format(right.Cr)}, μPt = ${format(right.Pt)}; slope μPt − μCr = ${format(right.Pt - right.Cr)}.`)
      notes.push(`At the selected composition, the lower convex-envelope energy is ${format(envelope(s.composition / 100))}. Here x = at% Pt / 100; g is energy per mole of atoms and g′ = dg/dx. All energy values are arbitrary schematic units, not measured material energies. The envelope lies at or below the single-phase curves.`)
      notes.push('Equality is component-specific between coexisting phases: μCrα = μCrβ and μPtα = μPtβ. μCr need not equal μPt. The common tangent slope is their difference; tangent intercepts at x = 0 and x = 1 give the individual potentials.')
    }
  } else if (view === 2) {
    const event = events[Math.round(p.cooling)]
    notes.push(`Selected invariant: ${event.title}; ${event.before} → ${event.after}; ${event.kind} at ${format(event.T)} °C, reacting composition near ${format(event.x)} at% Pt. Three phases coexist at the invariant, so P = 3 and F = 0 at fixed pressure.`)
    notes.push(`Current moving marker is ${format(s.coolingTemperature)} °C with conceptual progress ${format(100 * s.progress)}%. It illustrates cooling through the reaction; it does not solve phase amounts away from the invariant or represent a physical cooling rate. Solid-slice composition/temperature settings are inactive here.`)
    notes.push('Lower-temperature invariant coordinates are approximate graph readings (unlabeled temperatures about ±10 °C). Eutectic: liquid → two solids; peritectoid: two solids → one solid; eutectoid: one solid → two solids.')
  } else {
    notes.push(`Marked congruent melting extrema: ${congruent.map(point => `${point.label}: ${format(point.x)} at% Pt, ${format(point.T)} °C`).join('; ')}. The shallow (Pt) minimum near 96 at% / 1760 °C is approximate.`)
    notes.push(`Three-phase invariants: ${events.map(event => `${event.title}: ${event.before} → ${event.after}, ${event.kind}, ${format(event.T)} °C, near ${format(event.x)} at% Pt`).join('; ')}.`)
    notes.push('The CrPt₃ maximum at 1134 °C and CrPt maximum near 780 °C occur in solid fields and are ordering transitions, not congruent melting. A two-phase congruent melting point is not a binary three-phase invariant. Overview outlines are schematic; inactive solid-slice controls do not define a current equilibrium state here.')
  }
  notes.push(p.reference === 1 && view === 1
    ? 'Reference frame: Practice Exam 1 Problem 4 Fall 2026, 6:07, https://www.youtube.com/watch?v=xdFv_SmjKSA&t=367s. The visible 1400 °C line and circled (Pt) field were inspected. The upper Gibbs sketch is clipped; the app’s complete curves and energies are independently constructed.'
    : 'Exam reference: user-confirmed 12-page Exam_1_F26_Practice_Exam.pdf p10 Fig4 / p11 Q4. Only that exam supplies numerical boundary and event readings.')
  return notes
}
