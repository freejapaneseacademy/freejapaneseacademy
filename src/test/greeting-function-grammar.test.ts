import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/l0-m05-c01-l03-v1.json';
describe('greeting function grammar',()=>{
 it('has ten distinct, versioned, schema-keyed questions',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.id).toMatch(/^ex-/);expect(q.status).toBe('drafted');expect(q.version).toBe(1);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);expect(q.explanation.length).toBeGreaterThan(20);expect(q.objectiveIds.length).toBeGreaterThan(0);expect(q.knowledgeItemIds.length).toBeGreaterThan(0);}});
 it('distinguishes polite morning, daytime and classroom requests',()=>{expect(bank.items[0].choices[bank.items[0].correctIndex].text).toBe('おはようございます');expect(bank.items[1].choices[bank.items[1].correctIndex].text).toBe('こんにちは');expect(bank.items[4].choices[bank.items[4].correctIndex].text).toBe('Read the text');});
});
