import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import bank from '../src/content/exercises/l0-m02-c02-l05-v1.json';
const lesson=readFileSync('src/content/lessons/l0/hiragana-tnh-label-reading.mdx','utf8');
describe('L0 M02 C02 L05 evidence reading',()=>{
 it('has eight stable unique scored questions with matching answer keys and printed evidence',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m02-c02-l05-\d{2}$/);expect(q.options[q.correctIndex]).toBeTruthy();expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(20);expect(lesson).toContain(q.evidence.phrase)}
 });
 it('contains the source labels and all T/N/H characters',()=>{
  for(const word of ['はな','ふね','ほし','なつ','ねこ','たこ','つき','ひと'])expect(lesson).toContain(word);
  for(const kana of 'たちつてとなにぬねのはひふへほ')expect(lesson).toContain(kana);
 });
});
