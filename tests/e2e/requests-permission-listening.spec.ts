import { test, expect } from '@playwright/test';
test('n5-m06-c03-l06: keyboard, audio gating and narrow dark-mode layout',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/n5/module-06/chapter-03/lesson-06/');
 await expect(page.getByRole('heading',{name:/Listen for Requests and Rules/i})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await page.getByRole('button',{name:/Reveal Japanese transcript/i}).first().focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText('この辞書を使ってもいいですか。')).toBeVisible();
 await expect(page.getByRole('button',{name:'Check listening answers'})).toBeDisabled();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 expect(overflow).toBe(false);
});