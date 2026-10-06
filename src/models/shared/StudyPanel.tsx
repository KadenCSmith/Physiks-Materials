import { useState, type ReactNode } from 'react'
import { MathFormula } from '../../framework/Math'
import { useNumberFormat } from '../../framework/formatting'
import './materials.css'
export type Question = { prompt: string; hint: string; check: (answer: string) => boolean; solution: string; choices?: string[] }
export function StudyPanel({ title, steps, explore, question, source, method }: {title: string; steps: ReactNode[]; explore: ReactNode; question: Question; source: string; method: string}) {
  const [mode, setMode] = useState('Learn')
  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState('')
  const [hint, setHint] = useState(false)
  const [feedback, setFeedback] = useState('')
  const { format: n } = useNumberFormat()
  return <section className="equation-panel materials-lesson" aria-label={`${title} lesson`}>
    <span className="eyebrow">PREDICT / REVEAL / TRY</span><h2>{title}</h2>
    <nav className="materials-tabs" aria-label="Lesson mode">{['Learn','Explore','Practice'].map(m=><button key={m} aria-pressed={m===mode} onClick={()=>setMode(m)}>{m}</button>)}</nav>
    {mode==='Learn' && <div className="equation-card"><span className="eyebrow">STEP {n(step+1)} / {n(steps.length)} · {['Predict','Inspect','Reveal','Substitute','Interpret','Try nearby'][step]}</span><div className="study-step">{steps[step]}</div><nav className="materials-tabs"><button disabled={step===0} onClick={()=>setStep(v=>v-1)}>Back</button><button disabled={step===steps.length-1} onClick={()=>setStep(v=>v+1)}>Next</button></nav></div>}
    {mode==='Explore' && <div className="equation-card">{explore}<p>Use the scene choices or Toolbox to change the same values used by the diagram and live readouts.</p></div>}
    {mode==='Practice' && <form className="equation-card" onSubmit={e=>{e.preventDefault();setFeedback(!answer.trim()?'Enter an answer first.':question.check(answer)?'Correct. '+question.solution:'Try again. '+question.hint)}}><p>{question.prompt}</p>{question.choices && <div className="materials-tabs">{question.choices.map(c=><button key={c} type="button" aria-pressed={answer===c} onClick={()=>{setAnswer(c);setFeedback('')}}>{c}</button>)}</div>}<label>Practice answer<input aria-label="Practice answer" value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback('')}} autoComplete="off" /></label><div className="materials-tabs"><button type="button" onClick={()=>setHint(v=>!v)}>Hint</button><button type="submit">Check answer</button></div>{hint && <p>{question.hint}</p>}<p role="status" aria-live="polite">{feedback}</p></form>}
    <details className="materials-detail"><summary>Symbolic method</summary><MathFormula tex={method}/></details>
    <details className="materials-detail"><summary>Sources & assumptions</summary><p>{source}</p><p>Playback shows conceptual demonstration progress. It is not a kinetic simulation. Selected lecture frames were inspected. Finder records verified timestamps; captures stay local.</p><a href="https://youtube.com/playlist?list=PLSKNWIzCsmjD05-AI9RG6Iab0h2v63euI" target="_blank" rel="noreferrer">Professor’s lecture playlist</a></details>
  </section>
}
export function Equation({tex, children}: {tex:string;children?:ReactNode}) {return <><MathFormula tex={tex} /><p className="materials-substitution">{children}</p></>}
export function numericAnswer(a:string, value:number, tolerance=0.001) {return a.trim()!=='' && Number.isFinite(Number(a)) && Math.abs(Number(a)-value)<=tolerance}
export function Choice({label, value, options, onChange}:{label:string;value:number;options:string[];onChange:(value:number)=>void}) {return <div className="materials-choice"><span>{label}</span><div className="materials-tabs">{options.map((o,i)=><button key={o} aria-pressed={Math.round(value)===i} onClick={()=>onChange(i)}>{o}</button>)}</div></div>}
export const chapter = (n:number) => `https://eng.libretexts.org/Courses/California_State_Polytechnic_University_Humboldt/Mechanics_and_Science_of_Materials/Chapter_${n}${n===2?'%3A_Structure%3A_Crystalline_Amorphous_Non-Crystalline_and_Liquid_Crystal_Materials':n===3?'%3A_Defects_in_Crystalline_Materials':'%3A_Phase_Diagrams'}`
export const lectureNote = 'Selected Fall 2026 lecture frames visually inspected in the user’s Chrome profile. Only the described frame is attributed; no entire-playlist review claimed. Captures stay local.'
