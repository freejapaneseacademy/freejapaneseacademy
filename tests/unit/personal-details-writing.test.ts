import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c02-l07-v1.json';
import {scoreAnswers,normalizeModel} from '../../src/components/interactive/PersonalDetailsWriting';
describe('l0-m05-c02-l07 writing assessment',()=>{
 it('has unique stable IDs and meaningful keyed choices',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.choices.map(c=>c.id)).toContain(q.answerKey.choiceId);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.explanation.length).toBeGreaterThan(15);}});
 it('scores only keyed choices',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreAnswers(correct)).toBe(10);expect(scoreAnswers({})).toBe(0);});
 it('trims and NFC-normalizes optional model comparison',()=>{expect(normalizeModel(' ミナ ')).toBe('ミナ');});
});