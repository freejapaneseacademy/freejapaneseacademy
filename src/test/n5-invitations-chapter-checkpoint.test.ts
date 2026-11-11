import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m04-c04-chk-v1.json';
import {scoreInvitationCheckpoint} from '../components/interactive/InvitationChapterCheckpoint';
describe('N5-M04-C04-CHK invitation checkpoint',()=>{
 it('has 12 unique versioned, feedback-rich written items',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.id).toMatch(/^ex-n5-m04-c04-chk-\d\d$/);expect(q.version).toBe(1);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);expect(q.explanation.length).toBeGreaterThan(15);expect(q.type).toBe('single-choice');}});
 it('scores answer keys and incorrect attempts',()=>{const good=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreInvitationCheckpoint(good)).toBe(12);expect(scoreInvitationCheckpoint({})).toBe(0);const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));expect(scoreInvitationCheckpoint(wrong)).toBe(0);});
 it('does not misrepresent text as scored listening',()=>{expect(bank.items.every(q=>!q.skills.includes('listening'))).toBe(true);expect(bank.scoring.maxWrittenScore).toBe(12);});
});
