import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c03-l06.json';
import job from '../../scripts/tts/jobs/l0-m04-c03-l06.json';
describe('l0-m04-c03-l06 listening evidence', () => {
 it('contains six unique versioned items across both tracks', () => {
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  expect(bank.items.filter(q=>q.trackId.endsWith('-a'))).toHaveLength(3);
  expect(bank.items.filter(q=>q.trackId.endsWith('-b'))).toHaveLength(3);
 });
 it('has valid scored keys and verbatim spoken evidence', () => {
  for(const q of bank.items){
   expect(q.id.startsWith('ex-')).toBe(true);
   expect(q.status).toBe('drafted');
   expect(q.objectiveIds.length).toBeGreaterThan(0);
   expect(q.knowledgeItemIds.length).toBeGreaterThan(0);
   expect(q.skills.length).toBeGreaterThan(0);
   expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   const track=job.tracks.find(t=>q.trackId.endsWith('-'+t.id));
   expect(track?.turns.some(t=>t.text===q.evidence)).toBe(true);
  }
 });
 it('uses two distinct licensed audio-first scenes',()=>{
  expect(job.schemaVersion).toBe(3);
  expect(job.auditoryOnly).toBe(true);
  expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
  expect(job.tracks.every(t=>t.turns.length>=4 && t.comprehensionPrompts.length===3)).toBe(true);
 });
});
