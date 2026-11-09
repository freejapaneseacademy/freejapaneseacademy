import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c04-l05-v1.json';
import { scoreProfileReading } from '../../src/components/interactive/ProfileBioReading';
describe('n5-m01-c04-l05 original profile reading',()=>{
  it('has ten uniquely keyed, explained and rationalized items',()=>{
    expect(bank.items).toHaveLength(10);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
    for(const q of bank.items){
      expect(q.status).toBe('internally-checked');
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(20);
    }
  });
  it('scores perfect, empty and one-wrong attempts',()=>{
    const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreProfileReading(answers)).toBe(10);
    expect(scoreProfileReading({})).toBe(0);
    answers[bank.items[0].id]='invalid';
    expect(scoreProfileReading(answers)).toBe(9);
  });
});
