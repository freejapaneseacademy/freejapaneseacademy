import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {fluencyShadowQuestions,scoreFluencyShadowKnowledge} from '../../src/components/interactive/HiraganaFluencyShadowing';
import manifest from '../../src/content/audio/l0-m02-c04-l06-v1.json';
describe('L08 speaking models and knowledge check',()=>{
 it('reuses two real rights-cleared model tracks with ordered turns',()=>{
  expect(manifest.assets).toHaveLength(2);
  for(const a of manifest.assets){expect(a.rights.redistributionCleared).toBe(true);expect(a.qa.sha256).toMatch(/^[a-f0-9]{64}$/);expect(a.turns.length).toBeGreaterThanOrEqual(4);expect(a.turns.every((t,i)=>t.endSeconds>t.startSeconds&&(i===0||t.startSeconds>=a.turns[i-1].endSeconds))).toBe(true);}
 });
 it('has six unique evidence-based non-pronunciation questions',()=>{
  expect(fluencyShadowQuestions).toHaveLength(6);
  expect(new Set(fluencyShadowQuestions.map(q=>q.id)).size).toBe(6);
  expect(scoreFluencyShadowKnowledge(Object.fromEntries(fluencyShadowQuestions.map(q=>[q.id,q.correct])))).toBe(6);
  expect(scoreFluencyShadowKnowledge({})).toBe(0);
  for(const q of fluencyShadowQuestions){expect(q.why.length).toBeGreaterThan(35);expect(q.choices[q.correct]).toBeTruthy();}
 });
 it('has an original published lesson and no machine pronunciation claim',()=>{
  const s=readFileSync('src/content/lessons/l0/hiragana-fluency-speaking.mdx','utf8');
  expect(s).toContain('lessonId: "l0-m02-c04-l08"');expect(s).toContain('publicationStatus: published');expect(s).toContain('Independent Japanese pronunciation');
 });
});