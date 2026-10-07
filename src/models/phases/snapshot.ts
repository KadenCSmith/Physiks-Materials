import type { NumericParameters, NumericSnapshot, SnapshotReport, SnapshotReportSection } from '../../framework/types'
import { chemicalPotentials, envelope, phaseNames, tangentContacts } from './calculation'
import { congruent, events } from './boundaries'
import { thermalCases, thermalEnergy } from './thermal'
import { chapter } from '../shared/StudyPanel'

const examSource = 'Exam_1_F26_Practice_Exam.pdf · user-confirmed 12-page copy · p10 Figure 4 / p11 Question 4. This is the only exam reference.'
const basis = 'Temperature is °C. In the exam figure, the bottom composition axis is atomic percent Pt and the top is weight percent Pt; the app draws the atomic-percent axis. The exam’s unspecified 10% is interpreted as 10 at% Pt. Amounts on this basis are atom/mole-of-atoms fractions, not automatically mass or volume fractions.'
const phaseField = (s: NumericSnapshot) => s.phases === 3 ? 'Cr₄Pt + L + (Pt)' : s.phases === 1 ? phaseNames[s.phaseA] : `${phaseNames[s.phaseA]} + ${phaseNames[s.phaseB]}`
const graphRange = (p: NumericParameters) => p.gRange === 1 ? 'Whole binary · 0–100 at% Pt' : 'Contact zoom · 0–40 at% Pt'
const sources = (sections: string) => [examSource, `Primary instructor textbook Chapter 4, ${sections} · ${chapter(4)}`]

export function getSnapshotNotes(p: NumericParameters, s: NumericSnapshot, format: (value: number) => string = String): string[] {
  const view = Math.round(p.view)
  const notes = [
    'Components are Cr and Pt. Temperature is °C. In the exam figure, the bottom composition axis is atomic percent Pt and the top is weight percent Pt; the app draws the atomic-percent axis. The exam’s unspecified 10% is explicitly interpreted as 10 at% Pt; a weight-percent interpretation gives a different state.',
    'Phase fractions calculated from this atomic-percent axis are atomic/mole fractions, not automatically mass or volume fractions. Full PDF figures and lecture captures remain local reference assets; this report contains recreated app geometry.',
  ]
  if (view < 2) {
    notes.push(`Current evaluated solid slice: ${format(s.temperature)} °C, overall composition ${format(s.composition)} at% Pt. ${view === 1 ? 'The Gibbs view fixes 1400 °C regardless of the inactive temperature setting.' : 'The numerical solver is limited to 1400–1530 °C and 0–35 at% Pt.'}`)
    const names = s.phases === 3 ? 'Cr₄Pt + L + (Pt)' : s.phases === 1 ? phaseNames[s.phaseA] : `${phaseNames[s.phaseA]} + ${phaseNames[s.phaseB]}`
    notes.push(`Current phase field: ${names}; participating phase count P = ${format(s.phases)}, fixed-pressure phase rule F = C − P + 1 = ${format(s.freedom)} (C = ${format(s.components)}).`)
    if (!s.fractionValid) {
      notes.push('At the 1530 °C eutectic interior, three phase fractions are withheld because overall composition alone does not determine them. The stored zero placeholders are not physical phase amounts; a transformation extent or another independent constraint is required. Invariant liquid composition is about 28.1 at% Pt.')
    } else if (s.phases === 1) {
      notes.push(`Single phase ${phaseNames[s.phaseA]} has composition ${format(s.composition)} at% Pt and atom fraction 1. The two readout endpoint fields coincide and do not form a nonzero tie line. ${s.components === 1 ? "This pure Cr endmember has C = 1 and F = 1 at fixed pressure; fixing temperature consumes that freedom." : "F = 2 at fixed pressure; imposing temperature and this single-phase composition fixes those two intensive variables."}`)
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
      notes.push(`Displayed Gibbs composition range: ${graphRange(p)}. Stable phases at 1400 °C are (Cr), Cr₄Pt and (Pt); lower-temperature ordered phases are not stable in this slice. The complete binary field continues through (Pt) to pure Pt.`)
    }
  } else if (view === 2) {
    const index = Math.round(p.cooling), event = thermalCases[index], energy = thermalEnergy(index, s.coolingTemperature)
    const invariant = event.phaseCount === 3, freedom = event.components - event.phaseCount + 1
    notes.push(`Selected ${invariant ? 'invariant' : 'congruent transition'}: ${event.title}; ${event.before} → ${event.after}; ${event.kind} at ${format(event.T)} °C, fixed overall composition ${format(event.x)} at% Pt. At the transition C = ${format(event.components)}, P = ${format(event.phaseCount)}, F = C − P + 1 = ${format(freedom)} at fixed pressure.`)
    notes.push(`Current moving marker is ${format(s.coolingTemperature)} °C with conceptual progress ${format(100 * s.progress)}%. It illustrates cooling through the reaction; it does not solve phase amounts away from the ${invariant ? 'invariant' : 'transition'} or represent a physical cooling rate. Solid-slice composition/temperature settings are inactive here.`)
    notes.push(`Matching G/T schematic: reactant assemblage g = ${format(energy.reactant)}, product assemblage g = ${format(energy.product)}, Δg = gProducts − gReactants = ${format(energy.gap)}. ${energy.stable === 2 ? 'The two assemblages have equal energy at the transition.' : energy.stable === 0 ? 'The reactant assemblage has the lower schematic energy.' : 'The product assemblage has the lower schematic energy.'} Both assemblages have the same overall composition; mixed phases are weighted by atom fractions.`)
    notes.push(event.sourceNote)
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

/** Focused reports follow the active graph; inactive controls and formulas are omitted. */
export function getSnapshotReport(p: NumericParameters, s: NumericSnapshot, format: (value: number) => string = String): SnapshotReport {
  const view = Math.round(p.view)
  if (view === 0) {
    const amounts: SnapshotReportSection = s.fractionValid ? {
      title: 'Current phase compositions and amounts',
      table: { headers: ['Phase', 'Composition (at% Pt)', 'Atom fraction'], rows: s.phases === 1
        ? [[phaseNames[s.phaseA], format(s.composition), '1']]
        : [[phaseNames[s.phaseA], format(s.left), format(s.fA)], [phaseNames[s.phaseB], format(s.right), format(s.fB)]] },
      rows: [{ label: 'Sum of phase fractions', value: format(s.fA + s.fB) }, { label: 'Composition residual', value: `${format(s.conservation)} at% Pt` }],
      notes: [s.phases === 1 ? 'One phase has the overall composition and fraction 1. Coincident endpoint readouts are not a nonzero tie line.' : 'The overall composition lies between two phase compositions. The amount of each phase follows the opposite tie-line segment.'],
    } : {
      title: 'Three-phase fractions require another constraint',
      tex: [String.raw`f_{\mathrm{Cr_4Pt}}+f_L+f_{\mathrm{Pt}}=1`, String.raw`c_0=f_{\mathrm{Cr_4Pt}}c_{\mathrm{Cr_4Pt}}+f_Lc_L+f_{\mathrm{Pt}}c_{\mathrm{Pt}}`],
      notes: ['At 1530 °C the interior interval can contain Cr₄Pt + L + (Pt). Two conservation equations do not determine three amounts. A transformation extent or another independent constraint is needed.', 'The stored zero placeholders are not physical fractions and are deliberately omitted. The invariant liquid composition is 28.1 at% Pt.'],
    }
    return {
      title: `Tie line · ${format(s.composition)} at% Pt / ${format(s.temperature)} °C`,
      description: 'Read the phase compositions, conserve the overall composition, and count independent intensive variables.',
      sections: [
        { title: 'Selected equilibrium state', rows: [{ label: 'Temperature', value: `${format(s.temperature)} °C` }, { label: 'Overall Pt composition', value: `${format(s.composition)} at% Pt` }, { label: 'Phase field', value: phaseField(s) }, { label: 'Components', value: s.components === 1 ? 'Pure Cr · C = 1' : 'Cr and Pt · C = 2' }], notes: [basis] },
        amounts,
        { title: 'Lever rule and chemical equilibrium', tex: [String.raw`f_\alpha=\frac{c_\beta-c_0}{c_\beta-c_\alpha},\qquad f_\beta=1-f_\alpha`, String.raw`c_0=f_\alpha c_\alpha+f_\beta c_\beta`, String.raw`\mu_{\mathrm{Cr}}^\alpha=\mu_{\mathrm{Cr}}^\beta,\qquad\mu_{\mathrm{Pt}}^\alpha=\mu_{\mathrm{Pt}}^\beta`], notes: [s.phases === 2 ? `Current substitution: left fraction = (${format(s.right)} − ${format(s.composition)}) / (${format(s.right)} − ${format(s.left)}) = ${format(s.fA)}; right fraction = ${format(s.fB)}.` : 'The two-phase lever rule applies only across a nonzero two-phase tie line. Componentwise chemical-potential equality applies to every participating coexisting phase.'] },
        { title: 'Phase rule and graph limits', tex: [s.components === 1 ? String.raw`F=C-P+1=2-P` : String.raw`F=C-P+1=3-P`], rows: [{ label: 'Participating phases P', value: format(s.phases) }, { label: 'Fixed-pressure degrees of freedom F', value: format(s.freedom) }], notes: [s.phases === 2 ? 'F = 1 before imposing temperature. Fixing T consumes that intensive freedom; the overall composition sets amounts by conservation.' : s.phases === 3 ? 'The binary three-phase invariant has F = 0. Overall composition alone still does not supply a third phase-amount equation.' : s.components === 1 ? 'At the pure Cr endmember, C = 1 and temperature is the single remaining intensive variable at fixed pressure.' : 'In a binary single-phase field, temperature and composition are the two intensive variables.', 'The numerical solid-slice solver uses visually read boundaries only within 1400–1530 °C and 0–35 at% Pt. Endpoint readings carry approximately ±0.5 at% uncertainty.'] },
      ], sources: sources('§4.3–4.5'),
    }
  }

  if (view === 1) {
    const left = chemicalPotentials(0, tangentContacts[0]), right = chemicalPotentials(1, tangentContacts[2])
    return {
      title: 'Gibbs energy versus composition · 1400 °C',
      description: 'Read two supporting common tangents and the stable lower convex envelope at one fixed temperature.',
      sections: [
        { title: 'Current graph and selection', rows: [{ label: 'Fixed temperature', value: '1400 °C' }, { label: 'Displayed composition range', value: graphRange(p) }, { label: 'Overall Pt composition', value: `${format(s.composition)} at% Pt` }, { label: 'Current phase field', value: phaseField(s) }, { label: 'Lower-envelope g at this composition', value: `${format(envelope(s.composition / 100))} schematic units / mol atoms` }], notes: [basis, 'The temperature control is inactive in this graph. The stable phases at 1400 °C are (Cr), Cr₄Pt and (Pt). Cr₃Pt, CrPt and CrPt₃ occur only in lower-temperature solid fields; a shown metastable liquid curve does not contribute to this stable envelope.', ...(p.gRange !== 1 && s.composition > 40 ? ['The selected composition is outside the contact zoom. Use Whole binary to see its marker.'] : [])] },
        { title: 'Two common tangents', table: { headers: ['Coexisting pair', 'Contacts (at% Pt)', 'μCr', 'μPt', 'Slope μPt − μCr'], rows: [
          ['(Cr) / Cr₄Pt', `${format(100 * tangentContacts[0])} / ${format(100 * tangentContacts[1])}`, format(left.Cr), format(left.Pt), format(left.Pt - left.Cr)],
          ['Cr₄Pt / (Pt)', `${format(100 * tangentContacts[2])} / ${format(100 * tangentContacts[3])}`, format(right.Cr), format(right.Pt), format(right.Pt - right.Cr)],
        ] }, notes: ['Each component has an equal chemical potential at the two contacts of its tangent. The left and right tangent need not have the same slope or the same intercepts.'] },
        { title: 'Read the individual chemical potentials', tex: [String.raw`x=c_{\mathrm{Pt}}/100,\qquad g'=\frac{dg}{dx}`, String.raw`\mu_{\mathrm{Cr}}=g-xg',\qquad\mu_{\mathrm{Pt}}=g+(1-x)g'`, String.raw`\mu_{\mathrm{Cr}}^\alpha=\mu_{\mathrm{Cr}}^\beta,\qquad\mu_{\mathrm{Pt}}^\alpha=\mu_{\mathrm{Pt}}^\beta`, String.raw`g'=\mu_{\mathrm{Pt}}-\mu_{\mathrm{Cr}}`], notes: ['The supporting tangent intercept at x = 0 gives μCr; its intercept at x = 1 gives μPt. This is equality of each component across phases. It does not require μCr = μPt.'] },
        { title: 'What the curves establish', tex: [String.raw`g_{\mathrm{mixture}}=f_\alpha g_\alpha+f_\beta g_\beta,\qquad x_0=f_\alpha x_\alpha+f_\beta x_\beta`], notes: ['The tangent segments are energies of composition-conserving mixtures and lie at or below the single-phase curves. Together with stable single-phase sections they form the lower convex envelope.', 'All energies and component potentials are arbitrary schematic units per mole of atoms. The phase diagram supplies approximate contact compositions, not numerical Gibbs energies. Boundary readings carry approximately ±0.5 at% uncertainty.'] },
      ], sources: sources('§4.3–4.4 · component-specific tangent interpretation'),
    }
  }

  if (view === 2) {
    const index = Math.round(p.cooling), event = thermalCases[index], energy = thermalEnergy(index, s.coolingTemperature)
    const freedom = event.components - event.phaseCount + 1
    const rows = [
      ...event.reactants.map(phase => ['Reactants', phase.phase, format(phase.composition), format(phase.fraction)]),
      ...event.products.map(phase => ['Products', phase.phase, format(phase.composition), format(phase.fraction)]),
    ]
    return {
      title: `Matching G/T graph · ${event.title}`,
      description: 'Compare two assemblages with the same fixed overall composition while cooling through the selected transition.',
      sections: [
        { title: 'Selected transition and current cursor', rows: [{ label: 'Reaction on cooling', value: `${event.before} → ${event.after}` }, { label: 'Type', value: event.kind }, { label: 'Transition temperature T₀', value: `${format(event.T)} °C` }, { label: 'Fixed overall Pt composition', value: `${format(event.x)} at% Pt` }, { label: 'Current demonstration temperature', value: `${format(s.coolingTemperature)} °C = ${format(s.coolingTemperature + 273.15)} K` }, { label: 'Lower schematic branch now', value: energy.stable === 2 ? 'Equal assemblage energies at transition' : energy.stable === 0 ? `Reactants · ${event.before}` : `Products · ${event.after}` }], notes: ['The phase-diagram cursor and G/T cursor use the same temperature. The stored tie-line temperature and composition controls are inactive. Playback is a teaching reveal, not a cooling rate.'] },
        { title: 'Conserve the same composition on both sides', table: { headers: ['Assemblage', 'Phase', 'Composition (at% Pt)', 'Atom fraction'], rows }, tex: [String.raw`\sum_j f_j=1,\qquad c_0=\sum_j f_jc_j,\qquad g_{\mathrm{assemblage}}=\sum_j f_jg_j`], notes: ['Each side sums to atom fraction 1 and the same overall composition. Mixed-phase branch energies compare weighted assemblages; individual phases at different compositions need not have equal molar energy.', 'These endpoint compositions and weights are frozen local approximations at the transition. They do not solve changing phase amounts away from it. The phase names in the arrow are not balanced formula-unit coefficients.'] },
        { title: 'Calculate the matching local G/T curves', tex: [String.raw`T_K=T_{^\circ\mathrm C}+273.15,\qquad g=h-T_Ks`, String.raw`\left(\frac{\partial g}{\partial T_K}\right)_{P,c_0}=-s`, String.raw`g_{\mathrm R}=2-0.020(T_K-T_{0,K}),\qquad g_{\mathrm P}=2-0.010(T_K-T_{0,K})`, String.raw`\Delta g=g_{\mathrm P}-g_{\mathrm R}`], rows: [{ label: 'Reactant assemblage gR', value: `${format(energy.reactant)} schematic units / mol atoms` }, { label: 'Product assemblage gP', value: `${format(energy.product)} schematic units / mol atoms` }, { label: 'Δg = products − reactants', value: `${format(energy.gap)} schematic units / mol atoms` }], notes: ['The local branches use independently chosen constant entropies: sR = 0.020 and sP = 0.010 schematic units / (mol atoms · K). Both slopes are negative; reactants have the larger entropy. At T₀ both g values equal 2. Products are lower below T₀ and reactants are lower above it.', 'The centered curves are equivalent to h = 2 + T₀,K s. No measured enthalpy, entropy, latent heat, kinetic rate, or transition order is inferred.'] },
        { title: 'Phase rule at the transition and source limits', tex: [String.raw`F=C-P+1`], rows: [{ label: 'Components C at this transition', value: format(event.components) }, { label: 'Participating phases P at this transition', value: format(event.phaseCount) }, { label: 'Fixed-pressure F at this transition', value: format(freedom) }], notes: [event.phaseCount === 3 ? 'This binary invariant has C = 2, P = 3 and F = 0 at fixed pressure.' : event.components === 1 ? 'Pure Cr or Pt is a one-component endmember: C = 1, P = 2 and F = 0 at its melting point. Solid and liquid have the same composition.' : 'This interior congruent melting point has C = 2 and P = 2, so F = 1 before imposing further constraints. Solid and liquid have the same composition; it is not a binary three-phase invariant.', event.sourceNote] },
      ], sources: sources('§4.1, §4.3, §4.6–4.8, §4.10'),
    }
  }

  return {
    title: 'Cr–Pt overview · melting and invariant reactions',
    description: 'Identify the five marked melting extrema and the five three-phase invariants on the supplied diagram.',
    sections: [
      { title: 'Read the diagram axes', notes: [basis, 'The overview is a qualitative reconstruction. It does not evaluate the inactive solid-slice temperature or composition controls.'] },
      { title: 'Five three-phase invariants', table: { headers: ['Type', 'Cooling reaction', 'T (°C)', 'Near at% Pt'], rows: events.map(event => [event.kind, `${event.before} → ${event.after}`, `${event.kind.includes('approximate') ? '≈' : ''}${format(event.T)}`, format(event.x)]) }, tex: [String.raw`F=C-P+1=2-3+1=0`], notes: ['Eutectic: liquid → two solids. Peritectoid: two solids → one solid. Eutectoid: one solid → two solids. The lower unlabeled temperatures and composition coordinates are approximate graph readings.'] },
      { title: 'Five marked congruent melting extrema', table: { headers: ['Point', 'at% Pt', 'T (°C)', 'At transition C / P / F'], rows: thermalCases.slice(5).map(event => [event.title, `${event.id === 'pt-minimum' || event.id === 'cr4pt-melting' ? '≈' : ''}${format(event.x)}`, `${event.id === 'pt-minimum' ? '≈' : ''}${format(event.T)}`, `${event.components} / ${event.phaseCount} / ${event.components - event.phaseCount + 1}`]) }, notes: ['Solid and liquid have the same composition at a congruent transition. The shallow (Pt) minimum is approximate. Pure Cr/Pt have one component; interior binary extrema have two. A two-phase congruent point is not a binary three-phase invariant.'] },
      { title: 'Solid ordering and a source inconsistency', notes: ['CrPt₃ at 1134 °C and CrPt near 780 °C are maxima within solid fields. They are solid ordering transitions, not congruent melting. Their transition orders and thermodynamic magnitudes are not supplied.', 'The exam prints Cr₃Pt in a field near 33–40 at% Pt, whereas nominal Cr₃Pt would contain 25 at% Pt. The app preserves the printed label and approximate drawn geometry. It does not replace the label from another diagram or infer formula-unit reaction coefficients.'] },
    ], sources: sources('§4.3, §4.6–4.8, §4.10'),
  }
}
