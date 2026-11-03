import { describe, expect, it } from 'vitest';
import {
  vowelSpeakingLessonId, vowelSpeakingQuizId, vowelSpeakingQuestions,
  vowelSpeakingMedia, vowelSpeakingRubric, scoreVowelSpeakingPreparation,
  validateVowelSpeakingPreparation
} from '../src/lib/vowelSpeakingPractice';

describe('L0-M01-C02-L08 speaking preparation and documented real WAV contract', () => {
  it('links two original approved recordings, with turn-level transcripts and exact metadata', () => {
    expect(vowelSpeakingLessonId).toBe('l0-m01-c02-l08');
    expect(validateVowelSpeakingPreparation()).toBe(true);
    expect(vowelSpeakingMedia).toHaveLength(2);
    expect(new Set(vowelSpeakingMedia.map(x => x.mediaPath)).size).toBe(2);
    for (const track of vowelSpeakingMedia) {
      expect(track.turns.length).toBe(4);
      expect(track.durationSeconds).toBeGreaterThan(8);
      expect(track.qa.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(track.rights.redistributionCleared).toBe(true);
      for (const turn of track.turns) {
        expect(turn.japanese.length).toBeGreaterThan(3);
        expect(track.transcript).toContain(turn.japanese);
        expect(turn.endSeconds).toBeLessThanOrEqual(track.durationSeconds + 0.02);
      }
    }
  });
  it('has five original knowledge-only questions and a self-review without fake speech scores', () => {
    expect(vowelSpeakingQuizId).toBe('l0-m01-c02-l08-check-v1');
    expect(vowelSpeakingQuestions).toHaveLength(5);
    expect(new Set(vowelSpeakingQuestions.map(x => x.id)).size).toBe(5);
    for (const q of vowelSpeakingQuestions) {
      expect(q.skills).toContain('speaking-preparation');
      expect(q.choices).toHaveLength(3);
      expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
      expect(q.choices.every(c => c.rationale.length > 20)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(45);
    }
    const correct = Object.fromEntries(vowelSpeakingQuestions.map(x => [x.id, x.answerKey.choiceId]));
    expect(scoreVowelSpeakingPreparation(correct)).toBe(5);
    expect(scoreVowelSpeakingPreparation({})).toBe(0);
    expect(scoreVowelSpeakingPreparation({...correct,[vowelSpeakingQuestions[0].id]:'invalid'})).toBe(4);
    expect(vowelSpeakingRubric).toHaveLength(5);
  });
});
