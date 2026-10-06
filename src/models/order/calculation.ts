import type {NumericParameters} from '../../framework/types'
export const firstDistance=2.78
export const bccA=2*firstDistance/Math.sqrt(3)
export const shells=[{r:firstDistance,count:8},{r:bccA,count:6},{r:Math.sqrt(2)*bccA,count:12},{r:Math.sqrt(11)*bccA/2,count:24},{r:Math.sqrt(3)*bccA,count:8},{r:2*bccA,count:6}]
const sigma=.025
const gaussian=(r:number,center:number,width:number)=>Math.exp(-.5*((r-center)/width)**2)/(Math.sqrt(2*Math.PI)*width)
// Abramowitz-Stegun erf approximation, maximum error ~1.5e-7.
export function erf(x:number){const sign=x<0?-1:1,a=Math.abs(x),t=1/(1+.3275911*a);return sign*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-a*a))}
function gaussianIntegral(r:number,c:number,w:number){return .5*(erf((r-c)/(Math.SQRT2*w))-erf(-c/(Math.SQRT2*w)))}
export function radialCount(mode:number,r:number,density:number){if(r<=0)return 0;if(mode===0)return shells.reduce((s,v)=>s+v.count*gaussian(r,v.r,sigma),0);if(mode===2)return 4*Math.PI*density*r*r;return 2*gaussian(r,1.5,.09)+.3*shells.reduce((s,v)=>s+v.count*gaussian(r,v.r,.15),0)+4*Math.PI*density*r*r*(r>2?1:0)}
export function rdf(mode:number,r:number,density:number){return r>0?radialCount(mode,r,density)/(4*Math.PI*density*r*r):0}
export function coordination(mode:number,r:number,density:number){const R=Math.max(0,r);if(mode===0)return shells.reduce((s,v)=>s+v.count*gaussianIntegral(R,v.r,sigma),0);if(mode===2)return 4*Math.PI*density*R**3/3;return 2*gaussianIntegral(R,1.5,.09)+.3*shells.reduce((s,v)=>s+v.count*gaussianIntegral(R,v.r,.15),0)+4*Math.PI*density*Math.max(0,R**3-8)/3}
export type Particle=[number,number,number]
export const crystalParticles:Particle[]=Array.from({length:27},(_,i)=>[i%3-1,Math.floor(i/3)%3-1,Math.floor(i/9)-1] as Particle).flatMap(v=>[v.map(x=>x*bccA) as Particle,v.map(x=>(x+.5)*bccA) as Particle]).filter(v=>Math.hypot(...v)<=6.6&&Math.hypot(...v)>0)
export const gasParticles:Particle[]=(()=>{let seed=330;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};return Array.from({length:35},()=>[10*(rand()-.5),10*(rand()-.5),10*(rand()-.5)] as Particle)})()
export const polymerParticles:Particle[]=Array.from({length:12},(_,i)=>{const k=i<6?i+1:-(i-5);return [k*1.2,Math.abs(k)%2*.9,0]})
export function sampleModel(p:NumericParameters,time:number){const progress=Math.min(1,Math.max(0,Number.isFinite(time)?time/12:0)),r=p.shellRadius*progress,mode=Math.round(p.material);return {progress,shell:r,coordination:coordination(mode,r,p.density),g:rdf(mode,r,p.density),a:bccA,burgers:p.spacing,lineDot:Math.round(p.dislocation)===0?-p.spacing:0,firstDistance}}
export function circuit(dislocation:number,a:number):Particle[]{return dislocation===0?[[0,0,0],[0,4*a,0],[a/4,4*a,4*a],[a/2,0,4*a],[a,0,0]]:[[0,0,0],[4*a,0,0],[4*a,4*a,0],[0,4*a,0],[a,0,0]]}
export const getPlayback=()=>({duration:12,loop:false,note:'The shell expands and the Burgers circuit is traced once. Progress is conceptual, not elapsed diffusion time.'})
