import test from 'node:test';
import assert from 'node:assert/strict';
import { eligible, changedPaths, locations, isSiteUrl } from '../scripts/indexnow-submit.mjs';

const entry = (id, url, content, rest={}) =>
  ({id,url,content,status:'published',noindex:false,...rest});

test('unpublished or noindex lessons cannot be submitted',()=>{
  assert.equal(eligible(entry('x','/x/','x.mdx')),true);
  assert.equal(eligible(entry('x','/x/','x.mdx',{status:'draft'})),false);
  assert.equal(eligible(entry('x','/x/','x.mdx',{noindex:true})),false);
});
test('newly published and edited lessons are selected but drafts are excluded',()=>{
  const prev=[entry('a','/a/','a.mdx'),entry('b','/b/','b.mdx',{status:'reviewed'})];
  const now=[entry('a','/a/','a.mdx'),entry('b','/b/','b.mdx'),entry('c','/c/','c.mdx',{noindex:true})];
  assert.deepEqual(changedPaths(now,prev,['docs/LESSON_INVENTORY.json','a.mdx','c.mdx']),['/a/','/b/']);
});
test('static pages are detected, not previews, generic layouts, or 404s',()=>{
  assert.deepEqual(changedPaths([],[],['src/pages/index.astro','src/pages/about/index.astro','src/pages/404.astro','src/pages/[slug].astro','src/layouts/Base.astro']),['/','/about/']);
});
test('XML escapes and exact hostname enforcement',()=>{
  assert.deepEqual(locations('<urlset><loc>https://free-japanese-academy.pages.dev/a/?x=1&amp;y=2</loc></urlset>'),['https://free-japanese-academy.pages.dev/a/?x=1&y=2']);
  assert.equal(isSiteUrl('https://free-japanese-academy.pages.dev/learn/start/'),true);
  assert.equal(isSiteUrl('https://example.pages.dev/'),false);
  assert.equal(isSiteUrl('https://free-japanese-academy.pages.dev/?q=1'),false);
});
