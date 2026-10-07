import {useMemo} from 'react'
import {useNumberFormat} from '../../framework/formatting'
import type {SimulationSceneProps} from '../../framework/types'
import {Choice} from '../shared/StudyPanel'
import {endpoints,phaseNames} from './calculation'
import {events,congruent} from './boundaries'
import {thermalCases} from './thermal'
import {PhaseDiagram} from './PhaseDiagram'
import {CompositionScene} from './CompositionScene'
import {ThermalScene} from './ThermalScene'
import {LeverScene} from './LeverScene'

export function Scene(props:SimulationSceneProps){
 const {parameters:p,snapshot:s,display,onParameterChange:change}=props,{format:n}=useNumberFormat(),view=Math.round(p.view)
 const phaseLabel=s.phases===3?'Cr₄Pt + (Pt) + L':s.phases===1?phaseNames[s.phaseA]:phaseNames[s.phaseA]+' + '+phaseNames[s.phaseB]
 const highX=(x:number)=>65+650*x/35,highY=(T:number)=>325-(T-1400)/130*220
 const bounds=useMemo(()=>[0,1,2,3].map(i=>[1400,1500,1530].map(T=>`${65+650*endpoints(T)[i]/35},${325-(T-1400)/130*220}`).join(' ')),[])
 return <>
  <div className="materials-scene-controls">
   <Choice label="Example source" value={p.reference} options={['Exam example','Lecture example · 1400 °C slice']} onChange={v=>{change('reference',v);change('view',v===1?1:0);change('temperature',v===1?1400:1500);change('composition',10)}}/>
   {p.reference===1&&<p className="materials-note">Dr. Joshua Paul Steimel · 6:07: the visible horizontal 1400 °C line crosses the solid fields, with the (Pt) region circled. His upper Gibbs sketch is clipped. Our complete curves are independently constructed schematic common tangents.</p>}
   <Choice label="Inspect" value={p.view} options={['Exam tie line','G–composition · 1400 °C','Cooling & G–T','Full overview']} onChange={v=>{change('view',v);if(v!==1)change('reference',0)}}/>
   {view<2&&<>
    <div className="materials-tabs"><button onClick={()=>{change('view',0);change('temperature',1500);change('composition',10)}}>Exam example · 10 at% / 1500 °C</button><button onClick={()=>{change('composition',11.95);change('temperature',1500);change('view',0)}}>Easy example · tie-line midpoint</button></div>
    <div className="materials-small-grid"><label>Composition (at% Pt)<input aria-label="Composition in scene" type="range" min="0" max="35" step=".1" value={p.composition} onChange={e=>change('composition',Number(e.target.value))}/></label>{view===0&&<label>Temperature (°C)<input aria-label="Phase temperature in scene" type="range" min="1400" max="1530" value={p.temperature} onChange={e=>change('temperature',Number(e.target.value))}/></label>}</div>
   </>}
   {view===2&&<label className="phase-transition-choice">Choose a transformation<select aria-label="Transformation in scene" value={p.cooling} onChange={e=>change('cooling',Number(e.target.value))}>{thermalCases.map((e,i)=><option key={e.id} value={i}>{e.title} · {n(e.T)} °C · {e.kind}</option>)}</select></label>}
  </div>
  {view===0?<>
   <svg className="materials-scene" viewBox="0 0 760 440" role="img" aria-label="Digitized high-temperature Cr–Pt solid slice with current tie line">
    <path d="M65,100 V325 H715" stroke="#758393" fill="none"/>
    {bounds.map((v,i)=><polyline key={i} points={v} fill="none" stroke={i<2?'#9db8e8':'#d4b184'} strokeWidth="2"/>)}
    {display.forces&&<line x1={highX(s.left)} x2={highX(s.left)+(highX(s.right)-highX(s.left))*s.progress} y1={highY(s.temperature)} y2={highY(s.temperature)} stroke="#9ebf9d" strokeWidth="3"/>}
    <circle cx={highX(p.composition)} cy={highY(s.temperature)} r="6" fill="#eee"/>
    {display.labels&&<><text x="65" y="65">{n(s.temperature)} °C · {phaseLabel}</text><text x="80" y="350">(Cr)</text><text x="390" y="350">Cr₄Pt</text><text x="670" y="350">(Pt)</text><text x="20" y="108">1530</text><text x="20" y="325">1400</text><text x="65" y="375">0</text><text x="650" y="375">35 at% Pt</text><text x="65" y="410">cα ≈ {n(s.left)} · cβ ≈ {n(s.right)} · c₀ = {n(p.composition)}</text></>}
   </svg>
   <LeverScene {...props}/>
   <p className="materials-note">{s.fractionValid?`${phaseLabel}. Fractions sum to ${n(s.fA+s.fB)}; composition residual ${n(s.conservation)} at%. Approximate endpoints carry ±0.5 at% uncertainty.`:'At 1530 °C, Cr₄Pt + L + (Pt) can coexist. Overall composition alone does not determine three fractions.'}</p>
  </>:view===1?<CompositionScene {...props}/>:view===2?<ThermalScene {...props}/>:<>
   <PhaseDiagram labels={display.labels}/>
   <div className="phase-calculation">
    <h3>Question 4a · find and classify every marked event</h3>
    <table className="materials-facts"><thead><tr><th>Point</th><th>Temperature</th><th>at% Pt</th><th>Cooling transformation</th><th>Matched graph</th></tr></thead><tbody>
     {events.map((e,i)=><tr key={e.title}><th>{e.title}</th><td>{i>1?'≈':''}{n(e.T)} °C</td><td>≈{n(e.x)}</td><td>{e.kind}: {e.before} → {e.after}</td><td><button onClick={()=>{change('cooling',i);change('view',2)}}>Inspect G–T</button></td></tr>)}
     {congruent.map((e,i)=><tr key={e.label}><th>{e.label}</th><td>{i===3?'≈':''}{n(e.T)} °C</td><td>{i===1||i===3?'≈':''}{n(e.x)}</td><td>Congruent melting: same solid/liquid composition</td><td><button onClick={()=>{change('cooling',i+5);change('view',2)}}>Inspect G–T</button></td></tr>)}
    </tbody></table>
    <p>The 1134 °C CrPt₃ and ≈780 °C CrPt maxima occur inside a solid field. They are solid ordering transitions, rather than melting points. The low-temperature event coordinates are approximate graph readings.</p>
    <p className="phase-source-note">*Cr₃Pt is the label printed in the exam. Its drawn 33–40 at% region conflicts with nominal Cr₃Pt = 25 at% Pt. We retain the exam label and approximate drawn coordinates without treating them as formula stoichiometry.</p>
   </div>
  </>}
 </>
}
