import { describe, expect, it } from 'vitest'
import { createRasterPdf } from '../src/framework/rasterPdf'

const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9])

describe('downloadable snapshot PDF container', () => {
  it('uses real page/image objects, A4 media boxes and exact byte offsets for its cross-reference table', () => {
    const bytes = createRasterPdf([{ jpeg, width: 1588, height: 2246 }, { jpeg, width: 1588, height: 2246 }])
    const latin = new TextDecoder('latin1').decode(bytes)
    expect(latin.startsWith('%PDF-1.4\n')).toBe(true)
    expect(latin).toContain('/Count 2 /Kids [3 0 R 6 0 R]')
    expect(latin.match(/\/MediaBox \[0 0 595.28 841.89\]/g)).toHaveLength(2)
    expect(latin.match(/\/Filter \/DCTDecode/g)).toHaveLength(2)
    const start = Number(latin.match(/startxref\n(\d+)\n%%EOF/)?.[1])
    expect(new TextDecoder().decode(bytes.slice(start, start + 4))).toBe('xref')
    const offsets = [...latin.matchAll(/(\d{10}) 00000 n/g)].map(match => Number(match[1]))
    expect(offsets).toHaveLength(8)
    offsets.forEach((offset, index) => {
      expect(new TextDecoder().decode(bytes.slice(offset, offset + `${index + 1} 0 obj`.length))).toBe(`${index + 1} 0 obj`)
    })
  })

  it('rejects empty documents, invalid image bytes and unsupported page dimensions', () => {
    expect(() => createRasterPdf([])).toThrow(/at least one page/)
    for (const page of [{ jpeg: new Uint8Array([1, 2, 3, 4]), width: 2, height: 2 },
      { jpeg, width: 0, height: 2 }, { jpeg, width: 2, height: Infinity }, { jpeg, width: 2.5, height: 2 }]) {
      expect(() => createRasterPdf([page])).toThrow(/JPEG image and positive integer dimensions/)
    }
  })
})
