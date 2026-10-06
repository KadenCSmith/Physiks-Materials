import type { ComponentType } from 'react'

export type NumericParameters = Record<string, number>
export type NumericSnapshot = Record<string, number>
export type ValueTone = 'position' | 'velocity' | 'force' | 'neutral'

export interface ParameterOption {
  value: number
  label: string
}

export interface ParameterDefinition {
  key: string
  label: string
  symbol?: string
  unit?: string
  min: number
  max: number
  step: number
  note?: string
  /** Named choices retain the numeric model and storage contract. */
  options?: ParameterOption[]
  /** Related controls share a labeled fieldset in the customization drawer. */
  group?: string
  /** Hidden controls still participate in validation and saved-value recovery. */
  visibleWhen?: (parameters: NumericParameters) => boolean
}
export interface FormulaEntry {
  id: string
  group: string
  title: string
  description: string
  tex: string[]
  usage?: string
  sources?: string[]
}
export interface GuideEntry { title: string; text: string }
export interface Readout { label: string; value: number; unit?: string; tone?: ValueTone }
export interface PlotDefinition { key: string; label: string; unit?: string; tone?: ValueTone }
export interface DisplayOptions { labels: boolean; forces: boolean }
export interface PlaybackDefinition {
  duration: number
  loop: boolean
  disabled?: boolean
  note?: string
}
export interface SimulationSceneProps {
  parameters: NumericParameters
  snapshot: NumericSnapshot
  display: DisplayOptions
  onParameterChange: (key: string, value: number) => void
  onInteractionStart: () => void
  onInteractionEnd: () => void
  onOpenControls?: () => void
  onSeek?: (time: number) => void
}
export interface SimulationLessonProps {
  parameters: NumericParameters
  snapshot: NumericSnapshot
  time: number
}
export interface SimulationControlsProps {
  parameters: NumericParameters
  snapshot: NumericSnapshot
  onParameterChange: (key: string, value: number) => void
  onParametersChange: (values: NumericParameters) => void
}
export type SnapshotReportCell = string | { tex: string }
export interface SnapshotReportSection {
  title: string
  notes?: string[]
  tex?: string[]
  rows?: { label: string; value: string }[]
  table?: { headers: string[]; rows: SnapshotReportCell[][] }
}
export interface SnapshotReport {
  title: string
  description: string
  sections: SnapshotReportSection[]
  sources: string[]
}

/** Register a model without changing the shell. All numeric quantities use the units declared by the model. */
export interface SimulationDefinition {
  id: string
  title: string
  description: string
  eyebrow?: string
  interactionHint?: string
  defaults: NumericParameters
  controls: ParameterDefinition[]
  sample: (parameters: NumericParameters, time: number) => NumericSnapshot
  getPlayback: (parameters: NumericParameters) => PlaybackDefinition
  getReadouts: (parameters: NumericParameters, snapshot: NumericSnapshot) => Readout[]
  /** Snapshot facts and caveats for exports, independent of the active lesson step. */
  getSnapshotNotes?: (parameters: NumericParameters, snapshot: NumericSnapshot, format?: (value: number) => string) => string[]
  /** A focused export for the active task; other models use the shared full-method report. */
  getSnapshotReport?: (parameters: NumericParameters, snapshot: NumericSnapshot, format?: (value: number) => string) => SnapshotReport
  Scene: ComponentType<SimulationSceneProps>
  Lesson: ComponentType<SimulationLessonProps>
  Details?: ComponentType<SimulationLessonProps>
  Controls?: ComponentType<SimulationControlsProps>
  formulas: FormulaEntry[]
  plots?: PlotDefinition[]
  guides?: GuideEntry[]
}
export interface AppConfig {
  id: string
  title: string
  shortTitle: string
  description: string
  version: string
  switcherLabel: string
  documentationLabel: string
  defaultSpeed: number
  defaultModelId: string
}
