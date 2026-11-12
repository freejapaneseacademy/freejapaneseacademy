import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c01-l06.json';
import job from '../../scripts/tts/jobs/n5-m07-c01-l06.json';
describe('n5-m07-c01-l06 listening integrity', () => {
 it('has six unique keyed questions, three choices each, and spoken evidence', () => {
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q => q.id)).size).toBe(6);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   const t=job.tracks.find(t=>q.trackId.endsWith('-'+t.id));
   expect(t?.turns.some(turn=>turn.text.includes(q.evidence))).toBe(true);
  }
 });
 it('contains two distinct candidate tracks with pinned licensed voices',()=>{
  expect(job.schemaVersion).toBe(3);
  expect(job.candidateOnly).toBe(true);
  expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
  expect(job.voices.male.sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(job.voices.female.sha256).toMatch(/^[a-f0-9]{64}$/);
 });
});
