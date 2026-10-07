import {renderToStaticMarkup} from 'react-dom/server'
import {describe,expect,it} from 'vitest'
import {DislocationScene} from '../src/models/order/DislocationScene'
import {sampleModel} from '../src/models/order/calculation'

const p={reference:0,view:1,material:0,shellRadius:3.05,density:.06,dislocation:0,spacing:1}
const frame=(time:number,dislocation=0,playing=true)=>{
 const parameters={...p,dislocation}
 return renderToStaticMarkup(<DislocationScene parameters={parameters} snapshot={sampleModel(parameters,time)} display={{labels:true,forces:true}} playing={playing} onSeek={()=>{}} onReplay={()=>{}} onTogglePlayback={()=>{}}/>)
}
const tip=(html:string,key='data-circuit-tip')=>html.match(new RegExp(`${key}="true" cx="([^"]+)" cy="([^"]+)"`))?.slice(1).map(Number)

describe('visible Burgers circuit animation',()=>{
 it('moves around the four screw legs and rises one layer while the transverse projection returns to S',()=>{
  expect(tip(frame(0))).toEqual([465,300])
  expect(tip(frame(3))).toEqual([673,300])
  expect(tip(frame(6))).toEqual([673,92])
  expect(tip(frame(9))).toEqual([465,92])
  expect(tip(frame(12))).toEqual([465,300])
  expect(tip(frame(0),'data-circuit-height-tip')).toEqual([466,478])
  expect(tip(frame(12),'data-circuit-height-tip')).toEqual([691,405])
 })
 it('exposes the final Burgers gap only after all sixteen neighbor steps',()=>{
  for(const dislocation of [0,1]){
   expect(frame(6,dislocation)).not.toContain('data-burgers-gap="true"')
   expect(frame(12,dislocation)).toContain('data-burgers-gap="true"')
  }
  expect(tip(frame(0,1))).toEqual([460,310])
  expect(tip(frame(12,1))).toEqual([503,310])
 })
 it('makes replay and pause/resume visible beside the animated diagram, with leg and bond cues',()=>{
  const paused=frame(6,0,false)
  expect(paused).toContain('Animate Burgers circuit')
  expect(paused).toContain('Resume circuit')
  expect(paused).toContain('Paused')
  expect(paused).toContain('Leg 3 (−y) · bond 9 of 16.')
  expect(frame(6)).toContain('Pause circuit')
  expect(frame(6)).toContain('Animating')
  expect(frame(12)).toContain('16 neighbor bonds traced')
  expect(paused.indexOf('order-physical')).toBeLessThan(paused.indexOf('Animate Burgers circuit'))
  expect(paused.indexOf('Animate Burgers circuit')).toBeLessThan(paused.indexOf('order-circuit"'))
 })
})
