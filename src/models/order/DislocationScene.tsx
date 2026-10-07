import {useId} from 'react'
import {useNumberFormat} from '../../framework/formatting'
import type {SimulationSceneProps} from '../../framework/types'
import {circuitSteps,type Particle} from './calculation'

type Point=[number,number]
const points=(values:Point[])=>values.map(v=>v.join(',')).join(' ')

/** Physical identification and the independent step-count construction are deliberately separate. */
export function DislocationScene({parameters:p,snapshot:s,display,onSeek,playing=false,onReplay,onTogglePlayback}:Pick<SimulationSceneProps,'parameters'|'snapshot'|'display'|'onSeek'|'playing'|'onReplay'|'onTogglePlayback'>){
 const id=useId(),{format:n}=useNumberFormat(),screw=p.dislocation===0
 const path=circuitSteps(p.dislocation,1),f=Math.min(16,Math.max(0,s.progress*16))
 const segment=Math.min(15,Math.floor(f)),fraction=f-segment
 const tip=path[segment].map((v,i)=>v+(path[segment+1][i]-v)*fraction) as Particle
 const project=(v:Particle):Point=>screw?[465+52*v[1],300-52*v[2]]:[460+43*v[0],310-43*v[1]]
 const trace=[...path.slice(0,segment+1),tip],start=project(path[0]),finish=project(path[16])
 const complete=f>=16,leg=Math.min(3,Math.floor(f/4))
 const directions=screw?['+y','+z','−y','−z']:['+x','+y','−x','−y']
 const physical=(x:number,y:number,z:number):Point=>[45+44*y+22*z,285-29*x-15*z]
 const face=(vertices:Array<[number,number,number]>)=>points(vertices.map(([x,y,z])=>physical(x,y,z)))
 const rows=Array.from({length:6},(_,i)=>i-2),columns=Array.from({length:6},(_,i)=>i-2.5)
 const edgePoint=(x:number,y:number):Particle=>[x+2.5+(y>0?Math.sign(x)*.5:0),y+2,0]
 const physicalEdge=(x:number,y:number):Point=>[220+45*(x+(y>0?Math.sign(x)*.5:0)),242-42*y]
 const heights=path.map((v,i):Point=>[466+225*i/16,478-73*v[0]])
 const heightTip:Point=[466+225*f/16,478-73*tip[0]]
 return <>

  <svg className="materials-scene order-dislocation order-physical" viewBox="0 0 430 380" role="img" aria-label={screw?'Screw crystal cutaway: filled lattice walls and floor with a surface step ending at the dislocation core':'Edge crystal cross-section: an extra atomic half-plane terminates at the core'}>
   <defs>
    <marker id={`${id}-physical-trace`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#9db8e8"/></marker>
    <marker id={`${id}-physical-burgers`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#e2bc82"/></marker>
    <marker id={`${id}-physical-tangent`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#91cbb5"/></marker>
    <clipPath id={`${id}-upper-floor`}><polygon points={face([[0,0,0],[0,6,0],[0,6,2],[0,3,2],[0,3,4],[0,0,4]])}/></clipPath>
    <clipPath id={`${id}-lower-floor`}><polygon points={face([[0,3,2],[0,6,2],[-1,6,4],[-1,3,4]])}/></clipPath>
   </defs>
   <rect x="15" y="15" width="411" height="360" rx="8" fill="#0b1017" stroke="#27313d"/>
   <text x="32" y="42" className="large-label">{screw?'1 · SCREW CRYSTAL':'1 · EDGE CRYSTAL'}</text>
   {screw?<>
    {/* Opaque cutaway faces. The tapered glidestep follows the exam-style cartoon;
        it is an identification sketch, not the quantitative displacement field. */}
    <polygon points={face([[5,0,4],[5,6,4],[-1,6,4],[-1,3,4],[0,3,4],[0,0,4]])} fill="#263241" stroke="#94a0af"/>
    <polygon points={face([[0,0,0],[5,0,0],[5,0,4],[0,0,4]])} fill="#1b2634" stroke="#94a0af"/>
    {Array.from({length:6},(_,x)=><g key={`wall-${x}`}>
     <line x1={physical(x,0,4)[0]} y1={physical(x,0,4)[1]} x2={physical(x,6,4)[0]} y2={physical(x,6,4)[1]} stroke="#637183"/>
     <line x1={physical(x,0,0)[0]} y1={physical(x,0,0)[1]} x2={physical(x,0,4)[0]} y2={physical(x,0,4)[1]} stroke="#637183"/>
    </g>)}
    {Array.from({length:7},(_,y)=><line key={`rear-${y}`} x1={physical(5,y,4)[0]} y1={physical(5,y,4)[1]} x2={physical(y>3?-1:0,y,4)[0]} y2={physical(y>3?-1:0,y,4)[1]} stroke="#637183"/>)}
    {Array.from({length:5},(_,z)=><line key={`side-${z}`} x1={physical(5,0,z)[0]} y1={physical(5,0,z)[1]} x2={physical(0,0,z)[0]} y2={physical(0,0,z)[1]} stroke="#637183"/>)}
    <polygon points={face([[0,0,0],[0,6,0],[0,6,2],[0,3,2],[0,3,4],[0,0,4]])} fill="#35475a" stroke="#b6c2ce"/>
    <polygon points={face([[0,3,2],[0,6,2],[-1,6,4],[-1,3,4]])} fill="#24354a" stroke="#b6c2ce"/>
    <g clipPath={`url(#${id}-upper-floor)`}>
     {Array.from({length:7},(_,y)=><line key={`upper-y-${y}`} x1={physical(0,y,0)[0]} y1={physical(0,y,0)[1]} x2={physical(0,y,4)[0]} y2={physical(0,y,4)[1]} stroke="#8796a7"/>)}
     {Array.from({length:5},(_,z)=><line key={`upper-z-${z}`} x1={physical(0,0,z)[0]} y1={physical(0,0,z)[1]} x2={physical(0,6,z)[0]} y2={physical(0,6,z)[1]} stroke="#8796a7"/>)}
    </g>
    <g clipPath={`url(#${id}-lower-floor)`}>
     {[3,4,5,6].map(y=><polyline key={`lower-y-${y}`} points={points([2,3,4].map(z=>physical(-(z-2)/2,y,z)))} fill="none" stroke="#8796a7"/>)}
     {[2,3,4].map(z=><line key={`lower-z-${z}`} x1={physical(-(z-2)/2,3,z)[0]} y1={physical(-(z-2)/2,3,z)[1]} x2={physical(-(z-2)/2,6,z)[0]} y2={physical(-(z-2)/2,6,z)[1]} stroke="#8796a7"/>)}
    </g>
    <polygon points={face([[0,3,2],[0,3,4],[-1,3,4]])} fill="#65809e" stroke="#c0d4ea" strokeWidth="1.5"/>
    <line x1={physical(-.8,3,2)[0]} y1={physical(-.8,3,2)[1]} x2={physical(2.6,3,2)[0]} y2={physical(2.6,3,2)[1]} stroke="#91cbb5" strokeWidth="2.5" strokeDasharray="5 4" markerEnd={`url(#${id}-physical-tangent)`}/>
    <circle cx={physical(0,3,2)[0]} cy={physical(0,3,2)[1]} r="5" fill="#91cbb5" stroke="#030303" strokeWidth="1.5"/>
    <line x1={physical(-1,3,4)[0]+7} y1={physical(-1,3,4)[1]} x2={physical(0,3,4)[0]+7} y2={physical(0,3,4)[1]} stroke="#e2bc82" strokeWidth="3" markerEnd={`url(#${id}-physical-burgers)`}/>
    {display.labels&&<>
     <text x="231" y="175" className="order-tangent-label">t = +x</text>
     <text x="281" y="240" className="order-burgers-label">b ∥ t</text>
     <path d="M222 267 L254 315 H365" fill="none" stroke="#91cbb5"/>
     <text x="225" y="337" className="order-tangent-label">step ends at line/core</text>
     <text x="32" y="359">Exam-style cutaway · schematic surface</text>
    </>}
   </>:<>
    <path d="M35 100 H405 V336 H35 Z" fill="#223142" stroke="#8392a4"/>
    {Array.from({length:6},(_,i)=>i-2).map(y=><g key={y}>
     <polyline points={points(Array.from({length:8},(_,i)=>physicalEdge(i-3.5,y)))} fill="none" stroke="#5c7188"/>
     {Array.from({length:8},(_,i)=>i-3.5).map(x=><circle key={x} cx={physicalEdge(x,y)[0]} cy={physicalEdge(x,y)[1]} r="4.5" fill="#bac8d7" stroke="#1b2634"/>)}
    </g>)}
    {Array.from({length:8},(_,i)=>i-3.5).map(x=><polyline key={x} points={points(Array.from({length:6},(_,i)=>physicalEdge(x,i-2)))} fill="none" stroke="#5c7188"/>)}
    <line x1="220" y1="116" x2="220" y2="242" stroke="#91cbb5" strokeWidth="3"/>
    {[0,1,2,3].map(y=><circle key={y} cx="220" cy={242-42*y} r="5" fill="#91cbb5" stroke="#152030"/>)}
    <circle cx="220" cy="242" r="10" fill="#17222f" stroke="#91cbb5" strokeWidth="2"/><circle cx="220" cy="242" r="2.5" fill="#91cbb5"/>
    <line x1="285" y1="352" x2="350" y2="352" stroke="#e2bc82" strokeWidth="3" markerEnd={`url(#${id}-physical-burgers)`}/>
    {display.labels&&<>
     <text x="240" y="80" className="order-tangent-label">extra half-plane</text>
     <text x="234" y="264" className="order-tangent-label">t = +z ⊙</text>
     <text x="287" y="374" className="order-burgers-label">b = +x</text>
     <text x="32" y="367">b ⟂ t · atom-row cross-section</text>
    </>}
   </>}
  </svg>
  <div className="order-animation-controls" aria-label="Burgers circuit playback">
   <div className="materials-tabs order-circuit-actions">
    <button className="order-animate" onClick={onReplay} disabled={!onReplay}>Animate Burgers circuit</button>
    <button onClick={onTogglePlayback} disabled={complete||!onTogglePlayback}>{playing?'Pause circuit':'Resume circuit'}</button>
    <button onClick={()=>onSeek?.(0)}>Restart circuit</button>
    <button onClick={()=>onSeek?.(6)}>Inspect halfway</button>
    <button onClick={()=>onSeek?.(12)}>Show Burgers gap</button>
   </div>
   <p className="materials-note order-animation-status"><strong>{complete?'Circuit complete':playing?'Animating':'Paused'}</strong> · {complete?'16 neighbor bonds traced; inspect the gold start-to-finish Burgers gap.':`Leg ${leg+1} (${directions[leg]}) · bond ${Math.min(16,Math.floor(f)+1)} of 16.`} Animate starts from the first bond; Pause freezes the moving marker.</p>
  </div>
  <svg className="materials-scene order-dislocation order-circuit" viewBox="0 0 760 440" role="img" aria-label={screw?'Separate Burgers circuit in the y-z projection, with a height chart showing its rise along x':'Separate Burgers circuit follows sixteen edge-lattice neighbors and leaves a horizontal start-to-finish gap'}>
   <defs>
    <marker id={`${id}-trace`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#9db8e8"/></marker>
    <marker id={`${id}-burgers`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#e2bc82"/></marker>
    <marker id={`${id}-tangent`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#91cbb5"/></marker>
   </defs>
   <rect x="15" y="15" width="730" height="420" rx="8" fill="#090e15" stroke="#27313d"/>
   <text x="32" y="42" className="large-label">2 · SEPARATE CIRCUIT</text>
   <g transform="translate(-400,0)">
   {screw?<>
    {Array.from({length:5},(_,i)=><g key={i}>
     <line x1="465" y1={300-52*i} x2="673" y2={300-52*i} stroke="#354352"/>
     <line x1={465+52*i} y1="92" x2={465+52*i} y2="300" stroke="#354352"/>
     {Array.from({length:5},(_,j)=>i===2&&j===2?null:<circle key={j} cx={465+52*j} cy={300-52*i} r="3" fill="#788899"/>)}
    </g>)}
    <circle cx="569" cy="196" r="10" fill="#111b26" stroke="#91cbb5" strokeWidth="2"/><circle cx="569" cy="196" r="2.5" fill="#91cbb5"/>
    {display.labels&&<><text x="490" y="70">View along +x · y–z plane</text><text x="529" y="229" className="order-tangent-label">t = +x ⊙</text><text x="550" y="320">+y →</text><text x="432" y="178">+z ↑</text></>}
   </>:<>
    {rows.map(y=><g key={y}>
     <polyline points={points(columns.map(x=>project(edgePoint(x,y))))} fill="none" stroke="#354352"/>
     {columns.map(x=><circle key={x} cx={project(edgePoint(x,y))[0]} cy={project(edgePoint(x,y))[1]} r="3" fill="#788899"/>)}
    </g>)}
    {columns.map(x=><polyline key={x} points={points(rows.map(y=>project(edgePoint(x,y))))} fill="none" stroke="#354352"/>)}
    <line x1={project([2.5,2,0])[0]} y1={project([2.5,2,0])[1]} x2={project([2.5,5,0])[0]} y2={project([2.5,5,0])[1]} stroke="#91cbb5" strokeWidth="2"/>
    {[0,1,2,3].map(y=><circle key={y} cx={project([2.5,y+2,0])[0]} cy={project([2.5,y+2,0])[1]} r="3.5" fill="#91cbb5"/>)}
    <circle cx={project([2.5,2,0])[0]} cy={project([2.5,2,0])[1]} r="8" fill="#111b26" stroke="#91cbb5"/><circle cx={project([2.5,2,0])[0]} cy={project([2.5,2,0])[1]} r="2" fill="#91cbb5"/>
    {display.labels&&<><text x="478" y="70">View along +z · x–y plane</text><text x="555" y="332">+x →</text><text x="430" y="170">+y ↑</text></>}
   </>}
   {f>0&&<polyline data-circuit-trace="true" points={points(trace.map(project))} stroke="#9db8e8" strokeWidth="3" fill="none" strokeLinejoin="round" markerEnd={`url(#${id}-trace)`}/>}
   <circle cx={start[0]} cy={start[1]} r="5" fill="#fff" stroke="#030303" strokeWidth="1.5"/>
   <circle data-circuit-tip="true" cx={project(tip)[0]} cy={project(tip)[1]} r="5" fill="#9db8e8" stroke="#030303"/>
   {complete&&!screw&&<><line data-burgers-gap="true" x1={start[0]} y1={start[1]} x2={finish[0]} y2={finish[1]} stroke="#e2bc82" strokeWidth="3.5" markerEnd={`url(#${id}-burgers)`}/><circle cx={finish[0]} cy={finish[1]} r="4" fill="#9db8e8"/></>}
   {display.labels&&<>
    <text x={screw?451:445} y="337">{screw?'S/F share y,z; their x differs by a.':'S'}</text>
    {complete&&!screw&&<text x={finish[0]+5} y={finish[1]-10}>F</text>}
    <text x="454" y="367">{complete?'16 / 16 steps · complete':`${Math.floor(f)} / 16 steps · tracing leg ${leg+1}`}</text>
   </>}
   </g>
   {screw?<g transform="translate(-50,-150)">
    <path d="M466 395 V478 H700" fill="none" stroke="#758393"/>
    <polyline points={points(heights)} fill="none" stroke="#354352" strokeDasharray="4 3"/>
    <polyline points={points([...heights.slice(0,segment+1),heightTip])} fill="none" stroke="#9db8e8" strokeWidth="2.5"/>
    <circle data-circuit-height-tip="true" cx={heightTip[0]} cy={heightTip[1]} r="4" fill="#9db8e8"/>
    {complete&&<line data-burgers-gap="true" x1="713" y1="478" x2="713" y2="405" stroke="#e2bc82" strokeWidth="3" markerEnd={`url(#${id}-burgers)`}/>}
    {display.labels&&<><text x="454" y="391">Height along line · x/a</text><text x="445" y="409">1</text><text x="445" y="482">0</text><text x="461" y="500">S · 0</text><text x="566" y="500">8</text><text x="670" y="500">16 · F</text><text x="495" y="524">One turn rises one spacing a.</text></>}
   </g>:display.labels&&<g transform="translate(-40,-140)">
    <text x="454" y="406">Four bonds on every side.</text>
    <text x="454" y="432">Extra site above the core</text>
    <text x="454" y="454">leaves a horizontal gap a.</text>
    <text x="454" y="486" className="order-burgers-label">b = (+{n(p.spacing)}, 0, 0) Å</text>
    <text x="454" y="515">t × b points into the half-plane.</text>
   </g>}
   {display.labels&&<g transform="translate(380,-350)">
    <text x="32" y="410" className="large-label">COUNT NEIGHBOR BONDS</text>
    {directions.map((direction,i)=><g key={direction}>
     <circle cx="42" cy={439+i*28} r="9" fill={!complete&&leg===i?'#263d60':'#161c23'} stroke={!complete&&leg===i?'#9db8e8':'#485361'}/>
     <text x="38" y={443+i*28}>{i+1}</text><text x="61" y={443+i*28}>{direction} · 4 nearest-neighbor steps</text>
    </g>)}
</g>}
   {display.labels&&<g transform="translate(0,-179)">
    <text x="32" y="574" className="order-burgers-label">b = F − S = (+{n(p.spacing)}, 0, 0) Å · a = {n(p.spacing)} Å</text>
    <text x="32" y="602">SF/RH: gold b joins S → F; the closing vector F → S is −b.</text>
</g>}
  </svg>
  <p className="materials-note order-circuit-explanation"><strong>What the two pictures show:</strong> {screw?'First: an opaque exam-style crystal cutaway; its surface step ends at the dislocation line. This identification sketch is schematic, not a measured displacement field. Second: a separate, ideal lattice circuit viewed along +x. Its y–z projection closes, but the height chart shows the final atom is one spacing higher along x. That height difference is b, parallel to the line.':'First: a crystal cross-section with an extra half-plane ending at the green core. Second: a separate circuit follows four actual neighbor bonds on each side; the extra upper-row site leaves a gap one spacing to the right. That gap is b, perpendicular to the line.'} The app’s circuit is independently constructed; the exam supplies no directed step counts or axes.</p>
 </>
}
