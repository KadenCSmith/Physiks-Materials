import type { NumericParameters, NumericSnapshot } from '../../framework/types'
import { effectiveCharge, energyComparison, KB, reactions, sites, species } from './calculation'
import { reactionStage, scientificValue } from './presentation'

const host = 'Formal ionic host: PtO₃ is treated as Pt⁶⁺ and O²⁻; Ta₂O₅ supplies Ta⁵⁺. This is exam bookkeeping, not evidence that bulk PtO₃ is stable.'
const exam = 'Exam reference: the user-confirmed 12-page Exam_1_F26_Practice_Exam.pdf, p4 Q2. No other exam is used.'

/** Facts follow the active task independently of the visible Learn/Explore/Practice step. */
export function getSnapshotNotes(p: NumericParameters, s: NumericSnapshot, format: (value: number) => string = String): string[] {
  const topic = Math.round(p.topic ?? 0)
  const signed = (value: number) => `${value > 0 ? '+' : ''}${format(value)}`
  if (topic === 0) {
    const atom = Math.round(p.species), site = Math.round(p.site)
    const absolute = effectiveCharge(atom, 2), expected = effectiveCharge(atom, site)
    return [
      `Current trial notation: ${species[atom]} on ${site === 2 ? 'interstitial site i' : `${sites[site]} site`}; absolute species charge ${signed(absolute)}, normal occupant charge ${signed(absolute - expected)}, expected effective charge ${signed(expected)}. Effective charge equals species charge minus normal occupant charge.`,
      `Proposed effective charge ${signed(p.charge)} ${Number.isInteger(p.charge) ? (p.charge === expected ? 'matches the selected species and site.' : 'does not match the selected species and site.') : 'is invalid: dots and primes require a whole number of charge units.'} One dot means +1, one prime means −1, and × means zero. A vacancy V is a species; it is not a site type.`,
      host, exam,
    ]
  }
  if (topic === 1) {
    const id = Math.round(p.reaction)
    const notes = [
      `Selected balanced reaction: ${reactions[id].title}. Current teaching stage: ${reactionStage(s.progress).label}. Atom residual ${format(s.massResidual)}, site residual ${format(s.siteResidual)}, effective-charge residual ${format(s.chargeResidual)}. Zero residual means conservation.`,
      'Every effective-charge contribution is the reaction coefficient times the charge per term. The separately selected trial symbol does not alter this fixed reaction.',
      'PtO₃(s) denotes a surface/solid reservoir outside the lattice. Vᵢˣ denotes an explicitly empty interstitial site; h• is electronic charge, not an atom. These examples do not predict a preferred incorporation mechanism.',
      host, exam,
    ]
    if (p.reference === 1 && id === 3) notes.push('Loaded lecture reference: Practice Exam 1 Problem 2 Fall 2026, 3:35, https://www.youtube.com/watch?v=i6fOof4oQwc&t=215s. The inspected frame shows Ta substitution with oxygen-vacancy compensation; the full reservoir balance is independently explicit.')
    return notes
  }
  const formation = p.energyMode === 1, energy = energyComparison(p.temperature, formation)
  return [
    `Current temperature ${format(p.temperature)} K; kBT = ${scientificValue(KB * p.temperature, format)} eV. The exam labels 0.1, 2.3 and 4 eV as activation energies for anion Frenkel, cation Frenkel and Schottky defects, respectively.`,
    formation
      ? 'Conditional formation-energy mode: assume the listed values are formation energies per Frenkel pair or one-Pt/three-O Schottky cluster. K = exp(−Ef/kBT). Ideal dilute fractions scale as K^(1/2), K^(1/2), K^(1/4), respectively.'
      : 'Activation mode: k = k₀ exp(−Ea/kBT). Compare equal-prefactor kinetic weights. Activation barriers alone do not establish equilibrium defect populations.',
    `Current ${formation ? 'conditional site fractions' : 'kinetic weights'}: anion ${scientificValue(energy[0].fraction, format)}, cation ${scientificValue(energy[1].fraction, format)}, Schottky ${scientificValue(energy[2].fraction, format)}. Small nonzero values retain scientific notation.`,
    formation
      ? `Assume unit entropy prefactors, ideal dilute activities, equal normalized host/interstitial capacities and equal normalized Pt/O vacancy fractions. ${energy[0].fraction > .1 ? 'The anion estimate is too large for the dilute approximation.' : 'These remain conditional model estimates.'} These are not measured equilibrium populations.`
      : 'The anion process has the largest conditional kinetic weight only under equal prefactors. Absolute rate prefactors and thermodynamic formation data are not supplied.',
    exam,
  ]
}

export { getSnapshotReport } from './report'
