import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c01-l08-v1.json';
describe('l0-m04-c01-l08 optional shadowing written check',()=>{
 it('has eight stable, independently explained scored items',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.id.startsWith('ex-')).toBe(true);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.choices.every(c=>c.rationale.length>12)).toBe(true)}});
 it('distinguishes shi and tsu without pronunciation grading',()=>{expect(bank.items.some(q=>q.options.includes('シ')&&q.options.includes('ツ'))).toBe(true);expect(bank.scoring.officialJLPTScore).toBe(false)});
});