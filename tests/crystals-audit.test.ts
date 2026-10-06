import {describe,expect,it} from 'vitest'
import {indexAnswer,parseCoordinate,planeData,planePolygon,polygonArea,sampleModel,type V3} from '../src/models/crystals/calculation'

// Independent analytic cases: a=2 Å for this SC cell. No UI defaults are assumed.
const p={structure:0,view:2,radius:1,planeCase:0,planeInput:0,planeLevel:1,ix:1,iy:1,iz:1,ph:1,pk:1,pl:1,
 directionMode:0,sx:0,sy:0,sz:0,ex:1,ey:0,ez:0,du:1,dv:0,dw:0,translate:0}

describe('independent custom crystallography audit',()=>{
 it('preserves the drawn plane level when rational intercepts are integerized',()=>{
  const parameters={...p,ix:.75,iy:1,iz:1},data=planeData(parameters),s=sampleModel(parameters,0)
  expect(data.indices).toEqual([4,3,3]);expect(data.indexLevel).toBe(3)
  expect(s.spacing).toBeCloseTo(2/Math.sqrt(34),12)
  expect(s.originDistance).toBeCloseTo(6/Math.sqrt(34),12)
  expect(s.originDistance).toBeCloseTo(3*s.spacing,12)
  expect(s.sliceArea).toBeCloseTo(Math.sqrt(34)/2,12)
 })
 it('retains higher-order spacing and distinguishes a parallel translate from that spacing',()=>{
  const parameters={...p,planeInput:1,ph:2,pk:0,pl:0,planeLevel:2},s=sampleModel(parameters,0)
  expect(s.spacing).toBe(1);expect(s.originDistance).toBe(2);expect(s.sliceArea).toBe(4)
  const opposite=sampleModel({...parameters,ph:-2,planeLevel:-1},0)
  expect(opposite.originDistance).toBe(1);expect(opposite.sliceArea).toBe(4)
 })
 it('agrees with triangular, central hexagonal and diagonal-square analytic slice areas',()=>{
  expect(polygonArea(planePolygon([1,1,1],1))).toBeCloseTo(Math.sqrt(3)/2,12)
  expect(polygonArea(planePolygon([1,1,1],1.5))).toBeCloseTo(3*Math.sqrt(3)/4,12)
  expect(polygonArea(planePolygon([1,-1,0],0))).toBeCloseTo(Math.sqrt(2),12)
  expect(polygonArea(planePolygon([2,1,-1],1))).toBeCloseTo(Math.sqrt(6)/2,12)
 })
 it('returns no positive-area polygon for a point, an edge, a missed cell or the zero normal',()=>{
  for(const [normal,level] of [[[1,1,1],0],[[1,1,0],0],[[1,0,0],2],[[0,0,0],0]] as [V3,number][]){
   expect(planePolygon(normal,level)).toEqual([])
   expect(polygonArea(planePolygon(normal,level))).toBe(0)
  }
 })
 it('keeps every clipped polygon vertex in its defining plane and cube',()=>{
  for(const [normal,level] of [[[2,1,-1],0],[[2,1,-1],1],[[1,1,1],1.5],[[-3,2,1],-.5]] as [V3,number][]){
   const polygon=planePolygon(normal,level);expect(polygon.length).toBeGreaterThanOrEqual(3)
   for(const point of polygon){expect(point.reduce((sum,v,i)=>sum+v*normal[i],0)).toBeCloseTo(level,12);expect(point.every(v=>v>=-1e-12&&v<=1+1e-12)).toBe(true)}
  }
 })
 it('uses the selected in-cell arrow for length and computes signed axis angles',()=>{
  const s=sampleModel({...p,directionMode:1,du:-2,dv:1,dw:0,planeInput:1,ph:0,pk:0,pl:1},0)
  expect([s.u,s.v,s.w]).toEqual([-2,1,0]);expect(s.directionLength).toBeCloseTo(Math.sqrt(5),12)
  expect(s.unitX).toBeCloseTo(-2/Math.sqrt(5),12);expect(s.unitY).toBeCloseTo(1/Math.sqrt(5),12)
  expect(s.angleX).toBeCloseTo(Math.acos(-2/Math.sqrt(5))*180/Math.PI,12)
  expect(s.angleZ).toBe(90);expect(s.directionPlaneAngle).toBe(0)
  const normal=sampleModel({...p,planeInput:1,ph:1,pk:0,pl:0},0)
  expect(normal.directionPlaneAngle).toBe(90)
 })
 it('parses fractions and rejects missing or nonfinite coordinate values',()=>{
  expect(parseCoordinate('−1 / 2')).toBe(-.5);expect(parseCoordinate(' .25 ')).toBe(.25)
  expect(parseCoordinate('1/3')).toBeCloseTo(1/3,14)
  for(const invalid of ['', '1/0', 'Infinity', 'NaN', '1/2/3'])expect(parseCoordinate(invalid)).toBeNull()
 })
 it('accepts three separated signed indices including full multi-digit overbar tokens',()=>{
  for(const text of ['[-12 0 1]','[−12, 0, 1]','12̅ 0 1','1̅2̅ 0 1'])expect(indexAnswer(text,[-12,0,1])).toBe(true)
  expect(indexAnswer('12 0 1',[-12,0,1])).toBe(false)
  expect(indexAnswer('1 0 -2',[1,0,-2])).toBe(true)
 })
})
