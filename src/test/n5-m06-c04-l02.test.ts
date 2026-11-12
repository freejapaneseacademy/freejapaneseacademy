import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m06-c04-l02-v1.json';
import { QUIZ_ID, questions, scoreOngoingVocabulary } from '../components/interactive/OngoingVocabularyPractice';

describe('n5-m06-c04-l02 activity and place vocabulary', () => {
  it('uses stable IDs, unique choices, keyed answers and feedback', () => {
    expect(QUIZ_ID).toBe('n5-m06-c04-l02-vocabulary-v1');
    expect(questions).toHaveLength(12);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
    for (const q of bank.items) {
      expect(q.id).toMatch(/^ex-n5-m06-c04-l02-q\d\d-v1$/);
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);
      expect(q.evidence.length).toBeGreaterThan(5);
    }
  });
  it('scores exact keyed IDs, not option position', () => {
    expect(scoreOngoingVocabulary({})).toBe(0);
    expect(scoreOngoingVocabulary(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
    expect(scoreOngoingVocabulary(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});
