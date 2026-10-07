import type {NumericParameters} from '../../framework/types'
import {solidReadings} from './boundaries'
import {thermalCases,thermalEnergy} from './thermal'
export const phaseNames=['(Cr)','Cr₄Pt','(Pt)','L']
export function endpoints(T:number){if(!Number.isFinite(T)||T<1400||T>1530)throw new Error('Outside digitized solid slice.');let i=T<=1500?0:1;const a=solidReadings[i],b=solidReadings[i+1],f=(T-a[0])/(b[0]-a[0]);return [1,2,3,4].map(k=>a[k]+f*(b[k]-a[k]))}
export function lever(c:number,a:number,b:number){if(![c,a,b].every(Number.isFinite)||!(b>a)||c<a||c>b)throw new Error('Composition must be inside a nonzero tie line.');const right=(c-a)/(b-a);return {left:1-right,right}}
export function equilibrium(T:number,c:number){if(!Number.isFinite(c)||c<0||c>35)throw new Error('Outside supported composition.');const [cr,cl,ch,pt]=endpoints(T)
 const single=(phase:number)=>({phaseA:phase,phaseB:phase,phases:1,left:c,right:c,fA:1,fB:0,fractionValid:1})
 const pair=(a:number,b:number,left:number,right:number)=>{const f=lever(c,left,right);return {phaseA:a,phaseB:b,phases:2,left,right,fA:f.left,fB:f.right,fractionValid:1}}
 // At the terminal compositions, conservation forces the other two amounts to zero.
 // In the open interval, liquid + both solids can coexist and amounts need an extra constraint.
 if(T===1530&&c>ch&&c<pt)return {phaseA:1,phaseB:2,phases:3,left:ch,right:pt,fA:0,fB:0,fractionValid:0}
 if(c<=cr)return single(0);if(c<cl)return pair(0,1,cr,cl);if(c<=ch)return single(1);if(c<pt)return pair(1,2,ch,pt);return single(2)
}
const [a,b,c,d]=endpoints(1400).map(x=>x/100)
const center=.2,k=100,mL=2*k*(b-center),mR=2*k*(c-center),centerCr=.08,centerPt=.30
const kCr=mL/(2*(a-centerCr)),kPt=mR/(2*(d-centerPt))
const gCompound=(x:number)=>k*(x-center)**2
const crOffset=gCompound(b)+mL*(a-b)-kCr*(a-centerCr)**2
const ptOffset=gCompound(c)+mR*(d-c)-kPt*(d-centerPt)**2
export const tangentContacts=[a,b,c,d]
export function gibbs(phase:number,x:number){return phase===0?kCr*(x-centerCr)**2+crOffset:phase===1?gCompound(x):kPt*(x-centerPt)**2+ptOffset}
export function gibbsSlope(phase:number,x:number){return phase===0?2*kCr*(x-centerCr):phase===1?2*k*(x-center):2*kPt*(x-centerPt)}
export function chemicalPotentials(phase:number,x:number){const g=gibbs(phase,x),slope=gibbsSlope(phase,x);return {Cr:g-x*slope,Pt:g+(1-x)*slope}}
export function envelope(x:number){if(x<a)return gibbs(0,x);if(x<b)return gibbs(0,a)+mL*(x-a);if(x<c)return gibbs(1,x);if(x<d)return gibbs(1,c)+mR*(x-c);return gibbs(2,x)}
// Smooth metastable liquid branch, deliberately above the solid envelope at 1400 °C.
export function liquidGibbs(x:number){return gCompound(c)+mR*(x-c)+200*(x-.281)**2+2}
export function sampleModel(p:NumericParameters,time:number){const progress=Math.min(1,Math.max(0,Number.isFinite(time)?time/12:0)),T=Math.round(p.view)===1?1400:p.temperature,eq=equilibrium(T,p.composition),event=thermalCases[Math.round(p.cooling)],coolingTemperature=event.T+60-120*progress,energy=thermalEnergy(Math.round(p.cooling),coolingTemperature);return {...eq,temperature:T,composition:p.composition,components:p.composition===0?1:2,freedom:(p.composition===0?2:3)-eq.phases,conservation:eq.fractionValid?eq.fA*eq.left+eq.fB*eq.right-p.composition:0,progress,coolingTemperature,invariantTemperature:event.T,reactantG:energy.reactant,productG:energy.product,gap:energy.gap,thermalStable:energy.stable,transitionPhases:event.phaseCount,transitionComponents:event.components,transitionFreedom:event.components-event.phaseCount+1}}
export const getPlayback=()=>({duration:12,loop:false,note:'Tie-line reveal or matched cooling/G–T marker. Conceptual 12-second demonstration, not a physical cooling rate. Gibbs energies are schematic.'})
