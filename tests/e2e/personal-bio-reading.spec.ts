import { test,expect } from '@playwright/test';
const url='/learn/n5/module-01/chapter-04/lesson-05/';
test('keyboard answer selection, saved score, feedback and retry',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Find the evidence in the three bios'})).toBeVisible();
  const questions=page.locator('[data-question-id]');
  await expect(questions).toHaveCount(10);
  const correct=['a','b','c','a','b','c','a','b','c','a'];
  for(let i=0;i<correct.length;i++){
    const radio=questions.nth(i).locator('input[value="'+correct[i]+'"]');
    await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();
  }
  await page.getByRole('button',{name:'Check answers and save attempt'}).click();
  await expect(page.getByRole('heading',{name:'10 / 10 correct'})).toBeVisible();
  await expect(page.locator('.foundation-feedback')).toHaveCount(10);
  await page.getByRole('button',{name:'Try again'}).click();
  await expect(page.getByText('0 of 10 answered')).toBeVisible();
});
test('320px mobile dark mode, model toggle and no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:700});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Find the evidence in the three bios'})).toBeVisible();
  await page.getByLabel('Write two Japanese sentences about a fictional person from the bios.').fill('みおさんは 京都出身です。');
  await page.getByRole('button',{name:'Compare with model'}).click();
  await expect(page.getByText('Self-check:',{exact:false})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2)).toBe(true);
});
