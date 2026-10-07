# Physiks · Materials

Four interactive ENGR330 labs built from [KadenCSmith/Physiks](https://github.com/KadenCSmith/Physiks), template version 0.3.2. The cinematic shell, Finder, Toolbox, playback, keyboard controls, and local settings are retained. App/storage identity: `physiks-materials-kadencsmith`.

- **Crystals & indices:** SC/BCC/FCC atom sharing, coordination, signed directions, translated Miller planes, and BCC (200) density.
- **Kröger–Vink defects:** three focused activities: build a symbol with charge subtraction, follow one of seven balanced reactions, or compare energies with explicit activation/formation assumptions.
- **Order & dislocations:** density-weighted RDF coordination, crystal/polymer/gas idealizations, physical defect sketches, and independently constructed screw/edge Burgers circuits with dedicated animation controls.
- **Cr–Pt phase equilibria:** linked tie lines and lever-rule arms/fraction bars, a full-composition Gibbs view with a Cr-rich zoom, matched cooling diagrams and free-energy comparisons, and phase-rule constraints.

Each lab has Learn (six Back/Next steps), Explore, Practice, targeted hints, checked answers, easy examples, exam examples, and a selectable example from an inspected lecture frame. Source notes are expandable in the lesson and Finder.

## Run

Requires Node **22.12.0 or newer**, npm, and access to this public repository. Locally tested with Node 26.8.2 / npm 11.19.1. Install the exact versions in the committed lockfile with `npm ci`. The template dependencies remain pinned; `html2canvas` **1.4.1** was added for PDF snapshots and loads only when exporting.

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

Open **customize** to edit grouped, named controls for the current view. Categories such as crystal structure, reaction and material use named choices; only relevant controls appear. Load an exam or lecture reference with the scene’s example buttons.

In the defects lab, start with **Build a symbol**: choose the species and site, then compare your proposed superscript with the calculated charge. **Follow a reaction** has **Before**, **Change** and **Check products** buttons that pause at the corresponding stage. Colored circles track conserved atoms between equation terms; the site cards and tables explain empty sites, holes, reservoirs and charge contributions. These paths illustrate bookkeeping. **Compare energies** supplies a conventional logarithmic graph and a numerical table; temperature sets the values, and the interpretation explains what the given energies can establish. Each activity has its own Learn, Explore and Practice lesson.

In the crystal lab, choose **Direction** to enter tail/head coordinates (decimals or fractions of the cell edge, such as `1/2`) or signed integer indices. **Calculate direction** updates the arrow, reduced indices, unit vector, drawn length and angles to the three axes. Choose **Plane** → **My plane** to enter axis intercepts, marking a parallel axis explicitly, or enter Miller indices and a plane level `q`. **Calculate plane** updates the slice, intercepts, normal, spacing, origin distance and cell-clipped area. Negative indices keep their overbars; `(200)` retains its spacing rather than being reduced to `(100)`.

In **Order & dislocations → Burgers circuit**, the first picture identifies the physical defect and the second explains the circuit calculation. The screw cutaway shows a surface step ending at its core; its separate circuit is viewed along the line, with a height chart exposing the one-spacing rise hidden by that projection. The edge picture shows an extra half-plane ending at the core and a sideways Burgers gap. **Animate Burgers circuit** starts the trace from its first bond. **Pause circuit** and **Resume circuit** control the moving marker, arrow and current leg/bond cue. **Restart circuit**, **Inspect halfway** and **Show Burgers gap** pause at 0, 6 and 12 seconds. Four neighbor bonds on each side make 16 steps. These controls share the global playback clock and viewing speed. The physical crystal is a schematic identification sketch; the independently constructed circuit supplies its own counts and axes, which are not supplied by the exam figure.

In **Cr–Pt phase equilibria**, the exam tie line connects the marked phase endpoints to the two lever-rule arms and the phase-fraction bar. The arm opposite a phase determines that phase's atom/mole fraction. The **1400 °C Gibbs** view can show **0–100 at% Pt** or a **0–40 at% Pt** zoom; the diagram and energy view refer to the same composition and temperature. The cooling activity links a selected phase-diagram transition to a **G–T** comparison at that transition's composition. Five invariant and five congruent cases distinguish a multi-phase reaction from a same-composition transition. The compared energies describe competing states or equal-composition phase assemblages, using symbolic, arbitrary local energy scales; they are not measured Cr–Pt Gibbs data.

**Download current simulation PDF** freezes the current diagram and calculation at the click without changing Play/Pause intent. Defects exports follow the selected activity: a symbol with its charge arithmetic, one reaction with term contributions and conservation checks, or an energy comparison with its relevant assumptions. The other labs include current inputs, results, lesson, methods and references. The clean A4 PDF uses rendered page images to preserve mathematical notation and diagrams; its text is not searchable or selectable. Export requires a browser with canvas and file-download support. Source course PDFs and lecture captures are not bundled into the export.

PDF figures retain their original width-to-height ratio: both dimensions are fitted together inside the page limits. Figures are centered without stretching, and complete tables and equation units stay together when paginating calculation notes.

## Evidence and limits

Public app: **https://kadencsmith.github.io/Physiks-Materials/**.

The only exam source is the 12-page local `Exam_1_F26_Practice_Exam.pdf`, confirmed by the user as the requested `(2)` copy. Source figures were visually inspected. See [coverage](docs/MATERIALS_COVERAGE.md), [source manifest](docs/SOURCE_MANIFEST.md), [app brief](docs/APP_BRIEF.md), and [verification](docs/VERIFICATION.md).

Selected actual frames from four Fall 2026 practice-exam videos in the professor's supplied playlist were inspected in the user's Chrome profile. Their URLs, exact titles, timestamps, visible givens, and independent additions are recorded. No whole-playlist review is claimed. Full course PDFs, lecture captures, transcripts, and raw logs stay in ignored `.local/`; screenshots in `docs/screenshots/` show the recreated app only.

The science audit checked signed indices, plane levels, all seven reaction balances, full Kröger–Vink superscripts, RDF weighting and neighbor shells, Burgers handedness, and phase conservation. The independent Burgers construction follows the instructor's **SF/RH** convention: a right-hand circuit around the positive unit line tangent **t**, with **b = finish − start**; the gap-closing vector is −b. Custom cubic geometry keeps plane orientation separate from its level, so (200) at x=a/2 retains its order. Slice area describes the clipped geometry and is not automatically an atom density.

The quantitative phase-fraction solver is restricted to **0–35 at% Pt, 1400–1530 °C**, with graph readings approximately **±0.5 at%**. The full-composition energy view and cooling comparisons extend the teaching diagrams, not the range of measured or digitized thermodynamic data. The exam's “10%” is explicitly interpreted on the bottom atomic-percent axis. Overview/cooling outlines and Gibbs energies are schematic. Three fractions at an invariant cannot be determined from overall composition alone. The source's printed **Cr₃Pt** label lies near **33–40 at% Pt**, whereas its nominal formula implies **25 at% Pt**. The app flags this discrepancy and retains the printed label; its drawn position must not be silently treated as exact stoichiometry. Eight neighbors supports a BCC candidate, not a unique element. Activation barriers establish relative equal-prefactor kinetic weights; equilibrium estimates are explicitly conditional on treating those energies as formation energies. RDF curves and later BCC shells are stated idealizations rather than digitized measurements. The shared conversation and older discovery videos were inaccessible; they do not block the exam-based lessons. The complete instructor Gibbs sketch and unreadable element handwriting are unverified.

The latest animation and linked phase views use the same confirmed 12-page exam and the four previously inspected lecture frames. No new videos or additional exam references were inspected for these additions. Their browser/check results belong in [verification](docs/VERIFICATION.md), separately from this description of the implemented behavior.

## Code and checks

Domain modules are in `src/models/{crystals,defects,order,phases}/`; each follows the template's `defineSimulation` and deterministic `sample(parameters,time)` contract. `src/models/shared/` contains a small local lesson component, not a replacement app framework. Original oscillator/relaxation examples remain for template regression tests but are not registered as materials labs.

`npm run check` runs type checking, lint, scaffold verification, the complete test suite, and the production build. Domain checks cover independent numerical results, rational and signed custom geometry, plane levels, Kröger–Vink symbols and balances, RDF weighting and complete shells, right-hand circuit signs, deterministic sampling, phase conservation/boundaries, each component potential at both tangents, the lower convex envelope, and active-state scientific snapshot notes. Inherited tests cover the shell and playback. See [verification](docs/VERIFICATION.md) for final counts, browser results and limitations.

Template architecture and desktop documentation remain available in `docs/`; desktop packaging was not part of this implementation.
