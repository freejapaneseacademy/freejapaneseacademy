import { test, expect } from '@playwright/test';
const path = '/learn/start/module-01/chapter-03/lesson-03/';

test('Chapter 03 L03 original written sentence check saves progress and reveals feedback', async ({page}) => {
  await page.goto('/learn/start/');
  await expect(page.getByRole('link',{name:/Study Chapter 03 lesson 03/})).toHaveAttribute('href',path);
  await page.goto(path);
  await expect(page.getByRole('heading',{level:1,name:/One mora changes the message/})).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',new RegExp('/chapter-03/lesson-03/'));
  const quiz=page.locator('section[aria-labelledby="rhythm-sentence-title"]');
  const fields=quiz.locator('fieldset.foundation-question');
  await expect(fields).toHaveCount(8);
  const check=quiz.getByRole('button',{name:'Check answers and save written score'});
  await expect(check).toBeDisabled();
  for(const field of await fields.all()) await field.locator('input[type=radio]').first().check();
  await expect(check).toBeEnabled();
  await check.click();
  await expect(quiz.getByRole('heading',{name:/[0-8] \/ 8 correct/})).toBeVisible();
  await expect(quiz.locator('.foundation-feedback')).toHaveCount(8);
  await quiz.getByRole('button',{name:'Try again'}).click();
  await expect(check).toBeDisabled();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Chapter 03 sentence meaning checkpoint')).toBeVisible();
});

for (const width of [320,375,768,1440]) {
  test('Chapter 03 L03 accessible at '+width+'px and keyboard-selectable',async({page})=>{
    await page.setViewportSize({width,height:860});
    await page.goto(path);
    await expect(page.locator('fieldset.foundation-question')).toHaveCount(8);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
    await page.locator('html').evaluate(node=>{node.dataset.theme='dark';});
    const radio=page.locator('fieldset.foundation-question').first().locator('input[type=radio]').first();
    await expect(radio).toBeEnabled();
    await radio.focus();
    await page.keyboard.press('Space');
    await expect(radio).toBeChecked();
  });
}
