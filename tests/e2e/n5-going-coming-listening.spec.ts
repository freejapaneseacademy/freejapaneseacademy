import { test, expect } from '@playwright/test';
test('movement listening supports keyboard, transcript reveal and 320px dark mode', async ({page}) => {
  await page.setViewportSize({width:320,height:740});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto('/learn/n5/module-05/chapter-01/lesson-06/');
  await expect(page.getByRole('heading',{name:/Listen to a journey/i})).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(2);
  await expect(page.locator('fieldset[data-question-id]')).toHaveCount(6);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button',{name:/Reveal transcript/i}).first()).toBeVisible();
  await page.getByRole('button',{name:/Reveal transcript/i}).first().click();
  await expect(page.getByText(/Assisted practice:/i)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
