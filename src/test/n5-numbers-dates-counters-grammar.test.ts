import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m03-c01-l03-v1.json';
import { scoreTimeGrammar } from '../components/interactive/TimeGrammarPractice';

describe('n5-m03-c01-l03 dates, times and counters', () => {
  it('has twelve distinct, fully keyed, explained, evidence-backed questions', () => {
    expect(bank.lessonId).toBe('n5-m03-c01-l03');
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
  it('scores no responses, all correct and one incorrect', () => {
    expect(scoreTimeGrammar({})).toBe(0);
    const answers = Object.fromEntries(bank.items.map(q => [q.id, q.answerKey.choiceId]));
    expect(scoreTimeGrammar(answers)).toBe(12);
    answers[bank.items[0].id] = 'incorrect';
    expect(scoreTimeGrammar(answers)).toBe(11);
  });
});
