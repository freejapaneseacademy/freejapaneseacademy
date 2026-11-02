import { describe, expect, it } from 'vitest';
import { scoreSoundContext, soundContextQuestions, soundContextQuizId, validateSoundContext } from '../src/lib/soundContextPractice';

describe('L0-M01-C02-L01 original vowel context bank', () => {
  it('has ten unique, versioned, valid, answerable items', () => {
    expect(soundContextQuizId).toBe('l0-m01-c02-l01-check-v1');
    expect(soundContextQuestions).toHaveLength(10);
    expect(validateSoundContext()).toBe(true);
    expect(new Set(soundContextQuestions.map(q => q.id)).size).toBe(10);
    for (const question of soundContextQuestions) {
      expect(question.id).toMatch(/^ex-l0-m01-c02-l01-/);
      expect(question.objectiveIds.every(id => id.startsWith('l0-m01-c02-l01-o'))).toBe(true);
      expect(question.choices.find(c => c.id === question.answerKey.choiceId)?.rationale.length).toBeGreaterThan(12);
    }
  });

  it('scores the canonical keys and never grants credit to blank answers', () => {
    const allCorrect = Object.fromEntries(soundContextQuestions.map(q => [q.id, q.answerKey.choiceId]));
    expect(scoreSoundContext(allCorrect)).toBe(10);
    expect(scoreSoundContext({})).toBe(0);
    const oneWrong = { ...allCorrect, [soundContextQuestions[0].id]: soundContextQuestions[0].choices.find(c => c.id !== soundContextQuestions[0].answerKey.choiceId)!.id };
    expect(scoreSoundContext(oneWrong)).toBe(9);
  });

  it('rejects duplicate IDs and missing answer keys', () => {
    expect(() => validateSoundContext([soundContextQuestions[0], soundContextQuestions[0]])).toThrow(/Invalid question metadata/);
    const invalid = { ...soundContextQuestions[0], answerKey: { choiceId: 'not-a-choice' } };
    expect(() => validateSoundContext([invalid])).toThrow(/Invalid answer choices/);
  });

  it('keeps written mora counts separate from auditory certification', () => {
    const length = soundContextQuestions.find(q => q.knowledgeItemIds.includes('mora-length-preview'))!;
    expect(length.answerKey.choiceId).toBe('longer');
    expect(length.explanation).toMatch(/extra timing unit/);
    const limits = soundContextQuestions.find(q => q.knowledgeItemIds.includes('sound-learning-limits'))!;
    expect(limits.answerKey.choiceId).toBe('written');
    expect(limits.explanation).toMatch(/real audio/i);
  });
});
