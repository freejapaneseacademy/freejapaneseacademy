import { test, expect } from '@playwright/test';
test('L07 writing studio is keyboard accessible, scores kana, and supports self-review', async ({ page }) => {
  await page.goto('/learn/start/module-02/chapter-01/lesson-07/');
  await expect(page.getByRole('heading', { name: 'Write the fifteen hiragana' })).toBeVisible();
  const prompts = page.locator('fieldset').filter({ has: page.locator('input[lang="ja"]') });
  await expect(prompts).toHaveCount(20);
  const answers = ['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','かさ','すし','いす','ここ','せかい'];
  for (let i=0;i<answers.length;i++) await page.locator('fieldset input[lang="ja"]').nth(i).fill(answers[i]);
  await page.getByRole('button', { name: 'Check all 20 kana answers' }).click();
  await expect(page.getByText('Exact kana production: 20/20.')).toBeVisible();
  await page.getByRole('button', { name: 'Reveal models and self-review' }).click();
  await expect(page.getByText('Self-review rubric (not scored)')).toBeVisible();
  await page.getByRole('button', { name: 'Clear drafts' }).click();
  await expect(page.getByText('Self-review rubric (not scored)')).toHaveCount(0);
});
test('L07 fits a 320px viewport without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/learn/start/module-02/chapter-01/lesson-07/');
  await expect(page.getByRole('heading', { name: 'Kana writing studio' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
