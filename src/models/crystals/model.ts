import { defineSimulation } from '../../framework/model'
import type { ParameterDefinition } from '../../framework/types'
import { sampleModel, getPlayback } from './calculation'
import { Scene } from './Scene'
import { Lesson } from './Lesson'
import { Controls, GeometryResults } from './Controls'
import { formulas } from './formulas'
import { snapshotNotes } from './snapshot'
import './styles.css'
const control = (key: string, label: string, min: number, max: number, step = .25): ParameterDefinition => ({ key, label, min, max, step })
const hidden = (key: string, label: string, min: number, max: number, step = .25): ParameterDefinition => ({ ...control(key, label, min, max, step), visibleWhen: () => false })
export const crystalsModel = defineSimulation({
  id: 'crystals', title: 'Crystals & indices', eyebrow: 'LAB A · EXAM QUESTION 1',
  description: 'Count shared atoms. Build a direction or plane and inspect its geometry.',
  interactionHint: 'Rotate the cell. Open Customize to build your own direction or plane.',
  defaults: { reference: 0, structure: 1, view: 1, radius: 1, yaw: 0, sx: 0, sy: 0, sz: 1, ex: .5, ey: 0, ez: 0, ix: .5, iy: 1, iz: -1, planeCase: 1, translate: 0, directionMode: 0, du: 1, dv: 0, dw: -2, planeInput: 1, ph: 1, pk: 0, pl: 0, planeLevel: 1 },
  controls: [
    { ...control('view', 'What to inspect', 0, 3, 1), group: 'View', options: ['Shared atoms', 'Direction', 'Plane', 'BCC (200) density'].map((label, value) => ({ label, value })) },
    { ...control('structure', 'Crystal structure', 0, 2, 1), group: 'Cell', options: ['Simple cubic (SC)', 'Body-centered cubic (BCC)', 'Face-centered cubic (FCC)'].map((label, value) => ({ label, value })), visibleWhen: p => p.view !== 3 },
    { ...control('radius', 'Atomic radius', .1, 3, .1), group: 'Cell', unit: 'Å', note: 'Sets the lattice parameter for the chosen structure; illustrative radius.' },
    { ...control('yaw', 'Cell rotation', -180, 180, 1), group: 'Cell', unit: '°' },
    hidden('reference', 'Example source', 0, 1, 1),
    ...['sx', 'sy', 'sz', 'ex', 'ey', 'ez'].map((key, i) => hidden(key, `${i < 3 ? 'Tail' : 'Head'} ${'xyz'[i % 3]} coordinate`, 0, 1)),
    ...['ix', 'iy', 'iz'].map((key, i) => hidden(key, `${'xyz'[i]} plane intercept`, -12, 12)),
    hidden('planeCase', 'Plane example', 0, 2, 1), hidden('translate', 'Translate origin-crossing plane', 0, 1, 1),
    hidden('directionMode', 'Direction input method', 0, 1, 1),
    ...['du', 'dv', 'dw'].map((key, i) => hidden(key, `Direction index ${'uvw'[i]}`, -12, 12, 1)),
    hidden('planeInput', 'Plane input method', 0, 1, 1),
    ...['ph', 'pk', 'pl'].map((key, i) => hidden(key, `Miller index ${'hkl'[i]}`, -12, 12, 1)),
    hidden('planeLevel', 'Plane level q', -12, 12, .25),
  ],
  sample: sampleModel, getPlayback,
  getReadouts: (p, s) => p.view === 0 ? [
    { label: 'Atoms / cell', value: s.atoms }, { label: 'Nearest neighbors', value: s.neighbors }, { label: 'Lattice parameter a', value: s.a, unit: 'Å' },
  ] : p.view === 1 ? [
    { label: 'Lattice parameter a', value: s.a, unit: 'Å' },
    ...(s.validDirection ? [{ label: 'Drawn arrow length', value: s.directionLength, unit: 'Å' }, { label: 'Angle to +x', value: s.angleX, unit: '°' }, { label: 'Angle to +z', value: s.angleZ, unit: '°' }] : []),
  ] : p.view === 2 ? [
    { label: 'Lattice parameter a', value: s.a, unit: 'Å' },
    ...(s.validPlane ? [{ label: 'Index-vector spacing d', value: s.spacing, unit: 'Å' }, { label: 'Slice distance from origin', value: s.originDistance, unit: 'Å' }, { label: 'Area inside this cell', value: s.sliceArea, unit: 'Å²' }] : []),
  ] : [{ label: 'Lattice parameter a', value: s.a, unit: 'Å' }, { label: 'BCC (200) density', value: s.planarDensity, unit: 'atoms/Å²' }, { label: 'Area packing fraction', value: 3 * Math.PI / 16 }],
  Scene, Lesson, Controls, Details: GeometryResults, formulas, getSnapshotNotes: snapshotNotes,
  guides: [
    { title: 'Build your own geometry', text: 'Customize → Direction: enter tail/head fractions or signed integer indices. Customize → Plane: enter signed Miller indices with a level, or axis intercepts with separate parallel choices. Results use the same geometry as the diagram.' },
    { title: 'Verified exam direction', text: 'Exam p1 Q1d visibly has an overbar on 2: [1 0 −2]. OCR loses it.' },
    { title: 'Figure reading', text: 'A is SC, B is FCC, C is BCC. Unnumbered half-edge positions are inferred from the illustration. Exam B is (2 1 −1) under that reading; C is (0 1 1).' },
  ],
})
