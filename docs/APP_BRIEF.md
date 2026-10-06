# App brief

## Purpose and delivery

Physiks · Materials (`physiks-materials-kadencsmith`) helps an ENGR330 student reason through the supplied practice exam. Deliverable: runnable browser app and a new public `KadenCSmith/Physiks-Materials` repository. The user explicitly authorized creating and publishing the new repository. No backend, login, assessment service, dependency upgrade, hosting deployment, or desktop installer is needed. The existing black cinematic shell is retained.

Template: package 0.3.2, base commit `886f2c0b1d4569f4e8b05726945827dac1afdde3`. Generated modules replace all new-model scaffold calculations. Original template examples are retained only for regression tests. A unique local-storage identity isolates this app's settings.

## Models and conventions

| ID | Rules and initial example | Limits and undefined cases |
|---|---|---|
| crystals | BCC, R=1 Å, direction tail (0,0,1) to head (1/2,0,0), [1 0 −2]. Head minus tail; integerize rational coordinates. Plane indices use reciprocal intercepts; zero parameter means parallel axis, not zero intercept. Counts SC/BCC/FCC 1/2/4; neighbors 6/8/12. BCC (200) density 3/(16R²). | Coordinates in cell; supported rational denominator ≤64. Coincident directions and all-parallel planes are flagged. Origin-crossing B is translated before intercept calculation. BCC density view fixes BCC structure. Radius 0.1–3 Å is illustrative, not measured exam data. |
| defects | Formal PtO3 host: Pt6+, O2−; Ta2O5: Ta5+. Default cation Frenkel, notation Ta on Pt with effective −1, 1000 K, activation interpretation. Charge = species absolute charge minus normal occupant charge. Seven reactions have explicit site and surface reservoirs. | Temperature 300–2000 K. Charges −8…8. Reaction selection is a documented finite set, not a chemical mechanism predictor. Formation-energy mode is conditional; pair and four-vacancy cluster exponents differ. Large site fractions violate dilution. |
| order | Crystal/BCC candidate, first distance 2.78 Å, shell radius 3.05 Å, density 0.06 Å⁻³. N=4πρ∫r²g(r)dr. Crystal shell broadening 0.025 Å conserves count. Gas g=1; seeded particles are reproducible. | Radius 0.1–6.5 Å; density 0.01–0.12 Å⁻³. Later crystal shells, polymer mixture and small projected particle samples are stated idealizations. No element identification. Circuit is independent of the exam's undirected screw surface; b joins finish to start, reversing it changes sign. |
| phases | Default 10 at% Pt / 1500 °C: (Cr)+Cr4Pt; endpoints 6.4/17.5 at%, atom fractions 0.675675…/0.324324…. At 1400 °C two schematic supporting tangents connect stable phase fields. F=3−P at fixed pressure. | Solver 0–35 at% / 1400–1530 °C, piecewise interpolation of stored graph readings ±0.5 at%. A weight interpretation of 10% would give a different state. At 1530 °C / compound–Pt coexistence, three fractions are withheld. Energy curves and full overview are schematic. |

Direction arrows use 6-second reveals; all other views use 12-second **nonperiodic conceptual** reveals and a deterministic numerical snapshot. No animation rate is interpreted as a migration or cooling rate. Static curves/geometry are memoized or precomputed; numeric substitutions use the template formatter without rounding internal calculations.

Parameter keys, exact ranges/defaults, and snapshot readout definitions are authoritative in each `model.ts` and `calculation.ts`; source units and graph uncertainty are in `phases/boundaries.ts`.

## Teaching and acceptance

Learn follows predict → inspect → reveal → substitute → interpret → try nearby. Explore shows the current calculation. Practice uses finite checked answers and targeted hints. Each lab supplies an easy-number and exam example; lecture choices are attributed only to actual inspected frames. Controls, lesson substitutions, scene, and live values use the same parameters/snapshot.

Acceptance examples: [1 0 −2] retains its overbar; translated B gives (2 1 −1); BCC a=2 Å gives 0.25 atoms/Å²; Ta on Pt gives −1 while retaining absolute +5; first BCC shell integrates to 8; gas R=2 Å gives N≈2.010619; exam phase fractions sum to one and conserve 10 at%.

The required automated checks and Chrome walkthrough are recorded in [VERIFICATION.md](VERIFICATION.md). All exam-topic coverage and exact source locations are in [MATERIALS_COVERAGE.md](MATERIALS_COVERAGE.md) and [SOURCE_MANIFEST.md](SOURCE_MANIFEST.md).

## Publication and remaining limits

The user's request authorizes a new repository containing the derived app. Full PDF, extracted exam figures, lecture captures and transcripts are local ignored reference material. No claim of publication rights for course captures is made. Only app screenshots are committed. Source access gaps do not block any exam-based lab; complete lecture review, measured thermodynamics/kinetics, learning gains, native installers, and cross-platform manual verification are outside verified evidence.
