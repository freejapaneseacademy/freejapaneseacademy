import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c04-l04-v1.json';
import {scoreKanaFluency} from '../../src/components/interactive/KanaFluencyLab';
describe('foundation kana fluency',()=>{
 it('has ten unique valid items with explanations and distinct choices',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.explanation.length).toBeGreaterThan(15);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.map(c=>c.id)).toContain(q.answerKey.choiceId);}});
 it('scores exact choice IDs only',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreKanaFluency(correct)).toBe(10);const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices[1].id]));expect(scoreKanaFluency(wrong)).toBe(0);});
});