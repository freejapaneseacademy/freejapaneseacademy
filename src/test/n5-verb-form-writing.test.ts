import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m06-c01-l07-v1.json';
import { scoreVerbWriting } from '../components/interactive/VerbWritingWorkshop';
describe('n5-m06-c01-l07 writing practice',()=>{
  it('has eight uniquely keyed questions with feedback and three distinct choices',()=>{
    expect(bank.items).toHaveLength(8);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
    for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);}
  });
  it('scores only the recognition items, not free writing',()=>{
    expect(scoreVerbWriting(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(8);
    expect(scoreVerbWriting({})).toBe(0);
    expect(scoreVerbWriting(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});