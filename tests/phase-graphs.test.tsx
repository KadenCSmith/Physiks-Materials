import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import katex from 'katex'
import {describe,it,expect} from 'vitest'
import {envelope,liquidGibbs} from '../src/models/phases/calculation'
import {phasesModel} from '../src/models/phases/model'
import {thermalCases} from '../src/models/phases/thermal'

describe('linked exam phase graphs',()=>{
 it('counts the selected pure Cr endmember consistently',()=>{
  const p={...phasesModel.defaults,composition:0},s=phasesModel.sample(p,0)
  expect(s.components).toBe(1);expect(s.phases).toBe(1);expect(s.freedom).toBe(1)
  expect(JSON.stringify(phasesModel.getSnapshotReport!(p,s))).toContain('Pure Cr · C = 1')
 })
 it('keeps the smooth liquid branch metastable across the entire binary',()=>{
  for(let i=0;i<=1000;i++)expect(liquidGibbs(i/1000)).toBeGreaterThan(envelope(i/1000))
 })
 it('matches phase-diagram temperature and Gibbs markers at above, at and below every transition',()=>{
  for(let cooling=0;cooling<thermalCases.length;cooling++)for(const time of [0,6,12]){
   const p={...phasesModel.defaults,view:2,cooling},s=phasesModel.sample(p,time)
   expect(s.coolingTemperature).toBe(thermalCases[cooling].T+60-time*10)
   expect(s.thermalStable).toBe(time===0?0:time===6?2:1)
   expect(s.transitionFreedom).toBe(thermalCases[cooling].components-thermalCases[cooling].phaseCount+1)
   const report=phasesModel.getSnapshotReport!(p,s)
   for(const section of report.sections)for(const tex of section.tex??[])expect(()=>katex.renderToString(tex,{throwOnError:true})).not.toThrow()
  }
 })
 it('renders both linked graphs and the same chosen transition without hiding the pure-endmember case',()=>{
  const p={...phasesModel.defaults,view:2,cooling:9},s=phasesModel.sample(p,6)
  const html=renderToStaticMarkup(<phasesModel.Scene parameters={p} snapshot={s} display={{labels:true,forces:true}} onParameterChange={()=>{}} onInteractionStart={()=>{}} onInteractionEnd={()=>{}}/>)
  expect(html).toContain('Matched Gibbs energy versus temperature')
  expect(html).toContain('Phase diagram marker matched')
  expect(html).toContain('1769')
  expect(html).toContain('C = 1')
 })
 it('fixes Q4c to1400 degrees and supplies a whole-binary range without changing the supported fraction solver',()=>{
  const p={...phasesModel.defaults,view:1,gRange:1,temperature:1500},s=phasesModel.sample(p,6)
  expect(s.temperature).toBe(1400)
  const html=renderToStaticMarkup(<phasesModel.Scene parameters={p} snapshot={s} display={{labels:true,forces:true}} onParameterChange={()=>{}} onInteractionStart={()=>{}} onInteractionEnd={()=>{}}/>)
  expect(html).toContain('Whole binary · 0–100 at% Pt')
  expect(html).toContain('both common tangents')
  expect(phasesModel.controls.find(c=>c.key==='composition')?.max).toBe(35)
 })
})
