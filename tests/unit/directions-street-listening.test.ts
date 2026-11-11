import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c03-l06-v1.json';
import job from '../../scripts/tts/jobs/n5-m05-c03-l06.json';
describe('N5-M05-C03-L06 original street listening',()=>{
 it('has two distinct original scenes and six evidence-based keyed questions',()=>{
  expect(job.schemaVersion).toBe(3);expect(job.candidateOnly).toBe(true);expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
  expect(job.tracks.every(t=>t.turns.length>=4)).toBe(true);
  expect(bank.items).toHaveLength(6);expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.evidence.length).toBeGreaterThan(5);expect(job.tracks.find(t=>q.trackId.endsWith('-'+t.id))?.turns.some(t=>t.text.includes(q.evidence))).toBe(true);}
 });
 it('does not test visual spelling in an auditory quiz',()=>{expect(bank.items.map(q=>q.prompt).join(' ')).not.toMatch(/kanji|hiragana|katakana|spelling|printed|letter/i);});
});
