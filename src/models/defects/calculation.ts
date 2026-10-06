import type { NumericParameters } from '../../framework/types'
export const KB=8.617333262145e-5
export const species=['Pt','O','Ta','V'];export const sites=['Pt','O','i']
const absolute=[6,-2,5,0],reference=[6,-2,0]
export function effectiveCharge(speciesId:number,siteId:number){return absolute[speciesId]-reference[siteId]}
export function kv(speciesId:number,siteId:number,charge:number){return `${species[speciesId]}${sites[siteId]==='i'?'ᵢ':sites[siteId]==='Pt'?'₍Pt₎':'₍O₎'}${charge===0?'ˣ':charge>0?'•'.repeat(charge):'′'.repeat(-charge)}`}
/** True subscript/superscript notation; each dot or prime is one effective charge unit. */
export function kvTex(speciesId:number,siteId:number,charge:number){const superscript=charge===0?'\\times':charge>0?'\\bullet'.repeat(charge):'\\prime'.repeat(-charge);return `\\mathrm{${species[speciesId]}}_{\\mathrm{${sites[siteId]}}}^{${superscript}}`}
export type Term={name:string;atoms:Record<string,number>;sites:Record<string,number>;charge:number;coefficient:number}
function term(name:string,atoms:Record<string,number>,sites:Record<string,number>,charge=0,coefficient=1):Term{return {name,atoms,sites,charge,coefficient}}
const pt=()=>term('Pt_Ptˣ',{Pt:1},{Pt:1}),o=()=>term('O_Oˣ',{O:1},{O:1}),empty=(coefficient=1)=>term('V_iˣ',{}, {i:1},0,coefficient)
const vp=(coefficient=1)=>term('V_Pt′′′′′′',{}, {Pt:1},-6,coefficient),vo=(coefficient=1)=>term('V_O••',{}, {O:1},2,coefficient)
const reservoir=(coefficient=1)=>term('PtO₃(surface / reservoir)',{Pt:1,O:3},{},0,coefficient)
const dopant=(coefficient=1)=>term('Ta₂O₅',{Ta:2,O:5},{},0,coefficient)
export const reactions=[
 {title:'Anion Frenkel',tex:String.raw`\mathrm{O}_{\mathrm{O}}^\times+\mathrm{V}_i^\times\rightleftharpoons \mathrm{V}_{\mathrm{O}}^{\bullet\bullet}+\mathrm{O}_i^{\prime\prime}`,left:[o(),empty()],right:[vo(),term('O_i′′',{O:1},{i:1},-2)]},
 {title:'Cation Frenkel',tex:String.raw`\mathrm{Pt}_{\mathrm{Pt}}^\times+\mathrm{V}_i^\times\rightleftharpoons \mathrm{V}_{\mathrm{Pt}}^{\prime\prime\prime\prime\prime\prime}+\mathrm{Pt}_i^{\bullet\bullet\bullet\bullet\bullet\bullet}`,left:[pt(),empty()],right:[vp(),term('Pt_i••••••',{Pt:1},{i:1},6)]},
 {title:'Schottky cluster',tex:String.raw`\mathrm{Pt}_{\mathrm{Pt}}^\times+3\mathrm{O}_{\mathrm{O}}^\times\rightleftharpoons \mathrm{V}_{\mathrm{Pt}}^{\prime\prime\prime\prime\prime\prime}+3\mathrm{V}_{\mathrm{O}}^{\bullet\bullet}+\mathrm{PtO}_3(\mathrm{s})`,left:[pt(),{...o(),coefficient:3}],right:[vp(),vo(3),reservoir()]},
 {title:'Ta substitution · oxygen vacancy',tex:String.raw`\mathrm{Ta}_2\mathrm{O}_5+2\mathrm{Pt}_{\mathrm{Pt}}^\times+\mathrm{O}_{\mathrm{O}}^\times\rightarrow 2\mathrm{Ta}_{\mathrm{Pt}}^{\prime}+\mathrm{V}_{\mathrm{O}}^{\bullet\bullet}+2\mathrm{PtO}_3(\mathrm{s})`,left:[dopant(),{...pt(),coefficient:2},o()],right:[term('Ta_Pt′',{Ta:1},{Pt:1},-1,2),vo(),reservoir(2)]},
 {title:'Ta substitution · holes',tex:String.raw`\mathrm{Ta}_2\mathrm{O}_5+2\mathrm{Pt}_{\mathrm{Pt}}^\times+\tfrac12\mathrm{O}_2(\mathrm{g})\rightarrow 2\mathrm{Ta}_{\mathrm{Pt}}^{\prime}+2h^{\bullet}+2\mathrm{PtO}_3(\mathrm{s})`,left:[dopant(),{...pt(),coefficient:2},term('O₂(g)',{O:2},{},0,.5)],right:[term('Ta_Pt′',{Ta:1},{Pt:1},-1,2),term('h•',{},{},1,2),reservoir(2)]},
 {title:'Ta interstitial · oxygen interstitials',tex:String.raw`\mathrm{Ta}_2\mathrm{O}_5+7\mathrm{V}_i^\times\rightarrow 2\mathrm{Ta}_i^{\bullet\bullet\bullet\bullet\bullet}+5\mathrm{O}_i^{\prime\prime}`,left:[dopant(),empty(7)],right:[term('Ta_i•••••',{Ta:1},{i:1},5,2),term('O_i′′',{O:1},{i:1},-2,5)]},
 {title:'Ta interstitial · Pt vacancies',tex:String.raw`3\mathrm{Ta}_2\mathrm{O}_5+5\mathrm{Pt}_{\mathrm{Pt}}^\times+6\mathrm{V}_i^\times\rightarrow 6\mathrm{Ta}_i^{\bullet\bullet\bullet\bullet\bullet}+5\mathrm{V}_{\mathrm{Pt}}^{\prime\prime\prime\prime\prime\prime}+5\mathrm{PtO}_3(\mathrm{s})`,left:[dopant(3),{...pt(),coefficient:5},empty(6)],right:[term('Ta_i•••••',{Ta:1},{i:1},5,6),vp(5),reservoir(5)]},
]
export function balance(reaction:typeof reactions[number]){
 const delta=(kind:'atoms'|'sites',key:string)=>reaction.right.reduce((s,t)=>s+(t[kind][key]||0)*t.coefficient,0)-reaction.left.reduce((s,t)=>s+(t[kind][key]||0)*t.coefficient,0)
 return {Pt:delta('atoms','Pt'),O:delta('atoms','O'),Ta:delta('atoms','Ta'),PtSites:delta('sites','Pt'),OSites:delta('sites','O'),iSites:delta('sites','i'),charge:reaction.right.reduce((s,t)=>s+t.charge*t.coefficient,0)-reaction.left.reduce((s,t)=>s+t.charge*t.coefficient,0)}
}
export function energyComparison(temperature:number,formation:boolean){const energies=[.1,2.3,4],counts=formation?[2,2,4]:[1,1,1];return energies.map((e,i)=>({energy:e,logK:-e/(KB*temperature*Math.LN10),logFraction:-e/(counts[i]*KB*temperature*Math.LN10),fraction:Math.exp(-e/(counts[i]*KB*temperature))}))}
export function sampleModel(p:NumericParameters,time:number){const progress=Math.min(1,Math.max(0,Number.isFinite(time)?time/12:0)),r=reactions[Math.round(p.reaction)],b=balance(r),e=energyComparison(p.temperature,p.energyMode>=.5),expected=effectiveCharge(Math.round(p.species),Math.round(p.site));return {progress,temperature:p.temperature,hostValence:6,effectiveCharge:expected,chargeValid:Number(Number.isInteger(p.charge)&&p.charge===expected),massResidual:Math.abs(b.Pt)+Math.abs(b.O)+Math.abs(b.Ta),siteResidual:Math.abs(b.PtSites)+Math.abs(b.OSites)+Math.abs(b.iSites),chargeResidual:b.charge,anionLog:e[0].logFraction,cationLog:e[1].logFraction,schottkyLog:e[2].logFraction,anionEstimate:e[0].fraction}}
export const getPlayback=()=>({duration:12,loop:false,note:'Conceptual defect displacement and incorporation. No migration rate is inferred from the given energies.'})
