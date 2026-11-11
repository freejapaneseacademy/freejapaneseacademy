import { describe,it,expect } from 'vitest';
import { invitationQuestions,scoreInvitations } from '../../src/components/interactive/InvitationGrammarPractice';
describe('invitations and decisions grammar',()=>{
  it('contains twelve uniquely keyed questions with feedback',()=>{
    expect(invitationQuestions).toHaveLength(12);
    expect(new Set(invitationQuestions.map(q=>q.id)).size).toBe(12);
    for(const q of invitationQuestions){
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
      expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);
    }
  });
  it('scores only exact answer IDs',()=>{
    expect(scoreInvitations({})).toBe(0);
    expect(scoreInvitations(Object.fromEntries(invitationQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
    expect(scoreInvitations(Object.fromEntries(invitationQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});