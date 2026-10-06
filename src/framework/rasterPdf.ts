export interface RasterPdfPage {
  jpeg: Uint8Array
  width: number
  height: number
}

const encode = (value: string) => new TextEncoder().encode(value)
const concat = (parts: Uint8Array[]) => {
  const result = new Uint8Array(parts.reduce((length, part) => length + part.length, 0))
  let offset = 0
  for (const part of parts) { result.set(part, offset); offset += part.length }
  return result
}

/** A standards-based A4 PDF with sharp raster pages, preserving rendered mathematical glyphs. */
export function createRasterPdf(pages: readonly RasterPdfPage[]): Uint8Array {
  if (!pages.length) throw new Error('A PDF needs at least one page.')
  for (const page of pages) {
    if (!Number.isInteger(page.width) || !Number.isInteger(page.height) || page.width <= 0 || page.height <= 0
      || page.jpeg.length < 4 || page.jpeg[0] !== 0xff || page.jpeg[1] !== 0xd8) {
      throw new Error('Each PDF page needs a JPEG image and positive integer dimensions.')
    }
  }
  const objects: Uint8Array[] = []
  const pageIds = pages.map((_page, index) => 3 + index * 3)
  objects.push(encode('<< /Type /Catalog /Pages 2 0 R >>'))
  objects.push(encode(`<< /Type /Pages /Count ${pages.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] >>`))
  pages.forEach((page, index) => {
    const id = pageIds[index], imageId = id + 1, contentId = id + 2
    objects.push(encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /PageImage ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`))
    objects.push(concat([
      encode(`<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpeg.length} >>\nstream\n`),
      page.jpeg, encode('\nendstream'),
    ]))
    const content = 'q\n595.28 0 0 841.89 0 0 cm\n/PageImage Do\nQ\n'
    objects.push(encode(`<< /Length ${encode(content).length} >>\nstream\n${content}endstream`))
  })
  const parts = [encode('%PDF-1.4\n')]
  const offsets = [0]
  let offset = parts[0].length
  objects.forEach((object, index) => {
    offsets.push(offset)
    const part = concat([encode(`${index + 1} 0 obj\n`), object, encode('\nendobj\n')])
    parts.push(part)
    offset += part.length
  })
  parts.push(encode(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(value => `${String(value).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`))
  return concat(parts)
}
