import {describe,expect,it} from 'vitest'
import {coordination,rdf,crystalParticles,gasParticles,circuit} from '../src/models/order/calculation'
describe('RDF and dislocation checks',()=>{
 it('normalizes a BCC candidate shell to eight, independent of density',()=>{expect(coordination(0,3.05,.06)).toBeCloseTo(8,5);expect(coordination(0,3.05,.12)).toBeCloseTo(8,5);expect(crystalParticles.filter(v=>Math.hypot(...v)<3.05)).toHaveLength(8)})
 it('integrates a density-weighted ordinary gas RDF',()=>{expect(rdf(2,2,.06)).toBe(1);expect(coordination(2,2,.06)).toBeCloseTo(2.0106192983,9);let integral=0;const dr=.0025;for(let i=1;i<=800;i++){const r=(i-.5)*dr;integral+=4*Math.PI*.06*r*r*rdf(2,r,.06)*dr}expect(integral).toBeCloseTo(coordination(2,2,.06),5)})
 it('keeps the seeded gas sample reproducible and closure signed',()=>{expect(gasParticles).toHaveLength(35);expect(gasParticles[0][0]).toBeCloseTo(-1.360397262033075,12);for(const mode of [0,1]){const c=circuit(mode,2);expect(c[0].map((v,i)=>v-c[4][i])).toEqual([-2,0,0])}})
})
