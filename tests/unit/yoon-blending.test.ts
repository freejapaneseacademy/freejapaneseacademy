import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m03-c02-l03-v1.json';
describe('contracted-kana blending assessment',()=>{
 it('has eight unique stable scored questions with aligned keys and evidence',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.options[q.correctIndex]).toBe(q.choices[q.correctIndex].text);expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);expect(q.explanation.length).toBeGreaterThan(30);expect(q.evidence.phrase.length).toBeGreaterThan(0);}});
 it('assesses one-mora contractions and long-vowel counts',()=>{expect(bank.items[0].options[bank.items[0].correctIndex]).toBe('きゃ');expect(bank.items[5].options[bank.items[5].correctIndex]).toBe('2');});
});
