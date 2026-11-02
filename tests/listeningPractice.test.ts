import { describe, expect, it } from 'vitest';
import { listeningQuestions, listeningQuizId, listeningTracks, scoreListeningQuestions, validateListeningQuestions } from '../src/lib/listeningPractice';

describe('L06 listening data', () => {
  it('has distinct real audio tracks and complete metadata', () => {
    expect(listeningTracks).toHaveLength(2);
    expect(new Set(listeningTracks.map(t => t.url)).size).toBe(2);
    for(const t of listeningTracks) {
      expect(t.url).toMatch(/^\/audio\/[a-z0-9-]+\.wav$/);
      expect(t.transcript.length).toBeGreaterThan(30);
      expect(t.durationSeconds).toBeGreaterThan(8);
    }
    expect(listeningQuizId).toBe('l0-m01-c01-l06-check-v2');
  });
  it('has eight stable, correctly keyed questions, split across two recordings', () => {
    expect(validateListeningQuestions()).toBe(true);
    expect(listeningQuestions.filter(x=>x.trackId.endsWith('-a'))).toHaveLength(4);
    expect(listeningQuestions.filter(x=>x.trackId.endsWith('-b'))).toHaveLength(4);
    expect(scoreListeningQuestions({})).toBe(0);
    expect(scoreListeningQuestions(Object.fromEntries(listeningQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(8);
  });
});
