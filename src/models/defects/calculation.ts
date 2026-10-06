import type { NumericParameters } from '../../framework/types'
export const KB=8.617333262145e-5
export const species=['Pt','O','Ta','V'];export const sites=['Pt','O','i']
const absolute=[6,-2,5,0],reference=[6,-2,0]
export function effectiveCharge(speciesId:number,siteId:number){return absolute[speciesId]-reference[siteId]}
export function kv(speciesId:number,siteId:number,charge:number){return `${species[speciesId]}${sites[siteId]==='i'?'ᵢ':sites[siteId]==='Pt'?'₍Pt₎':'₍O₎'}${charge===0?'ˣ':charge>0?'•'.repeat(charge):'′'.repeat(-charge)}`}
export type Term={name:string;atoms:Record<string,number>;sites:Record<string,number>;charge:number;coefficient:number}
function term(name:string,atoms:Record<string,number>,sites:Record<string,number>,charge=0,coefficient=1):Term{return {name,atoms,sites,charge,coefficient}}
const pt=()=>term('Pt_Ptˣ',{Pt:1},{Pt:1}),o=()=>term('O_Oˣ',{O:1},{O:1}),empty=(coefficient=1)=>term('V_iˣ',{}, {i:1},0,coefficient)
const vp=(coefficient=1)=>term('V_Pt⁶′',{}, {Pt:1},-6,coefficient),vo=(coefficient=1)=>term('V_O••',{}, {O:1},2,coefficient)
const reservoir=(coefficient=1)=>term('PtO₃(surface / reservoir)',{Pt:1,O:3},{},0,coefficient)
const dopant=(coefficient=1)=>term('Ta₂O₅',{Ta:2,O:5},{},0,coefficient)
export const reactions=[
 {title:'Anion Frenkel',tex:String.raw`O_O^\times+V_i^\times\rightleftharpoons V_O^{\bullet\bullet}+O_i^{\prime\prime}`,left:[o(),empty()],right:[vo(),term('O_i′′',{O:1},{i:1},-2)]},
 {title:'Cation Frenkel',tex:String.raw`Pt_{Pt}^\times+V_i^\times\rightleftharpoons V_{Pt}^{6\prime}+Pt_i^{6\bullet}`,left:[pt(),empty()],right:[vp(),term('Pt_i⁶•',{Pt:1},{i:1},6)]},
 {title:'Schottky cluster',tex:String.raw`Pt_{Pt}^\times+3O_O^\times\rightleftharpoons V_{Pt}^{6\prime}+3V_O^{\bullet\bullet}+PtO_3(s)`,left:[pt(),{...o(),coefficient:3}],right:[vp(),vo(3),reservoir()]},
 {title:'Ta substitution · oxygen vacancy',tex:String.raw`Ta_2O_5+2Pt_{Pt}^\times+O_O^\times\rightarrow 2Ta_{Pt}^{\prime}+V_O^{\bullet\bullet}+2PtO_3(s)`,left:[dopant(),{...pt(),coefficient:2},o()],right:[term('Ta_Pt′',{Ta:1},{Pt:1},-1,2),vo(),reservoir(2)]},
 {title:'Ta substitution · holes',tex:String.raw`Ta_2O_5+2Pt_{Pt}^\times+\tfrac12O_2(g)\rightarrow 2Ta_{Pt}^{\prime}+2h^{\bullet}+2PtO_3(s)`,left:[dopant(),{...pt(),coefficient:2},term('O₂(g)',{O:2},{},0,.5)],right:[term('Ta_Pt′',{Ta:1},{Pt:1},-1,2),term('h•',{},{},1,2),reservoir(2)]},
 {title:'Ta interstitial · oxygen interstitials',tex:String.raw`Ta_2O_5+7V_i^\times\rightarrow 2Ta_i^{5\bullet}+5O_i^{\prime\prime}`,left:[dopant(),empty(7)],right:[term('Ta_i⁵•',{Ta:1},{i:1},5,2),term('O_i′′',{O:1},{i:1},-2,5)]},
 {title:'Ta interstitial · Pt vacancies',tex:String.raw`3Ta_2O_5+5Pt_{Pt}^\times+6V_i^\times\rightarrow 6Ta_i^{5\bullet}+5V_{Pt}^{6\prime}+5PtO_3(s)`,left:[dopant(3),{...pt(),coefficient:5},empty(6)],right:[term('Ta_i⁵•',{Ta:1},{i:1},5,6),vp(5),reservoir(5)]},
]
export function balance(reaction:typeof reactions[number]){
 const delta=(kind:'atoms'|'sites',key:string)=>reaction.right.reduce((s,t)=>s+(t[kind][key]||0)*t.coefficient,0)-reaction.left.reduce((s,t)=>s+(t[kind][key]||0)*t.coefficient,0)
 return {Pt:delta('atoms','Pt'),O:delta('atoms','O'),Ta:delta('atoms','Ta'),PtSites:delta('sites','Pt'),OSites:delta('sites','O'),iSites:delta('sites','i'),charge:reaction.right.reduce((s,t)=>s+t.charge*t.coefficient,0)-reaction.left.reduce((s,t)=>s+t.charge*t.coefficient,0)}
}
export function energyComparison(temperature:number,formation:boolean){const energies=[.1,2.3,4],counts=formation?[2,2,4]:[1,1,1];return energies.map((e,i)=>({energy:e,logK:-e/(KB*temperature*Math.LN10),logFraction:-e/(counts[i]*KB*temperature*Math.LN10),fraction:Math.exp(-e/(counts[i]*KB*temperature))}))}
export function sampleModel(p:NumericParameters,time:number){const progress=Math.min(1,Math.max(0,Number.isFinite(time)?time/12:0)),r=reactions[Math.round(p.reaction)],b=balance(r),e=energyComparison(p.temperature,p.energyMode>=.5),expected=effectiveCharge(Math.round(p.species),Math.round(p.site));return {progress,temperature:p.temperature,hostValence:6,effectiveCharge:expected,chargeValid:Number(Math.round(p.charge)===expected),massResidual:Math.abs(b.Pt)+Math.abs(b.O)+Math.abs(b.Ta),siteResidual:Math.abs(b.PtSites)+Math.abs(b.OSites)+Math.abs(b.iSites),chargeResidual:b.charge,anionLog:e[0].logFraction,cationLog:e[1].logFraction,schottkyLog:e[2].logFraction,anionEstimate:e[0].fraction}}
export const getPlayback=()=>({duration:12,loop:false,note:'Conceptual defect displacement and incorporation. No migration rate is inferred from the given energies.'})
