import type { NumericParameters, NumericSnapshot } from '../../framework/types'
import { bccDensity, radialCount } from './calculation'

export function getSnapshotNotes(p: NumericParameters, s: NumericSnapshot, format: (value: number) => string = String): string[] {
  if (p.view === 1) {
    const screw = p.dislocation === 0
    return [
      `Current dislocation construction: ${screw ? 'screw' : 'edge'}. Start S = (0, 0, 0) Å; finish F = (${format(p.spacing)}, 0, 0) Å. Instructor SF/RH convention: b = F − S = (+${format(p.spacing)}, 0, 0) Å.`,
      `Positive unit line tangent t is ${screw ? '+x = (1, 0, 0)' : '+z = (0, 0, 1)'}. The circuit traverses right-handed around that line. b is ${screw ? 'parallel' : 'perpendicular'} to the line; b · t = ${format(s.lineDot)} Å. Pure screw also permits antiparallel character.`,
      `Gold b points start → finish. The opposite vector, −b, closes the gap from finish → start. Reversing both the traversal and positive line sense reverses b while retaining its magnitude and edge/screw character.`,
      `The first diagram identifies the physical defect: ${screw ? 'an opaque exam-style crystal cutaway with a surface step terminating at the dislocation line' : 'an atom-row crystal cross-section with an extra half-plane terminating at its core'}. The second diagram is a separate quantitative teaching construction. Exam p8 Fig3 supplies no directed circuit, axes, or step counts.`,
      `The circuit follows 16 actual lattice-neighbor bonds, 4 per leg: ${screw ? '+y, +z, −y, −z' : '+x, +y, −x, −y'}. Current conceptual reveal: ${format(16 * s.progress)} of 16 steps. Plot geometry is normalized to a, so changing a changes the reported length without changing its shape.`,
      screw
        ? 'Separate screw circuit: u_x = aθ/(2π), with θ unwrapped from 0 to 2π around the +x line. Its y–z projection closes, but the height chart shows x rising from 0 to a; S and F share y,z and differ by a along x. The first cutaway is a schematic identification sketch, not a rendering or measurement of this displacement field. The core is unresolved; no relaxed atomistic calculation is claimed.'
        : 'Edge teaching geometry: upper rows include one extra half-plane, terminating at the green core. Four neighbor bonds on each side of the circuit end one horizontal spacing from S. The positive tangent +z points toward the viewer; t × b points +y, toward the extra half-plane. The strained rows are schematic and the core is unresolved.',
      `Defect dimensions: vacancies/interstitials 0D; dislocations 1D; grain boundaries, surfaces and stacking faults 2D. An edge defect is associated with an extra half-plane; a screw has shear along its line.`,
      `Reference: user-confirmed 12-page Exam_1_F26_Practice_Exam.pdf pp7–8 Q3 and instructor textbook §3.4 for the SF/RH convention. RDF material/radius/density settings are inactive in this view.`,
    ]
  }
  const material = Math.round(p.material)
  const notes = [
    `Current radial-distribution model: ${['BCC crystal candidate', 'semicrystalline polymer idealization', 'uncorrelated ideal gas'][material]}. Shell radius R = ${format(s.shell)} Å, final reveal radius ${format(p.shellRadius)} Å, number density ρ = ${format(p.density)} Å⁻³.`,
    `Ordinary 3D g(r) is dimensionless. dN/dr = 4πρr²g(r); at the current radius, g(R) = ${format(s.g)}, radial neighbor count density = ${format(radialCount(material, s.shell, p.density))} Å⁻¹, and integrated coordination N(R) = ${format(s.coordination)}.`,
    `N(R) = 4πρ∫₀ᴿ r²g(r)dr. Shading selects the interval r ≤ R; its unweighted area under g is not coordination. Highlighted particles are selected by 3D distance even though the drawing projects them onto the screen.`,
  ]
  if (material === 0) {
    notes.push(`Exam first distance 2.78 Å and given coordination 8 support a BCC candidate, with a = 2r₁/√3 = ${format(s.a)} Å. They do not uniquely identify an element.`)
    notes.push(`Later shells are independent ideal BCC geometry, with counts 8, 6, 12, 24, 8, 6. All 64 ideal lattice neighbors are drawn. Gaussian broadening width 0.025 Å preserves shell counts but makes N change smoothly near a shell; exact particle highlights change discretely.`)
    notes.push(`A fully occupied BCC lattice with this a requires ρ = 2/a³ = ${format(bccDensity)} Å⁻³. The density control illustrates normalization at fixed shell counts; another density is not the same fully occupied lattice. The source loosely calls an unweighted first-peak integral 8; the app treats 8 as supplied coordination.`)
  } else if (material === 1) {
    notes.push(`Independent polymer model: two-neighbor bonded-chain peak near 1.5 Å, broadened 30% BCC correlations (width 0.15 Å), plus an amorphous background beyond 2 Å. The short projected chain is illustrative and does not estimate the bulk curve.`)
    notes.push(`Order ranking for the requested comparison: polymer exceeds ideal gas in short-range order and in long-range order inside its crystalline domains. Domain-limited order is not one perfect bulk lattice; this curve is an idealization, not a measurement.`)
  } else {
    notes.push(`Ideal gas has g(r) = 1, including the zero-radius limit, and N(R) = 4πρR³/3. The positive average coordination need not be an integer. The finite seeded drawing is illustrative; the bulk RDF is analytic and is not estimated from those 35 particles.`)
    notes.push(`The ideal gas has no correlated positional short-range or long-range order and assumes no excluded-volume interactions. Its RDF is flat, unlike the polymer’s local-chain and crystalline-domain correlations.`)
  }
  notes.push(p.reference === 1
    ? 'Reference frame: Practice Exam 1 Problem 3 Fall 2026, 2:49, https://www.youtube.com/watch?v=APNwMOIxPqQ&t=169s. BCC geometry, sharp/broad polymer sketches and a flat gas curve were visible. Normalization, widths and mixture are independently modeled; unclear element handwriting is not transcribed.'
    : 'Exam reference: user-confirmed 12-page Exam_1_F26_Practice_Exam.pdf p7 Fig2/Q3. Later peak positions are not digitized exam measurements; only the first 2.78 Å label and stated coordination 8 are treated as givens.')
  return notes
}
