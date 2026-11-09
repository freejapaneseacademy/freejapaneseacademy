import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import inventory from '../../docs/LESSON_INVENTORY.json';

describe('N5 canonical routes and SEO redirects', () => {
  const redirects = readFileSync('public/_redirects', 'utf8').split(/\r?\n/);
  const lessons = inventory.items.filter(item => item.level === 'n5' && item.status === 'published' && item.noindex === false);
  it('provides a permanent redirect from each legacy content slug to the canonical lesson', () => {
    expect(lessons).toHaveLength(36);
    for (const lesson of lessons) {
      const slug = lesson.content.split('/').at(-1)?.replace(/\.mdx$/, '');
      expect(redirects).toContain('/learn/n5/' + slug + '/ ' + lesson.url + ' 301');
    }
  });
  it('excludes canonical lessons from the demonstration-only dynamic route', () => {
    const source = readFileSync('src/pages/learn/[level]/[slug].astro', 'utf8');
    expect(source).toContain("lesson.data.isDemo === true");
  });
});
