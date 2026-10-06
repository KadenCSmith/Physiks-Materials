/** Manual readings from Exam p10 Fig4; not assessed thermodynamic data. */
export const provenance={source:'Exam_1_F26_Practice_Exam.pdf p10 Figure 4',temperatureUnit:'°C',compositionUnit:'atomic percent Pt (mole fraction ×100)',readingUncertaintyAtPercent:.5,unlabeledTemperatureUncertaintyC:10,supportedTemperature:[1400,1530],supportedComposition:[0,35],method:'Visually read source axes; piecewise-linear interpolation only within the solid high-temperature slice. Lower overview outlines are qualitative.'}
// [T, (Cr) right edge, Cr4Pt left edge, Cr4Pt right edge, (Pt) left edge]
export const solidReadings=[
 [1400,5.6,17.5,22.3,33.2],
 [1500,6.4,17.5,22.0,31.9],
 [1530,6.65,17.5,21.8,31.3],
] as const
export const eutectic={temperature:1530,liquid:28.1,left:21.8,right:31.3}
export const events=[
 {title:'Cr-rich eutectic',T:1571,x:13.8,before:'L',after:'(Cr) + Cr₄Pt',kind:'Eutectic'},
 {title:'Pt-side eutectic',T:1530,x:28.1,before:'L',after:'Cr₄Pt + (Pt)',kind:'Eutectic'},
 {title:'Cr₃Pt formation',T:970,x:33.3,before:'Cr₄Pt + (Pt)',after:'Cr₃Pt',kind:'Peritectoid · approximate T'},
 {title:'CrPt-side decomposition',T:570,x:41.5,before:'(Pt)',after:'Cr₃Pt + CrPt',kind:'Eutectoid · approximate T'},
 {title:'CrPt₃-side decomposition',T:550,x:58.5,before:'(Pt)',after:'CrPt + CrPt₃',kind:'Eutectoid · approximate T'},
]
export const congruent=[{x:0,T:1863,label:'Cr melting'},{x:19.1,T:1599,label:'Cr₄Pt melting'},{x:76.7,T:1784,label:'(Pt) melting maximum'},{x:96,T:1760,label:'(Pt) minimum · ≈'},{x:100,T:1769,label:'Pt melting'}]
// Overview [at% Pt, °C] outlines. Only solidReadings above supply numeric answers.
export const overview:number[][][]=[
 [[0,1863],[4,1790],[9,1670],[13.8,1571]],[[0,1863],[2,1740],[4,1640],[6.8,1571]],
 [[6.8,1571],[17.5,1571]],[[13.8,1571],[16,1590],[19.1,1599],[23,1578],[28.1,1530]],[[17.5,1571],[19.1,1599],[20.6,1580],[21.8,1530]],
 [[21.8,1530],[31.3,1530]],[[28.1,1530],[45,1660],[60,1750],[76.7,1784],[96,1760],[100,1769]],[[31.3,1530],[47,1650],[62,1750],[76.7,1784],[96,1760],[100,1769]],
 [[1,500],[5.6,1400],[6.8,1571]],[[18,500],[17.5,1400],[17.5,1571]],[[24.5,500],[23.5,970],[22.3,1400],[21.8,1530]],[[41.5,570],[35,970],[33.2,1400],[31.3,1530]],
 [[23.5,970],[35,970]],[[33.5,500],[33.3,970]],[[40,500],[40.5,570],[33.3,970]],
 [[40.5,570],[42.5,570]],[[41.5,500],[45,700],[50,780],[55,700],[58.5,500]],[[40.5,570],[44,715],[50,780],[56,680],[59,550]],
 [[57.5,550],[59,550]],[[58,500],[63,800],[68,1050],[73.3,1134],[77,1000],[79.5,500]],[[59,550],[64,850],[70,1100],[73.3,1134],[79,1000],[85.5,500]],
]
