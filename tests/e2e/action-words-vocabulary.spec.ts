import { test, expect } from '@playwright/test';
test('action vocabulary is keyboard operable with feedback and retry',async({page})=>{
 await page.goto('/learn/n5/module-06/chapter-01/lesson-02/');
 await expect(page.getByRole('heading',{name:/Action words: Recognize dictionary forms/i})).toBeVisible();
 const questions=page.locator('.foundation-question');await expect(questions).toHaveCount(12);
 await questions.first().locator('input[type=radio]').first().focus();await page.keyboard.press('Space');
 for(let i=1;i<12;i++)await questions.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:/Check answers and save score/}).click();
 await expect(page.getByText(/correct/).first()).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByText('0 of 12 answered')).toBeVisible();
});
test('320px dark-mode action vocabulary has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/n5/module-06/chapter-01/lesson-02/');
 await expect(page.locator('.foundation-question')).toHaveCount(12);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});