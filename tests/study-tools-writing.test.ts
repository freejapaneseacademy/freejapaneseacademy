import { describe, expect, it } from 'vitest';
import { items, models, normalize } from '../src/components/interactive/StudyToolsWritingPractice';
describe('Chapter 04 L07 writing tasks',()=>{
 it('has twelve unique stable scored tasks with nonempty explanations',()=>{expect(items).toHaveLength(12);expect(new Set(items.map(x=>x.id)).size).toBe(12);expect(items.every(x=>x.answer&&x.why&&x.cue)).toBe(true);});
 it('normalizes whitespace and Japanese full-width punctuation without accepting romaji',()=>{expect(normalize(' にほんご。 ')).toBe('にほんご');expect(normalize('nihongo')).not.toBe('にほんご');});
 it('offers three independent open writing models',()=>{expect(models).toHaveLength(3);expect(new Set(models.map(x=>x.id)).size).toBe(3);});
});
