# Verification report

Tested on the user's Mac in **Google Chrome / Kaden profile**, October 6, 2026. Local dev URL: http://127.0.0.1:5185/. Template port 5183 was occupied; no unrelated process was terminated. The new public repository and Pages preview are recorded in README.

## Automated results

| Check | Result |
|---|---|
| Runtime / lockfile | Node 26.8.2 satisfies ≥22.12.0; npm 11.19.1; `npm ci` succeeded; updated lockfile installed with npm ci; pinned html2canvas 1.4.1 added for local PDF export; other template versions retained |
| `npm run check:models` during implementation | Passed: all four registered modules, valid defaults, numeric finite snapshots and supported parameter boundaries |
| Final `npm run check` | Passed: type checking, lint, 3 scaffold tests, all **214 tests in24 files**, production build |
| Mathematical tests | **22 domain tests**: signed indices, atom counts, BCC area density, effective charges and seven full balances, mass-action exponents, RDF radial weighting/coordination, seeded particles, signed circuit closure, phase fractions and endpoints, both components at both tangents, convex envelope |
| Direction timing | 6-second direction window and matching sample progress; 12-second windows for other views; nonperiodic endpoints retained |
| Change hygiene | `git diff --check` passed; raw course material under ignored `.local/` |

Full installation/check logs are retained locally in `.local/logs/`. Earlier builds reported two dependency `use client` directives ignored while bundling lucide-react; the final build succeeds. No app lint warnings remain.

## Live browser walkthrough

Desktop **1440×1000** and narrow **390×844** layouts were inspected; temporary viewport overrides were reset. Every lab was opened through the registered model menu. Narrow document width equaled 390 px, with no page-level horizontal overflow and no KaTeX error nodes. Long equations use the inherited scrollable math block.

| Lab | Worked result observed | Practice result observed | Other controls exercised |
|---|---|---|---|
| A | [1 0 −2], translated lecture B (2 1 −1), FCC 4 atoms/12 neighbors, BCC a=2 Å gives 0.25 atoms/Å² | Nearby [−1 1 0] accepted | SC/BCC/FCC, direction/plane/density choices, origin translation, rotation, radius input and easy example |
| B | Pt6+, Ta-on-Pt effective −1, reaction mass/charge/site residuals zero; Pt vacancy effective −6 supported | Wrong answer +5 returns charge-subtraction hint; −1 accepted | Lecture substitution, Schottky, species/site/charge, activation versus formation mode, 2000 K endpoint |
| C | First candidate BCC shell N=8; ideal gas g=1 and N≈2.011 at R=2 Å | 2.01 accepted; “Parallel” accepted for screw | Crystal/polymer/gas, shell radius, inspected lecture sketch choice, screw/edge circuits and orientations |
| D | 10 at% /1500 °C endpoints 6.4/17.5 and fractions 0.676/0.324; fractions sum to one, residual zero | 0.5 accepted for midpoint tie line | Lecture 1400 °C choice, schematic Gibbs curves/tangents, qualitative cooling selections |

Learn Next/Back and Explore/Practice switches were exercised. Finder “chemical” search returned the component-potential topic with equations and sources on a narrow screen. Escape returned focus to the Finder opener. Toolbox radius 100 clamped to 3; blank input restored the prior valid value. Tab moved focus to the next labeled control. Pause followed by restart retained paused intent and time zero; parameter changes and lab switches preserved pause. Seek-to-end, replay, and nonperiodic stop were observed. The shared speed menu and scene overlays remain in the template shell.

Screenshots of the recreated app: [A desktop](screenshots/crystals-desktop.jpg), [B desktop](screenshots/defects-desktop.jpg), [C desktop](screenshots/order-desktop.jpg), [D desktop](screenshots/phases-desktop.jpg), and the corresponding `*-narrow.jpg` files. Some full-page captures include the fixed header/transport at the current scroll position. Local lecture evidence is separate and ignored.

## Public deployment

The [public repository](https://github.com/KadenCSmith/Physiks-Materials) and [published app](https://kadencsmith.github.io/Physiks-Materials/) are available. [GitHub Actions run37441246332](https://github.com/KadenCSmith/Physiks-Materials/actions/runs/37441246332) passed the full checks and deployed the customization, animated plane and PDF version with Node24. This current version was published before the focused defects redesign, as requested. Later updates use the same checked deployment workflow; [deployment history](https://github.com/KadenCSmith/Physiks-Materials/actions).

The published app was loaded in the same Chrome / Kaden profile. All four labs opened, and their Practice answers were accepted: A `[−1 1 0]`, B `−1`, C `2.01`, and D `0.5`. The published phase lesson showed the 6.4/17.5 at% endpoints and 0.676/0.324 fractions without KaTeX errors. The published direction view displayed its six-second window, reached 6/6 s, and rendered the signed `[1 0 −2]` arrow. Other views retained twelve-second windows. [Published-app screenshot](screenshots/public-app.jpg).

## Unverified / outside measured evidence

- A separate hidden-tab suspension test could not be completed: browser tools activate the inspected tab, and native tab switching was interrupted by user activity. The template's existing visibility guard is retained. No claim of a passed hidden-tab test is made.
- Complete playlist review, complete instructor Gibbs sketch, unreadable element handwriting, shared conversation and older discovery videos are unverified; see source manifest. All exam-based labs are complete.
- Graph boundaries remain approximate; no assessed thermodynamic dataset or quantitative defect kinetics was supplied. Gibbs curves, polymer mixture, overview and cooling are stated idealizations.
- Native installers, signing/notarization, manual Windows/Linux/Safari checks, physical validation, FPS and measured learning gains were not run or claimed.
- Production build and public Pages loading passed; the local `npm run preview` server was not separately started.

## Customization and snapshot follow-up

The notation and calculations were audited against the same 12-page exam and inspected lecture frames. Tests cover custom rational inputs, integerized plane levels, whole-number negative overbars, (200) versus (100), all 64 supported BCC neighbors, SF/RH Burgers vectors, nonfinite phase inputs, and the 1530 °C terminal endpoints.

Chrome tests exercised a [−12 1 0] custom direction, invalid zero direction/normal, fractional intercepts (0.75,1,1) producing (4 3 3) at integer level3, and (200) at q=0/1/3. The q=0 case distinguishes contained axes; q=3 produces a valid equation but zero area in the cell. Enter submits a custom plane. Plane reveal at0 shows no boundary/fill; 7.2s has partial edges; 12s has all edges and fill. Named selectors show only relevant controls. At390×844 the customization dialog and document stay within390px.

Actual Chrome PDF downloads were generated for all four labs and rendered with Poppler; embedded JPEGs were also inspected at original resolution to avoid misleading resized previews. Mathematical notation and formulas passed visual/scientific review. Repeated headers/footers and plane-coordinate tables were reviewed on all pages. The corrected crystal plane sample uses3 pages, order/dislocations3 and phases3. Generic reports include frozen diagrams, exact input notes, current results, lesson, methods, assumptions and references. Reports are A4 image-based PDFs; text is not selectable or searchable. The earlier layout review missed image distortion; the explicit proportion measurements below supersede that part of the review.

## Focused defects and PDF redesign

The three activities use different controls, readouts, lessons and snapshot reports. Chrome checks covered all seven reaction selections, positive and negative whole-unit charge marks, wrong-charge feedback, and accepted Practice answers for symbol (−1), cation Frenkel (+6) and activation comparison (anion). Before/Change/Check-products buttons pause and seek to0/6/12 seconds. Empty sites and holes are never shown as atoms; atom allocations match all reactant/product inventories, and atom, site and charge residuals are zero. The independent audit includes9 tests for all seven inventories, oxygen provenance, reverse seeking, and fitting all21 dopant-reaction atoms inside term boxes.

The logarithmic energy plot and numerical tables were checked at1000 K and at300/2000 K. Nonzero tiny weights use raised scientific exponents. Activation mode reports log₁₀w; conditional formation mode distinguishes log₁₀K and log₁₀c and warns when the anion fraction invalidates dilution. Each activity's Learn/Explore/Practice content matches the selected task. Customize shows only the active fields. All three activities were checked at390×844 with document width390 and no KaTeX error nodes. Temporary viewport overrides were reset.

Final actual downloads passed scientific and page-layout review: Ta-on-Pt symbol1 page, activation comparison1, conditional formation1, cation-Frenkel reaction2. Each includes the selected activity's diagram, calculations, notation explanation or conservation checks, relevant formulas, assumptions and references, with no inactive activity dump. See the recreated-app screenshots: [symbol narrow](screenshots/defects-symbol-narrow.jpg), [reaction narrow](screenshots/defects-reaction-narrow.jpg), [energy narrow](screenshots/defects-energy-narrow.jpg). The final check log is `.local/logs/defects-final-check.log`.

## PDF proportions and physical dislocation drawing correction

The export previously forced diagrams to full width while capping their height. The canvas renderer does not honor `object-fit`, so this stretched the figures. Both dimensions are now scaled together from each SVG viewBox, with explicit matching SVG/image dimensions and no independent height clamp. Four regression tests cover the lab ratios, wide/tall cases, generated dimensions and invalid sizes. Calculation sections paginate by whole tables, result lists and equations; headings stay with their following content. Plane notes already included beside the calculation are no longer repeated in the assumptions section.

Fresh Chrome downloads for all four labs were rendered with Poppler. All10 final pages were visually inspected, along with original-resolution embedded page images. Measured dark diagram rectangles in the actual PDF images agree with their source ratios within **0.1%**, accounting for whole-pixel rounding:

| Figure | Source dimensions | PDF pixel dimensions | Relative ratio error |
|---|---|---|---|
| Crystal plane | 600×480 | 908×726 | 0.055% |
| Defects energy chart | 760×365 | 1074×516 | 0.038% |
| Phase Gibbs chart | 760×440 | 1254×726 | 0% |
| Dislocation crystal | 430×380 | 822×726 | 0.058% |
| Separate Burgers circuit | 760×440 | 1254×726 | 0% |

The physical screw illustration was compared directly with the only exam's p8 Fig3. It now has opaque connected lattice walls/floor, a tapered surface step ending at the core, and separate line/Burgers arrows. Edge uses an atom-row cross-section with a terminating extra half-plane. A second SVG supplies the independent circuit rather than overlaying it on an unrelated physical sketch. Screw projection is along +x; a height chart reveals the hidden rise of a. Edge projection is along +z and exposes a horizontal gap a. The physical drawings are schematic identification sketches, not measured or relaxed atomistic displacement fields. No directed exam circuit, axes or step counts are claimed.

Eight added geometry tests cover the 16 actual neighbor bonds, screw angular displacement, endpoint gaps at three spacings, enclosed edge core, and t×b toward the extra half-plane. Browser controls paused the circuit at0/6/12 seconds with0/8/16 steps visible; screw Parallel and edge Perpendicular Practice answers were accepted, and changing character reset stale lesson feedback. Long native SVG title tooltips were removed. At390×844 the document width remained390px, no KaTeX errors appeared, and SVG proportions were retained; the override was reset. [Screw narrow screenshot](screenshots/order-screw-narrow.jpg).

Final correction checks: `.local/logs/pdf-proportions-final-check.log`; type checking, lint, scaffold verification,214 tests and production build passed. Corrected samples are retained locally in ignored `output/pdf/`; course source images remain ignored and read-only.
