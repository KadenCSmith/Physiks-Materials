import { describe, expect, it } from 'vitest'
import { getSnapshotNotes as defectNotes } from '../src/models/defects/snapshot'
import { getSnapshotNotes as orderNotes } from '../src/models/order/snapshot'
import { getSnapshotNotes as phaseNotes } from '../src/models/phases/snapshot'
import { sampleModel as defectSample } from '../src/models/defects/calculation'
import { sampleModel as orderSample } from '../src/models/order/calculation'
import { sampleModel as phaseSample } from '../src/models/phases/calculation'
import { defectsModel } from '../src/models/defects/model'
import { orderModel } from '../src/models/order/model'
import { phasesModel } from '../src/models/phases/model'

describe('scientific context in downloadable snapshots', () => {
  it('distinguishes the trial species charge from effective charge and the selected fixed reaction', () => {
    const p = { ...defectsModel.defaults, species: 2, site: 0, charge: -1, reaction: 3 }
    const notes = defectNotes(p, defectSample(p, 12)).join('\n')
    expect(notes).toContain('Ta on Pt site; absolute species charge +5, normal occupant charge +6, expected effective charge -1')
    expect(notes).toContain('Proposed effective charge -1 matches')
    expect(notes).toContain('Ta substitution · oxygen vacancy')
    expect(notes).toContain('trial symbol does not alter this fixed reaction')
    expect(notes).toContain('Activation barriers alone do not establish equilibrium defect populations')
  })

  it('labels fractional trial charges invalid and distinguishes conditional formation data from lecture evidence', () => {
    const p = { ...defectsModel.defaults, charge: -.9, reference: 1, reaction: 6, energyMode: 1 }
    const notes = defectNotes(p, defectSample(p, 12)).join('\n')
    expect(notes).toContain('is invalid: dots and primes require a whole number')
    expect(notes).toContain('K^(1/4)')
    expect(notes).toContain('violate the dilute approximation')
    expect(notes).toContain('current reaction differs from that inspected example')
  })

  it('exports the current gas limit without attributing BCC geometry to a gas', () => {
    const p = { ...orderModel.defaults, material: 2, shellRadius: 2 }
    const notes = orderNotes(p, orderSample(p, 0)).join('\n')
    expect(notes).toContain('Shell radius R = 0 Å')
    expect(notes).toContain('g(R) = 1')
    expect(notes).toContain('integrated coordination N(R) = 0')
    expect(notes).toContain('not estimated from those 35 particles')
    expect(notes).not.toContain('fully occupied BCC')
  })

  it('exports the course Burgers sign and active edge line sense without reporting stale RDF settings', () => {
    const p = { ...orderModel.defaults, view: 1, dislocation: 1, spacing: 2, reference: 1, shellRadius: 6.5 }
    const notes = orderNotes(p, orderSample(p, 12)).join('\n')
    expect(notes).toContain('b = F − S = (+2, 0, 0) Å')
    expect(notes).toContain('+z = (0, 0, 1)')
    expect(notes).toContain('b is perpendicular')
    expect(notes).toContain('b · t = 0 Å')
    expect(notes).not.toContain('Shell radius R =')
    expect(notes).not.toContain('Reference frame:')
  })

  it('reports the actual 1400 °C Gibbs state rather than the inactive stored temperature', () => {
    const p = { ...phasesModel.defaults, view: 1, temperature: 1500 }
    const notes = phaseNotes(p, phaseSample(p, 12), value => String(Number(value.toFixed(3)))).join('\n')
    expect(notes).toContain('Current evaluated solid slice: 1400 °C')
    expect(notes).toContain('left common tangent joins (Cr) at 5.6 at% Pt to Cr₄Pt at 17.5')
    expect(notes).toContain('slope μPt − μCr')
    expect(notes).toContain('arbitrary schematic units, not measured material energies')
  })

  it('withholds underdetermined three-phase fractions rather than reporting stored zeros as physical amounts', () => {
    const p = { ...phasesModel.defaults, temperature: 1530, composition: 28.1 }
    const notes = phaseNotes(p, phaseSample(p, 12)).join('\n')
    expect(notes).toContain('Cr₄Pt + L + (Pt)')
    expect(notes).toContain('three phase fractions are withheld')
    expect(notes).toContain('stored zero placeholders are not physical phase amounts')
    expect(notes).not.toContain('atom fraction 0')
  })

  it('exports invariant context without treating the conceptual cooling marker as a solved equilibrium temperature', () => {
    const p = { ...phasesModel.defaults, view: 2, cooling: 2, composition: 10, temperature: 1500 }
    const notes = phaseNotes(p, phaseSample(p, 0)).join('\n')
    expect(notes).toContain('Peritectoid · approximate T at 970 °C')
    expect(notes).toContain('moving marker is 1030 °C')
    expect(notes).toContain('does not solve phase amounts away from the invariant')
    expect(notes).not.toContain('Current evaluated solid slice')
  })

  it('preserves formatting preferences and never changes sampled state while assembling context', () => {
    for (const [model, makeNotes] of [[defectsModel, defectNotes], [orderModel, orderNotes], [phasesModel, phaseNotes]] as const) {
      const p = { ...model.defaults }, s = model.sample(p, 12)
      const before = JSON.stringify({ p, s })
      const notes = makeNotes(p, s, value => `formatted(${value})`)
      expect(notes.join('\n')).toContain('formatted(')
      expect(JSON.stringify({ p, s })).toBe(before)
      expect(notes.length).toBeGreaterThan(0)
    }
  })
})
