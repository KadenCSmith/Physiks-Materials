import { describe, expect, it } from 'vitest'
import { congruent, events } from '../src/models/phases/boundaries'
import { thermalCases, thermalEnergy } from '../src/models/phases/thermal'

describe('exam-matched G versus T assemblages', () => {
  it('preserves all five invariant cases followed by all five congruent cases', () => {
    expect(thermalCases).toHaveLength(10)
    expect(thermalCases.slice(0, 5).map(entry => [entry.T, entry.x, entry.before, entry.after])).toEqual(events.map(event => [event.T, event.x, event.before, event.after]))
    expect(thermalCases.slice(5).map(entry => [entry.T, entry.x])).toEqual(congruent.map(event => [event.T, event.x]))
    expect(new Set(thermalCases.map(entry => entry.id)).size).toBe(10)
  })

  it('conserves the same bulk atomic composition and total amount on both sides', () => {
    for (const entry of thermalCases) for (const side of [entry.reactants, entry.products]) {
      expect(side.reduce((sum, phase) => sum + phase.fraction, 0)).toBeCloseTo(1, 14)
      expect(side.reduce((sum, phase) => sum + phase.composition * phase.fraction, 0)).toBeCloseTo(entry.x, 12)
      expect(side.every(phase => phase.fraction >= 0 && phase.fraction <= 1 && phase.composition >= 0 && phase.composition <= 100)).toBe(true)
    }
  })

  it('uses independent lever amounts for the source-labeled eutectic endpoints', () => {
    const cr = thermalCases[0], pt = thermalCases[1]
    expect(cr.products.map(phase => phase.phase)).toEqual(['(Cr)', 'Cr₄Pt'])
    expect(cr.products[0].fraction).toBeCloseTo(3.7 / 10.7, 12)
    expect(cr.products[1].fraction).toBeCloseTo(7 / 10.7, 12)
    expect(pt.products.map(phase => phase.composition)).toEqual([21.8, 31.3])
    expect(pt.products[0].fraction).toBeCloseTo(3.2 / 9.5, 12)
    expect(pt.products[1].fraction).toBeCloseTo(6.3 / 9.5, 12)
  })

  it('distinguishes peritectoid and eutectoid assemblages without inventing stoichiometric coefficients', () => {
    expect(thermalCases[2].reactants.map(phase => phase.phase)).toEqual(['Cr₄Pt', '(Pt)'])
    expect(thermalCases[2].products.map(phase => phase.phase)).toEqual(['Cr₃Pt'])
    expect(thermalCases[2].reactants[0].fraction).toBeCloseTo(1.7 / 11.5, 12)
    expect(thermalCases[3].products.map(phase => phase.fraction)).toEqual([.5, .5])
    expect(thermalCases[4].products[0].fraction).toBeCloseTo(1 / 3, 12)
    expect(thermalCases[4].products[1].fraction).toBeCloseTo(2 / 3, 12)
    expect(thermalCases[2].sourceNote).toContain('nominal Cr₃Pt would be 25 at% Pt')
    expect(thermalCases[3].sourceNote).toContain('label/composition inconsistency')
  })

  it('uses equal solid/liquid compositions for congruent melting and counts pure components correctly', () => {
    for (const entry of thermalCases.slice(5)) {
      expect(entry.phaseCount).toBe(2)
      expect(entry.reactants).toEqual([{ phase: 'L', composition: entry.x, fraction: 1 }])
      expect(entry.products[0].composition).toBe(entry.x)
      expect(entry.products[0].fraction).toBe(1)
    }
    expect(thermalCases.map(entry => entry.components)).toEqual([2, 2, 2, 2, 2, 1, 2, 2, 2, 1])
    expect(thermalCases.slice(0, 5).every(entry => entry.phaseCount === 3)).toBe(true)
    expect(thermalCases[8].sourceNote).toContain('unlabeled graph estimate')
  })

  it('crosses at the source transition and selects products below, reactants above', () => {
    thermalCases.forEach((entry, index) => {
      expect(thermalEnergy(index, entry.T)).toEqual({ reactant: 2, product: 2, stable: 2, gap: 0 })
      const below = thermalEnergy(index, entry.T - 60), above = thermalEnergy(index, entry.T + 60)
      expect(below.stable).toBe(1); expect(below.product).toBeLessThan(below.reactant)
      expect(above.stable).toBe(0); expect(above.reactant).toBeLessThan(above.product)
      expect(below.gap).toBeCloseTo(-.6, 12); expect(above.gap).toBeCloseTo(.6, 12)
    })
  })

  it('has negative slopes with a larger reactant entropy and matches a Kelvin H−TS calculation', () => {
    const index = 1, T0 = thermalCases[index].T, a = thermalEnergy(index, T0 - 1), b = thermalEnergy(index, T0 + 1)
    expect((b.reactant - a.reactant) / 2).toBeCloseTo(-.020, 12)
    expect((b.product - a.product) / 2).toBeCloseTo(-.010, 12)
    const kelvin = T0 + 17 + 273.15
    expect(thermalEnergy(index, T0 + 17).reactant).toBeCloseTo(2 + .020 * (T0 + 273.15) - .020 * kelvin, 12)
    expect(thermalEnergy(index, T0 + 17).product).toBeCloseTo(2 + .010 * (T0 + 273.15) - .010 * kelvin, 12)
  })

  it('is deterministic after reversed queries and rejects invalid indices or temperature', () => {
    const before = thermalEnergy(2, 980)
    thermalEnergy(2, 940); thermalEnergy(2, 1020)
    expect(thermalEnergy(2, 980)).toEqual(before)
    for (const index of [-1, 10, .5, NaN]) expect(() => thermalEnergy(index, 1000)).toThrow()
    for (const temperature of [NaN, Infinity, -Infinity, -274]) expect(() => thermalEnergy(0, temperature)).toThrow()
    expect(thermalCases.every(entry => entry.sourceNote.includes('local schematic') && entry.sourceNote.includes('p10 Fig4 / p11 Q4'))).toBe(true)
  })
})
