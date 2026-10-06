# Physiks · Materials

Four interactive ENGR330 labs built from [KadenCSmith/Physiks](https://github.com/KadenCSmith/Physiks), template version 0.3.2. The cinematic shell, Finder, Toolbox, playback, keyboard controls, and local settings are retained. App/storage identity: `physiks-materials-kadencsmith`.

- **Crystals & indices:** SC/BCC/FCC atom sharing, coordination, signed directions, translated Miller planes, and BCC (200) density.
- **Kröger–Vink defects:** independently selected species/site/charge, Frenkel and Schottky constructions, seven balanced reactions, and explicit activation/formation-energy assumptions.
- **Order & dislocations:** density-weighted RDF coordination, crystal/polymer/gas idealizations, and independently constructed screw/edge Burgers circuits.
- **Cr–Pt phase equilibria:** a traceable solid phase slice, lever rule, qualitative cooling reactions, two consistent schematic common tangents, and phase-rule constraints.

Each lab has Learn (six Back/Next steps), Explore, Practice, targeted hints, checked answers, easy examples, exam examples, and a selectable example from an inspected lecture frame. Source notes are expandable in the lesson and Finder.

## Run

Requires Node **22.12.0 or newer**, npm, and access to this public repository. Locally tested with Node 26.8.2 / npm 11.19.1. Dependencies and the template lockfile are unchanged.

```sh
gh repo clone KadenCSmith/Physiks-Materials
cd Physiks-Materials
npm ci
npm run check
npm run dev -- --port 5185
```

Open **http://127.0.0.1:5185/** in Chrome. This port was verified on the user's Mac; 5183 was already occupied. If another copy is running on 5185, use `npm run dev -- --port 5186` and open http://127.0.0.1:5186/. Vite uses strict ports; it will report a conflict instead of silently moving.

For a production build:

```sh
npm run build
npm run preview -- --port 5186
```

The production build passed. The separate production-preview server and native desktop installers were not manually tested. A public GitHub Pages browser preview is included. Native installers were not requested or created.

## Use

Choose a lab from **Materials lab**. Scene buttons and Toolbox edit the same model state. Parameter changes restart the conceptual reveal while preserving Play/Pause intent. Seek to the end to inspect completed constructions. Direction arrows stop after 6 seconds (twice the original reveal speed); other demonstrations stop after 12 seconds and do not automatically loop; seconds describe presentation progress, not physical kinetics. Use `Space` for play/pause and `R` for restart when focus is outside a field. Finder searches methods and sources across labs.

## Evidence and limits

Public app: **https://kadencsmith.github.io/Physiks-Materials/**.

The only exam source is the 12-page local `Exam_1_F26_Practice_Exam.pdf`, confirmed by the user as the requested `(2)` copy. Source figures were visually inspected. See [coverage](docs/MATERIALS_COVERAGE.md), [source manifest](docs/SOURCE_MANIFEST.md), [app brief](docs/APP_BRIEF.md), and [verification](docs/VERIFICATION.md).

Selected actual frames from four Fall 2026 practice-exam videos in the professor's supplied playlist were inspected in the user's Chrome profile. Their URLs, exact titles, timestamps, visible givens, and independent additions are recorded. No whole-playlist review is claimed. Full course PDFs, lecture captures, transcripts, and raw logs stay in ignored `.local/`; screenshots in `docs/screenshots/` show the recreated app only.

The phase solver is restricted to **0–35 at% Pt, 1400–1530 °C**, with graph readings approximately **±0.5 at%**. The exam's “10%” is explicitly interpreted on the bottom atomic-percent axis. Overview/cooling outlines and Gibbs energies are schematic. Three fractions at an invariant cannot be determined from overall composition alone. Eight neighbors supports a BCC candidate, not a unique element. Activation barriers cannot establish equilibrium defect concentrations. The shared conversation and older discovery videos were inaccessible; they do not block the exam-based lessons. The complete instructor Gibbs sketch and unreadable element handwriting are unverified.

## Code and checks

Domain modules are in `src/models/{crystals,defects,order,phases}/`; each follows the template's `defineSimulation` and deterministic `sample(parameters,time)` contract. `src/models/shared/` contains a small local lesson component, not a replacement app framework. Original oscillator/relaxation examples remain for template regression tests but are not registered as materials labs.

`npm run check` runs type checking, lint, scaffold verification, all 129 tests, and the production build. The 22 domain tests check independent numerical results, notation, balances, RDF weighting, deterministic sampling, phase conservation/boundaries, each component potential at both tangents, and the lower convex envelope. Inherited tests cover the shell and playback. See verification for browser results and limitations.

Template architecture and desktop documentation remain available in `docs/`; desktop packaging was not part of this implementation.
