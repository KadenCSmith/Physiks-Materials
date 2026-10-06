import type { NumericParameters } from '../../framework/types'
export type V3 = [number,number,number]
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a)
function fraction(x:number):[number,number] {for(let d=1;d<=64;d++){const a=Math.round(x*d);if(Math.abs(a/d-x)<1e-8)return [a,d]}throw new Error('Use rational coordinates with denominator at most 64.')}
export function integerIndices(values: V3, reduce=true):V3 {
 const fs=values.map(fraction);const l=fs.reduce((a,[,d])=>a*d/gcd(a,d),1)
 const ns=fs.map(([a,d])=>a*l/d);const g=reduce?ns.reduce((a,b)=>gcd(a,b),0)||1:1
 return ns.map(x=>x/g) as V3
}
export function direction(start:V3,end:V3) {return integerIndices(end.map((v,i)=>v-start[i]) as V3)}
export function miller(intercepts:V3) {return integerIndices(intercepts.map(v=>v===0?0:1/v) as V3,false)}
export function indexText(v:V3,plane=false) {return (plane?'(':'[')+v.map(x=>x<0?`${-x}\u0305`:String(x)).join(' ')+(plane?')':']')}
export function indexAnswer(a:string,v:V3) {const t=a.replace(/(\d)\u0305/g,'-$1').replace(/[[\]()]/g,'').trim();let ns=t.split(/[ ,]+/).map(Number);if(ns.length===1&&/^-?\d-?\d-?\d$/.test(t))ns=(t.match(/-?\d/g)||[]).map(Number);return ns.length===3&&ns.every((x,i)=>x===v[i])}
export const structures=[{name:'SC',atoms:1,nn:6,factor:2,count:'8 × 1/8 = 1',dense:'⟨100⟩ touching chains; {100} densest. No close-packed plane.'},{name:'BCC',atoms:2,nn:8,factor:4/Math.sqrt(3),count:'8 × 1/8 + 1 = 2',dense:'⟨111⟩ touching chains; {110} densest. BCC is not close packed.'},{name:'FCC',atoms:4,nn:12,factor:2*Math.sqrt(2),count:'8 × 1/8 + 6 × 1/2 = 4',dense:'⟨110⟩ close-packed directions; {111} close-packed planes.'}]
export const examArrows:{name:string;start:V3;end:V3}[]=[
 {name:'A · upper arrow',start:[0,1,1],end:[1,.5,1]},
 {name:'A · left arrow',start:[1,0,1],end:[1,.5,0]},
 {name:'A · right arrow',start:[0,1,0],end:[1,1,1]},
 {name:'A · lower arrow',start:[.5,1,0],end:[0,0,0]},
 {name:'D · exam [1 0 −2]',start:[0,0,1],end:[.5,0,0]},
]
export function getDirection(p:NumericParameters) {return direction([p.sx,p.sy,p.sz],[p.ex,p.ey,p.ez])}
export function planeData(p:NumericParameters) {
 const c=Math.round(p.planeCase)
 if(c===1)return {normal:[2,1,-1] as V3,level:p.translate>=.5?1:0,indices:[2,1,-1] as V3}
 if(c===2)return {normal:[0,1,1] as V3,level:1,indices:[0,1,1] as V3}
 const normal=[p.ix,p.iy,p.iz].map(v=>v===0?0:1/v) as V3
 return {normal,level:1,indices:miller([p.ix,p.iy,p.iz])}
}
export const corners:V3[]=Array.from({length:8},(_,i)=>[i&1,(i>>1)&1,(i>>2)&1])
export const edges=corners.flatMap((v,i)=>corners.flatMap((w,j)=>j>i&&v.reduce((s,x,k)=>s+Math.abs(x-w[k]),0)===1?[[v,w]]:[]))
export function planePolygon(normal:V3,level:number):V3[] {
 const pts:V3[]=[];const dot=(v:V3)=>v.reduce((s,x,i)=>s+x*normal[i],0)
 for(const [a,b] of edges){const da=dot(a)-level,db=dot(b)-level;for(const [v,d] of [[a,da],[b,db]] as [V3,number][]){if(Math.abs(d)<1e-8&&!pts.some(p=>p.every((x,i)=>Math.abs(x-v[i])<1e-8)))pts.push(v)}if(da*db<0){const f=da/(da-db);const v=a.map((x,i)=>x+f*(b[i]-x)) as V3;if(!pts.some(p=>p.every((x,i)=>Math.abs(x-v[i])<1e-8)))pts.push(v)}}
 if(pts.length<3)return []
 const center=pts[0].map((_,i)=>pts.reduce((s,v)=>s+v[i],0)/pts.length) as V3
 const axis=normal.findIndex(x=>Math.abs(x)>1e-8),other=[0,1,2].filter(i=>i!==axis)
 return pts.sort((a,b)=>Math.atan2(a[other[1]]-center[other[1]],a[other[0]]-center[other[0]])-Math.atan2(b[other[1]]-center[other[1]],b[other[0]]-center[other[0]]))
}
export function sampleModel(p:NumericParameters,time:number) {
 const st=structures[Math.round(p.view)===3?1:Math.round(p.structure)];let v:V3=[0,0,0],h:V3=[0,0,0],validDirection=1,validPlane=1
 try{v=getDirection(p);if(v.every(x=>x===0))validDirection=0}catch{validDirection=0}
 try{h=planeData(p).indices;if(h.every(x=>x===0))validPlane=0}catch{validPlane=0}
 return {progress:Math.min(1,Math.max(0,Number.isFinite(time)?time/getPlayback(p).duration:0)),atoms:st.atoms,neighbors:st.nn,aOverR:st.factor,a:st.factor*p.radius,planarDensity:3/(16*p.radius**2),u:v[0],v:v[1],w:v[2],h:h[0],k:h[1],l:h[2],validDirection,validPlane}
}
export const getPlayback=(p:NumericParameters)=>({duration:Math.round(p.view)===1?6:12,loop:false,note:Math.round(p.view)===1?'A 6-second direction reveal (2× faster); no physical time or automatic loop. Drag the cell or use the rotation slider.':'A 12-second construction reveal; no physical time or automatic loop. Drag the cell or use the rotation slider.'})
