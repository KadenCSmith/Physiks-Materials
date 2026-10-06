# Exam-to-lesson checklist

Only exam authority: local Exam_1_F26_Practice_Exam.pdf, 12 pages, confirmed by the user as the requested (2) copy. Figures visually inspected from rendered pages and embedded source images. No earlier exam/study guides used.

| Question | Source | Lesson and verification target |
|---|---|---|
| 1a | p1 Fig1 A/B/C | Four SC arrows; FCC origin-crossing plane; BCC (011); signed indices and equivalence |
| 1b | p1 Fig1 | SC/BCC/FCC counts, neighbors, radius relationships; dense versus close-packed |
| 1c | p1 Fig1 D | BCC (200), x=a/2: one interior center / a²; no corner centers in the slice |
| 1d | p1 text visually inspected | [1 0 −2], not OCR [102]; in-cell tail (0,0,1), head (1/2,0,0) |
| 2a–d | p4 | PtO3 host (formal Pt6+) and Ta2O5 (Ta5+); Frenkel, Schottky, two incorporation mechanisms; balances; energy assumptions |
| 3a | p7 Fig2 | Crystal spikes, first distance 2.78 Å, stated coordination 8; element underdetermined; BCC candidate a=2r/√3 |
| 3b | p7 | Density-weighted RDF, polymer/crystal/gas idealizations and order |
| 3c | p8 Fig3 | Screw displacement surface; explicit chosen Burgers circuit/sign convention; contrast edge; 0D/1D/2D |
| 4a | p10 Fig4 | Labeled melting extrema, two eutectics, lower solid invariants, congruent ordering distinguished from melting |
| 4b | p11 with p10 Fig4 | 10 at% Pt, 1500 °C: (Cr)+Cr4Pt, graph-estimated endpoints and atom/mole fractions; each μ equal; F=1 |
| 4c | p11 with p10 Fig4 | 1400 °C schematic Gibbs curves over the verified solid slice, two tangent segments and lower envelope |

## Limits established before implementation
- Diagram reading uncertainty: roughly ±0.5 atomic percentage point for supported high-temperature boundaries, ±10 °C for unlabeled lower invariants. Store actual traced readings in phases/boundaries.ts.
- Figure 1 unnumbered arrow tails/heads are interpreted at intended half-edge positions; drawing is not metrically exact. B-plane x-edge intercept is also interpreted as one half. These readings are explicitly labeled in Finder; custom coordinates allow alternative readings.
- Figure 3 supplies a screw-dislocation surface but no directed step-count circuit. The circuit/sign used in the app is independently constructed and labeled, not an instructor-specified sign.
- Exam calls energies activation energies. Equilibrium concentrations cannot be established from kinetic barriers alone. Compare conditional formation-energy equilibrium constants and equal-prefactor kinetic weights separately; no quantitative measured concentrations claimed.
- Numerical phase controls restricted to 0–35 at% Pt and 1400–1530 °C. Full diagram overview and cooling reactions are qualitative reconstructions, not a thermodynamic database.
- Full PDF and extracted images stay in ignored .local/evidence, not in GitHub.

## Supplemental sources and completion

All four exam-based labs are implemented. Each has Learn/Explore/Practice, controls, an easy example, an exam example, and a selectable lecture example. The selected lecture frames and actual visible content are recorded in [SOURCE_MANIFEST.md](SOURCE_MANIFEST.md); textbook methods and corrections are recorded there too. Source captures remain local and ignored. [VERIFICATION.md](VERIFICATION.md) separates numerical, live-browser and unrun checks.

No exam-based lesson is blocked. Complete lecture Gibbs geometry, the unreadable handwritten element name, the inaccessible shared conversation and older video leads remain unverified. The app makes the independent constructions and assumptions explicit rather than filling these gaps with attributed claims.
