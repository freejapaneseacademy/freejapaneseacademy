import { test, expect } from '@playwright/test';
const path='/learn/n5/module-01/chapter-01/lesson-08/';
test('optional audio, transcript, keyboard quiz and retry',async({page})=>{
  await page.goto(path);
  await expect(page.getByRole('heading',{name:/First-meeting shadowing/})).toBeVisible();
  await expect(page.locator('audio source[type="audio/wav"]')).toHaveCount(2);
  await expect(page.getByRole('button',{name:'Start recording'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Stop recording'})).toBeDisabled();
  await page.getByText('Show practice script and meaning').first().click();
  await expect(page.getByText(/たなかさんは、せんせいですか/).first()).toBeVisible();
  const questions=page.locator('[data-question-id]');
  await expect(questions).toHaveCount(8);
  await questions.first().locator('input[type=radio]').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(questions.first().locator('input[type=radio]:checked')).toHaveCount(1);
  for(let i=0;i<8;i++) await questions.nth(i).locator('input[type=radio]').first().check();
  await page.getByRole('button',{name:'Check 8 answers'}).click();
  await expect(page.getByText(/Written recognition:/)).toBeVisible();
  await expect(page.getByText(/No pronunciation score/)).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check 8 answers'})).toBeDisabled();
});
test('320px dark mode is accessible without horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(path);
  await expect(page.locator('[data-question-id]')).toHaveCount(8);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
