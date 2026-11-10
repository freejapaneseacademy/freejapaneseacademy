import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c02-l06-v1.json';
import job from '../../scripts/tts/jobs/n5-m04-c02-l06.json';
import {gradeShoppingListening,shoppingListeningQuestions} from '../../src/components/interactive/ShoppingListeningPractice';
describe('n5-m04-c02-l06 checkout listening',()=>{
 it('has two original audio scenes and six evidence-backed unique questions',()=>{
 expect(job.schemaVersion).toBe(3);expect(job.tracks).toHaveLength(2);
 expect(job.tracks.map(t=>t.id)).toEqual(['a','b']);
 expect(bank.items).toHaveLength(6);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(6);
 for(const t of job.tracks){expect(bank.items.filter(q=>q.trackId===t.id)).toHaveLength(3);}
 for(const q of bank.items){const t=job.tracks.find(t=>t.id===q.trackId)!;expect(t.turns.some(x=>x.text.includes(q.evidence))).toBe(true);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);}
 expect(shoppingListeningQuestions).toHaveLength(6);
 });
 it('grades exact choice identifiers',()=>{expect(gradeShoppingListening(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(6);expect(gradeShoppingListening({})).toBe(0);});
});
