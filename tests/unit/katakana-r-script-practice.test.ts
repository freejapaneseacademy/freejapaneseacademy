import {describe,expect,it} from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c03-l04-v1.json';
describe('katakana R row script practice',()=>{
 it('has twelve stable keyed schema-conforming questions',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c03-l04-/);expect(q.version).toBe(1);expect(q.status).toBe('drafted');expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(20);expect(q.objectiveIds.length).toBeGreaterThan(0);}});
 it('checks R-row recognition and voiced marks',()=>{expect(bank.items.slice(0,5).map(q=>q.options[q.correctIndex])).toEqual(['ラ','リ','ル','レ','ロ']);expect(bank.items[8].options[bank.items[8].correctIndex]).toBe('ポ');expect(bank.items[9].options[bank.items[9].correctIndex]).toBe('ペン');});
});