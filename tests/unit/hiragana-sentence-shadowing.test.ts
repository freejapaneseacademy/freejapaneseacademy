import { describe, expect, it } from 'vitest';
import { models, questions, scoreKnowledge } from '../../src/lib/hiraganaSentenceShadowing';

describe('l0-m03-c04-l08 shadowing content',()=>{
  it('has two distinct dialogue models with exact authored L06 Japanese turns',()=>{
    expect(models).toHaveLength(2);
    expect(models[0].turns).toHaveLength(4);
    expect(models[1].turns).toHaveLength(5);
    expect(models[0].turns[1].japanese).toBe('はい。ねこのほんはありますか。');
    expect(models[1].turns[1].japanese).toBe('はい。なまえをかいてください。');
    expect(new Set(models.map(m=>m.src)).size).toBe(2);
  });
  it('has six stable unique scored items and sensible key range',()=>{
    expect(questions).toHaveLength(6);
    expect(new Set(questions.map(q=>q.id)).size).toBe(6);
    for(const q of questions){expect(q.id).toMatch(/^ex-l0-m03-c04-l08-00[1-6]$/);expect(q.correctIndex).toBeGreaterThanOrEqual(0);expect(q.correctIndex).toBeLessThan(q.options.length);expect(q.rationale.length).toBeGreaterThan(25);}
  });
  it('scores keyed and incorrect choices without inventing a pronunciation grade',()=>{
    expect(scoreKnowledge(Object.fromEntries(questions.map(q=>[q.id,q.correctIndex])))).toBe(6);
    expect(scoreKnowledge(Object.fromEntries(questions.map(q=>[q.id,(q.correctIndex+1)%q.options.length])))).toBe(0);
  });
});
