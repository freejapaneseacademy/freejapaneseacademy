import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/l0-m04-c04-l03-v1.json';
describe('katakana loanword grammar',()=>{
 it('has ten distinct, versioned, answerable items',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.status).toBe('drafted');expect(q.version).toBe(1);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);expect(q.explanation.length).toBeGreaterThan(20);}});
 it('distinguishes small kana and long-vowel marks',()=>{expect(bank.items[1].choices[bank.items[1].correctIndex].text).toBe('パーティー');expect(bank.items[2].choices[bank.items[2].correctIndex].text).toBe('fa');expect(bank.items[3].choices[bank.items[3].correctIndex].text).toBe('チェ');});
});
