import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c01-l08-v1.json';
import { actionSpeakingQuestions, scoreActionSpeaking, ACTION_SPEAKING_QUIZ_ID } from '../../src/components/interactive/ActionVerbSpeakingPractice';

describe('optional action-verb speaking recognition bank', () => {
  it('uses a stable quiz ID and twelve unique versioned questions', () => {
    expect(ACTION_SPEAKING_QUIZ_ID).toBe('n5-m06-c01-l08-v1');
    expect(bank.lessonId).toBe('n5-m06-c01-l08');
    expect(actionSpeakingQuestions).toHaveLength(12);
    expect(new Set(actionSpeakingQuestions.map(q => q.id)).size).toBe(12);
  });
  it('has unique alternatives, explanations, and valid keys', () => {
    for (const q of actionSpeakingQuestions) {
      expect(q.status).toBe('internally-checked');
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c => c.text)).size).toBe(3);
      expect(q.choices.some(c => c.id === q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c => c.rationale.length > 12)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(15);
    }
  });
  it('scores correct, wrong, and missing answers separately', () => {
    const correct = Object.fromEntries(actionSpeakingQuestions.map(q => [q.id, q.answerKey.choiceId]));
    const wrong = Object.fromEntries(actionSpeakingQuestions.map(q => [q.id, q.choices.find(c => c.id !== q.answerKey.choiceId)!.id]));
    expect(scoreActionSpeaking(correct)).toBe(12);
    expect(scoreActionSpeaking(wrong)).toBe(0);
    expect(scoreActionSpeaking({})).toBe(0);
  });
});
