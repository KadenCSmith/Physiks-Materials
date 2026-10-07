import {useNumberFormat} from '../../framework/formatting'
import type {SimulationSceneProps} from '../../framework/types'
import {phaseNames} from './calculation'
import {Equation} from '../shared/StudyPanel'

export function LeverScene({parameters:p,snapshot:s,display}:SimulationSceneProps){
 const {format:n}=useNumberFormat(),pair=s.phases===2,x=(c:number)=>80+600*(c-s.left)/(s.right-s.left)
 if(!s.fractionValid)return <p className="materials-note">At the eutectic, three fractions require an extra constraint. There is no unique two-phase lever-rule bar to draw.</p>
 if(!pair)return <p className="materials-note">Single {phaseNames[s.phaseA]} phase: cphase = c₀ = {n(p.composition)} at% Pt, fraction 1.</p>
 return <>
  <svg className={`materials-scene${display.labels?'':' phase-labels-hidden'}`} viewBox="0 0 760 250" role="img" aria-label="Lever-rule arms and phase fraction bar for the current tie line">
   <text x="50" y="30">Question 4b · the opposite arm sets each phase fraction</text>
   <line x1="80" x2="680" y1="80" y2="80" stroke="#c6d4e5" strokeWidth="3"/>
   {[s.left,p.composition,s.right].map((c,i)=><g key={i}><circle cx={x(c)} cy="80" r="5" fill={i===1?'#fff':'#e2bc82'}/><text x={x(c)} y="61" textAnchor="middle">{n(c)}</text></g>)}
   <text x="80" y="111">cα · {phaseNames[s.phaseA]}</text><text x={x(p.composition)} y="111" textAnchor="middle">c₀</text><text x="680" y="111" textAnchor="end">cβ · {phaseNames[s.phaseB]}</text>
   <text x={(80+x(p.composition))/2} y="143" textAnchor="middle">c₀ − cα = {n(p.composition-s.left)}</text><text x={(680+x(p.composition))/2} y="143" textAnchor="middle">cβ − c₀ = {n(s.right-p.composition)}</text>
   <rect x="80" y="167" width={600*s.fA} height="22" fill="#9db8e8"/><rect x={80+600*s.fA} y="167" width={600*s.fB} height="22" fill="#e2bc82"/>
   <text x="80" y="214">{phaseNames[s.phaseA]}: {n(s.fA*100)}% · {phaseNames[s.phaseB]}: {n(s.fB*100)}% · atom/mole fractions</text>
   <text x="80" y="238">fα + fβ = {n(s.fA+s.fB)} · fαcα + fβcβ = {n(p.composition)} at% Pt</text>
  </svg>
  <Equation tex={String.raw`\mu_{\mathrm{Cr}}^{\alpha}=\mu_{\mathrm{Cr}}^{\beta},\qquad\mu_{\mathrm{Pt}}^{\alpha}=\mu_{\mathrm{Pt}}^{\beta}`}>For this coexisting pair, each component has equal chemical potential across phases. The equality concerns Cr and Pt separately; overall composition sets phase amounts.</Equation>
 </>
}
