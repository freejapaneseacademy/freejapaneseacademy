import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m03-c02-l06-v1.json';
import {gradeRoutineListening} from '../components/interactive/RoutineListeningPractice';
const spoken=['毎朝、何時に起きますか。','六時半に起きます。七時に朝ご飯を食べます。','朝、テレビを見ますか。','いいえ、見ません。八時に学校へ行きます。','仕事のあと、何をしますか。','六時に家に帰ります。七時に晩ご飯を作ります。','夜、音楽を聞きますか。','はい、聞きます。でも、夜はコーヒーを飲みません。'].join(' ');
describe('n5-m03-c02-l06 audio evidence and grading',()=>{
it('has six unique evidenced items, three per track',()=>{expect(bank.items).toHaveLength(6);expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);for(const track of ['a','b'])expect(bank.items.filter(q=>q.trackId===track)).toHaveLength(3);for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(spoken).toContain(q.evidence);}});
it('grades perfect, blank and incorrect attempts',()=>{expect(gradeRoutineListening(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(6);expect(gradeRoutineListening({})).toBe(0);expect(gradeRoutineListening(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);});});
