import { test,expect } from '@playwright/test';
const url='/learn/start/module-01/chapter-02/lesson-05/';

test('L05 map, exact evidence, scoring, retry and Dexie progress persistence',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{level:1,name:/Read a Japanese pronunciation map/i})).toBeVisible();
  const practice=page.locator('.sound-reading-practice');
  await expect(practice.locator('tbody tr')).toHaveCount(11);
  await expect(practice.locator('fieldset')).toHaveCount(12);
  const submit=practice.getByRole('button',{name:'Check answers & save score'});
  await expect(submit).toBeDisabled();
  const correct=['a','b','a','c','a','b','c','a','b','a','c','b'];
  for(let i=0;i<12;i++)await practice.locator('fieldset').nth(i).locator('input[value="'+correct[i]+'"]').check();
  await submit.click();
  await expect(practice.getByRole('heading',{name:'12 / 12 correct'})).toBeVisible();
  await expect(practice.getByText(/Map evidence:/)).toHaveCount(12);
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Pronunciation-map reading')).toBeVisible();
  await page.goto(url);
  await page.getByRole('button',{name:/Mark lesson complete/}).click();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
});

test('L05 map and ungraded evidence note are accessible',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('region',{name:/Eleven-row pronunciation map/})).toBeVisible();
  await page.locator('#sound-reading-draft').fill('Row H: いえ house. Row I: いいえ no.');
  await page.getByRole('button',{name:'Compare with model and checklist'}).click();
  await expect(page.getByText('Model evidence note and self-review')).toBeVisible();
  await expect(page.getByText(/self-review, not an automated writing grade/)).toBeVisible();
});

for(const width of [320,375,390,768,1024,1440])test('L05 mobile layout, dark theme and keyboard focus at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:820});
  await page.goto(url);
  const root=page.locator('.sound-reading-practice');
  await expect(root).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await page.locator('html').evaluate(el=>{el.dataset.theme='dark';});
  await expect(root.getByRole('region',{name:/Eleven-row pronunciation map/})).toBeVisible();
  const first=root.locator('fieldset').first().locator('input[type="radio"]').first();
  await expect(first).toBeEnabled();
  await first.focus();
  await page.keyboard.press('Space');
  await expect(first).toBeChecked();
});
