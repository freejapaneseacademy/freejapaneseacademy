import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c03-l07-v1.json';
describe('N5-M06-C03-L07 original recognition bank',()=>{
 it('has eight uniquely keyed complete questions',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.status).toBe('drafted');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.explanation.length).toBeGreaterThan(30);expect(q.evidence.length).toBeGreaterThan(4);expect(q.objectiveIds.length).toBeGreaterThan(0);expect(q.knowledgeItemIds.length).toBeGreaterThan(0);}
 });
 it('does not claim that composition is machine graded',()=>{expect(bank.scoring.maxWrittenScore).toBe(8);expect(bank.scoring.officialJLPTScore).toBe(false);});
});