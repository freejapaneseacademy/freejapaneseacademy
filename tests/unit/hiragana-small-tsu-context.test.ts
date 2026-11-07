import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m03-c03-l01-v1.json';
describe('L0-M03-C03-L01 written library labels',()=>{
 it('has eight unique, scored and evidence-backed items',()=>{
 expect(bank.items).toHaveLength(8);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
 for(const q of bank.items){
 expect(q.options[q.correctIndex]).toBe(q.choices.find(c=>c.id===q.answerKey.choiceId)?.text);
 expect(q.explanation.length).toBeGreaterThan(15);
 expect(q.evidence.phrase.length).toBeGreaterThan(2);
 expect(q.choices).toHaveLength(q.options.length);
 }
 });
 it('does not claim listening or pronunciation scores',()=>{expect(bank.scoring.maxWrittenScore).toBe(8);expect(bank.items.every(q=>q.skill==='written')).toBe(true)});
});