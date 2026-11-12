import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m07-c03-l02-v1.json';
import { QUIZ_ID, questions, scoreComparisonVocabulary } from '../components/interactive/ComparisonVocabularyPractice';
describe('n5-m07-c03-l02 comparison vocabulary',()=>{
  it('has twelve distinct evidence-backed keyed items and balanced answer positions',()=>{
    expect(QUIZ_ID).toBe('n5-m07-c03-l02-recognition-v1');
    expect(bank.lessonId).toBe('n5-m07-c03-l02');
    expect(questions).toHaveLength(12);
    expect(new Set(questions.map(q=>q.id)).size).toBe(12);
    const positions=[0,0,0];
    for(const q of questions){
      expect(q.id).toMatch(/^ex-n5-m07-c03-l02-q\d\d-v1$/);
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      const p=q.choices.findIndex(c=>c.id===q.answerKey.choiceId);
      expect(p).toBeGreaterThanOrEqual(0);positions[p]++;
      expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
      expect(q.evidence.length).toBeGreaterThan(2);
    }
    expect(positions).toEqual([4,4,4]);
  });
  it('scores only keyed answers',()=>{
    expect(scoreComparisonVocabulary({})).toBe(0);
    expect(scoreComparisonVocabulary(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
    expect(scoreComparisonVocabulary(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});
