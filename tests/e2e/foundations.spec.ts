import {test,expect} from '@playwright/test';
test('first Foundations lesson loads, responds, and retains completed quiz in local dashboard',async({page})=>{
  await page.goto('/learn/start/');
  await expect(page.getByRole('link',{name:/Study lesson 01/i})).toBeVisible();
  await page.getByRole('link',{name:/Study lesson 01/i}).click();
  await expect(page.getByRole('heading',{name:/Japanese writing:/i,level:1})).toBeVisible();
  const check=page.locator('.foundation-practice');
  await expect(check.locator('fieldset')).toHaveCount(8);
  for(const fieldset of await check.locator('fieldset').all()) await fieldset.locator('input[type="radio"]').first().check();
  await check.getByRole('button',{name:/Check answers/i}).click();
  await expect(check.getByText(/Your attempt was saved on this browser/)).toBeVisible();
  await page.reload();
  await expect(page.locator('.foundation-practice fieldset')).toHaveCount(8);
  await page.getByRole('button',{name:/Mark lesson complete/i}).click();
  await expect(page.getByRole('button',{name:/Lesson completed/i})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:/Lesson completed/i})).toBeVisible();
});
for(const width of [320,375,390,768,1024,1440]) test(`L0 lesson layout ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:800});await page.goto('/learn/start/module-01/chapter-01/lesson-01/');
 const size=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:window.innerWidth}));
 expect(size.body).toBeLessThanOrEqual(size.viewport+2);
 await expect(page.locator('.foundation-practice')).toBeVisible();
});
