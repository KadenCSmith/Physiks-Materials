import { defineSimulation } from '../../framework/model'
import {sampleModel,getPlayback,reactions} from './calculation'
import {Scene} from './Scene'
import {Lesson} from './Lesson'
import {formulas} from './formulas'
import {getSnapshotNotes} from './snapshot'
import './styles.css'
export const defectsModel=defineSimulation({id:'defects',title:'Kröger–Vink defects',eyebrow:'LAB B · EXAM QUESTION 2',description:'Separate the atom, its site, and its effective charge.',interactionHint:'Pick a reaction or construct a notation symbol. All balances include reservoirs.',defaults:{reference:0,reaction:1,species:2,site:0,charge:-1,temperature:1000,energyMode:0},controls:[
 {key:'reference',label:'Example source',group:'Example',min:0,max:1,step:1,visibleWhen:()=>false,options:[{value:0,label:'Practice exam'},{value:1,label:'Lecture · Ta substitution'}]},
 {key:'reaction',label:'Balanced reaction',group:'Reaction',min:0,max:6,step:1,options:reactions.map((reaction,value)=>({value,label:reaction.title})),note:'Atom, site and effective-charge balances include the reservoirs shown.'},
 {key:'species',label:'Species',group:'Build notation',min:0,max:3,step:1,options:[{value:0,label:'Platinum · Pt'},{value:1,label:'Oxygen · O'},{value:2,label:'Tantalum · Ta'},{value:3,label:'Vacancy · V'}]},
 {key:'site',label:'Site',group:'Build notation',min:0,max:2,step:1,options:[{value:0,label:'Platinum site · Pt'},{value:1,label:'Oxygen site · O'},{value:2,label:'Interstitial site · i'}]},
 {key:'charge',label:'Your proposed effective charge',group:'Build notation',min:-8,max:8,step:1,options:Array.from({length:17},(_,i)=>{const value=i-8;return {value,label:`${value>0?'+':''}${value} · ${value===0?'×':value>0?'•'.repeat(value):'′'.repeat(-value)}`}}),note:'Choose a whole charge. Each dot or prime represents one unit. Compare species valence minus the normal site occupant’s valence; this exercise is separate from the selected reaction.'},
 {key:'temperature',label:'Absolute temperature',group:'Energy comparison',unit:'K',min:300,max:2000,step:10},
 {key:'energyMode',label:'Energy interpretation',group:'Energy comparison',min:0,max:1,step:1,options:[{value:0,label:'Activation energies · kinetic weights'},{value:1,label:'Assume formation energies · equilibrium'}],note:'The exam calls these activation energies. Formation-energy estimates require an additional assumption.'}
 ],sample:sampleModel,getPlayback,getSnapshotNotes,getReadouts:(_p,s)=>[{label:'Host Pt valence',value:s.hostValence},{label:'Expected effective charge',value:s.effectiveCharge},{label:'Mass residual',value:s.massResidual},{label:'Charge residual',value:s.chargeResidual}],Scene,Lesson,formulas,guides:[{title:'Formal ionic exercise',text:'PtO3 is treated as Pt6+ / O2− and Ta2O5 as Ta5+. This is the exam’s formal host model, not a claim about stable bulk PtO3.'},{title:'Activation versus formation',text:'Kinetic barriers alone cannot yield equilibrium populations. Conditional formation constants and defect stoichiometry are explicitly separated.'}]})
