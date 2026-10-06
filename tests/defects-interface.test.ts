import { describe, expect, it } from 'vitest'
import { defectsModel } from '../src/models/defects/model'

describe('focused defects activities', () => {
  it('shows the controls for one task without mixing unrelated trial and reaction values', () => {
    const visible = (topic: number) => defectsModel.controls.filter(control => !control.visibleWhen || control.visibleWhen({ ...defectsModel.defaults, topic })).map(control => control.key)
    expect(visible(0)).toEqual(['topic', 'species', 'site', 'charge'])
    expect(visible(1)).toEqual(['topic', 'reaction'])
    expect(visible(2)).toEqual(['topic', 'temperature', 'energyMode'])
  })
  it('uses task-specific readouts, preserving tiny energy values through logarithms', () => {
    const symbol = defectsModel.defaults
    const outputs = defectsModel.getReadouts(symbol, defectsModel.sample(symbol, 12))
    expect(outputs.map(row => row.value)).toEqual([5, 6, -1, -1])
    const reaction = { ...symbol, topic: 1 }
    expect(defectsModel.getReadouts(reaction, defectsModel.sample(reaction, 12)).map(row => row.value)).toEqual([0, 0, 0])
    const energy = { ...symbol, topic: 2, temperature: 300 }
    const rows = defectsModel.getReadouts(energy, defectsModel.sample(energy, 12))
    expect(rows.slice(1).every(row => row.label.includes('log₁₀') && row.value < 0)).toBe(true)
    expect(rows[1].value).toBeGreaterThan(rows[2].value)
    expect(rows[2].value).toBeGreaterThan(rows[3].value)
  })
})
