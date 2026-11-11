import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c01-l06-v1.json';
import job from '../../scripts/tts/jobs/n5-m06-c01-l06.json';
describe('n5-m06-c01-l06 authentic listening package contract', () => {
 it('contains two original scenes and eight unique keyed audible questions', () => {
  expect(job.schemaVersion).toBe(3);
  expect(job.candidateOnly).toBe(true);
  expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
  expect(bank.tracks).toEqual(['audio-n5-m06-c01-l06-a','audio-n5-m06-c01-l06-b']);
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   const track=job.tracks[q.trackId.endsWith('-a')?0:1];
   expect(track.turns.some(turn=>turn.text.includes(q.evidence))).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(12);
  }
 });
});
