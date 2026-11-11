import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c01-l01-v1.json';
import { gradeVerbBoard } from '../../src/components/interactive/VerbBoardPractice';
describe('n5-m06-c01-l01 verb board context',()=>{
  it('has 12 distinct, versioned questions with keyed, distinct alternatives',()=>{
    expect(bank.items).toHaveLength(12);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
    for(const q of bank.items){
      expect(q.version).toBe(1);
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
    }
  });
  it('scores empty, correct and incorrect answers without false credit',()=>{
    expect(gradeVerbBoard({})).toBe(0);
    expect(gradeVerbBoard(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
    expect(gradeVerbBoard(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});
