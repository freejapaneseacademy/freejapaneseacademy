import { test, expect } from '@playwright/test';
const url='/learn/n5/module-02/chapter-02/lesson-05/';
test('map reading is keyboard accessible and provides evidence feedback',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Reading a school building map'})).toBeVisible();
 const questions=page.locator('fieldset.foundation-question');
 await expect(questions).toHaveCount(10);
 for(let i=0;i<10;i++){const first=questions.nth(i).getByRole('radio').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.getByText(/10 correct|correct/).first()).toBeVisible();
 await expect(page.locator('.foundation-feedback')).toHaveCount(10);
 await page.getByRole('button',{name:'Retry reading check'}).click();
 await expect(questions.first().getByRole('radio').first()).not.toBeChecked();
});
test('320px viewport and dark mode do not overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.locator('article')).toContainText('図書室');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});
