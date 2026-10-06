import {describe,expect,it} from 'vitest'
import {lever,equilibrium,endpoints,gibbs,gibbsSlope,chemicalPotentials,tangentContacts,envelope} from '../src/models/phases/calculation'
describe('Cr–Pt supported region',()=>{
 it('reads the exam point on the atomic axis and conserves composition',()=>{const q=equilibrium(1500,10);expect([q.phaseA,q.phaseB]).toEqual([0,1]);expect(q.fB).toBeCloseTo(3.6/11.1,12);expect(q.fA+q.fB).toBe(1);expect(q.fA*q.left+q.fB*q.right).toBeCloseTo(10,12)})
 it('handles one-phase edges, tie-line endpoints, and a three-phase invariant',()=>{expect(equilibrium(1500,0).phases).toBe(1);expect(equilibrium(1500,17.5).phases).toBe(1);expect(equilibrium(1500,35).phases).toBe(1);expect(lever(5,5,15)).toEqual({left:1,right:0});expect(lever(15,5,15)).toEqual({left:0,right:1});expect(equilibrium(1530,28.1).fractionValid).toBe(0);expect(equilibrium(1530,28.1).phases).toBe(3);expect(()=>endpoints(1300)).toThrow();expect(()=>lever(1,2,2)).toThrow()})
 it('preserves fraction and composition at a few independent supported states',()=>{for(const [T,c] of [[1400,10],[1450,27],[1529,30]]){const q=equilibrium(T,c);expect(q.fA+q.fB).toBeCloseTo(1,12);expect(q.fA*q.left+q.fB*q.right).toBeCloseTo(c,12)}})
})
describe('schematic molar Gibbs consistency',()=>{
 it('equates each component chemical potential at both common tangents',()=>{for(const [pa,pb,a,b] of [[0,1,tangentContacts[0],tangentContacts[1]],[1,2,tangentContacts[2],tangentContacts[3]]]){expect(gibbsSlope(pa,a)).toBeCloseTo(gibbsSlope(pb,b),12);const ma=chemicalPotentials(pa,a),mb=chemicalPotentials(pb,b);expect(ma.Cr).toBeCloseTo(mb.Cr,12);expect(ma.Pt).toBeCloseTo(mb.Pt,12);expect((gibbs(pb,b)-gibbs(pa,a))/(b-a)).toBeCloseTo(ma.Pt-ma.Cr,12)}})
 it('keeps the lower envelope below every phase curve',()=>{for(const x of [0,.04,.1,.18,.2,.25,.31,.35,.4,.75,1])for(const phase of [0,1,2])expect(envelope(x)).toBeLessThanOrEqual(gibbs(phase,x)+1e-10)})
})
