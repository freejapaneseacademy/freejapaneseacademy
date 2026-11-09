import { describe,expect,it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c03-l03-v1.json';
describe('voiced katakana grammar',()=>{
 it('contains ten stable versioned and keyed questions',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c03-l03-/);expect(q.status).toBe('drafted');expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.explanation.length).toBeGreaterThan(20);}});
 it('discriminates dakuten, handakuten and the ン/ソ contrast',()=>{expect(bank.items[0].options[bank.items[0].correctIndex]).toBe('ガ');expect(bank.items[1].options[bank.items[1].correctIndex]).toBe('パ');expect(bank.items[5].options[bank.items[5].correctIndex]).toBe('ン');expect(bank.items[6].options[bank.items[6].correctIndex]).toBe('ソ');});
});
