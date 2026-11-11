import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c01-chk-v1.json';
import {scoreVerbCheckpoint} from '../../src/components/interactive/VerbGroupsChapterCheckpoint';
describe('N5 M06 C01 checkpoint bank',()=>{
 it('has 16 distinct, answerable questions with feedback and evidence',()=>{expect(bank.items).toHaveLength(16);expect(new Set(bank.items.map(q=>q.id)).size).toBe(16);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(12);expect(q.evidence.length).toBeGreaterThan(0);expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);}});
 it('scores perfect and empty answers correctly',()=>{expect(scoreVerbCheckpoint({})).toBe(0);expect(scoreVerbCheckpoint(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(16);});
 it('separates written review from listening claims',()=>{expect(bank.source).toContain('written checkpoint');expect(bank.scoring.officialJLPTScore).toBe(false);});
});