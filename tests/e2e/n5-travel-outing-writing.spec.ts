import { test, expect } from '@playwright/test';

test.describe('N5 outing writing lesson', () => {
  test('supports keyboard answers, scoring, retry and local draft controls', async ({ page }) => {
    await page.goto('/learn/n5/module-05/chapter-04/lesson-07/');
    await expect(page.getByRole('heading',{name:/Write an outing plan/i})).toBeVisible();
    const draft=page.getByLabel('Your Japanese draft');
    await draft.fill('午前九時に駅の前で集合します。');
    await page.getByRole('button',{name:'Save draft'}).click();
    await page.getByRole('button',{name:'Clear draft'}).click();
    await expect(draft).toHaveValue('');
    await page.getByRole('button',{name:'Load draft'}).click();
    await expect(draft).toHaveValue('');
    await page.getByRole('button',{name:'Compare model'}).click();
    await expect(page.getByText('One possible model')).toBeVisible();
    const questions=page.locator('[data-question-id]');
    await expect(questions).toHaveCount(8);
    for(let i=0;i<8;i++) {
      const first=questions.nth(i).getByRole('radio').first();
      await first.focus();
      await page.keyboard.press('Space');
      await expect(first).toBeChecked();
    }
    await page.getByRole('button',{name:'Check 8 answers'}).click();
    await expect(page.getByText(/Written recognition score: \d\/8/)).toBeVisible();
    await page.getByRole('button',{name:'Retry questions'}).click();
    await expect(page.getByRole('button',{name:'Check 8 answers'})).toBeDisabled();
  });
  test('is readable at 320px in dark mode without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({width:320,height:720});
    await page.emulateMedia({colorScheme:'dark'});
    await page.goto('/learn/n5/module-05/chapter-04/lesson-07/');
    await expect(page.getByLabel('Your Japanese draft')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
    expect(overflow).toBe(false);
  });
});