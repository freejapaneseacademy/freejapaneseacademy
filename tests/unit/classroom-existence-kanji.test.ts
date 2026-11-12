import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c03-l04-v1.json';
import {scoreClassroomKanji} from '../../src/components/interactive/ClassroomKanjiPractice';
describe('classroom existence kanji',()=>{
 it('has unique keyed items with explanatory choices',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);}});
 it('scores correct, blank and wrong answers',()=>{expect(scoreClassroomKanji(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);expect(scoreClassroomKanji({})).toBe(0);expect(scoreClassroomKanji(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);});
 it('varies correct positions',()=>expect(new Set(bank.items.map(q=>q.answerKey.choiceId)).size).toBe(4));
});
