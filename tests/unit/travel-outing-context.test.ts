import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c04-l01-v1.json';
import { gradeOutingContext } from '../../src/components/interactive/OutingContextPractice';
describe('n5-m05-c04-l01 outing context',()=>{
  it('contains twelve distinct keyed items with useful feedback',()=>{
    expect(bank.items).toHaveLength(12);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
    for(const q of bank.items){
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
    }
  });
  it('grades all correct, blank and wrong answers deterministically',()=>{
    expect(gradeOutingContext({})).toBe(0);
    expect(gradeOutingContext(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
    expect(gradeOutingContext(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});