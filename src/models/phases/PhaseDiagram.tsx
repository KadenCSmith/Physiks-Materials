import {useNumberFormat} from '../../framework/formatting'
import {congruent,events,overview} from './boundaries'

export function PhaseDiagram({temperature,composition,labels=true,title='Exam phase diagram · schematic boundary outlines'}:{temperature?:number;composition?:number;labels?:boolean;title?:string}){
 const {format:n}=useNumberFormat(),x=(c:number)=>65+650*c/100,y=(T:number)=>350-(T-400)/1600*280
 return <svg className="materials-scene" viewBox="0 0 760 430" role="img" aria-label={title}>
  <path d="M65 70 V350 H715" stroke="#758393" fill="none"/>
  {[500,1000,1500,2000].map(T=><g key={T}><line x1="65" x2="715" y1={y(T)} y2={y(T)} stroke="#242c36"/>{labels&&<text x="57" y={y(T)+5} textAnchor="end">{n(T)}</text>}</g>)}
  {[0,20,40,60,80,100].map(c=><g key={c}><line x1={x(c)} x2={x(c)} y1="350" y2="355" stroke="#758393"/>{labels&&<text x={x(c)} y="377" textAnchor="middle">{n(c)}</text>}</g>)}
  {overview.map((line,i)=><polyline key={i} points={line.map(([c,T])=>`${x(c)},${y(T)}`).join(' ')} stroke="#667386" fill="none" strokeWidth="1.6"/>)}
  {events.map((e,i)=><circle key={`e${i}`} cx={x(e.x)} cy={y(e.T)} r="4" fill="#e2bc82"/>)}
  {congruent.map((e,i)=><circle key={`m${i}`} cx={x(e.x)} cy={y(e.T)} r="4" fill="#9db8e8"/>)}
  {temperature!==undefined&&<line x1="65" x2="715" y1={y(temperature)} y2={y(temperature)} stroke="#91cbb5" strokeWidth="2" strokeDasharray="5 4"/>}
  {temperature!==undefined&&composition!==undefined&&<circle cx={x(composition)} cy={y(temperature)} r="6" fill="#fff" stroke="#050505" strokeWidth="2"/>}
  {labels&&<>
   <text x="65" y="30">{temperature===undefined?'Question 4a · melting points and invariant reactions':`${n(temperature)} °C · c₀ = ${n(composition??10)} at% Pt`}</text>
   <text x="65" y="52">Temperature °C · gold = invariant · blue = congruent melting</text>
   <text x="258" y="98">L</text><text x="83" y="174">(Cr)</text><text x="185" y="276">Cr₄Pt</text><text x="270" y="327">Cr₃Pt*</text><text x="372" y="331">CrPt</text><text x="527" y="278">CrPt₃</text><text x="550" y="190">(Pt)</text>
   <text x="65" y="407">Atomic percent Pt · Cr at 0 · Pt at 100</text>
  </>}
 </svg>
}
