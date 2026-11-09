import {test,expect} from '@playwright/test';
test('N5 vocabulary is keyboard accessible at 320px in dark mode',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/n5/module-01/chapter-01/lesson-02/');
 await expect(page.getByRole('heading',{name:/Meeting people/})).toBeVisible();
 const practice=page.locator('section[aria-labelledby="meeting-words-heading"]');
 await expect(practice.locator('fieldset')).toHaveCount(10);
 await practice.locator('input[type=radio]').first().focus();
 await practice.locator('input[type=radio]').first().press('Space');
 for(let i=1;i<10;i++)await practice.locator('fieldset').nth(i).locator('input[type=radio]').first().check();
 await practice.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Score: 10/10')).toBeVisible();
 await practice.getByRole('button',{name:'Try again'}).click();
 await expect(practice.getByRole('button',{name:'Check answers'})).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});