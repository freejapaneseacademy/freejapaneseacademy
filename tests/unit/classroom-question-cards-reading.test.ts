import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c02-l05-v1.json';
import { scoreClassroomCards } from '../../src/components/interactive/ClassroomQuestionCards';
describe('n5-m01-c02-l05 reading assessment',()=>{
 it('has unique versioned ids and valid distinct options',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);}});
 it('scores an all-correct attempt and zero answers',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreClassroomCards(correct)).toBe(10);expect(scoreClassroomCards({})).toBe(0);});
 it('does not count wrong options',()=>{const wrong=Object.fromEntries(bank.items.map(q=>[q.id,'b']));expect(scoreClassroomCards(wrong)).toBe(0);});
});