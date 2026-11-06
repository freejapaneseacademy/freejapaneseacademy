import {test,expect} from '@playwright/test';
test('Voiced L08 optional speaking is keyboard accessible, responsive and ungraded',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-03/chapter-01/lesson-08/');
 await expect(page.getByRole('heading',{name:'Shadow voiced and p-series hiragana in two everyday conversations'})).toBeVisible();
 await expect(page.locator('audio[src^="/audio/"]')).toHaveCount(2);
 await expect(page.getByRole('button',{name:'Check preparation and save knowledge score'})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Start optional recording'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Play track A turn 1'})).toBeVisible();
 for(const q of await page.locator('fieldset[data-question-id]').all()){await q.locator('input[type=radio]').first().check();}
 await page.getByRole('button',{name:'Check preparation and save knowledge score'}).click();
 await expect(page.getByText(/knowledge answers correct/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check preparation and save knowledge score'})).toBeDisabled();
 await page.evaluate(()=>document.documentElement.classList.add('dark'));
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});