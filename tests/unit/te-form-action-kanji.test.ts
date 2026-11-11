import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c02-l04-v1.json';
import { scoreActionKanji } from '../../src/components/interactive/ActionKanjiPractice';
describe('n5-m06-c02-l04 exercise integrity',()=>{
 it('has twelve unique keyed questions with unique choices and explanations',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}});
 it('scores correct answers and rejects incorrect ones',()=>{const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreActionKanji(answers)).toBe(12);expect(scoreActionKanji({})).toBe(0);});
});