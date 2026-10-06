import { defineSimulation } from '../../framework/model'
import { sampleModel, getPlayback } from './calculation'
import { Scene } from './Scene'
import { Lesson } from './Lesson'
import { formulas } from './formulas'
import './styles.css'
const control=(key:string,label:string,min:number,max:number,step=.25,note?:string)=>({key,label,min,max,step,note})
export const crystalsModel=defineSimulation({id:'crystals',title:'Crystals & indices',eyebrow:'LAB A · EXAM QUESTION 1',description:'Count shared atoms. Turn geometry into signed indices.',interactionHint:'Choose a view, then rotate the cell. Negative indices have overbars.',
 defaults:{reference:0,structure:1,view:1,radius:1,yaw:0,sx:0,sy:0,sz:1,ex:.5,ey:0,ez:0,ix:.5,iy:1,iz:-1,planeCase:1,translate:0},
 controls:[control('reference','Example source: 0 exam · 1 verified lecture planes',0,1,1),control('structure','Structure: 0 SC · 1 BCC · 2 FCC',0,2,1),control('view','View: 0 atoms · 1 direction · 2 plane · 3 density',0,3,1),{...control('radius','Atomic radius',.1,3,.1),unit:'Å'},control('yaw','Cell rotation',-180,180,1),...['sx','sy','sz','ex','ey','ez'].map((key,i)=>control(key,`${i<3?'Start':'End'} ${'xyz'[i%3]} coordinate`,0,1,.25)),...['ix','iy','iz'].map((key,i)=>control(key,`${'xyz'[i]} plane intercept (0 = parallel)`,-2,2,.25,'Lattice units. Custom intercepts only; origin-crossing planes need translation.')),control('planeCase','Plane: 0 custom · 1 exam B · 2 exam C',0,2,1),control('translate','Translate exam B plane off origin',0,1,1)],
 sample:sampleModel,getPlayback,getReadouts:(_p,s)=>[{label:'Atoms / cell',value:s.atoms},{label:'Nearest neighbors',value:s.neighbors},{label:'Lattice parameter a',value:s.a,unit:'Å'},{label:'BCC (200) density',value:s.planarDensity,unit:'atoms/Å²'}],Scene,Lesson,formulas,
 guides:[{title:'Verified exam direction',text:'Exam p1 Q1d visibly has an overbar on 2: [1 0 −2]. OCR loses it.'},{title:'Figure reading',text:'A is SC, B is FCC, C is BCC. Unnumbered half-edge positions are inferred from the illustration. Exam B is (2 1 −1) under that reading; C is (0 1 1).'}]})
