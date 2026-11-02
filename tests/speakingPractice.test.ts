import { describe, expect, it } from 'vitest';
import {
  speakingQuestions, speakingTracks, speakingCues, speakingRubric,
  scoreSpeakingPreparation, validateSpeakingPreparation, speakingQuizId
} from '../src/lib/speakingPractice';

describe('L08 optional speaking preparation and media contract', () => {
  it('uses two existing real audio models and exact recorded cue phrases', () => {
    expect(validateSpeakingPreparation()).toBe(true);
    expect(speakingTracks).toHaveLength(2);
    expect(new Set(speakingTracks.map(track => track.url)).size).toBe(2);
    for (const cue of speakingCues) {
      const transcript = speakingTracks.find(track => track.id === cue.track)?.transcript;
      expect(transcript).toContain(cue.japanese);
    }
  });
  it('has versioned, unique, valid keys and useful feedback', () => {
    expect(speakingQuizId).toBe('l0-m01-c01-l08-check-v1');
    expect(speakingQuestions).toHaveLength(5);
    expect(new Set(speakingQuestions.map(q => q.id)).size).toBe(5);
    for (const q of speakingQuestions) {
      expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
      expect(q.choices.every(c => c.rationale.length > 15)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(30);
    }
  });
  it('scores only selected written choices, not speaking proficiency', () => {
    const correct = Object.fromEntries(speakingQuestions.map(q => [q.id, q.answerKey.choiceId]));
    expect(scoreSpeakingPreparation(correct)).toBe(5);
    expect(scoreSpeakingPreparation({})).toBe(0);
    expect(scoreSpeakingPreparation({ ...correct, [speakingQuestions[0].id]: 'invalid' })).toBe(4);
    expect(speakingRubric).toHaveLength(5);
  });
});
