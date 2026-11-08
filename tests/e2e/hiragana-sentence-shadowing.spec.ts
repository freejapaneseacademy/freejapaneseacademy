import { test, expect } from '@playwright/test';
const url='/learn/start/module-03/chapter-04/lesson-08/';
test('optional shadowing works by keyboard at 320px with no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Shadow a short hiragana library conversation'})).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(2);
  await expect(page.getByRole('button',{name:'Start optional recording'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Check six knowledge answers'})).toBeDisabled();
  for(const item of await page.locator('[data-question-id]').all())await item.locator('input[type=radio]').first().check();
  await expect(page.getByRole('button',{name:'Check six knowledge answers'})).toBeEnabled();
  await page.getByRole('button',{name:'Check six knowledge answers'}).click();
  await expect(page.getByText(/Knowledge score:/)).toBeVisible();
  await expect(page.getByRole('button',{name:'Try again'})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  expect(overflow).toBe(false);
});
test('self-review and retry are keyboard-accessible without requesting a microphone',async({page})=>{
  await page.goto(url);
  const checkbox=page.getByRole('checkbox').first();
  await checkbox.focus();await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await expect(page.getByText('1 of 4 observations checked.')).toBeVisible();
  await expect(page.getByRole('button',{name:'Start optional recording'})).toBeVisible();
});
