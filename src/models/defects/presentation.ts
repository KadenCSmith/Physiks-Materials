import { kvTex, reactions, type Term } from './calculation'

export const topicTitles = ['Build a symbol', 'Follow a reaction', 'Compare energies']
export const reactionSteps = [
  { before: 'One oxygen occupies an O site; one interstitial site is empty.', change: 'Move that oxygen to the empty interstitial. Its original O site becomes a vacancy.', after: 'An oxygen vacancy (+2) and oxygen interstitial (−2) form a neutral Frenkel pair.', lesson: 'A Frenkel pair moves an ion within the host. No oxygen is lost to a reservoir.' },
  { before: 'One platinum occupies a Pt site; one interstitial site is empty.', change: 'Move that platinum to the empty interstitial. Its original Pt site becomes a vacancy.', after: 'A platinum vacancy (−6) and platinum interstitial (+6) form a neutral Frenkel pair.', lesson: 'The cation is Pt⁶⁺ in this formal host. Both defects require six charge marks.' },
  { before: 'One Pt and three O occupy their normal host sites.', change: 'Transfer one complete PtO₃ formula unit to the external surface/solid reservoir.', after: 'One Pt vacancy and three O vacancies remain: −6 + 3(+2) = 0.', lesson: 'Schottky formation removes a neutral formula unit. The reservoir preserves atom balance.' },
  { before: 'Ta₂O₅ supplies two Ta and five O. Two Pt sites and one O site are initially occupied.', change: 'Two Ta replace two Pt; one host O is removed. The displaced Pt and six O enter two PtO₃ reservoir units.', after: 'Two Ta-on-Pt defects contribute −2; one oxygen vacancy contributes +2.', lesson: 'Ta⁵⁺ on a Pt⁶⁺ site is −1 relative to the host. A single +2 oxygen vacancy compensates two substitutions.' },
  { before: 'Ta₂O₅ supplies two Ta and five O; half an O₂ molecule supplies one more O. Two Pt sites are occupied.', change: 'Two Ta replace two Pt. Displaced Pt and six reservoir O make two PtO₃ units; two holes supply electronic compensation.', after: 'Two Ta-on-Pt defects contribute −2; two holes contribute +2. No O-site vacancy is required.', lesson: 'A hole is electronic charge bookkeeping, not an atom. It is not drawn as a moving ion.' },
  { before: 'Ta₂O₅ supplies two Ta and five O; seven interstitial sites are empty.', change: 'Place two Ta and five O into those seven interstitial sites.', after: 'Two Ta interstitials contribute +10; five O interstitials contribute −10.', lesson: 'Interstitial Ta has charge +5 relative to an empty site, whereas substitutional Ta on Pt has −1.' },
  { before: 'Three Ta₂O₅ units supply six Ta and fifteen O. Five Pt sites are occupied; six interstitial sites are empty.', change: 'Six Ta fill the interstitial sites. Five Pt leave their sites and combine with the fifteen dopant O in five PtO₃ reservoir units.', after: 'Six Ta interstitials contribute +30; five Pt vacancies contribute −30.', lesson: 'Only Pt leaves host sites here. All fifteen reservoir oxygen atoms come from the dopant; host O sites are spectators.' },
]

export function reactionStage(progress: number) {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0
  const movement = Math.min(1, Math.max(0, (p - .2) / .6))
  return { index: p < .2 ? 0 : p < .8 ? 1 : 2, movement, label: p < .2 ? 'Before' : p < .8 ? 'Change' : 'After' }
}

export function termLabel(term: Term): string {
  const labels: Record<string, string> = {
    'Pt_Ptˣ': 'Pt on Pt sites', 'O_Oˣ': 'O on O sites', 'V_iˣ': 'Empty interstitial sites',
    'V_Pt′′′′′′': 'Vacant Pt sites', 'V_O••': 'Vacant O sites',
    'O_i′′': 'O in interstitial sites', 'Pt_i••••••': 'Pt in interstitial sites',
    'Ta_Pt′': 'Ta on Pt sites', 'Ta_i•••••': 'Ta in interstitial sites',
    'PtO₃(surface / reservoir)': 'PtO₃ external reservoir', 'Ta₂O₅': 'Ta₂O₅ dopant',
    'O₂(g)': 'O₂ gas reservoir', 'h•': 'Holes · electronic charge',
  }
  return `${term.coefficient === 1 ? '' : `${term.coefficient} × `}${labels[term.name] ?? term.name}`
}


/** One species/formula term; its stoichiometric coefficient is displayed separately. */
export function termTex(term: Term): string {
  const tex: Record<string, string> = {
    'Pt_Ptˣ': kvTex(0, 0, 0), 'O_Oˣ': kvTex(1, 1, 0), 'V_iˣ': kvTex(3, 2, 0),
    'V_Pt′′′′′′': kvTex(3, 0, -6), 'V_O••': kvTex(3, 1, 2),
    'O_i′′': kvTex(1, 2, -2), 'Pt_i••••••': kvTex(0, 2, 6),
    'Ta_Pt′': kvTex(2, 0, -1), 'Ta_i•••••': kvTex(2, 2, 5),
    'PtO₃(surface / reservoir)': String.raw`\mathrm{PtO}_3(\mathrm{s})`,
    'Ta₂O₅': String.raw`\mathrm{Ta}_2\mathrm{O}_5`, 'O₂(g)': String.raw`\mathrm{O}_2(\mathrm{g})`,
    'h•': String.raw`h^{\bullet}`,
  }
  return tex[term.name]
}

export type AtomAllocation = { element: string; sourceTerm: number; targetTerm: number; from: [number, number]; to: [number, number] }
function sideAtoms(terms: Term[], left: boolean) {
  return terms.flatMap((term, termIndex) => {
    const elements = Object.entries(term.atoms).flatMap(([element, count]) => Array.from({ length: Math.round(count * term.coefficient) }, () => element))
    return elements.map((element, index) => ({ element, termIndex, point: [left ? 65 + index % 12 * 22 : 445 + index % 12 * 22, 96 + termIndex * 82 + Math.floor(index / 12) * 20] as [number, number] }))
  })
}

/** Matches conserved atoms between reactant/product terms, not physical migration paths. */
export function reactionAtoms(reactionId: number): AtomAllocation[] {
  const reaction = reactions[reactionId], left = sideAtoms(reaction.left, true), right = sideAtoms(reaction.right, false)
  const available = [...right]
  return left.map(atom => {
    const index = available.findIndex(candidate => candidate.element === atom.element)
    if (index < 0) throw new Error('Reaction atom inventory is inconsistent')
    const destination = available.splice(index, 1)[0]
    return { element: atom.element, sourceTerm: atom.termIndex, targetTerm: destination.termIndex, from: atom.point, to: destination.point }
  })
}

export function inventory(terms: Term[]) {
  const atoms: Record<string, number> = { Pt: 0, O: 0, Ta: 0 }
  for (const term of terms) for (const [element, count] of Object.entries(term.atoms)) atoms[element] += count * term.coefficient
  return { Pt: atoms.Pt, O: atoms.O, Ta: atoms.Ta, charge: terms.reduce((sum, term) => sum + term.charge * term.coefficient, 0), PtSites: terms.reduce((sum, term) => sum + (term.sites.Pt ?? 0) * term.coefficient, 0), OSites: terms.reduce((sum, term) => sum + (term.sites.O ?? 0) * term.coefficient, 0), iSites: terms.reduce((sum, term) => sum + (term.sites.i ?? 0) * term.coefficient, 0) }
}

export function scientificValue(value: number, format: (n: number) => string): string {
  if (value === 0 || (Math.abs(value) >= .001 && format(value) !== '0' && format(value) !== '-0')) return format(value)
  const exponent = Math.floor(Math.log10(Math.abs(value)))
  return `${format(value / 10 ** exponent)} × 10^${exponent}`
}

/** Inline math keeps small nonzero values legible with a raised exponent. */
export function scientificTex(value: number, format: (n: number) => string): string {
  const shown = scientificValue(value, format)
  const caret = shown.indexOf('^')
  if (caret < 0) return shown
  return `${shown.slice(0, caret).replace(' × 10', String.raw`\times 10`)}^{${shown.slice(caret + 1)}}`
}
