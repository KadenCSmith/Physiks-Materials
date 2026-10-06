# Verification report

Tested on the user's Mac in **Google Chrome / Kaden profile**, October 6, 2026. Local dev URL: http://127.0.0.1:5185/. Template port 5183 was occupied; no unrelated process was terminated. The new public repository and Pages preview are recorded in README.

## Automated results

| Check | Result |
|---|---|
| Runtime / lockfile | Node 26.8.2 satisfies ≥22.12.0; npm 11.19.1; `npm ci` succeeded; lockfile/dependency versions unchanged |
| `npm run check:models` during implementation | Passed: all four registered modules, valid defaults, numeric finite snapshots and supported parameter boundaries |
| Final `npm run check` | Passed: type checking, lint, 3 scaffold tests, all **129 tests in 14 files**, production build |
| Mathematical tests | **22 domain tests**: signed indices, atom counts, BCC area density, effective charges and seven full balances, mass-action exponents, RDF radial weighting/coordination, seeded particles, signed circuit closure, phase fractions and endpoints, both components at both tangents, convex envelope |
| Direction timing | 6-second direction window and matching sample progress; 12-second windows for other views; nonperiodic endpoints retained |
| Change hygiene | `git diff --check` passed; raw course material under ignored `.local/` |

Full installation/check logs are retained locally in `.local/logs/`. Vite reports two dependency `use client` directives ignored while bundling lucide-react; the build succeeds. No app lint warnings remain.

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

## Unverified / outside measured evidence

- A separate hidden-tab suspension test could not be completed: browser tools activate the inspected tab, and native tab switching was interrupted by user activity. The template's existing visibility guard is retained. No claim of a passed hidden-tab test is made.
- Complete playlist review, complete instructor Gibbs sketch, unreadable element handwriting, shared conversation and older discovery videos are unverified; see source manifest. All exam-based labs are complete.
- Graph boundaries remain approximate; no assessed thermodynamic dataset or quantitative defect kinetics was supplied. Gibbs curves, polymer mixture, overview and cooling are stated idealizations.
- Native installers, signing/notarization, manual Windows/Linux/Safari checks, physical validation, FPS and measured learning gains were not run or claimed.
- Production build passed; the local `npm run preview` server was not separately started. Public Pages loading is verified separately after deployment.
