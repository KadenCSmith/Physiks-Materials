import { defineSimulation } from '../../framework/model'
import {sampleModel,getPlayback} from './calculation'
import {Scene} from './Scene'
import {Lesson} from './Lesson'
import {formulas} from './formulas'
import './styles.css'
export const defectsModel=defineSimulation({id:'defects',title:'Kröger–Vink defects',eyebrow:'LAB B · EXAM QUESTION 2',description:'Separate the atom, its site, and its effective charge.',interactionHint:'Pick a reaction or construct a notation symbol. All balances include reservoirs.',defaults:{reference:0,reaction:1,species:2,site:0,charge:-1,temperature:1000,energyMode:0},controls:[{key:'reference',label:'Example source: 0 exam · 1 verified lecture substitution',min:0,max:1,step:1},
 {key:'reaction',label:'Reaction: 0–2 intrinsic · 3–6 Ta incorporation',min:0,max:6,step:1},
 {key:'species',label:'Species: 0 Pt · 1 O · 2 Ta · 3 vacancy',min:0,max:3,step:1},{key:'site',label:'Site: 0 Pt · 1 O · 2 interstitial',min:0,max:2,step:1},{key:'charge',label:'Proposed effective charge',min:-8,max:8,step:1},
 {key:'temperature',label:'Absolute temperature',unit:'K',min:300,max:2000,step:10}, {key:'energyMode',label:'Energy interpretation: 0 kinetic · 1 conditional formation',min:0,max:1,step:1,note:'Exam calls them activation energies; formation energies require an additional assumption.'}],sample:sampleModel,getPlayback,getReadouts:(_p,s)=>[{label:'Host Pt valence',value:s.hostValence},{label:'Expected effective charge',value:s.effectiveCharge},{label:'Mass residual',value:s.massResidual},{label:'Charge residual',value:s.chargeResidual}],Scene,Lesson,formulas,guides:[{title:'Formal ionic exercise',text:'PtO3 is treated as Pt6+ / O2− and Ta2O5 as Ta5+. This is the exam’s formal host model, not a claim about stable bulk PtO3.'},{title:'Activation versus formation',text:'Kinetic barriers alone cannot yield equilibrium populations. Conditional formation constants and defect stoichiometry are explicitly separated.'}]})
