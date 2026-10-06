import type { NumericParameters, NumericSnapshot, SnapshotReport, SnapshotReportCell } from '../../framework/types'
import { balance, energyComparison, KB, kvTex, reactions, sites, species, speciesValences, siteValences } from './calculation'
import { inventory, reactionSteps, scientificValue, termLabel, termTex } from './presentation'
import { chapter } from '../shared/StudyPanel'

const host = 'Formal exam host: PtO₃ is treated as Pt⁶⁺ and O²⁻; Ta₂O₅ supplies Ta⁵⁺. This is ionic bookkeeping, not evidence that bulk PtO₃ is stable.'
const notation = 'The main letter names the species; the subscript names its site (Pt, O or interstitial i); the superscript is charge relative to the normal occupant. A dot is +1, a prime is −1, and × is zero. Vacancy V is a species, not a site type.'
const examSource = 'Exam_1_F26_Practice_Exam.pdf · user-confirmed 12-page copy · p4, Question 2. This is the only exam reference.'
const names = ['Anion Frenkel', 'Cation Frenkel', 'Schottky cluster']
const signed = (value: number, format: (value: number) => string) => `${value > 0 ? '+' : ''}${format(value)}`
const shownValue = (value: number, format: (value: number) => string): SnapshotReportCell => {
  const ordinary = format(value)
  if (value === 0 || (Math.abs(value) >= .001 && ordinary !== '0' && ordinary !== '-0')) return ordinary
  const exponent = Math.floor(Math.log10(Math.abs(value)))
  return { tex: `${format(value / 10 ** exponent)}\\times 10^{${exponent}}` }
}

/** A compact report follows the selected task and never includes inactive lesson steps. */
export function getSnapshotReport(p: NumericParameters, s: NumericSnapshot, format: (value: number) => string = String): SnapshotReport {
  const topic = Math.round(p.topic ?? 0), reactionId = Math.round(p.reaction)
  const sources = [examSource]
  if (topic === 0) {
    const atom = Math.round(p.species), site = Math.round(p.site)
    const expected = speciesValences[atom] - siteValences[site]
    const whole = Number.isInteger(p.charge)
    const siteName = site === 2 ? 'an interstitial site' : `a ${sites[site]} site`
    return {
      title: `Build a symbol · ${species[atom]} on ${sites[site]}`,
      description: 'Identify the species, identify its site, then subtract the normal occupant’s charge.',
      sections: [
        { title: 'Your selected symbol', tex: whole ? [kvTex(atom, site, p.charge)] : [], rows: [
          { label: 'Species', value: species[atom] === 'V' ? 'Vacancy V · no atom' : species[atom] },
          { label: 'Site', value: siteName },
          { label: 'Your proposed effective charge', value: signed(p.charge, format) },
          { label: 'Check', value: !whole ? 'Use a whole charge' : p.charge === expected ? 'Matches the selected species and site' : `Expected ${signed(expected, format)}` },
        ], notes: whole ? [] : ['Each dot and prime counts one unit; fractional proposed charges cannot be written as valid charge marks.'] },
        { title: 'Calculate the relative charge', tex: [String.raw`q_{\mathrm{effective}}=z_{\mathrm{species}}-z_{\mathrm{normal\ occupant}}`,
          `q_{\\mathrm{effective}}=(${speciesValences[atom]})-(${siteValences[site]})=${expected}`,
          kvTex(atom, site, expected)], rows: [
          { label: 'Absolute species charge', value: signed(speciesValences[atom], format) },
          { label: 'Normal occupant charge', value: signed(siteValences[site], format) },
          { label: 'Expected effective charge', value: signed(expected, format) },
        ], notes: ['The final symbol above uses the expected charge. Absolute ionic charge and relative defect charge answer different questions.'] },
        { title: 'Interpret the notation', notes: [notation, host,
          'Try a vacancy on an oxygen site: 0 − (−2) = +2, so V on O has two dots. Choosing a balanced reaction is a separate task.'] },
      ], sources: [...sources, `Textbook Chapter 3, §3.2–3.3 · ${chapter(3)}`],
    }
  }
  if (topic === 1) {
    const reaction = reactions[reactionId], step = reactionSteps[reactionId]
    const left = inventory(reaction.left), right = inventory(reaction.right), residual = balance(reaction)
    const quantities = [
      ['Pt atoms', 'Pt'], ['O atoms', 'O'], ['Ta atoms', 'Ta'],
      ['Pt sites', 'PtSites'], ['O sites', 'OSites'], ['Interstitial sites', 'iSites'], ['Effective charge', 'charge'],
    ] as const
    if (p.reference === 1 && reactionId === 3) sources.push('Inspected lecture frame · Practice Exam 1 Problem 2 Fall 2026 · 3:35 · https://www.youtube.com/watch?v=i6fOof4oQwc&t=215s. Reservoir terms are independently made explicit.')
    return {
      title: `Follow a reaction · ${reaction.title}`,
      description: 'Follow the selected atom inventory and check what is conserved. This is a formal balanced example.',
      sections: [
        { title: 'Selected reaction', tex: [reaction.tex], notes: [step.lesson] },
        { title: 'Before → change → after', rows: [
          { label: 'Current teaching stage', value: s.progress < .2 ? 'Before' : s.progress < .8 ? 'Change' : 'After' },
        ], notes: [`Before: ${step.before}`, `Change: ${step.change}`, `After: ${step.after}`] },
        { title: 'Read each product term', table: {
          headers: ['Symbol', 'Meaning', 'Count', 'Charge per term', 'Count × charge'],
          rows: reaction.right.map(term => [{ tex: termTex(term) }, termLabel({ ...term, coefficient: 1 }),
            String(term.coefficient), signed(term.charge, format), signed(term.coefficient * term.charge, format)]),
        }, notes: ['Charge is relative to the normal occupant of the named site. A dot is +1, a prime is −1, and × is neutral. Count is the reaction coefficient; the last column is its contribution to the product-side charge total.'] },
        { title: 'Check atoms, sites and effective charge', table: {
          headers: ['Quantity', 'Reactants', 'Products', 'Products − reactants'],
          rows: quantities.map(([label, key]) => [label, String(left[key]), String(right[key]), String(residual[key])]),
        }, notes: ['Zero in the last column means that quantity is conserved. Charge totals count each term’s effective charge times its coefficient. Empty interstitial sites are counted explicitly.'] },
        { title: 'Site and reservoir assumptions', notes: [
          'PtO₃(s) is an external surface/solid reservoir, not an extra atom on a host lattice site. Vᵢˣ is an empty interstitial; h• is electronic charge, not an atom.',
          host,
          'These reactions show consistent bookkeeping. They do not predict the preferred incorporation mechanism. The species/site trial symbol belongs to the separate Build a symbol task.',
        ] },
      ], sources: [...sources, `Defect notation and mechanisms · textbook Chapter 3, §3.2–3.3 · ${chapter(3)}`],
    }
  }
  const formation = p.energyMode === 1, energy = energyComparison(p.temperature, formation)
  return {
    title: `Compare energies · ${formation ? 'conditional formation assumption' : 'activation barriers'}`,
    description: formation ? 'Assume formation energies and use the defect stoichiometry. The exam does not supply measured formation data.' : 'Compare Arrhenius weights under equal prefactors. A barrier alone does not give an equilibrium defect population.',
    sections: [
      { title: 'Current comparison', rows: [
        { label: 'Temperature', value: `${format(p.temperature)} K` },
        { label: 'Thermal energy kBT', value: `${scientificValue(KB * p.temperature, format)} eV` },
        { label: 'Interpretation', value: formation ? 'Assume formation energies' : 'Given activation energies' },
      ], table: {
        headers: ['Defect process', 'Energy (eV)', formation ? 'Conditional site fraction c' : 'Kinetic weight k/k₀', formation ? 'log₁₀ c' : 'log₁₀(k/k₀)'],
        rows: energy.map((entry, index) => [names[index], String(entry.energy), shownValue(entry.fraction, format), format(entry.logFraction)]),
      }, notes: ['Small nonzero results use scientific notation so display rounding does not imply an exact zero. No absolute rate or equilibrium concentration is measured here.'] },
      { title: 'Use the relevant equation', tex: formation ? [
        String.raw`K=\exp(-E_f/k_BT)`,
        String.raw`K_F=c_Vc_i,\qquad c_F\simeq K_F^{1/2}`,
        String.raw`K_S=c_{V_{Pt}}c_{V_O}^3,\qquad c_S\simeq K_S^{1/4}`,
      ] : [String.raw`k=k_0\exp(-E_a/k_BT),\qquad w=k/k_0`,
        String.raw`k_B=8.617333262145\times10^{-5}\ \mathrm{eV/K}`], notes: formation ? [
        'Each Frenkel pair has two defects. The PtO₃ Schottky cluster has one Pt vacancy and three O vacancies. Equal normalized vacancy site fractions give the fourth-root dependence.',
      ] : [
        'k₀ is a rate prefactor; Eₐ is an activation barrier; kB is Boltzmann’s constant; T is absolute temperature. The 0.1 eV anion process has the largest weight only when prefactors are equal.',
      ] },
      { title: formation ? 'Conditions and limits' : 'What this comparison establishes', notes: formation ? [
        'Assume energies per Frenkel pair or four-vacancy Schottky cluster, unit entropy factors, ideal dilute activities and equal normalized host/interstitial capacities for Frenkel pairs.',
        `The conditional anion fraction is ${scientificValue(energy[0].fraction, format)}. ${energy[0].fraction > .1 ? 'This is too large for the dilute approximation; treat the numerical value as a warning about the assumption.' : 'This is a conditional model estimate, not measured defect population data.'}`,
        'The exam calls these activation energies. Treating them as formation energies is an additional assumption.',
      ] : [
        'Lower activation barrier means a larger conditional kinetic weight. Unknown prefactors can change relative rates. Activation barriers alone cannot establish equilibrium defect concentrations.',
        'The 0.1, 2.3 and 4 eV exam values correspond to anion Frenkel, cation Frenkel and Schottky processes, respectively.',
      ] },
    ], sources: [...sources, `Defect energy concepts · textbook Chapter 3, §3.1–3.2 · ${chapter(3)}`],
  }
}
