import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c04-l06.json';
import job from '../../scripts/tts/jobs/l0-m02-c04-l06.json';
describe('Hiragana fluency spoken-meaning assessment',()=>{
 it('has six unique evidence-grounded questions',()=>{
  expect(bank.items).toHaveLength(6);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
   const track=job.tracks.find(t=>q.trackId.endsWith('-'+t.id));
   expect(track).toBeDefined();
   expect(track!.turns.some(t=>t.text.includes(q.evidence))).toBe(true);
  }
 });
 it('has two distinct scenes and no orthography-based listening questions',()=>{
  expect(job.tracks).toHaveLength(2);
  expect(new Set(job.tracks.map(t=>t.title)).size).toBe(2);
  expect(bank.items.filter(q=>q.trackId.endsWith('-a'))).toHaveLength(3);
  expect(bank.items.filter(q=>q.trackId.endsWith('-b'))).toHaveLength(3);
  expect(bank.items.every(q=>!/spelling|written|character shape|kana symbol/i.test(q.prompt))).toBe(true);
 });
});
