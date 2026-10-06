import { useState } from 'react'
import katex from 'katex'
import { useNumberFormat } from './formatting'
import { createRasterPdf, type RasterPdfPage } from './rasterPdf'
import { snapshotDiagramImage, type SnapshotDiagram } from './snapshotDiagram'
import type { DisplayOptions, NumericParameters, NumericSnapshot, SimulationDefinition, SnapshotReport, SnapshotReportCell } from './types'
import './snapshot-export.css'

export interface SnapshotExportProps {
  model: SimulationDefinition
  parameters: NumericParameters
  snapshot: NumericSnapshot
  time: number
  display: DisplayOptions
  visualRoot?: HTMLElement
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]!))
const paragraph = (value: string) => `<p>${escapeHtml(value)}</p>`
const styles = `
.snapshot-report{font:13px/1.45 Arial,Helvetica,sans-serif;color:#17202b;background:#fff;width:794px;position:fixed;left:-10000px;top:0;z-index:-1;box-sizing:border-box}
.snapshot-report *{box-sizing:border-box}
.snapshot-report .report-page{width:794px;height:1123px;padding:36px 42px 42px;position:relative;background:#fff;overflow:hidden}
.snapshot-report .report-header{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:11px;border-bottom:1px solid #bec7d0;margin-bottom:16px;color:#34485e;font-size:11px;visibility:hidden}
.snapshot-report .report-content{height:992px;overflow:hidden}
.snapshot-report .report-footer{position:absolute;bottom:23px;left:42px;right:42px;font-size:10px;display:flex;justify-content:space-between;color:#5c6875;border-top:1px solid #d8dfe6;padding-top:6px;visibility:hidden}
.snapshot-report h1{font-size:25px;line-height:1.15;margin:0 0 7px;color:#17202b;font-weight:600}
.snapshot-report h2{font-size:17px;line-height:1.25;margin:0 0 8px;color:#17202b;font-weight:600}
.snapshot-report h3{font-size:13px;line-height:1.3;margin:0 0 5px;color:#17202b;font-weight:600}
.snapshot-report p{font-size:11.5px;line-height:1.4;color:#344252;margin:3px 0 5px;overflow-wrap:anywhere}
.snapshot-report .report-block{margin-bottom:8px;padding:0;break-inside:avoid}
.snapshot-report .report-diagram{display:block;box-sizing:content-box;background:#050505;border:1px solid #cad2dc;margin:8px auto 4px}
.snapshot-report .report-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px 24px}
.snapshot-report .report-value{display:flex;gap:12px;justify-content:space-between;border-bottom:1px solid #e1e6eb;padding:3px 0;font-size:11px;line-height:1.3;min-width:0}
.snapshot-report .report-value span{min-width:0;overflow-wrap:anywhere;color:#465360}
.snapshot-report .report-value strong{font-weight:500;color:#17202b;text-align:right;overflow-wrap:anywhere;max-width:48%;min-width:0}
.snapshot-report .report-math{font-size:14px;color:#17202b;margin:6px 0;overflow:visible}
.snapshot-report .katex-display{margin:.35em 0}
.snapshot-report .katex-display>.katex{text-align:left}
.snapshot-report .report-method{padding-top:8px;border-top:1px solid #dce3ea}
.snapshot-report .report-source{font-size:10px;line-height:1.35;color:#536375}
.snapshot-report .report-lesson .equation-card{border:0;background:#fff;margin:0;padding:0;color:#17202b}
.snapshot-report .report-lesson .math-block{font-size:14px;color:#17202b;margin:5px 0;overflow:visible}
.snapshot-report .report-lesson .eyebrow{font:10px Arial,sans-serif;color:#536375;letter-spacing:.02em}
.snapshot-report .report-lesson :is(output,small,span,label){color:inherit}
.snapshot-report .report-lesson .materials-substitution{font-size:11.5px;color:#344252}
.snapshot-report .report-calculation :is(.crystal-results,.materials-kv-symbol){background:#fff;color:#17202b;border:0;padding:0;margin:0}
.snapshot-report .report-calculation :is(h3,dd,dt,span,small){color:#17202b}
.snapshot-report .report-calculation .crystal-results p{color:#344252;line-height:1.4!important;font-size:11.5px!important}
.snapshot-report .report-calculation .crystal-results dl>div{padding:4px 0;border-color:#e1e6eb;font-size:11px}
.snapshot-report .report-calculation .crystal-results dl{margin:8px 0}
.snapshot-report .report-calculation .math-block{color:#17202b;font-size:17px;overflow:visible}
.snapshot-report .materials-substitution{color:#344252!important}
.snapshot-report .study-step{min-height:0;padding-top:5px}
.snapshot-report .report-calculation .crystal-construction{padding:0!important;color:#344252}
.snapshot-report .report-calculation .crystal-construction p{font-size:11.5px!important;color:#344252!important;line-height:1.4!important}
.snapshot-report .report-calculation .materials-facts{width:100%;border-collapse:collapse;font-size:11px;color:#17202b}
.snapshot-report .report-calculation .materials-facts :is(th,td){padding:4px 8px;text-align:left;border-bottom:1px solid #dce3ea;color:#17202b}
.snapshot-report .report-table{width:100%;border-collapse:collapse;color:#17202b;font-size:11px;margin:8px 0;table-layout:auto}
.snapshot-report .report-table :is(th,td){padding:6px 8px;border-bottom:1px solid #dce3ea;text-align:left;vertical-align:middle;line-height:1.35}
.snapshot-report .report-table th{color:#34485e;font-weight:600}
.snapshot-report .report-table .katex{font-size:1.12em;white-space:nowrap}
.snapshot-report .report-section{border-top:1px solid #dce3ea;padding-top:9px}
.snapshot-report-focused .report-table :is(th,td){padding-top:4px;padding-bottom:4px}
.snapshot-report-focused .report-block{margin-bottom:6px}
.snapshot-report-focused .report-section{padding-top:7px}
`

const renderedMath = (tex: string, inline = false) => katex.renderToString(tex, {
  displayMode: !inline, output: 'htmlAndMathml', throwOnError: true, trust: false,
})
const reportCell = (cell: SnapshotReportCell) => typeof cell === 'string' ? escapeHtml(cell) : renderedMath(cell.tex, true)

function structuredBlocks(report: SnapshotReport): string[] {
  return report.sections.map(section => `<div class="report-section"><h2>${escapeHtml(section.title)}</h2>
    ${(section.tex ?? []).map(tex => `<div class="report-math">${renderedMath(tex)}</div>`).join('')}
    ${section.rows?.length ? `<div class="report-grid">${section.rows.map(row => `<div class="report-value"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.value)}</strong></div>`).join('')}</div>` : ''}
    ${section.table ? `<table class="report-table"><thead><tr>${section.table.headers.map(header => `<th scope="col">${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${section.table.rows.map(row => `<tr>${row.map(cell => `<td>${reportCell(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>` : ''}
    ${(section.notes ?? []).map(paragraph).join('')}
  </div>`)
}

function cloneDiagram(svg: SVGSVGElement): SnapshotDiagram {
  const clone = svg.cloneNode(true) as SVGSVGElement
  const originals = [svg, ...svg.querySelectorAll('*')]
  const copies = [clone, ...clone.querySelectorAll('*')]
  const properties = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray',
    'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-size', 'font-family', 'font-weight', 'font-style',
    'text-anchor', 'dominant-baseline', 'letter-spacing', 'color', 'visibility']
  originals.forEach((element, index) => {
    const computed = getComputedStyle(element)
    copies[index].setAttribute('style', properties.map(property => `${property}:${computed.getPropertyValue(property)}`).join(';'))
  })
  const box = svg.viewBox.baseVal
  const width = box.width || svg.clientWidth, height = box.height || svg.clientHeight
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))
  clone.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  background.setAttribute('x', String(box.x)); background.setAttribute('y', String(box.y))
  background.setAttribute('width', '100%'); background.setAttribute('height', '100%'); background.setAttribute('fill', '#050505')
  clone.insertBefore(background, clone.firstChild)
  return { source: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`, width, height }
}

function currentLesson(): { html: string; notes: string[] } {
  const lesson = document.querySelector('.materials-lesson')
  const content = lesson?.querySelector('.equation-card')?.cloneNode(true) as HTMLElement | undefined
  content?.querySelectorAll('input').forEach(input => {
    const value = document.createElement('span')
    value.textContent = (input as HTMLInputElement).value
    input.replaceWith(value)
  })
  content?.querySelectorAll('button,nav').forEach(element => element.remove())
  const notes = [...(lesson?.querySelectorAll('.materials-detail p') ?? []),
    ...document.querySelectorAll('.visual-workspace p.materials-note, .visual-workspace div.materials-note p')]
    .filter(element => !element.closest('.crystal-construction'))
    .map(element => element.textContent?.trim() ?? '').filter(Boolean)
  return { html: content?.outerHTML ?? '', notes: [...new Set(notes)] }
}

/** Keep calculations readable while allowing whole tables and equations to paginate. */
function calculationBlocks(clone: HTMLElement): string[] {
  if (!clone.matches('.crystal-results, .crystal-construction')) return [clone.outerHTML]
  const groups: Element[][] = []
  let headings: Element[] = []
  for (const child of clone.children) {
    if (child.matches('h1,h2,h3,h4,h5,h6,.eyebrow')) headings.push(child)
    else { groups.push([...headings, child]); headings = [] }
  }
  if (headings.length) {
    if (groups.length) groups.at(-1)!.push(...headings)
    else groups.push(headings)
  }
  if (!groups.length) return [clone.outerHTML]
  return groups.map(children => {
    const wrapper = clone.cloneNode(false) as HTMLElement
    children.forEach(child => wrapper.append(child.cloneNode(true)))
    return wrapper.outerHTML
  })
}

function fitMath(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.katex-display').forEach(block => {
    const visual = block.querySelector<HTMLElement>('.katex-html')
    if (!visual) return
    const width = visual.getBoundingClientRect().width
    const available = block.parentElement!.clientWidth
    if (width > available && width > 0) block.style.fontSize = `${parseFloat(getComputedStyle(block).fontSize) * available / width}px`
  })
}

function imageBytes(canvas: HTMLCanvasElement) {
  const raw = atob(canvas.toDataURL('image/jpeg', .96).split(',')[1])
  return Uint8Array.from(raw, character => character.charCodeAt(0))
}

/** Captures values and diagrams before any await; export never changes playback intent or model parameters. */
export async function downloadSnapshotPdf(props: SnapshotExportProps, format: (value: number) => string): Promise<string> {
  const { model } = props
  const parameters = { ...props.parameters }, snapshot = { ...props.snapshot }, time = props.time, display = { ...props.display }
  const visualRoot = props.visualRoot ?? document.querySelector<HTMLElement>('.visual-workspace')
  const diagrams = [...(visualRoot?.querySelectorAll<SVGSVGElement>('.materials-scene, .response-chart svg') ?? [])].map(cloneDiagram)
  if (!diagrams.length) throw new Error('The current diagram is unavailable. Open a lab and try again.')
  const lesson = currentLesson()
  const calculations = [...(visualRoot?.querySelectorAll<HTMLElement>('.crystal-results, .materials-kv-symbol, .crystal-construction') ?? [])].flatMap(element => {
    const clone = element.cloneNode(true) as HTMLElement
    clone.querySelectorAll('button,input,nav').forEach(control => control.remove())
    return calculationBlocks(clone)
  })
  const snapshotNotes = model.getSnapshotNotes?.(parameters, snapshot, format) ?? []
  const report = model.getSnapshotReport?.(parameters, snapshot, format)
  const readouts = model.getReadouts(parameters, snapshot)
  const filename = `physiks-${model.id}-snapshot.pdf`
  const inputRows = model.controls.filter(control => !control.visibleWhen || control.visibleWhen(parameters)).map(control => {
    const value = control.options?.find(option => option.value === parameters[control.key])?.label ?? String(parameters[control.key])
    return `<div class="report-value"><span>${escapeHtml(control.label)}</span><strong>${escapeHtml(`${value}${control.unit ? ` ${control.unit}` : ''}`)}</strong></div>`
  }).join('')
  const outputRows = readouts.map(readout => `<div class="report-value"><span>${escapeHtml(readout.label)}</span><strong>${escapeHtml(`${format(readout.value)}${readout.unit ? ` ${readout.unit}` : ''}`)}</strong></div>`).join('')
  const blocks: string[] = [
    `<h1>${escapeHtml(report?.title ?? model.title)}</h1>${paragraph(report?.description ?? model.description)}${paragraph(`Current reveal: ${format(time)} / ${format(model.getPlayback(parameters).duration)} s. Labels ${display.labels ? 'on' : 'off'}; teaching overlays ${display.forces ? 'on' : 'off'}. Playback is conceptual.`)}`,
    ...diagrams.map(diagram => snapshotDiagramImage(diagram, Boolean(report))),
  ]
  const sourceSet = new Set<string>()
  if (report) {
    blocks.push(...structuredBlocks(report))
    report.sources.forEach(source => sourceSet.add(source))
  } else {
    blocks.push(
    `<h2>Current values</h2><div class="report-grid">${outputRows}</div>`,
    `<h2>Inputs</h2><div class="report-grid">${inputRows}</div>${paragraph('Input values retain calculation precision. Displayed results follow the app’s decimal setting.')}`,
    ...calculations.map(html => `<div class="report-calculation">${html}</div>`),
    ...(snapshotNotes.length ? ['<h2>Current calculation & interpretation</h2>', ...snapshotNotes.map(paragraph)] : []),
    ...(lesson.html ? [`<h2>Current lesson</h2><div class="report-lesson">${lesson.html}</div>`] : []),
    `<h2>Methods & calculation notes</h2>`,
    )
  const descriptions = new Set<string>()
  model.formulas.filter(formula => !['Source access', 'Verified lecture example'].includes(formula.group) || parameters.reference === 1).forEach(formula => {
    const equations = formula.tex.map(tex => `<div class="report-math">${katex.renderToString(tex, { displayMode: true, output: 'htmlAndMathml', throwOnError: true, trust: false })}</div>`).join('')
    const description = descriptions.has(formula.description) ? '' : paragraph(formula.description)
    descriptions.add(formula.description)
    blocks.push(`<div class="report-method"><h3>${escapeHtml(formula.title)}</h3>${description}${equations}${formula.usage ? paragraph(formula.usage) : ''}</div>`)
    formula.sources?.forEach(source => sourceSet.add(source))
  })
  blocks.push('<h2>Assumptions & source notes</h2>')
  blocks.push(...[...new Set([
    model.interactionHint ?? '', model.getPlayback(parameters).note ?? '', ...lesson.notes,
    ...(model.guides ?? []).map(guide => `${guide.title}: ${guide.text}`),
    ...model.controls.filter(control => !control.visibleWhen || control.visibleWhen(parameters)).map(control => control.note ?? ''),
  ])].filter(Boolean).map(paragraph))
  }
  blocks.push('<h2>References</h2>', ...[...sourceSet].map(source => `<p class="report-source">${escapeHtml(source)}</p>`))
  const groupedBlocks: string[] = []
  let heading = ''
  for (const block of blocks) {
    if (/^<h2>[^<]+<\/h2>$/.test(block)) heading += block
    else { groupedBlocks.push(heading + block); heading = '' }
  }
  if (heading) groupedBlocks.push(heading)

  const root = document.createElement('div')
  root.className = `snapshot-report${report ? ' snapshot-report-focused' : ''}`
  root.setAttribute('aria-hidden', 'true')
  const style = document.createElement('style'); style.textContent = styles; root.append(style)
  document.body.append(root)
  try {
    const { default: html2canvas } = await import('html2canvas')
    await document.fonts.ready
    const pages: HTMLElement[] = []
    const newPage = () => {
      const page = document.createElement('div'); page.className = 'report-page'
      page.innerHTML = `<div class="report-header"><span>Physiks Materials · current simulation</span><span>${escapeHtml(model.eyebrow ?? model.id)}</span></div><div class="report-content"></div><div class="report-footer"><span>${escapeHtml(model.title)} · input snapshot</span><span class="report-page-number"></span></div>`
      root.append(page); pages.push(page)
      return page.querySelector<HTMLElement>('.report-content')!
    }
    let content = newPage()
    for (const html of groupedBlocks) {
      const block = document.createElement('section'); block.className = 'report-block'; block.innerHTML = html
      content.append(block)
      await Promise.all([...block.querySelectorAll('img')].map(image => image.decode()))
      await document.fonts.ready
      fitMath(block)
      if (content.scrollHeight > content.clientHeight && content.children.length > 1) {
        block.remove(); content = newPage(); content.append(block); fitMath(block)
      }
      if (content.scrollHeight > content.clientHeight) throw new Error('A report section is too tall to export cleanly.')
    }
    pages.forEach((page, index) => { page.querySelector('.report-page-number')!.textContent = `${index + 1} / ${pages.length}` })
    const rasterPages: RasterPdfPage[] = []
    // Keep every capture at the same origin. Fixed offscreen ancestors otherwise cause
    // browser renderers to clip repeated headers once later pages leave the viewport.
    pages.forEach(page => { page.style.display = 'none' })
    for (const [pageIndex, page] of pages.entries()) {
      page.style.display = 'block'
      const rendered = await html2canvas(page, { backgroundColor: '#ffffff', scale: 2, logging: false,
        scrollX: 0, scrollY: 0, windowWidth: 794, windowHeight: 1123 })
      // The rendering library retains a transformed/clipped drawing context. A fresh
      // canvas gives page furniture an identity transform and unrestricted clipping.
      const canvas = document.createElement('canvas')
      canvas.width = rendered.width; canvas.height = rendered.height
      const context = canvas.getContext('2d')!
      context.drawImage(rendered, 0, 0)
      const scale = canvas.width / 794
      context.save()
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, 65 * scale)
      context.fillStyle = '#34485e'; context.font = `${11 * scale}px Arial, Helvetica, sans-serif`
      context.textBaseline = 'top'; context.textAlign = 'left'
      context.fillText('Physiks Materials · current simulation', 42 * scale, 36 * scale)
      context.textAlign = 'right'; context.fillText(model.eyebrow ?? model.id, 752 * scale, 36 * scale)
      context.strokeStyle = '#bec7d0'; context.lineWidth = scale
      context.beginPath(); context.moveTo(42 * scale, 64 * scale); context.lineTo(752 * scale, 64 * scale); context.stroke()
      context.fillStyle = '#ffffff'; context.fillRect(0, 1078 * scale, canvas.width, 45 * scale)
      context.strokeStyle = '#d8dfe6'
      context.beginPath(); context.moveTo(42 * scale, 1079 * scale); context.lineTo(752 * scale, 1079 * scale); context.stroke()
      context.fillStyle = '#5c6875'; context.font = `${10 * scale}px Arial, Helvetica, sans-serif`
      context.textAlign = 'left'; context.fillText(`${model.title} · input snapshot`, 42 * scale, 1087 * scale)
      context.textAlign = 'right'; context.fillText(`${pageIndex + 1} / ${pages.length}`, 752 * scale, 1087 * scale)
      context.restore()
      rasterPages.push({ jpeg: imageBytes(canvas), width: canvas.width, height: canvas.height })
      page.style.display = 'none'
    }
    const bytes = createRasterPdf(rasterPages)
    const url = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 30000)
    return filename
  } finally { root.remove() }
}

export function SnapshotExport(props: SnapshotExportProps) {
  const { format } = useNumberFormat()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  return <div className="snapshot-export">
    <button type="button" disabled={busy} onClick={async () => {
      setBusy(true); setMessage('Preparing your PDF…')
      try { const filename = await downloadSnapshotPdf(props, format); setMessage(`Downloaded ${filename}`) }
      catch (error) { setMessage(error instanceof Error ? error.message : 'PDF export failed. Try again.') }
      finally { setBusy(false) }
    }}>{busy ? 'Preparing PDF…' : 'Download current simulation PDF'}</button>
    <p role="status" aria-live="polite">{message || 'Includes this diagram, current values, methods and assumptions.'}</p>
  </div>
}
