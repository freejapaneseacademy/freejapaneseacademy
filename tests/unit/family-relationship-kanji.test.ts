import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c03-l04-v1.json';
import {gradeFamilyRelationshipKanji} from '../../src/components/interactive/FamilyRelationshipKanjiPractice';
describe('N5 family relationship kanji',()=>{
 it('has ten unique keyed questions and distinct rationalized choices',()=>{
 expect(bank.lessonId).toBe('n5-m01-c03-l04');expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
 for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('scores keys only',()=>{expect(gradeFamilyRelationshipKanji(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);expect(gradeFamilyRelationshipKanji({})).toBe(0);expect(gradeFamilyRelationshipKanji(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);});
});