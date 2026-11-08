import { test, expect } from '@playwright/test';
const url='/learn/start/module-03/chapter-02/lesson-08/';
test('optional shadowing has two licensed audio models and scores knowledge',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Listen and shadow · optional speaking'})).toBeVisible();
 await expect(page.locator('audio[src^="/audio/fja-l0-m03-c02-l06-"]')).toHaveCount(2);
 await expect(page.getByRole('button',{name:'Start optional recording'})).toBeVisible();
 for(const q of await page.locator('fieldset[data-question-id]').all())await q.locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check preparation and save knowledge score'}).click();
 await expect(page.getByText('6 / 6 knowledge answers correct')).toBeVisible();
});
test('320px dark mode keyboard and no overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:'Listen and shadow · optional speaking'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
 const playTurn = page.getByRole('button',{name:'Play track A turn 1'});
 // Wait for the React island to enable playback controls after hydration.
 await expect(playTurn).toBeEnabled();
 await playTurn.focus();
 await expect(playTurn).toBeFocused();
});