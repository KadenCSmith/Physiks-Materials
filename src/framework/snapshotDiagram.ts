export interface SnapshotDiagram {
  source: string
  width: number
  height: number
}

/** Fit both dimensions together; the PDF renderer does not implement object-fit. */
export function fitSnapshotDiagram(width: number, height: number, maxWidth: number, maxHeight: number) {
  if ([width, height, maxWidth, maxHeight].some(value => !Number.isFinite(value) || value <= 0)) {
    throw new Error('The diagram needs finite, positive dimensions to export without distortion.')
  }
  const scale = Math.min(maxWidth / width, maxHeight / height)
  return { width: width * scale, height: height * scale }
}

export function snapshotDiagramImage(diagram: SnapshotDiagram, focused: boolean): string {
  // Page content is 710 px wide. Reserve the two 1 px border edges in both caps.
  const size = fitSnapshotDiagram(diagram.width, diagram.height, 708, (focused ? 260 : 365) - 2)
  return `<img class="report-diagram" src="${diagram.source}" alt="Current lab diagram" style="width:${size.width}px;height:${size.height}px"/>`
}
