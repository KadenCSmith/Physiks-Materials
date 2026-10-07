import {useId,useMemo} from 'react'
import {useNumberFormat} from '../../framework/formatting'
import type {SimulationSceneProps} from '../../framework/types'
import {endpoints,envelope,gibbs,liquidGibbs,tangentContacts,chemicalPotentials} from './calculation'
import {PhaseDiagram} from './PhaseDiagram'
import {Equation} from '../shared/StudyPanel'

export function CompositionScene({parameters:p,snapshot:s,display,onParameterChange:change}:SimulationSceneProps){
 const {format:n}=useNumberFormat(),id=useId(),full=p.gRange===1,maxX=full?1:.4,maxG=full?40:6,minG=-1.4
 const x=(v:number)=>65+650*v/maxX,y=(g:number)=>335-(g-minG)/(maxG-minG)*245
 const curves=useMemo(()=>[0,1,2,3,4].map(phase=>Array.from({length:301},(_,i)=>{
  const c=i/300*maxX,g=phase===4?envelope(c):phase===3?liquidGibbs(c):gibbs(phase,c)
  return `${65+650*c/maxX},${335-(g-minG)/(maxG-minG)*245}`
 }).join(' ')),[maxX,maxG])
 const contacts=endpoints(1400),segments=[0,...contacts,100],colors=['#9db8e8','#879aaf','#e2bc82','#92a598','#91cbb5']
 const muPairs=[[0,1,tangentContacts[0],tangentContacts[1]],[1,2,tangentContacts[2],tangentContacts[3]]]
 return <>
  <PhaseDiagram temperature={1400} composition={p.composition} labels={display.labels} title="Phase diagram at the same 1400 degrees Celsius as the Gibbs composition graph"/>
  <p className="materials-note">Question 4c: the green 1400 °C slice contains (Cr), Cr₄Pt and (Pt). Its four solid boundaries become the tangent contacts on the graph below. Liquid is metastable at this temperature.</p>
  <div className="materials-tabs" aria-label="Gibbs graph range"><button aria-pressed={!full} onClick={()=>change('gRange',0)}>Zoom · 0–40 at% Pt</button><button aria-pressed={full} onClick={()=>change('gRange',1)}>Whole binary · 0–100 at% Pt</button></div>
  <svg className={`materials-scene${display.labels?'':' phase-labels-hidden'}`} viewBox="0 0 760 500" role="img" aria-label="Gibbs energy versus composition at 1400 degrees Celsius with matched phase fields and both common tangents">
   <defs><clipPath id={`${id}-curves`}><rect x="65" y="80" width="650" height="255"/></clipPath></defs>
   <text x="65" y="32">Gibbs energy g · arbitrary units / mol atoms · 1400 °C</text>
   <text x="65" y="57">Blue (Cr) · gold Cr₄Pt · green (Pt) · dashed red L · white stable envelope</text>
   <path d="M65 80 V335 H715" stroke="#758393" fill="none"/>
   <g clipPath={`url(#${id}-curves)`}>
    {curves.map((v,i)=><polyline key={i} points={v} stroke={['#9db8e8','#e2bc82','#91cbb5','#db9797','#fff'][i]} strokeWidth={i===4?3:1.6} strokeDasharray={i===3?'5 4':i===4?'7 4':undefined} fill="none"/>)}
    {[[0,1],[2,3]].map(([a,b])=><line key={a} x1={x(tangentContacts[a])} x2={x(tangentContacts[b])} y1={y(envelope(tangentContacts[a]))} y2={y(envelope(tangentContacts[b]))} stroke="#fff" strokeWidth="3"/>)}
    <line x1={x(p.composition/100)} x2={x(p.composition/100)} y1="335" y2={y(envelope(p.composition/100))} stroke="#cdd7e2" strokeDasharray="3 3"/>
    <circle cx={x(p.composition/100)} cy={y(envelope(p.composition/100))} r="5" fill="#fff"/>
    {tangentContacts.map((c,i)=><circle key={i} cx={x(c)} cy={y(envelope(c))} r="4" fill="#fff"/>)}
   </g>
   {[0,maxG/2,maxG].map(g=><text key={g} x="57" y={y(g)+4} textAnchor="end">{n(g)}</text>)}
   {(full?[0,20,40,60,80,100]:[0,10,20,30,40]).map(c=><text key={c} x={x(c/100)} y="360" textAnchor="middle">{n(c)}</text>)}
   <text x="65" y="387">Atomic percent Pt · numerical tangent details use the zoom view</text>
   {segments.slice(0,-1).map((left,i)=>{const right=Math.min(segments[i+1],maxX*100);return right>left?<rect key={i} x={x(left/100)} y="413" width={x(right/100)-x(left/100)} height="18" fill={colors[i]} opacity=".75"/>:null})}
   <text x="65" y="405">Stable fields match the 1400 °C phase-diagram slice</text>
   <text x="65" y="456">(Cr) | (Cr)+Cr₄Pt | Cr₄Pt | Cr₄Pt+(Pt) | (Pt)</text>
   <text x="65" y="480">Contacts: 5.6 · 17.5 · 22.3 · 33.2 at% Pt (approximate exam readings)</text>
  </svg>
  <div className="phase-calculation">
   <h3>Equal chemical potentials at each tangent</h3>
   <Equation tex={String.raw`\mu_{\mathrm{Cr}}=g-xg',\qquad\mu_{\mathrm{Pt}}=g+(1-x)g'`}>x is Pt atomic fraction, at% / 100. The slope g′ is μPt − μCr; the two potentials need not equal each other.</Equation>
   <table className="materials-facts"><thead><tr><th>Coexisting pair</th><th>Contacts (at% Pt)</th><th>μCr at both</th><th>μPt at both</th></tr></thead><tbody>{muPairs.map(([a,_b,ca,cb],i)=>{const mu=chemicalPotentials(a,ca);return <tr key={i}><th>{a===0?'(Cr) ↔ Cr₄Pt':'Cr₄Pt ↔ (Pt)'}</th><td>{n(ca*100)} / {n(cb*100)}</td><td>{n(mu.Cr)}</td><td>{n(mu.Pt)}</td></tr>})}</tbody></table>
   <p>The white envelope gives the lowest energy at each overall composition. At c₀ = {n(p.composition)} at% Pt, its schematic g = {n(envelope(p.composition/100))}. A straight tangent segment describes a phase mixture, with amounts set by the lever rule.</p>
   <p>All energies and curvatures are independent teaching choices. The liquid branch stays above the stable envelope at 1400 °C; this is not a measured thermodynamic dataset.</p>
  </div>
  <p className="materials-note">At this slice, the evaluated exam-region state has {n(s.phases)} phase(s). The full graph also shows the stable (Pt) field extending to pure Pt; zoom preserves readable contact spacing.</p>
 </>
}
