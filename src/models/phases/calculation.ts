import type {NumericParameters} from '../../framework/types'
import {solidReadings,events} from './boundaries'
export const phaseNames=['(Cr)','Cr₄Pt','(Pt)','L']
export function endpoints(T:number){if(T<1400||T>1530)throw new Error('Outside digitized solid slice.');let i=T<=1500?0:1;const a=solidReadings[i],b=solidReadings[i+1],f=(T-a[0])/(b[0]-a[0]);return [1,2,3,4].map(k=>a[k]+f*(b[k]-a[k]))}
export function lever(c:number,a:number,b:number){if(!(b>a)||c<a||c>b)throw new Error('Composition must be inside a nonzero tie line.');const right=(c-a)/(b-a);return {left:1-right,right}}
export function equilibrium(T:number,c:number){if(c<0||c>35)throw new Error('Outside supported composition.');const [cr,cl,ch,pt]=endpoints(T)
 const single=(phase:number)=>({phaseA:phase,phaseB:phase,phases:1,left:c,right:c,fA:1,fB:0,fractionValid:1})
 const pair=(a:number,b:number,left:number,right:number)=>{const f=lever(c,left,right);return {phaseA:a,phaseB:b,phases:2,left,right,fA:f.left,fB:f.right,fractionValid:1}}
 if(T===1530&&c>=21.8&&c<=31.3)return {phaseA:1,phaseB:2,phases:3,left:21.8,right:31.3,fA:0,fB:0,fractionValid:0}
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
export function sampleModel(p:NumericParameters,time:number){const progress=Math.min(1,Math.max(0,Number.isFinite(time)?time/12:0)),T=Math.round(p.view)===1?1400:p.temperature,eq=equilibrium(T,p.composition),event=events[Math.round(p.cooling)];return {...eq,temperature:T,composition:p.composition,freedom:3-eq.phases,conservation:eq.fractionValid?eq.fA*eq.left+eq.fB*eq.right-p.composition:0,progress,coolingTemperature:event.T+60-120*progress,invariantTemperature:event.T}}
export const getPlayback=()=>({duration:12,loop:false,note:'Tie-line reveal or conceptual cooling across the selected reaction. No thermal rate or numerical Gibbs data are claimed.'})
