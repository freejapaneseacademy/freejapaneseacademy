import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c02-l08-v1.json';
import {scoreIntroductionShadow} from '../../src/components/interactive/IntroductionShadowing';
describe('optional introduction shadowing written check',()=>{
 it('uses eight unique valid keys and rationales',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.version).toBe(1);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);}});
 it('scores only keyed responses',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreIntroductionShadow(correct)).toBe(8);expect(scoreIntroductionShadow({})).toBe(0);expect(scoreIntroductionShadow({...correct,[bank.items[0].id]:'b'})).toBe(7);});
});