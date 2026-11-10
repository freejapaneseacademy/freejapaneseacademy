import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m03-c02-l03-v1.json';
import { scoreRoutineGrammar } from '../components/interactive/RoutineGrammarPractice';
describe('n5-m03-c02-l03 daily routine grammar', () => {
  it('has twelve distinct, keyed, evidence-backed items with feedback', () => {
    expect(bank.lessonId).toBe('n5-m03-c02-l03');
    expect(bank.items).toHaveLength(12);
    expect(new Set(bank.items.map(q => q.id)).size).toBe(12);
    for (const q of bank.items) {
      expect(q.status).toBe('internally-checked');
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices.map(c => c.text)).size).toBe(4);
      expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
      expect(q.explanation.length).toBeGreaterThan(25);
      expect(q.evidence.length).toBeGreaterThan(1);
      expect(q.choices.every(c => c.rationale.length > 25)).toBe(true);
    }
  });
  it('scores empty, perfect and incorrect submissions', () => {
    expect(scoreRoutineGrammar({})).toBe(0);
    const answers = Object.fromEntries(bank.items.map(q => [q.id, q.answerKey.choiceId]));
    expect(scoreRoutineGrammar(answers)).toBe(12);
    answers[bank.items[0].id] = 'wrong';
    expect(scoreRoutineGrammar(answers)).toBe(11);
  });
});