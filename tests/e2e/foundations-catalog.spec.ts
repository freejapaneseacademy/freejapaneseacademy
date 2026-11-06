import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const route='/learn/start/';
const inventory=JSON.parse(readFileSync('docs/LESSON_INVENTORY.json','utf8'));
const expected=inventory.items.filter((entry:any)=>entry.level==='l0'&&entry.status==='published')
  .map((entry:any)=>entry.id).sort((a:string,b:string)=>{
    const rank=(id:string)=>{
      const v=/^l0-m(\d+)-c(\d+)-(l(\d+)|chk)$/.exec(id)!;
      return Number(v[1])*10000+Number(v[2])*100+(v[4]?Number(v[4]):99);
    };
    return rank(a)-rank(b);
  });

test('Foundations is a single catalog with unique inventory-derived entries in correct order',async({page})=>{
  await page.goto(route);
  await expect(page.getByRole('heading',{level:1,name:/Your path into Japanese/})).toBeVisible();
  await expect(page.locator('.foundation-catalog-module')).toHaveCount(new Set(expected.map(id=>id.match(/^l0-m\d+/)![0])).size);
  const ids=await page.locator('#foundations-catalog [data-foundation-lesson-id]')
    .evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-foundation-lesson-id')));
  expect(ids).toEqual(expected);
  expect(new Set(ids).size).toBe(ids.length);
  expect(await page.locator('main .foundation-catalog-list li').count()).toBe(expected.length);
  const hrefs=await page.locator('[data-foundation-lesson-id] a').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
  for(let i=0;i<expected.length;i++)expect(hrefs[i]).toMatch(/\/learn\/start\/module-\d{2}\/chapter-\d{2}\/(lesson-\d{2}|checkpoint)\/$/);
  expect(await page.locator('main #foundations-catalog').count()).toBe(1);
});

test('Chapter disclosures work by keyboard and show a checkpoint after lesson 08',async({page})=>{
  await page.goto(route);
  const first=page.locator('.foundation-catalog-chapter').first();
  await expect(first).toHaveAttribute('open','');
  const firstId=await first.locator('[data-foundation-lesson-id]').first().getAttribute('data-foundation-lesson-id');
  expect(firstId).toBe('l0-m01-c01-l01');
  const lastId=await first.locator('[data-foundation-lesson-id]').last().getAttribute('data-foundation-lesson-id');
  expect(lastId).toBe('l0-m01-c01-chk');
  await first.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(first).not.toHaveAttribute('open','');
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('open','');
  await expect(first.locator('a').first()).toBeVisible();
});

for(const width of [320,375,768,1280]){
  test('Foundations catalog stays inside viewport and supports dark theme at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:860});
    await page.goto(route);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    await expect(page.locator('.foundation-catalog-chapter').first().locator('a').first()).toBeVisible();
    await page.locator('html').evaluate(node=>node.dataset.theme='dark');
    await expect(page.locator('.foundation-catalog-card').first()).toBeVisible();
    await page.locator('.foundation-catalog-card').first().focus();
    await expect(page.locator('.foundation-catalog-card').first()).toBeFocused();
  });
}
