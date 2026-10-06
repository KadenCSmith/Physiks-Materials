import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { reactionStage, scientificTex, scientificValue } from '../src/models/defects/presentation'

describe('defect teaching progress and displayed tiny values', () => {
  it('keeps a before inventory, a distinct transfer interval, and a completed check stage', () => {
    expect(reactionStage(0)).toEqual({ index: 0, movement: 0, label: 'Before' })
    expect(reactionStage(.199).movement).toBe(0)
    expect(reactionStage(.2)).toEqual({ index: 1, movement: 0, label: 'Change' })
    expect(reactionStage(.5).movement).toBeCloseTo(.5, 12)
    expect(reactionStage(.799).index).toBe(1)
    expect(reactionStage(.8)).toEqual({ index: 2, movement: 1, label: 'After' })
    expect(reactionStage(1)).toEqual(reactionStage(.8))
  })
  it('clamps invalid or out-of-window presentation progress to finite endpoints', () => {
    expect(reactionStage(-1)).toEqual(reactionStage(0))
    expect(reactionStage(2)).toEqual(reactionStage(1))
    expect(reactionStage(NaN)).toEqual(reactionStage(0))
  })
  it('retains tiny kinetic weights rather than displaying false zero at any supported precision', () => {
    expect(scientificValue(6.932e-21, value => String(Number(value.toFixed(3))))).toBe('6.932 × 10^-21')
    expect(scientificValue(.008, value => String(Number(value.toFixed(1))))).toBe('8 × 10^-3')
    expect(scientificValue(.008, value => String(Math.round(value)))).toBe('8 × 10^-3')
    expect(scientificTex(.008, value => String(Math.round(value)))).toBe(String.raw`8\times 10^{-3}`)
    expect(() => katex.renderToString(scientificTex(6.932e-21, String), {throwOnError:true, strict:'error'})).not.toThrow()
    expect(scientificValue(.748, value => String(Number(value.toFixed(3))))).toBe('0.748')
    expect(scientificValue(0, String)).toBe('0')
  })
})
