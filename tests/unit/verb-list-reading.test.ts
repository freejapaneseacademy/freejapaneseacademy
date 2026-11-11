import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c01-l05-v1.json';
import { questions, scoreVerbReading, QUIZ_ID } from '../../src/components/interactive/VerbListReadingPractice';
describe('n5-m06-c01-l05 reading evidence',()=>{
 it('has unique stable IDs, one valid keyed choice and specific evidence per question',()=>{
  expect(bank.lessonId).toBe('n5-m06-c01-l05'); expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.explanation).toContain('Evidence:');expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);}
 });
 it('scores by IDs, not option position',()=>{const all=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreVerbReading(all)).toBe(12);expect(scoreVerbReading({})).toBe(0);expect(QUIZ_ID).toContain('n5-m06-c01-l05');});
});
