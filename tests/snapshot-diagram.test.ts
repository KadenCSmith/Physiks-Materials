import { describe, expect, it } from 'vitest'
import { fitSnapshotDiagram, snapshotDiagramImage } from '../src/framework/snapshotDiagram'

describe('PDF diagram proportions', () => {
  const scenes = [[760, 440], [600, 480], [760, 420], [760, 300], [760, 375], [760, 365], [430, 380]]

  it('preserves every lab viewBox ratio inside both report layouts, including planes and dislocations', () => {
    for (const [width, height] of scenes) {
      for (const maxHeight of [258, 363]) {
        const fitted = fitSnapshotDiagram(width, height, 708, maxHeight)
        expect(fitted.width / fitted.height).toBeCloseTo(width / height, 12)
        expect(fitted.width).toBeLessThanOrEqual(708)
        expect(fitted.height).toBeLessThanOrEqual(maxHeight)
        expect(Math.max(fitted.width / 708, fitted.height / maxHeight)).toBeCloseTo(1, 12)
      }
    }
  })

  it('uses the width cap for wide charts and the height cap for tall diagrams without cropping', () => {
    expect(fitSnapshotDiagram(1200, 200, 708, 363)).toEqual({ width: 708, height: 118 })
    expect(fitSnapshotDiagram(200, 1200, 708, 363)).toEqual({ width: 60.5, height: 363 })
  })

  it('gives the rasterizer explicit paired dimensions instead of relying on object-fit or a height cap', () => {
    for (const focused of [false, true]) {
      const html = snapshotDiagramImage({ source: 'data:image/svg+xml,example', width: 760, height: 420 }, focused)
      const values = html.match(/style="width:([\d.]+)px;height:([\d.]+)px"/)
      expect(values).not.toBeNull()
      const width = Number(values![1]), height = Number(values![2])
      expect(width / height).toBeCloseTo(760 / 420, 12)
      expect(height + 2).toBe(focused ? 260 : 365)
      expect(html).not.toMatch(/object-fit|max-height|width:100%/)
    }
  })

  it('rejects zero, negative and nonfinite dimensions instead of producing distorted exports', () => {
    for (const invalid of [0, -1, Infinity, NaN]) {
      for (let index = 0; index < 4; index++) {
        const dimensions = [760, 420, 708, 363]
        dimensions[index] = invalid
        expect(() => fitSnapshotDiagram(...dimensions as [number, number, number, number])).toThrow(/positive dimensions/)
      }
    }
  })
})
