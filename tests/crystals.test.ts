import { describe,expect,it } from 'vitest'
import { direction,miller,planePolygon,structures,sampleModel,getPlayback } from '../src/models/crystals/calculation'
import { crystalsModel } from '../src/models/crystals/model'
describe('crystallography independent geometry',()=>{
 it('subtracts head minus tail with the visually verified overbar',()=>{expect(direction([0,0,1],[.5,0,0])).toEqual([1,0,-2]);expect(direction([0,1,1],[1,.5,1])).toEqual([2,-1,0]);expect(direction([.5,1,0],[0,0,0])).toEqual([-1,-2,0])})
 it('preserves plane intercept scale and parallel axes',()=>{expect(miller([.5,0,0])).toEqual([2,0,0]);expect(miller([.5,1,-1])).toEqual([2,1,-1]);expect(miller([0,1,1])).toEqual([0,1,1])})
 it('cuts BCC at x=1/2 in a unit square and counts one atom',()=>{const poly=planePolygon([1,0,0],.5);expect(poly).toHaveLength(4);expect(poly.every(p=>p[0]===.5)).toBe(true);const s=sampleModel({...crystalsModel.defaults,radius:Math.sqrt(3)/2},0);expect(s.a).toBeCloseTo(2);expect(s.planarDensity).toBeCloseTo(.25);expect(structures.map(v=>[v.atoms,v.nn])).toEqual([[1,6],[2,8],[4,12]])})
 it('completes directions in six seconds and other cell views in twelve',()=>{const p=crystalsModel.defaults;expect(getPlayback(p).duration).toBe(6);expect(sampleModel(p,3).progress).toBe(.5);expect(sampleModel(p,6).progress).toBe(1);expect(getPlayback({...p,view:3}).duration).toBe(12);expect(sampleModel({...p,view:3},6).progress).toBe(.5)})
 it('flags coincident direction without inventing indices',()=>{expect(sampleModel({...crystalsModel.defaults,sx:0,sy:0,sz:0,ex:0,ey:0,ez:0},0).validDirection).toBe(0)})
})

describe('custom geometry input and meaningful metrics',()=>{
 it('reduces an indices-mode arrow while measuring only the drawn in-cell segment',()=>{
  const s=sampleModel({...crystalsModel.defaults,directionMode:1,du:4,dv:2,dw:0,structure:0},6)
  expect([s.u,s.v,s.w]).toEqual([2,1,0]);expect(s.directionLength).toBeCloseTo(Math.sqrt(5));expect(s.unitX).toBeCloseTo(2/Math.sqrt(5));expect(s.angleX).toBeCloseTo(26.565051177)
 })
 it('does not invent a zero-vector direction or accept fractional integer-index input',()=>{
  expect(sampleModel({...crystalsModel.defaults,directionMode:1,du:0,dv:0,dw:0},0).validDirection).toBe(0)
  expect(sampleModel({...crystalsModel.defaults,directionMode:1,du:.5},0).validDirection).toBe(0)
 })
 it('keeps an arbitrary translated slice distinct from its index-vector spacing',()=>{
  const s=sampleModel({...crystalsModel.defaults,view:2,structure:0,planeCase:0,planeInput:1,ph:2,pk:0,pl:0,planeLevel:2},0)
  expect(s.spacing).toBe(1);expect(s.originDistance).toBe(2);expect(s.sliceArea).toBe(4)
 })
 it('flags a zero plane normal while a valid slice outside the cell has zero area',()=>{
  const p={...crystalsModel.defaults,view:2,planeCase:0,planeInput:1,ph:1,pk:0,pl:0,planeLevel:2}
  expect(sampleModel(p,0).validPlane).toBe(1);expect(sampleModel(p,0).sliceArea).toBe(0)
  expect(sampleModel({...p,ph:0},0).validPlane).toBe(0)
 })
})
