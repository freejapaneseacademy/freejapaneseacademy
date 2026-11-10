import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/l0-m05-c04-l08-v1.json';
import {scoreFoundationReviewShadow} from '../components/interactive/FoundationReviewShadowing';
describe('l0-m05-c04-l08',()=>{it('has unique keys and three meaningful choices',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(x=>x.id)).size).toBe(8);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);}});it('scores selected responses without grading speech',()=>{expect(scoreFoundationReviewShadow({})).toBe(0);expect(scoreFoundationReviewShadow(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(8);});});
