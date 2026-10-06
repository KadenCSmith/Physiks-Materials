import { useNumberFormat } from '../../framework/formatting'
import { MathFormula } from '../../framework/Math'
import type { SimulationLessonProps } from '../../framework/types'
import { StudyPanel, Equation, numericAnswer, type Question } from '../shared/StudyPanel'
import { reactions, energyComparison, effectiveCharge, kvTex, KB, species, sites, speciesValences, siteValences } from './calculation'
import { reactionSteps, scientificTex } from './presentation'

const source = 'Only exam source: user-confirmed 12-page Exam_1_F26_Practice_Exam.pdf, p4 Q2. PtO₃ / Ta₂O₅ and activation energies 0.1, 2.3, 4 eV were visually verified. Instructor textbook §3.2–3.3 supports Kröger–Vink slots. Complete reservoir and empty-site reactions are independently derived; no real crystal geometry, actual migration rate, or preferred doping mechanism is inferred.'
const reactionQuestions = [
  { prompt: 'An oxygen leaves its normal O²⁻ site and occupies an empty interstitial. What is the oxygen interstitial’s effective charge?', value: -2, hint: 'An empty interstitial has reference charge 0: −2 − 0.', solution: '−2, with two primes; the oxygen vacancy is +2.' },
  { prompt: 'In the formal PtO₃ cation Frenkel pair, what is the Pt interstitial’s effective charge?', value: 6, hint: 'Pt is +6 in this host, and an empty interstitial has reference charge 0.', solution: '+6, with six dots; the Pt vacancy is −6 with six primes.' },
  { prompt: 'How many O vacancies compensate one −6 Pt vacancy in a neutral Schottky cluster?', value: 3, hint: 'Each O vacancy is +2. Solve −6 + 2n = 0.', solution: 'Three O vacancies. One Pt and three O also form one reservoir PtO₃ unit.' },
  { prompt: 'How many +2 oxygen vacancies compensate two Ta-on-Pt substitutions, each with effective charge −1?', value: 1, hint: 'Solve 2(−1) + 2n = 0.', solution: 'One O vacancy for every two Ta-on-Pt defects.' },
  { prompt: 'How many +1 holes compensate two Ta-on-Pt substitutions, each with effective charge −1?', value: 2, hint: 'Solve 2(−1) + n(+1) = 0. Holes carry charge, not atoms.', solution: 'Two holes. The supplied O₂ reservoir keeps atom balance separate from electronic compensation.' },
  { prompt: 'How many −2 oxygen interstitials compensate two +5 Ta interstitials?', value: 5, hint: 'Solve 2(+5) − 2n = 0.', solution: 'Five oxygen interstitials; seven initially empty interstitial sites are consumed in total.' },
  { prompt: 'How many −6 Pt vacancies compensate six +5 Ta interstitials?', value: 5, hint: 'Solve 6(+5) − 6n = 0.', solution: 'Five Pt vacancies. The five removed Pt combine with dopant oxygen in five reservoir PtO₃ units.' },
]

export function Lesson({ parameters: p, snapshot: s }: SimulationLessonProps) {
  const { format: n } = useNumberFormat(), topic = Math.round(p.topic ?? 0)
  const speciesId = Math.round(p.species), siteId = Math.round(p.site), expected = effectiveCharge(speciesId, siteId)
  const reactionId = Math.round(p.reaction), reaction = reactions[reactionId], steps = reactionSteps[reactionId]
  const formation = p.energyMode === 1, energy = energyComparison(p.temperature, formation)
  const relativeMethod = String.raw`X_Y^q,\qquad q=z_X-z_{Y,\mathrm{normal}}`
  const chargeResult = <Equation tex={String.raw`${relativeMethod},\quad q=${speciesValences[speciesId]}-(${siteValences[siteId]})=${expected}`}>Current selection: species {species[speciesId]} on site {sites[siteId]}. Effective charge is {n(expected)}.</Equation>

  if (topic === 0) {
    const question: Question = { prompt: `${species[speciesId]} occupies ${siteId === 2 ? 'an empty interstitial' : `a normal ${sites[siteId]} site`}. Its absolute charge is ${n(speciesValences[speciesId])}; the normal occupant charge is ${n(siteValences[siteId])}. Enter the effective charge.`, hint: `Subtract the normal site charge: ${n(speciesValences[speciesId])} − (${n(siteValences[siteId])}).`, check: answer => numericAnswer(answer, expected), solution: `${n(expected)}. The superscript expresses charge relative to this site, not absolute ionic valence.` }
    return <StudyPanel key={`symbol-${speciesId}-${siteId}`} method={relativeMethod} title="Read each part of the symbol" steps={[
      <p>Predict the sign before calculating. Is the selected species more positive, less positive, or equal in charge to this site's normal occupant?</p>,
      <p>In the displayed X_Y^q notation, X is the occupying species, Y is the site subscript, and q is the charge superscript. A host atom can occupy X. A vacancy is represented by V in X; Y is a normal Pt/O site or interstitial i, never a site named V.</p>,
      chargeResult,
      <><Equation tex={kvTex(speciesId, siteId, expected)} /><p>Write one dot for each positive unit, one prime for each negative unit, and × for zero. Compare your proposed symbol with the calculated symbol beside the diagram.</p></>,
      <><Equation tex={String.raw`\mathrm{Ta}_{\mathrm{Pt}}^\prime:\quad 5-6=-1,\qquad \mathrm{V}_{\mathrm{O}}^{\bullet\bullet}:\quad0-(-2)=+2`} /><p>Ta remains an absolute +5 ion while its relative charge on Pt is −1. A missing O²⁻ leaves an effective +2 vacancy. “Positive ion” and “positive defect” answer different questions.</p></>,
      <p>Try a host Pt atom on a Pt site, then a vacancy on an O site. Switch to Follow a reaction to see how several symbols conserve charge together.</p>,
    ]} explore={<>{chargeResult}<Equation tex={kvTex(speciesId, siteId, expected)} /><p>The formal valences follow neutrality: Pt + 3(−2) = 0, so Pt is +6; 2Ta + 5(−2) = 0, so Ta is +5. An empty interstitial has zero reference charge. The calculator is formal bookkeeping and does not establish that every selected species/site arrangement is stable.</p><p>Your proposed charge is {n(p.charge)}; {s.chargeValid ? 'it matches.' : `the calculated charge is ${n(expected)}.`} The balanced reactions are separate fixed constructions and are not changed by this trial.</p></>} question={question} source={source} />
  }

  if (topic === 1) {
    const nearby = reactionQuestions[reactionId]
    const question: Question = { ...nearby, check: answer => numericAnswer(answer, nearby.value) }
    const result = <><Equation tex={reaction.tex} /><p>Atom residual {n(s.massResidual)}; charge residual {n(s.chargeResidual)}; site residual {n(s.siteResidual)}. Zero means equal inventories on both sides.</p></>
    return <StudyPanel key={`reaction-${reactionId}`} method={reaction.tex} title={reaction.title} steps={[
      <p>Predict which site becomes empty, which site gains an ion, and whether atoms enter or leave an external reservoir.</p>,
      <p>{steps.before} Use the numbered Before / Change / Check products buttons to freeze the reveal and inspect each inventory.</p>,
      <><p>{steps.change}</p>{result}</>,
      <p>{steps.after} Coefficients count species or formula units. Every dot/prime contributes one unit to the total effective-charge balance.</p>,
      <p>{steps.lesson} Empty interstitial sites preserve site bookkeeping; PtO₃(s) is outside the host. A hole is electronic charge rather than a moving atom. The diagram allocates conserved atoms among reaction terms; it is not a measured lattice or physical trajectory.</p>,
      <p>Try the Practice charge-compensation question for this reaction. Compare its mechanism with another substitutional or interstitial alternative; all are distinct balanced examples.</p>,
    ]} explore={<>{result}<p>{steps.before}</p><p>{steps.change}</p><p>{steps.after}</p><p>{steps.lesson}</p><p>The visible table checks Pt, O, Ta, effective charge and each site type separately. Atom conservation alone does not prove charge conservation. These reaction choices do not predict which mechanism is preferred in a real material.</p>{p.reference === 1 && reactionId === 3 && <p>The inspected lecture at 3:35 shows the compact oxygen-vacancy substitution mechanism. The complete reservoir/site terms here are independently explicit.</p>}</>} question={question} source={source} />
  }

  const method = formation ? String.raw`K=\exp(-E_f/k_BT),\quad c_F\simeq K^{1/2},\quad c_S\simeq K^{1/4}` : String.raw`k=k_0\exp(-E_a/k_BT),\quad w=k/k_0`
  const result = <Equation tex={method}>At {n(p.temperature)} K, kBT = {n(KB * p.temperature)} eV. Anion {formation ? 'conditional fraction' : 'kinetic weight'} = <MathFormula inline tex={scientificTex(energy[0].fraction, n)} />; cation = <MathFormula inline tex={scientificTex(energy[1].fraction, n)} />; Schottky = <MathFormula inline tex={scientificTex(energy[2].fraction, n)} />.</Equation>
  const question: Question = formation
    ? { prompt: 'One PtO₃ Schottky cluster contains one Pt vacancy and three O vacancies. If their normalized site fractions are equal, which power of K gives the conditional common fraction?', hint: 'The mass-action product is cPt × cO³ = c⁴ = K.', choices: ['K^(1/2)', 'K^(1/4)', 'K'], check: answer => answer.trim() === 'K^(1/4)', solution: 'K^(1/4), conditional on formation energies and the stated ideal dilute/site-capacity assumptions.' }
    : { prompt: 'Given equal prefactors, which process has the largest kinetic weight for the supplied activation barriers?', hint: 'In exp(−Ea/kBT), the smallest positive barrier gives the least suppression.', choices: ['Anion Frenkel', 'Cation Frenkel', 'Schottky'], check: answer => answer.trim() === 'Anion Frenkel', solution: 'Anion Frenkel, with 0.1 eV. This ranks kinetic weights; it does not prove equilibrium concentration dominance.' }
  return <StudyPanel key={`energy-${p.energyMode}`} method={method} title={formation ? 'State the extra equilibrium assumptions' : 'Explain what the activation barrier predicts'} steps={[
    <p>Predict how increasing temperature changes exp(−E/kBT), and which supplied energy gives the largest value at the same temperature.</p>,
    <p>The exam labels anion Frenkel 0.1 eV, cation Frenkel 2.3 eV, and Schottky 4 eV as activation energies. Its cation-reaction request does not change the fact that the anion barrier is lowest.</p>,
    result,
    <p>{formation ? 'Extra assumption: reuse the numbers as formation energies per Frenkel pair or Schottky cluster. For a neutral Frenkel pair K=cV ci and equal normalized capacities give c≈√K. For PtO₃ Schottky, K=cPt cO³; equal normalized vacancy fractions give c≈K¼.' : 'k is the process rate, k₀ its prefactor, Ea the activation barrier, kB Boltzmann’s constant, and T absolute temperature. Under equal prefactors the relative weights are w=k/k₀. The table retains tiny values in scientific notation instead of rounding them to zero.'}</p>,
    <p>{formation ? `The anion estimate ${n(energy[0].fraction)} is too large for a dilute model. Formation energies, unit entropy factors, ideal activities, and equal normalized site capacities are additional assumptions, not measurements supplied by the exam.` : 'The smallest barrier gives the largest equal-prefactor kinetic weight. A barrier describes a process; a formation free energy governs equilibrium population. Missing prefactors and thermodynamic data prevent actual rates or equilibrium concentrations from being inferred.'}</p>,
    <p>Try Practice, then compare 300 K and 2000 K. Higher positions on the labeled log plot mean larger values. Switch energy interpretation to inspect the explicitly conditional equilibrium calculation.</p>,
  ]} explore={<>{result}<p>{formation ? 'log₁₀K = −Ef/(kBT ln 10). The plot shows log₁₀c: divide log₁₀K by 2 for either Frenkel pair, or by 4 for the PtO₃ Schottky cluster.' : 'The plot shows log₁₀w = −Ea/(kBT ln 10).'} The plotted curves use a conventional log axis; numbers become less negative upward. Temperature sets the current vertical marker, while playback does not change thermodynamic values.</p><p>{formation ? 'The normalized Schottky vacancy fractions are equal even though there are three times as many O vacancies, because the host also has three O sites per Pt site. Large fractions invalidate dilution.' : 'The 0.1 eV anion process has the largest weight at every displayed temperature under equal prefactors. The provided barriers do not determine actual process rates or measured equilibrium populations.'}</p></>} question={question} source={source} />
}
