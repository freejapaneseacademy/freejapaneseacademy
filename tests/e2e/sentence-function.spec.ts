import { test, expect } from '@playwright/test';

test('L03 sentence function practice saves an attempt and lesson completion',async({page})=>{
  await page.goto('/learn/start/module-01/chapter-01/lesson-03/');
  await expect(page.getByRole('heading',{level:1,name:/Japanese sentences/i})).toBeVisible();
  const section=page.locator('.foundation-practice');
  await expect(section.locator('fieldset')).toHaveCount(12);
  for(const fieldset of await section.locator('fieldset').all())await fieldset.locator('input[type="radio"]').first().check();
  await section.getByRole('button',{name:/Check answers & save score/i}).click();
  await expect(section.getByText(/Your result was saved locally/i)).toBeVisible();
  await section.getByRole('button',{name:/Compare with model/i}).click();
  await expect(section.getByText(/Self-review:/i)).toBeVisible();
  await page.getByRole('button',{name:/Mark lesson complete/i}).click();
  await expect(page.getByRole('button',{name:/Lesson completed/i})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:/Lesson completed/i})).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Sentence function')).toBeVisible();
});
for(const width of [320,375,768,1440])test('L03 responsive layout at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto('/learn/start/module-01/chapter-01/lesson-03/');
  const sizes=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
  expect(sizes.page).toBeLessThanOrEqual(sizes.viewport+2);
  await expect(page.locator('.foundation-practice')).toBeVisible();
});
