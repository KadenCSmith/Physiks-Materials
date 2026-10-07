import { congruent, events } from './boundaries'

export type ThermalConstituent = {
  phase: string
  /** Atomic percent Pt, read from the bottom axis. */
  composition: number
  /** Fraction of the total atoms (equivalently moles of atoms). */
  fraction: number
}

export type ThermalCase = {
  id: string
  title: string
  /** Transition temperature in °C. */
  T: number
  /** Fixed overall atomic percent Pt of both compared assemblages. */
  x: number
  kind: string
  before: string
  after: string
  reactants: ThermalConstituent[]
  products: ThermalConstituent[]
  /** Participating phases at the transition, not phases away from it. */
  phaseCount: number
  /** Number of independent chemical components in the selected system. */
  components: number
  sourceNote: string
}

const single = (phase: string, composition: number): ThermalConstituent[] => [{ phase, composition, fraction: 1 }]

function mixture(x: number, left: string, a: number, right: string, b: number): ThermalConstituent[] {
  const rightFraction = (x - a) / (b - a)
  if (!(a < b && x >= a && x <= b)) throw new Error('Thermal assemblage composition must lie between its phase endpoints.')
  return [{ phase: left, composition: a, fraction: 1 - rightFraction }, { phase: right, composition: b, fraction: rightFraction }]
}

const source = 'Only exam source: user-confirmed 12-page Exam_1_F26_Practice_Exam.pdf, p10 Fig4 / p11 Q4. Compositions use atomic percent Pt; amounts are atom/mole-of-atoms fractions.'
const energyNote = 'G(T) compares assemblages with the same overall composition. Its molar energies and negative slopes are an independently chosen local schematic, not measured enthalpies, entropies, or a numerical Cr–Pt thermodynamic database.'
const invariantNotes = [
  'The figure labels 1571 °C, liquid 13.8 at% and (Cr) endpoint 6.8 at%. The Cr₄Pt endpoint ≈17.5 at% is a visual reading; lever fractions are derived from these endpoints.',
  'The figure labels 1530 °C and the three compositions: Cr₄Pt 21.8, L 28.1 and (Pt) 31.3 at%. Compare liquid with the composition-conserving two-solid mixture, not three individual energies at unequal compositions.',
  'The unlabeled peritectoid temperature ≈970 °C and reactant endpoints ≈23.5/35 at% are visual estimates. The selected product coordinate 33.3 at% preserves the existing diagram marker. The printed phase label Cr₃Pt conflicts with its drawn field near 33–40 at%: nominal Cr₃Pt would be 25 at% Pt. This preserves the exam label and approximate diagram geometry; 33.3 is not a formula-derived stoichiometry.',
  'The unlabeled eutectoid temperature ≈570 °C and product endpoints ≈40.5/42.5 at% are visual estimates; 41.5 at% selects a composition between them. Cr₃Pt is the printed exam label, with the same label/composition inconsistency noted for the peritectoid; no formula-unit reaction coefficients are inferred.',
  'The unlabeled eutectoid temperature ≈550 °C and product endpoints ≈57.5/59 at% are visual estimates; 58.5 at% selects a composition between them. The displayed phase reaction names phases, not balanced formula-unit coefficients.',
]

const invariantAssemblages: { reactants: ThermalConstituent[]; products: ThermalConstituent[] }[] = [
  { reactants: single('L', events[0].x), products: mixture(events[0].x, '(Cr)', 6.8, 'Cr₄Pt', 17.5) },
  { reactants: single('L', events[1].x), products: mixture(events[1].x, 'Cr₄Pt', 21.8, '(Pt)', 31.3) },
  { reactants: mixture(events[2].x, 'Cr₄Pt', 23.5, '(Pt)', 35), products: single('Cr₃Pt', events[2].x) },
  { reactants: single('(Pt)', events[3].x), products: mixture(events[3].x, 'Cr₃Pt', 40.5, 'CrPt', 42.5) },
  { reactants: single('(Pt)', events[4].x), products: mixture(events[4].x, 'CrPt', 57.5, 'CrPt₃', 59) },
]

/** Cases 0–4 retain the existing invariant order; 5–9 retain the congruent order. */
export const thermalCases: ThermalCase[] = [
  ...events.map((event, index) => ({
    id: ['cr-eutectic', 'pt-eutectic', 'peritectoid', 'crpt-eutectoid', 'crpt3-eutectoid'][index],
    title: event.title, T: event.T, x: event.x, kind: event.kind,
    before: event.before, after: event.after, ...invariantAssemblages[index],
    phaseCount: 3, components: 2,
    sourceNote: `${source} ${invariantNotes[index]} ${energyNote}`,
  })),
  ...congruent.map((event, index) => {
    const solid = ['(Cr)', 'Cr₄Pt', '(Pt)', '(Pt)', '(Pt)'][index]
    const note = index === 3
      ? 'The shallow minimum near 96 at% / 1760 °C is an unlabeled graph estimate.'
      : index === 1
        ? 'The figure labels 1599 °C; the peak composition ≈19.1 at% is visually read, not a formula-derived 20 at%.'
        : index === 2
          ? 'The figure labels the (Pt) liquidus/solidus maximum 1784 °C / 76.7 at%.'
          : `The figure labels the pure ${index === 0 ? 'Cr' : 'Pt'} melting temperature ${event.T} °C. This endmember is a one-component system.`
    return {
      id: ['cr-melting', 'cr4pt-melting', 'pt-maximum', 'pt-minimum', 'pt-melting'][index],
      title: event.label, T: event.T, x: event.x, kind: 'Congruent melting',
      before: 'L', after: solid, reactants: single('L', event.x), products: single(solid, event.x),
      phaseCount: 2, components: index === 0 || index === 4 ? 1 : 2,
      sourceNote: `${source} ${note} Solid and liquid have the same composition here. This is not a binary three-phase invariant. ${energyNote}`,
    }
  }),
]

/**
 * Independent schematic g = H − T_K s near the selected transition.
 * Centering at T0 is equivalent to H_j = g0 + T0_K s_j, avoiding cancellation.
 * The higher-temperature reactant assemblage has the larger chosen entropy.
 * These slopes do not establish measured latent heats or transition orders.
 */
export function thermalEnergy(caseIndex: number, T: number): {
  reactant: number; product: number; stable: 0 | 1 | 2; gap: number
} {
  if (!Number.isInteger(caseIndex) || !thermalCases[caseIndex]) throw new Error('Unknown thermal case.')
  if (!Number.isFinite(T) || T < -273.15) throw new Error('Temperature must be finite and at or above absolute zero.')
  const transition = thermalCases[caseIndex]
  const deltaKelvin = (T + 273.15) - (transition.T + 273.15)
  const reactant = 2 - .020 * deltaKelvin
  const product = 2 - .010 * deltaKelvin
  const gap = product - reactant
  return { reactant, product, stable: gap === 0 ? 2 : gap > 0 ? 0 : 1, gap }
}
