import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import bank from '../../src/content/exercises/l0-m03-c02-l05-v1.json';
const lesson=readFileSync('src/content/lessons/l0/hiragana-yoon-reading.mdx','utf8');
describe('L0-M03-C02-L05 reading',()=>{
 it('has ten unique answerable evidence-grounded items',()=>{
  expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.options[q.correctIndex]).toBeTruthy();expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(20);expect(lesson).toContain(q.evidence.phrase);}
 });
 it('contains the original chart, labels and mora contrasts',()=>{for(const s of ['きゃ','しゅ','ちょ','きや','しゃ・し・ん','ぎゅ・う・にゅ・う','じしょ','びょういん'])expect(lesson).toContain(s);});
});
