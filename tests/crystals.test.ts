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
