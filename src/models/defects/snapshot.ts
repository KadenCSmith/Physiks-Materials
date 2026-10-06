import type { NumericParameters, NumericSnapshot } from '../../framework/types'
import { effectiveCharge, energyComparison, KB, reactions, sites, species } from './calculation'

/** Scientific context remains available regardless of the visible Learn/Explore/Practice step. */
export function getSnapshotNotes(p: NumericParameters, s: NumericSnapshot, format: (value: number) => string = String): string[] {
  const speciesId = Math.round(p.species), siteId = Math.round(p.site), reactionId = Math.round(p.reaction)
  const signed = (value: number) => `${value > 0 ? '+' : ''}${format(value)}`
  const absoluteCharge = effectiveCharge(speciesId, 2)
  const normalCharge = absoluteCharge - s.effectiveCharge
  const energy = energyComparison(p.temperature, p.energyMode === 1)
  const trialSite = siteId === 2 ? 'interstitial site i' : `${sites[siteId]} site`
  const notes = [
    `Formal ionic host: PtO₃ is treated as Pt⁶⁺ and O²⁻; Ta₂O₅ supplies Ta⁵⁺. This is exam bookkeeping, not evidence that bulk PtO₃ is stable.`,
    `Current trial notation: ${species[speciesId]} on ${trialSite}; absolute species charge ${signed(absoluteCharge)}, normal occupant charge ${signed(normalCharge)}, expected effective charge ${signed(s.effectiveCharge)}. Effective charge equals species charge minus normal occupant charge.`,
    `Proposed effective charge ${signed(p.charge)} ${Number.isInteger(p.charge) ? (s.chargeValid ? 'matches the selected species and site.' : 'does not match the selected species and site.') : 'is invalid: dots and primes require a whole number of charge units.'} One dot means +1, one prime means −1, and × means zero. A vacancy V is a species; it is not a site type.`,
    `Selected balanced reaction: ${reactions[reactionId].title}. Atom residual ${format(s.massResidual)}, site residual ${format(s.siteResidual)}, effective-charge residual ${format(s.chargeResidual)}. Zero residual means conservation; the separately selected trial symbol does not alter this fixed reaction.`,
    `PtO₃(s) denotes a surface/solid reservoir outside the lattice. Vᵢˣ denotes an explicitly empty interstitial site. Reservoirs and empty sites make the full atom/site/charge balance explicit; these examples do not predict a preferred incorporation mechanism.`,
    `Current temperature ${format(p.temperature)} K; kBT = ${format(KB * p.temperature)} eV. The exam labels 0.1, 2.3 and 4 eV as activation energies for anion Frenkel, cation Frenkel and Schottky defects, respectively.`,
  ]
  if (p.energyMode === 1) {
    notes.push(`Conditional formation-energy mode: assume the listed values are formation energies per Frenkel pair or one-Pt/three-O Schottky cluster. K = exp(−Ef/kBT). Ideal dilute fractions scale as K^(1/2), K^(1/2), K^(1/4), respectively.`)
    notes.push(`Current conditional log₁₀ site fractions: anion ${format(energy[0].logFraction)}, cation ${format(energy[1].logFraction)}, Schottky ${format(energy[2].logFraction)}. Anion site-fraction estimate ${format(energy[0].fraction)} is large enough to violate the dilute approximation.`)
    notes.push(`Assumptions: unit entropy prefactors, ideal dilute activities, equal normalized host/interstitial capacities for each Frenkel pair. Schottky Pt and O vacancy fractions are equal because there are three O sites per Pt site. These are conditional estimates, not measured equilibrium populations.`)
  } else {
    notes.push(`Activation mode: k = k₀ exp(−Ea/kBT). Current log₁₀ equal-prefactor kinetic weights: anion ${format(energy[0].logFraction)}, cation ${format(energy[1].logFraction)}, Schottky ${format(energy[2].logFraction)}. k₀ is the attempt-rate prefactor; Ea is a barrier; kB is Boltzmann’s constant.`)
    notes.push(`The anion process has the largest conditional kinetic weight only under equal prefactors. Activation barriers alone do not establish equilibrium defect populations; migration/formation prefactors and thermodynamic data are not supplied.`)
  }
  notes.push(p.reference === 1
    ? `Reference frame: Practice Exam 1 Problem 2 Fall 2026, 3:35, https://www.youtube.com/watch?v=i6fOof4oQwc&t=215s. The inspected frame shows Ta substitution with oxygen-vacancy compensation. ${reactionId === 3 ? 'The selected substitution matches that example, with an independently explicit reservoir.' : 'The current reaction differs from that inspected example and is independently derived.'} The unfinished interstitial line is not attributed.`
    : 'Exam reference: the user-confirmed 12-page Exam_1_F26_Practice_Exam.pdf, p4 Q2. No other exam is used.')
  return notes
}
