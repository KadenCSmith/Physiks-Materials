import {describe,expect,it} from 'vitest'
import {burgersVector,circuit,circuitSteps,screwRise} from '../src/models/order/calculation'

describe('lattice-linked dislocation teaching geometry',()=>{
 it.each([.5,1,2])('follows four equal transverse neighbor steps per screw leg at a=%s',a=>{
  const path=circuitSteps(0,a)
  expect(path).toHaveLength(17)
  for(let i=1;i<path.length;i++){
   const d=path[i].map((v,k)=>(v-path[i-1][k])/a)
   expect(Math.hypot(d[1],d[2])).toBeCloseTo(1,12)
   expect(d[0]).toBeGreaterThan(0)
   expect(d[0]).toBeLessThan(.1)
  }
  expect(circuit(0,a).map(v=>v[0]/a)).toEqual([0,.25,.5,.75,1])
  expect(burgersVector(path)).toEqual([a,0,0])
 })
 it('gets screw rise from the angular displacement field instead of arbitrary corner drifts',()=>{
  expect(screwRise(0,0)).toBe(0)
  expect(screwRise(4,0)).toBe(.25)
  expect(screwRise(4,4)).toBe(.5)
  expect(screwRise(0,4)).toBe(.75)
  expect(screwRise(1,0)).toBeCloseTo((Math.atan2(-2,-1)+3*Math.PI/4)/(2*Math.PI),12)
 })
 it.each([.5,1,2])('follows four actual edge-lattice neighbors per leg at a=%s',a=>{
  const path=circuitSteps(1,a)
  expect(path).toHaveLength(17)
  for(const [start,end] of [[0,4],[8,12]])for(let i=start+1;i<=end;i++){
   expect(Math.abs(path[i][0]-path[i-1][0])).toBeCloseTo(a,12)
   expect(path[i][1]).toBe(path[i-1][1])
  }
  for(const [start,end] of [[4,8],[12,16]])for(let i=start+1;i<=end;i++){
   expect(Math.abs(path[i][1]-path[i-1][1])).toBeCloseTo(a,12)
   expect(Math.abs(path[i][0]-path[i-1][0])).toBeLessThanOrEqual(a/2)
  }
  // The upper traverse crosses the extra half-plane at x=2.5a.
  expect(path[10]).toEqual([2.5*a,4*a,0])
  expect(burgersVector(path)).toEqual([a,0,0])
 })
 it('keeps the core enclosed and t × b directed toward the extra half-plane',()=>{
  const path=circuitSteps(1,1),core=[2.5,2]
  expect(path[0][0]).toBeLessThan(core[0])
  expect(path[4][0]).toBeGreaterThan(core[0])
  expect(path[0][1]).toBeLessThan(core[1])
  expect(path[8][1]).toBeGreaterThan(core[1])
  // t=+z and b=+x, so t × b=+y, into the drawn upper half-plane.
  const b=burgersVector(path),t=[0,0,1]
  const cross=[t[1]*b[2]-t[2]*b[1],t[2]*b[0]-t[0]*b[2],t[0]*b[1]-t[1]*b[0]]
  expect(cross).toEqual([0,1,0])
 })
})
