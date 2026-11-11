import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m04-c04-l04-v1.json';
import { meetingKanjiQuestions, scoreMeetingKanji } from '../components/interactive/MeetingKanjiPractice';
describe('N5-M04-C04-L04 meeting-plan kanji',()=>{
  it('has twelve distinct keyed questions with rationales',()=>{
    expect(bank.lessonId).toBe('n5-m04-c04-l04');
    expect(meetingKanjiQuestions).toHaveLength(12);
    expect(new Set(meetingKanjiQuestions.map(q=>q.id)).size).toBe(12);
    for(const q of meetingKanjiQuestions){
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
      expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
      expect(q.objectiveIds.length).toBeGreaterThan(0);
      expect(q.knowledgeItemIds.length).toBeGreaterThan(0);
    }
  });
  it('scores only matching answer IDs',()=>{
    const perfect=Object.fromEntries(meetingKanjiQuestions.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreMeetingKanji(perfect)).toBe(12);
    expect(scoreMeetingKanji({})).toBe(0);
    const first=meetingKanjiQuestions[0];
    expect(scoreMeetingKanji({[first.id]:first.answerKey.choiceId})).toBe(1);
    expect(scoreMeetingKanji({[first.id]:'wrong-choice'})).toBe(0);
  });
  it('distributes keys among choices',()=>{
    expect(new Set(meetingKanjiQuestions.map(q=>q.answerKey.choiceId.slice(-2))).size).toBe(3);
  });
});