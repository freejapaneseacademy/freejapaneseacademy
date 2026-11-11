import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c01-l08-v1.json';
import { gradeFirstMeetingShadowing } from '../../src/components/interactive/FirstMeetingShadowing';

describe('N5 first-meeting optional shadowing bank',()=>{
  it('has eight unique versioned questions with valid keys and rationales',()=>{
    expect(bank.items).toHaveLength(8);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
    for(const q of bank.items){
      expect(q.version).toBe(1);
      expect(q.choices).toHaveLength(3);
      expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);
    }
  });
  it('grades written recognition, not spoken performance',()=>{
    const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
    expect(gradeFirstMeetingShadowing(correct)).toBe(8);
    expect(gradeFirstMeetingShadowing({})).toBe(0);
    const wrong={...correct,[bank.items[0].id]:bank.items[0].choices.find(c=>c.id!==bank.items[0].answerKey.choiceId)!.id};
    expect(gradeFirstMeetingShadowing(wrong)).toBe(7);
  });
});
