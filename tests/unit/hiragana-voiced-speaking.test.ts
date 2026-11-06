import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {voicedShadowQuestions,scoreVoicedShadowKnowledge} from '../../src/components/interactive/VoicedKanaShadowing';
import manifest from '../../src/content/audio/l0-m03-c01-l06-v1.json';
describe('Voiced L08 speaking models and knowledge check',()=>{
 it('reuses two real rights-cleared model tracks with ordered turns',()=>{
  expect(manifest.assets).toHaveLength(2);
  for(const a of manifest.assets){expect(a.rights.redistributionCleared).toBe(true);expect(a.qa.sha256).toMatch(/^[a-f0-9]{64}$/);expect(a.turns.length).toBeGreaterThanOrEqual(4);expect(a.turns.every((t,i)=>t.endSeconds>t.startSeconds&&(i===0||t.startSeconds>=a.turns[i-1].endSeconds))).toBe(true);}
 });
 it('has six unique evidence-based non-pronunciation questions',()=>{
  expect(voicedShadowQuestions).toHaveLength(6);
  expect(new Set(voicedShadowQuestions.map(q=>q.id)).size).toBe(6);
  expect(scoreVoicedShadowKnowledge(Object.fromEntries(voicedShadowQuestions.map(q=>[q.id,q.correct])))).toBe(6);
  expect(scoreVoicedShadowKnowledge({})).toBe(0);
  for(const q of voicedShadowQuestions){expect(q.why.length).toBeGreaterThan(35);expect(q.choices[q.correct]).toBeTruthy();}
 });
 it('has an original published lesson and no machine pronunciation claim',()=>{
  const s=readFileSync('src/content/lessons/l0/hiragana-voiced-speaking.mdx','utf8');
  expect(s).toContain('lessonId: "l0-m03-c01-l08"');expect(s).toContain('publicationStatus: published');expect(s).toContain('Independent qualified Japanese pronunciation');
 });
});