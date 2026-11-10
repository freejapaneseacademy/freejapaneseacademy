import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c03-l06-v1.json';
import job from '../../scripts/tts/jobs/n5-m04-c03-l06.json';
import {gradeAdjectiveListening,adjectiveListeningQuestions} from '../../src/components/interactive/AdjectiveListeningPractice';
describe('n5-m04-c03-l06 adjective comparisons listening',()=>{
it('provides two distinct original scenes and six unique evidence-backed questions',()=>{
expect(job.schemaVersion).toBe(3);expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
expect(bank.items).toHaveLength(6);expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
for(const track of job.tracks)expect(bank.items.filter(q=>q.trackId===track.id)).toHaveLength(3);
for(const q of bank.items){const track=job.tracks.find(t=>t.id===q.trackId)!;expect(track.turns.some(turn=>turn.text.includes(q.evidence))).toBe(true);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>Boolean(c.rationale))).toBe(true);}
expect(adjectiveListeningQuestions).toHaveLength(6);
});
it('grades only exact keyed choices',()=>{expect(gradeAdjectiveListening(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(6);expect(gradeAdjectiveListening({})).toBe(0);});
});
