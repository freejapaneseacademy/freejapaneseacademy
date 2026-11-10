import { describe, expect, it } from 'vitest';
import { captionQuestions, gradeCaptionAnswers, readingQuizId } from '../src/lib/soundChangeReading';
describe('Chapter 03 L05 original caption-reading assessment',()=>{
 it('has twelve distinct stable questions and four unique card choices',()=>{
  expect(readingQuizId).toBe('l0-m01-c03-l05-reading-v1');
  expect(captionQuestions).toHaveLength(12);
  expect(new Set(captionQuestions.map(q=>q.id)).size).toBe(12);
  for(const q of captionQuestions){expect(q.choices).toHaveLength(4);expect(new Set(q.choices).size).toBe(4);expect(q.choices).toContain(q.answer);expect(q.evidence).toContain(q.answer+' — ');expect(q.explanation.length).toBeGreaterThan(35)}
 });
 it('grades only explicitly correct choices and never counts blanks',()=>{
  expect(gradeCaptionAnswers({})).toBe(0);
  const correct=Object.fromEntries(captionQuestions.map(q=>[q.id,q.answer]));
  expect(gradeCaptionAnswers(correct)).toBe(12);
  expect(gradeCaptionAnswers({...correct,[captionQuestions[0].id]:'Z'})).toBe(11);
 });
 it('tests long vowels, gemination, and nasal mora as written evidence',()=>{
  const all=captionQuestions.map(q=>q.evidence+' '+q.explanation).join(' ');
  for(const text of ['おばあさん','さっか','きって','こうこう','さんぽ','ほん'])expect(all).toContain(text);
 });
});
