import {describe,it,expect} from 'vitest'
import {reactions,balance,effectiveCharge,energyComparison,KB} from '../src/models/defects/calculation'
describe('formal PtO3 defect bookkeeping',()=>{
 it('distinguishes absolute and relative ionic charges',()=>{expect(effectiveCharge(2,0)).toBe(-1);expect(effectiveCharge(3,0)).toBe(-6);expect(effectiveCharge(3,1)).toBe(2);expect(effectiveCharge(0,0)).toBe(0);expect(effectiveCharge(2,2)).toBe(5)})
 it.each(reactions)('$title conserves atoms, charge and every site type',r=>{expect(Object.values(balance(r))).toEqual([0,0,0,0,0,0,0])})
 it('uses distinct mass-action exponents for pairs and four-vacancy clusters',()=>{const e=energyComparison(1000,true);expect(e[0].fraction).toBeCloseTo(Math.exp(-.1/(2*KB*1000)),12);expect(e[2].fraction).toBeCloseTo(Math.exp(-4/(4*KB*1000)),12);expect(e[0].fraction).toBeGreaterThan(e[2].fraction);expect(energyComparison(2000,false)[1].fraction).toBeGreaterThan(energyComparison(1000,false)[1].fraction)})
})
