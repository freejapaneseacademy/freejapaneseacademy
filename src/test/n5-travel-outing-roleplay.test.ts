import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m05-c04-l08-v1.json';
import { outingRoleplayQuestions, scoreOutingRoleplay, OUTING_ROLEPLAY_QUIZ_ID } from '../components/interactive/OutingRoleplayPractice';
describe('outing role play',()=>{
 it('has a stable versioned bank and unambiguous keyed questions',()=>{expect(OUTING_ROLEPLAY_QUIZ_ID).toBe('n5-m05-c04-l08-v1');expect(bank.lessonId).toBe('n5-m05-c04-l08');expect(outingRoleplayQuestions).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}});
 it('scores correct and unanswered responses',()=>{const a=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreOutingRoleplay(a)).toBe(10);expect(scoreOutingRoleplay({})).toBe(0);expect(scoreOutingRoleplay({...a,[bank.items[0].id]:bank.items[0].choices[1].id})).toBe(9);});
});
