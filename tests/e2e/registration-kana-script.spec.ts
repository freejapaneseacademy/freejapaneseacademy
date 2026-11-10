import {test,expect} from '@playwright/test';
const route='/learn/start/module-05/chapter-02/lesson-04/';
test('keyboard, retry, explanations and 320px viewport',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto(route);
 await expect(page.getByRole('heading',{name:/Numbers and personal details in kana/})).toBeVisible();
 const questions=page.locator('fieldset[data-question-id^="ex-l0-m05-c02-l04-"]');await expect(questions).toHaveCount(12);
 const button=page.getByRole('button',{name:'Check all twelve answers'});
 await expect(page.locator('astro-island').filter({has:button})).not.toHaveAttribute('ssr','');
 for(let i=0;i<12;i++){const radio=questions.nth(i).locator('input[type="radio"]').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked()}
 await button.click();await expect(page.getByText(/Written score: \d+\/12/)).toBeVisible();
 await expect(questions.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();await expect(button).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
});
test('dark mode retains accessible choices',async({page})=>{await page.emulateMedia({colorScheme:'dark'});await page.goto(route);await expect(page.locator('fieldset input[type="radio"]').first()).toBeVisible()});