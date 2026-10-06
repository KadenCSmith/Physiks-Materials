import {describe,expect,it} from 'vitest'
import {reactions} from '../src/models/defects/calculation'
import {inventory,reactionAtoms,reactionStage} from '../src/models/defects/presentation'

const expectedInventories=[
 {Pt:0,O:1,Ta:0,charge:0,PtSites:0,OSites:1,iSites:1},
 {Pt:1,O:0,Ta:0,charge:0,PtSites:1,OSites:0,iSites:1},
 {Pt:1,O:3,Ta:0,charge:0,PtSites:1,OSites:3,iSites:0},
 {Pt:2,O:6,Ta:2,charge:0,PtSites:2,OSites:1,iSites:0},
 {Pt:2,O:6,Ta:2,charge:0,PtSites:2,OSites:0,iSites:0},
 {Pt:0,O:5,Ta:2,charge:0,PtSites:0,OSites:0,iSites:7},
 {Pt:5,O:15,Ta:6,charge:0,PtSites:5,OSites:0,iSites:6},
]

describe('independent exam Q2 teaching audit',()=>{
 it('shows the correct complete atom and site inventory for each of the seven reactions',()=>{
  reactions.forEach((reaction,index)=>{
   expect(inventory(reaction.left)).toEqual(expectedInventories[index])
   expect(inventory(reaction.right)).toEqual(expectedInventories[index])
  })
 })
 it('animates exactly the conserved atoms, with no vacancy, empty-site or hole circles',()=>{
  reactions.forEach((reaction,index)=>{
   const atoms=reactionAtoms(index),expected=expectedInventories[index]
   expect(atoms).toHaveLength(expected.Pt+expected.O+expected.Ta)
   for(const element of ['Pt','O','Ta'] as const)expect(atoms.filter(atom=>atom.element===element)).toHaveLength(expected[element])
   atoms.forEach(atom=>{
    expect(reaction.left[atom.sourceTerm].atoms[atom.element]).toBeGreaterThan(0)
    expect(reaction.right[atom.targetTerm].atoms[atom.element]).toBeGreaterThan(0)
    expect([...atom.from,...atom.to].every(Number.isFinite)).toBe(true)
   })
  })
 })
 it('keeps every counted atom inside its assigned reactant and product frame',()=>{
  reactions.forEach((_reaction,reactionId)=>{
   reactionAtoms(reactionId).forEach(atom=>{
    for(const [point,termIndex,x] of [[atom.from,atom.sourceTerm,45],[atom.to,atom.targetTerm,425]] as [[number,number],number,number][]){
     const top=55+termIndex*82,radius=10
     expect(point[0]-radius).toBeGreaterThanOrEqual(x)
     expect(point[0]+radius).toBeLessThanOrEqual(x+290)
     expect(point[1]-radius).toBeGreaterThanOrEqual(top)
     expect(point[1]+radius).toBeLessThanOrEqual(top+72)
    }
   })
  })
 })
 it('moves a Frenkel ion into an interstitial, and a Schottky formula unit into the reservoir',()=>{
  for(const [reactionId,target] of [[0,'O_i′′'],[1,'Pt_i••••••']] as [number,string][]){
   const atoms=reactionAtoms(reactionId);expect(atoms).toHaveLength(1)
   expect(reactions[reactionId].right[atoms[0].targetTerm].name).toBe(target)
  }
  const schottky=reactionAtoms(2);expect(schottky).toHaveLength(4)
  expect(schottky.every(atom=>reactions[2].right[atom.targetTerm].name==='PtO₃(surface / reservoir)')).toBe(true)
 })
 it('keeps substitution oxygen provenance: five dopant O plus one host O for vacancy compensation',()=>{
  const oxygen=reactionAtoms(3).filter(atom=>atom.element==='O')
  expect(oxygen.filter(atom=>reactions[3].left[atom.sourceTerm].name==='Ta₂O₅')).toHaveLength(5)
  expect(oxygen.filter(atom=>reactions[3].left[atom.sourceTerm].name==='O_Oˣ')).toHaveLength(1)
  expect(oxygen.every(atom=>reactions[3].right[atom.targetTerm].name==='PtO₃(surface / reservoir)')).toBe(true)
  expect(reactionAtoms(3).filter(atom=>atom.element==='Ta').every(atom=>reactions[3].right[atom.targetTerm].name==='Ta_Pt′')).toBe(true)
 })
 it('uses one gas O atom from half O2, and treats holes solely as electronic compensation',()=>{
  const atoms=reactionAtoms(4),oxygen=atoms.filter(atom=>atom.element==='O')
  expect(oxygen.filter(atom=>reactions[4].left[atom.sourceTerm].name==='O₂(g)')).toHaveLength(1)
  expect(oxygen.filter(atom=>reactions[4].left[atom.sourceTerm].name==='Ta₂O₅')).toHaveLength(5)
  expect(atoms.some(atom=>reactions[4].right[atom.targetTerm].name==='h•')).toBe(false)
  expect(reactions[4].right.find(term=>term.name==='h•')?.coefficient).toBe(2)
 })
 it('fills exactly seven interstitials in the oxygen-interstitial incorporation mechanism',()=>{
  const atoms=reactionAtoms(5)
  expect(atoms.filter(atom=>atom.element==='Ta')).toHaveLength(2)
  expect(atoms.filter(atom=>atom.element==='O')).toHaveLength(5)
  expect(atoms.every(atom=>reactions[5].right[atom.targetTerm].sites.i===1)).toBe(true)
 })
 it('keeps all fifteen reservoir O from the dopant in Pt-vacancy interstitial incorporation',()=>{
  const atoms=reactionAtoms(6),oxygen=atoms.filter(atom=>atom.element==='O')
  expect(oxygen).toHaveLength(15)
  expect(oxygen.every(atom=>reactions[6].left[atom.sourceTerm].name==='Ta₂O₅')).toBe(true)
  expect(oxygen.every(atom=>reactions[6].right[atom.targetTerm].name==='PtO₃(surface / reservoir)')).toBe(true)
  expect(atoms.filter(atom=>atom.element==='Ta'&&reactions[6].right[atom.targetTerm].name==='Ta_i•••••')).toHaveLength(6)
  expect(atoms.filter(atom=>atom.element==='Pt'&&reactions[6].right[atom.targetTerm].name==='PtO₃(surface / reservoir)')).toHaveLength(5)
 })
 it('begins with all reactant atoms, ends with all products, and reproduces reversed seeks',()=>{
  expect(reactionStage(0)).toEqual({index:0,movement:0,label:'Before'})
  expect(reactionStage(.5)).toEqual({index:1,movement:.5,label:'Change'})
  expect(reactionStage(1)).toEqual({index:2,movement:1,label:'After'})
  const atoms=reactionAtoms(6),midpoint=atoms.map(atom=>atom.from.map((value,i)=>value+(atom.to[i]-value)*reactionStage(.5).movement))
  reactionStage(.1);reactionStage(.9)
  expect(reactionAtoms(6).map(atom=>atom.from.map((value,i)=>value+(atom.to[i]-value)*reactionStage(.5).movement))).toEqual(midpoint)
  expect(reactionStage(-1)).toEqual(reactionStage(0));expect(reactionStage(NaN)).toEqual(reactionStage(0));expect(reactionStage(2)).toEqual(reactionStage(1))
 })
})
