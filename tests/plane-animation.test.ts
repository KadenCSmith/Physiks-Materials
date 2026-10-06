import {describe,expect,it} from 'vitest'
import {axisIntercepts,planeStage,tracedEdges,planeEquation} from '../src/models/crystals/planeAnimation'
import {planePolygon,type V3} from '../src/models/crystals/calculation'

describe('deterministic plane construction',()=>{
 it('reveals intercepts, vertices, perimeter and fill in order',()=>{
  const start=planeStage(0,4),intercepts=planeStage(.24,4),vertices=planeStage(.52,4),complete=planeStage(1,4)
  expect(start.axisReveal).toEqual([0,0,0]);expect(start.vertexReveal).toEqual([0,0,0,0]);expect(start.edgeProgress).toBe(0);expect(start.fillOpacity).toBe(0)
  expect(intercepts.axisReveal).toEqual([1,1,1]);expect(intercepts.edgeProgress).toBe(0)
  vertices.vertexReveal.forEach(value=>expect(value).toBeCloseTo(1,14));expect(vertices.edgeProgress).toBeGreaterThan(0);expect(vertices.edgeProgress).toBeLessThan(1);expect(vertices.fillOpacity).toBe(0)
  expect(planeStage(.8,4).fillOpacity).toBe(0)
  expect(complete.edgeProgress).toBe(1);expect(complete.fillOpacity).toBeCloseTo(.2,14)
 })
 it('clamps unsafe progress and reproduces reversed seeks without history',()=>{
  expect(planeStage(-1,3)).toEqual(planeStage(0,3));expect(planeStage(NaN,3)).toEqual(planeStage(0,3));expect(planeStage(5,3)).toEqual(planeStage(1,3))
  const later=planeStage(.9,6);planeStage(.2,6);expect(planeStage(.9,6)).toEqual(later)
  const polygon=planePolygon([2,1,-1],1),trace=tracedEdges(polygon,.75);tracedEdges(polygon,.1);expect(tracedEdges(polygon,.75)).toEqual(trace)
 })
 it('traces perimeter distances, including a partial second edge',()=>{
  const square:V3[]=[[0,0,0],[1,0,0],[1,1,0],[0,1,0]],copy=square.map(point=>[...point])
  expect(tracedEdges(square,0)).toEqual([])
  expect(tracedEdges(square,.375)).toEqual([{start:[0,0,0],end:[1,0,0]},{start:[1,0,0],end:[1,.5,0]}])
  const full=tracedEdges(square,1);expect(full).toHaveLength(4);expect(full[3].end).toEqual([0,0,0]);expect(square).toEqual(copy)
  expect(tracedEdges([[0,0,0],[1,0,0]],1)).toEqual([])
 })
 it('keeps a negative axis intercept outside the shown positive cell',()=>{
  const intercepts=axisIntercepts([2,1,-1],1)
  expect(intercepts.map(i=>i.value)).toEqual([.5,1,-1]);expect(intercepts.map(i=>i.insideCell)).toEqual([true,true,false])
  expect(intercepts[2].point).toEqual([0,0,-1])
 })
 it('distinguishes parallel axes, a contained axis, and finite intercepts collapsed at the origin',()=>{
  expect(axisIntercepts([0,1,1],1)[0].kind).toBe('parallel')
  const origin=axisIntercepts([0,1,1],0)
  expect(origin[0].kind).toBe('contained');expect(origin[0].point).toBeNull()
  expect(origin.slice(1).map(i=>i.value)).toEqual([0,0]);expect(origin.slice(1).map(i=>i.point)).toEqual([[0,0,0],[0,0,0]])
 })
 it('reveals a correct incomplete equation then all integer-scaled terms and offset',()=>{
  expect(planeEquation([2,1,-1],1,[0,0,0])).toBe('⋯ + ⋯ − ⋯ = 1')
  expect(planeEquation([2,1,-1],1,[1,0,0])).toBe('2x + ⋯ − ⋯ = 1')
  expect(planeEquation([2,1,-1],1,[1,1,1])).toBe('2x + y − z = 1')
  expect(planeEquation([4,3,3],3)).toBe('4x + 3y + 3z = 3')
  expect(planeEquation([0,1,1],0)).toBe('y + z = 0')
  expect(planeEquation([-12,0,1],-.5)).toBe('−12x + z = -0.5')
 })
})
