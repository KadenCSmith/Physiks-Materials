import {describe,it,expect} from 'vitest'
import katex from 'katex'
import {reactions,balance,effectiveCharge,energyComparison,kvTex,sampleModel,KB} from '../src/models/defects/calculation'
describe('formal PtO3 defect bookkeeping',()=>{
 it('distinguishes absolute and relative ionic charges',()=>{expect(effectiveCharge(2,0)).toBe(-1);expect(effectiveCharge(3,0)).toBe(-6);expect(effectiveCharge(3,1)).toBe(2);expect(effectiveCharge(0,0)).toBe(0);expect(effectiveCharge(2,2)).toBe(5)})
 it.each(reactions)('$title conserves atoms, charge and every site type',r=>{expect(Object.values(balance(r))).toEqual([0,0,0,0,0,0,0])})
 it('writes six separate effective-charge marks with true site subscripts',()=>{const vacancy=kvTex(3,0,-6),interstitial=kvTex(0,2,6);expect(vacancy).toBe(String.raw`\mathrm{V}_{\mathrm{Pt}}^{\prime\prime\prime\prime\prime\prime}`);expect(interstitial.match(/\\bullet/g)).toHaveLength(6);for(const tex of [vacancy,interstitial,...reactions.map(r=>r.tex)])expect(()=>katex.renderToString(tex,{throwOnError:true,strict:'error'})).not.toThrow()})
 it('rejects fractional effective charge rather than silently rounding it',()=>{const p={reference:0,reaction:1,species:2,site:0,charge:-.9,temperature:1000,energyMode:0};expect(sampleModel(p,0).chargeValid).toBe(0);expect(sampleModel({...p,charge:-1},0).chargeValid).toBe(1)})
 it('uses distinct mass-action exponents for pairs and four-vacancy clusters',()=>{const e=energyComparison(1000,true);expect(e[0].fraction).toBeCloseTo(Math.exp(-.1/(2*KB*1000)),12);expect(e[2].fraction).toBeCloseTo(Math.exp(-4/(4*KB*1000)),12);expect(e[0].fraction).toBeGreaterThan(e[2].fraction);expect(energyComparison(2000,false)[1].fraction).toBeGreaterThan(energyComparison(1000,false)[1].fraction)})
})
