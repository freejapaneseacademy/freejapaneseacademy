import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m04-c01-chk-v1.json';
import {QUIZ_ID,scoredQuestions,listeningQuestions,scoreCheckpoint} from '../components/interactive/FoodChapterCheckpoint';
describe('food chapter checkpoint',()=>{
 it('has stable unique IDs and valid keyed choices',()=>{expect(QUIZ_ID).toBe('n5-m04-c01-chk-mixed-v1');expect(new Set(bank.items.map(q=>q.id)).size).toBe(14);for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation).toContain(q.evidence);}});
 it('keeps unverified listening unscored',()=>{expect(scoredQuestions).toHaveLength(10);expect(listeningQuestions).toHaveLength(4);expect(listeningQuestions.every(q=>q.status==='drafted')).toBe(true);});
 it('scores only correct responses',()=>{const correct=Object.fromEntries(scoredQuestions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreCheckpoint(correct)).toBe(10);expect(scoreCheckpoint({})).toBe(0);expect(scoreCheckpoint({...correct,[scoredQuestions[0].id]:'wrong'})).toBe(9);});
});