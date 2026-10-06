import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { defectsModel } from '../src/models/defects/model'
import { getSnapshotReport } from '../src/models/defects/report'
import { reactions, sampleModel, energyComparison, kvTex } from '../src/models/defects/calculation'
import type { SnapshotReport } from '../src/framework/types'

const text = (report: SnapshotReport) => JSON.stringify(report)
const equations = (report: SnapshotReport) => report.sections.flatMap(section => [
  ...(section.tex ?? []), ...(section.table?.rows.flatMap(row => row.flatMap(cell => typeof cell === 'string' ? [] : [cell.tex])) ?? []),
])
const makeReport = (changes = {}, time = 12, format: (value: number) => string = String) => {
  const p = { ...defectsModel.defaults, ...changes }
  return getSnapshotReport(p, sampleModel(p, time), format)
}

describe('focused defect PDF reports', () => {
  it('shows the current trial, charge arithmetic and expected proper symbol without inactive tasks', () => {
    const report = makeReport({ species: 3, site: 1, charge: 1, reaction: 6, energyMode: 1 })
    expect(report.title).toBe('Build a symbol · V on O')
    expect(equations(report)).toContain(kvTex(3, 1, 1))
    expect(equations(report)).toContain(kvTex(3, 1, 2))
    expect(report.sections[0].rows).toContainEqual({ label: 'Check', value: 'Expected +2' })
    expect(text(report)).toContain('Absolute ionic charge and relative defect charge')
    expect(text(report)).not.toContain('Ta interstitial · Pt vacancies')
    expect(text(report)).not.toContain('Conditional site fraction')
    expect(report.sources.every(source => !source.includes('lecture frame'))).toBe(true)
  })

  it('does not format fractional proposals as whole charge marks', () => {
    const report = makeReport({ charge: -.9 })
    expect(report.sections[0].tex).toEqual([])
    expect(report.sections[0].rows).toContainEqual({ label: 'Check', value: 'Use a whole charge' })
    expect(equations(report)).toContain(kvTex(2, 0, -1))
  })

  it.each(reactions.map((reaction, id) => [reaction.title, id] as const))('explains only %s and verifies each product contribution and conserved quantity', (_title, id) => {
    const report = makeReport({ topic: 1, reaction: id, species: 3, site: 2, charge: 8 })
    expect(report.sections[0].tex).toEqual([reactions[id].tex])
    const termTable = report.sections.find(section => section.title === 'Read each product term')!.table!
    expect(termTable.rows).toHaveLength(reactions[id].right.length)
    termTable.rows.forEach((row, index) => {
      const term = reactions[id].right[index]
      expect(Number(row[2])).toBe(term.coefficient)
      expect(Number(row[3])).toBe(term.charge)
      expect(Number(row[4])).toBe(term.coefficient * term.charge)
    })
    expect(termTable.rows.reduce((sum, row) => sum + Number(row[4]), 0)).toBe(0)
    const totals = report.sections.find(section => section.title === 'Check atoms, sites and effective charge')!.table!
    expect(totals.rows).toHaveLength(7)
    expect(totals.rows.every(row => row[3] === '0')).toBe(true)
    expect(text(report)).not.toContain('Your proposed effective charge')
    expect(text(report)).not.toContain('Kinetic weight k/k₀')
  })

  it('freezes the actual teaching stage and attributes only the inspected reaction', () => {
    for (const [time, stage] of [[0, 'Before'], [6, 'Change'], [12, 'After']] as const) {
      const report = makeReport({ topic: 1, reaction: 3, reference: 1 }, time)
      expect(report.sections[1].rows).toContainEqual({ label: 'Current teaching stage', value: stage })
      expect(report.sources.some(source => source.includes('Inspected lecture frame'))).toBe(true)
    }
    expect(makeReport({ topic: 1, reaction: 6, reference: 1 }).sources.some(source => source.includes('Inspected lecture frame'))).toBe(false)
  })

  it('keeps activation and conditional formation interpretations distinct', () => {
    const activation = makeReport({ topic: 2, energyMode: 0 })
    expect(equations(activation).some(tex => tex.includes('E_a'))).toBe(true)
    expect(equations(activation).some(tex => tex.includes('K_S'))).toBe(false)
    expect(text(activation)).toContain('Activation barriers alone cannot establish equilibrium defect concentrations')
    const formation = makeReport({ topic: 2, energyMode: 1 })
    expect(equations(formation).some(tex => tex.includes('K_S') && tex.includes('1/4'))).toBe(true)
    expect(text(formation)).toContain('too large for the dilute approximation')
    expect(text(formation)).not.toContain('Your proposed effective charge')
    expect(text(formation)).not.toContain('Selected reaction')
  })

  it('preserves small nonzero weights and source energy values even with zero displayed decimals', () => {
    const format = (value: number) => value.toFixed(0)
    for (const temperature of [300, 1000]) {
      for (const energyMode of [0, 1]) {
        const report = makeReport({ topic: 2, temperature, energyMode }, 12, format)
        const rows = report.sections[0].table!.rows
        expect(rows[0][1]).toBe('0.1')
        const values = energyComparison(temperature, energyMode === 1)
        rows.forEach((row, index) => {
          expect(values[index].fraction).toBeGreaterThan(0)
          expect(row[2]).not.toBe('0')
          if (format(values[index].fraction) === '0') expect(row[2]).toEqual(expect.objectContaining({ tex: expect.stringContaining('times 10') }))
        })
      }
    }
  })

  it('renders every report equation and term with real KaTeX and does not mutate inputs', () => {
    for (const topic of [0, 1, 2]) for (let reaction = 0; reaction < reactions.length; reaction++) {
      for (const energyMode of [0, 1]) {
        const p = { ...defectsModel.defaults, topic, reaction, energyMode }
        const s = sampleModel(p, 6), before = JSON.stringify({ p, s })
        const report = getSnapshotReport(p, s)
        for (const tex of equations(report)) expect(() => katex.renderToString(tex, { throwOnError: true, trust: false })).not.toThrow()
        expect(JSON.stringify({ p, s })).toBe(before)
      }
    }
  })
})
