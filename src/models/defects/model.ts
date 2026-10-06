import { defineSimulation } from '../../framework/model'
import { sampleModel, getPlayback, reactions, KB } from './calculation'
import { Scene } from './Scene'
import { Lesson } from './Lesson'
import { formulas } from './formulas'
import { getSnapshotNotes, getSnapshotReport } from './snapshot'
import './styles.css'

export const defectsModel = defineSimulation({
  id: 'defects', title: 'Kröger–Vink defects', eyebrow: 'LAB B · EXAM QUESTION 2',
  description: 'Build a defect symbol, follow a balanced reaction, or compare activation energies.',
  interactionHint: 'Choose one activity. Follow the numbered explanation, then inspect its calculation.',
  defaults: { topic: 0, reference: 0, reaction: 1, species: 2, site: 0, charge: -1, temperature: 1000, energyMode: 0 },
  controls: [
    { key: 'topic', label: 'Activity', group: 'Choose your task', min: 0, max: 2, step: 1,
      options: [{ value: 0, label: 'Build a symbol' }, { value: 1, label: 'Follow a reaction' }, { value: 2, label: 'Compare energies' }] },
    { key: 'reference', label: 'Example source', group: 'Example', min: 0, max: 1, step: 1, visibleWhen: () => false,
      options: [{ value: 0, label: 'Practice exam' }, { value: 1, label: 'Lecture · Ta substitution' }] },
    { key: 'reaction', label: 'Balanced reaction', group: 'Reaction', min: 0, max: 6, step: 1, visibleWhen: p => p.topic === 1,
      options: reactions.map((reaction, value) => ({ value, label: reaction.title })),
      note: 'Follow the selected reaction only. The term table explains its ions, vacant sites, electronic carriers and reservoirs.' },
    { key: 'species', label: 'Species', group: 'Build notation', min: 0, max: 3, step: 1, visibleWhen: p => p.topic === 0,
      options: [{ value: 0, label: 'Platinum · Pt' }, { value: 1, label: 'Oxygen · O' }, { value: 2, label: 'Tantalum · Ta' }, { value: 3, label: 'Vacancy · V' }] },
    { key: 'site', label: 'Site', group: 'Build notation', min: 0, max: 2, step: 1, visibleWhen: p => p.topic === 0,
      options: [{ value: 0, label: 'Platinum site · Pt' }, { value: 1, label: 'Oxygen site · O' }, { value: 2, label: 'Interstitial site · i' }] },
    { key: 'charge', label: 'Your proposed effective charge', group: 'Build notation', min: -8, max: 8, step: 1, visibleWhen: p => p.topic === 0,
      options: Array.from({ length: 17 }, (_, i) => { const value = i - 8; return { value, label: `${value > 0 ? '+' : ''}${value} · ${value === 0 ? '×' : value > 0 ? '•'.repeat(value) : '′'.repeat(-value)}` } }),
      note: 'Effective charge = species charge − normal site charge. Each dot means +1, each prime −1, and × means zero.' },
    { key: 'temperature', label: 'Absolute temperature', group: 'Energy comparison', unit: 'K', min: 300, max: 2000, step: 10, visibleWhen: p => p.topic === 2 },
    { key: 'energyMode', label: 'Energy interpretation', group: 'Energy comparison', min: 0, max: 1, step: 1, visibleWhen: p => p.topic === 2,
      options: [{ value: 0, label: 'Activation energies · kinetic weights' }, { value: 1, label: 'Assume formation energies · equilibrium' }],
      note: 'The exam supplies activation energies. Formation estimates are an optional additional assumption.' },
  ],
  sample: sampleModel, getPlayback, getSnapshotNotes, getSnapshotReport,
  getReadouts: (p, s) => p.topic === 1 ? [
    { label: 'Atom balance residual', value: s.massResidual },
    { label: 'Site balance residual', value: s.siteResidual },
    { label: 'Effective-charge residual', value: s.chargeResidual },
  ] : p.topic === 2 ? [
    { label: 'Thermal energy kBT', value: KB * p.temperature, unit: 'eV' },
    { label: p.energyMode ? 'Anion log₁₀ site fraction' : 'Anion log₁₀ kinetic weight', value: s.anionLog },
    { label: p.energyMode ? 'Cation log₁₀ site fraction' : 'Cation log₁₀ kinetic weight', value: s.cationLog },
    { label: p.energyMode ? 'Schottky log₁₀ site fraction' : 'Schottky log₁₀ kinetic weight', value: s.schottkyLog },
  ] : [
    { label: 'Species ionic charge', value: s.speciesValence },
    { label: 'Normal site ionic charge', value: s.normalSiteValence },
    { label: 'Calculated effective charge', value: s.effectiveCharge },
    { label: 'Your proposed effective charge', value: p.charge },
  ],
  Scene, Lesson, formulas,
  guides: [
    { title: 'Read a symbol', text: 'X is the species present; the subscript Y is the site type. The superscript is charge relative to the normal occupant of Y, not the absolute ionic charge.' },
    { title: 'Formal ionic exercise', text: 'For this exam PtO3 means Pt6+ and O2−; Ta2O5 means Ta5+. The diagrams represent labeled sites and bookkeeping, not a measured PtO3 crystal structure.' },
    { title: 'Read a reaction', text: 'Count every element, every lattice/interstitial site type, and the sum of effective charges on each side. A zero products-minus-reactants residual means that quantity is conserved.' },
    { title: 'Read an energy', text: 'A smaller activation barrier gives a larger Arrhenius weight at the same temperature and equal prefactors. It does not determine an equilibrium defect population.' },
  ],
})
