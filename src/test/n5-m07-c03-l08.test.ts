import { describe,it,expect } from 'vitest';
import bank from '../content/exercises/n5-m07-c03-l08-v1.json';
import { questions,scoreComparisonRoleplay,QUIZ_ID } from '../components/interactive/ComparisonRoleplay';
describe('n5-m07-c03-l08 comparison roleplay',()=>{
  it('has unique IDs, valid keys and balanced answer positions',()=>{
    expect(QUIZ_ID).toBe('n5-m07-c03-l08-recognition-v1');
    expect(bank.lessonId).toBe('n5-m07-c03-l08');
    expect(questions).toHaveLength(12);
    expect(new Set(questions.map(q=>q.id)).size).toBe(12);
    const positions=[0,0,0];
    for(const q of questions){
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      const pos=q.choices.findIndex(c=>c.id===q.answerKey.choiceId);
      expect(pos).toBeGreaterThanOrEqual(0);
      positions[pos]++;
      expect(q.evidence.length).toBeGreaterThan(2);
      expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
    }
    expect(positions).toEqual([4,4,4]);
  });
  it('scores written recognition without speaking claims',()=>{
    expect(scoreComparisonRoleplay(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
    expect(scoreComparisonRoleplay(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});
