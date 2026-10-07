import {useMemo} from 'react'
import {useNumberFormat} from '../../framework/formatting'
import type {SimulationSceneProps} from '../../framework/types'
import {thermalCases,thermalEnergy} from './thermal'
import {PhaseDiagram} from './PhaseDiagram'
import {Equation} from '../shared/StudyPanel'

export function ThermalScene({parameters:p,snapshot:s,display,playing,onReplay,onTogglePlayback,onSeek}:SimulationSceneProps){
 const {format:n}=useNumberFormat(),index=Math.round(p.cooling),event=thermalCases[index],energy=thermalEnergy(index,s.coolingTemperature),finished=s.progress===1
 const x=(T:number)=>75+620*(T-event.T+60)/120,y=(g:number)=>220-(g-2)*85
 const curves=useMemo(()=>[0,1,2].map(which=>Array.from({length:121},(_,i)=>{
  const T=event.T-60+i,g=thermalEnergy(index,T),value=which===0?g.reactant:which===1?g.product:Math.min(g.reactant,g.product)
  return `${75+620*i/120},${220-(value-2)*85}`
 }).join(' ')),[event.T,index])
 return <>
  <PhaseDiagram temperature={s.coolingTemperature} composition={event.x} labels={display.labels} title="Phase diagram marker matched to the selected Gibbs-versus-temperature transformation"/>
  <p className="materials-note"><strong>{event.kind}: {event.before} → {event.after}</strong> at {n(event.T)} °C, c₀ ≈ {n(event.x)} at% Pt. Both graphs use the same moving temperature.</p>
  <div className="materials-tabs" aria-label="Cooling and Gibbs temperature playback">
   <button onClick={onReplay}>Animate cooling & G–T</button><button disabled={finished} onClick={onTogglePlayback}>{playing?'Pause cooling':'Resume cooling'}</button>
   <button onClick={()=>onSeek?.(0)}>Above transition</button><button onClick={()=>onSeek?.(6)}>At transition</button><button onClick={()=>onSeek?.(12)}>Below transition</button>
  </div>
  <svg className={`materials-scene${display.labels?'':' phase-labels-hidden'}`} viewBox="0 0 760 460" role="img" aria-label="Matched Gibbs energy versus temperature for equal-composition reactant and product assemblages">
   <text x="65" y="32">G–T · fixed c₀ ≈ {n(event.x)} at% Pt · pressure fixed</text>
   <text x="65" y="57">Schematic g / mol atoms · blue reactants · gold products · white stable minimum</text>
   <path d="M75 80 V360 H695" stroke="#758393" fill="none"/>
   <line x1="75" x2="695" y1="220" y2="220" stroke="#283440"/>
   <rect x="75" y="80" width="310" height="280" fill="#e2bc82" opacity=".05"/><rect x="385" y="80" width="310" height="280" fill="#9db8e8" opacity=".05"/>
   {curves.map((v,i)=><polyline key={i} points={v} stroke={['#9db8e8','#e2bc82','#fff'][i]} strokeWidth={i===2?3:2} strokeDasharray={i===2?'6 4':undefined} fill="none"/>)}
   <line x1="385" x2="385" y1="80" y2="360" stroke="#91cbb5" strokeDasharray="5 4"/>
   <line x1={x(s.coolingTemperature)} x2={x(s.coolingTemperature)} y1="80" y2="360" stroke="#fff" opacity=".7"/>
   <circle cx={x(s.coolingTemperature)} cy={y(energy.reactant)} r="5" fill="#9db8e8"/><circle cx={x(s.coolingTemperature)} cy={y(energy.product)} r="5" fill="#e2bc82"/>
   {[event.T-60,event.T,event.T+60].map(T=><text key={T} x={x(T)} y="386" textAnchor="middle">{n(T)} °C</text>)}
   <text x="65" y="412">Lower g is stable · below: {event.after} · above: {event.before}</text>
   <text x="65" y="440">At {n(event.T)} °C, the two assemblage energies match (Δg = 0).</text>
   {[1,2,3].map(g=><text key={g} x="62" y={y(g)+5} textAnchor="end">{n(g)}</text>)}
  </svg>
  <div className="phase-calculation">
   <h3>At {n(s.coolingTemperature)} °C</h3>
   <p>Stable: <strong>{energy.stable===2?'both assemblages can coexist':energy.stable===0?event.before:event.after}</strong>. Δg = gproducts − greactants = {n(energy.gap)} arbitrary units per mole of atoms.</p>
   <Equation tex={String.raw`g=h-T_Ks,\qquad (\partial g/\partial T)_{P,x}=-s,\qquad g_{mix}=\sum_i f_i g_i`}>Tₖ = T°C + 273.15. These straight branches use illustrative constant entropies near the transition. The high-temperature assemblage has the more negative slope.</Equation>
   <table className="materials-facts"><thead><tr><th>Assemblage</th><th>Phase</th><th>Phase composition (at% Pt)</th><th>Atom/mole fraction</th></tr></thead><tbody>{[event.reactants,event.products].flatMap((parts,side)=>parts.map((part,i)=><tr key={`${side}-${i}`}><th>{side===0?'Reactants':'Products'}</th><td>{part.phase}</td><td>{n(part.composition)}</td><td>{n(part.fraction)}</td></tr>))}</tbody></table>
   <p>Both sides conserve the same overall c₀. For an invariant, compare the weighted mixtures at that composition; individual phases at different compositions do not need equal molar g. Congruent melting compares a solid and a liquid at the same composition.</p>
   <p>At the transition: P = {n(event.phaseCount)}, C = {n(event.components)}, fixed-pressure F = C − P + 1 = {n(event.components-event.phaseCount+1)}. Additional imposed composition/temperature constraints are separate.</p>
   <p className="phase-source-note">{event.sourceNote}</p>
  </div>
 </>
}
