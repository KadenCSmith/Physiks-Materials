import {norm,type V3} from './calculation'

const clamp=(value:number)=>Math.min(1,Math.max(0,Number.isFinite(value)?value:0))
export type AxisIntercept={axis:'x'|'y'|'z';kind:'finite'|'parallel'|'contained';value:number|null;point:V3|null;insideCell:boolean}

/** Coordinates are fractional lattice coordinates, independently of integerized hkl scale. */
export function axisIntercepts(normal:V3,level:number):AxisIntercept[]{
 return normal.map((coefficient,i)=>{
  const axis=['x','y','z'][i] as AxisIntercept['axis']
  if(coefficient===0)return {axis,kind:level===0?'contained':'parallel',value:null,point:null,insideCell:false}
  const value=level/coefficient,point:[number,number,number]=[0,0,0];point[i]=value
  return {axis,kind:'finite',value,point,insideCell:value>=0&&value<=1}
 })
}

/** Conceptual construction follows the model's 12-second window, without frame or history state. */
export function planeStage(progress:number,vertexCount:number){
 const p=clamp(progress)
 return {
  progress:p,
  axisReveal:[0,.08,.16].map(start=>clamp((p-start)/.07)),
  vertexReveal:Array.from({length:vertexCount},(_,i)=>clamp((p-(.25+.2*i/Math.max(1,vertexCount-1)))/.07)),
  edgeProgress:clamp((p-.38)/.44),
  fillOpacity:.2*clamp((p-.82)/.18),
  label:p<.24?'1 · Locate axis intercepts':p<.52?'2 · Label the clipped vertices':p<.82?'3 · Trace the plane boundary':'4 · Fill the plane',
 }
}

/** Trace by true 3D perimeter length, so a partial edge has the correct spatial endpoint. */
export function tracedEdges(polygon:V3[],progress:number):{start:V3;end:V3}[]{
 if(polygon.length<3)return []
 const lengths=polygon.map((point,i)=>norm(polygon[(i+1)%polygon.length].map((value,k)=>value-point[k]) as V3))
 let remaining=lengths.reduce((sum,length)=>sum+length,0)*clamp(progress)
 const segments:{start:V3;end:V3}[]=[]
 polygon.forEach((start,i)=>{
  const length=lengths[i],end=polygon[(i+1)%polygon.length]
  if(remaining>0&&length>0){const fraction=Math.min(1,remaining/length);segments.push({start,end:start.map((value,k)=>value+fraction*(end[k]-value)) as V3})}
  remaining-=length
 })
 return segments
}

/** Ellipses preserve missing terms; a partially revealed expression never asserts a different plane. */
export function planeEquation(indices:V3,level:number,revealedAxes:number[]= [1,1,1],format:(value:number)=>string=String){
 const terms=indices.map((coefficient,i)=>({coefficient,axis:['x','y','z'][i],revealed:revealedAxes[i]>=.5})).filter(term=>term.coefficient!==0)
 const left=terms.map((term,i)=>{
  const sign=term.coefficient<0?(i===0?'−':' − '):i===0?'':' + '
  return sign+(term.revealed?(Math.abs(term.coefficient)===1?'':format(Math.abs(term.coefficient)))+term.axis:'⋯')
 }).join('')||'0'
 return left+' = '+format(level)
}
