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
| 3c | p8 Fig3 | Screw displacement surface; independently constructed right-hand circuit following instructor SF/RH (b=finish−start); contrast edge; unit line tangent t; 0D/1D/2D |
| 4a | p10 Fig4 | Labeled melting extrema, two eutectics, lower solid invariants, congruent ordering distinguished from melting |
| 4b | p11 with p10 Fig4 | 10 at% Pt, 1500 °C: (Cr)+Cr4Pt, graph-estimated endpoints and atom/mole fractions; each μ equal; F=1 |
| 4c | p11 with p10 Fig4 | 1400 °C schematic Gibbs curves over the verified solid slice, two tangent segments and lower envelope |

## Limits established before implementation
- Diagram reading uncertainty: roughly ±0.5 atomic percentage point for supported high-temperature boundaries, ±10 °C for unlabeled lower invariants. Store actual traced readings in phases/boundaries.ts.
- Figure 1 unnumbered arrow tails/heads are interpreted at intended half-edge positions; drawing is not metrically exact. B-plane x-edge intercept is also interpreted as one half. These readings are explicitly labeled in Finder; custom coordinates allow alternative readings.
- Figure 3 supplies a screw-dislocation surface but no directed step-count circuit. The app trace is independently constructed, while its sign follows the instructor textbook §3.4: SF/RH, a right-hand traversal about the positive unit tangent t with b=finish−start. A finish-to-start closing arrow is −b. Reversing both traversal and positive line sense reverses b.
- Exam calls energies activation energies. Equilibrium concentrations cannot be established from kinetic barriers alone. Compare conditional formation-energy equilibrium constants and equal-prefactor kinetic weights separately; no quantitative measured concentrations claimed.
- Numerical phase controls restricted to 0–35 at% Pt and 1400–1530 °C. Full diagram overview and cooling reactions are qualitative reconstructions, not a thermodynamic database.
- Full PDF and extracted images stay in ignored .local/evidence, not in GitHub.

## Follow-up science audit and custom calculations

- Custom cubic directions accept coordinates or signed indices and calculate reduced direction, physical length, unit direction, and axis angles. Custom planes accept intercepts, a normal/level, or three points and calculate the equation, normal, spacing, origin distance, intercepts, and cell-clipped slice area. Plane level is preserved when clearing reciprocal fractions; (200) is not silently reduced to the x=a slice. A slice area is geometric area, not a universal atom-density formula. These are independent extensions of Q1, with no new exam source.
- Kröger–Vink chemical labels are upright, sites are subscripts, and every dot/prime is a raised charge mark. Proposed effective charge is an integer choice, compared with species charge minus host-site charge. The editable trial is separate from the selected fixed reaction; all seven complete reactions conserve species, effective charge, and sites. Arrhenius rates include the equal-prefactor assumption; conditional Frenkel/Schottky equilibrium calculations disclose formation-energy and dilute-limit assumptions.
- The BCC candidate's projected particles now contain all 64 neighbors in the six shown shells (8, 6, 12, 24, 8, 6), including both signs of each displacement. Exact highlighted counts and smoothly broadened RDF coordination are distinguished. A fully occupied candidate requires ρ=2/a³; changing normalization density is not a new measured BCC lattice. The ideal-gas limit is g(0)=1 and N(0)=0. Polymer long-range order is local to crystalline domains.
- Both Burgers constructions show directed traversal and a positive line tangent. Tests check right-handedness and b=finish−start for screw and edge, including reversal. Pure screw has b parallel or antiparallel to t; pure edge has b perpendicular to t. The display uses tangent t rather than an ambiguous lowercase l.
- Phase calculations retain atomic/mole composition basis, fixed-pressure F=3−P, equality of each component's potential at both tangents, and the lower convex envelope. The Gibbs view evaluates its stated 1400 °C slice even if another view stored a different temperature. Three invariant fractions remain underdetermined; qualitative cooling markers are not substituted for invariant equilibrium states.
- PDF snapshot metadata preserves current scientific results and assumptions in every lesson mode, including source attribution and independent constructions. It reports active inputs rather than hidden stored values. Numerical and notation checks are listed in [VERIFICATION.md](VERIFICATION.md); exported pages are raster snapshots, so their text is not searchable/selectable.

## Supplemental sources and completion

All four exam-based labs are implemented. Each has Learn/Explore/Practice, controls, an easy example, an exam example, and a selectable lecture example. The selected lecture frames and actual visible content are recorded in [SOURCE_MANIFEST.md](SOURCE_MANIFEST.md); textbook methods and corrections are recorded there too. Source captures remain local and ignored. [VERIFICATION.md](VERIFICATION.md) separates numerical, live-browser and unrun checks.

No exam-based lesson is blocked. Complete lecture Gibbs geometry, the unreadable handwritten element name, the inaccessible shared conversation and older video leads remain unverified. The app makes the independent constructions and assumptions explicit rather than filling these gaps with attributed claims.
