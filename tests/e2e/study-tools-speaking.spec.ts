import { test, expect } from '@playwright/test';
const url='/learn/start/module-01/chapter-04/lesson-08/';
test('optional classroom shadowing exposes models and a knowledge check without microphone capture',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Speak Japanese classroom requests',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Start optional recording'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Play track A turn 1'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Play track B turn 1'})).toBeVisible();
 await expect(page.getByText('0 of 5 selected')).toBeVisible();
 await expect(page.getByText('Recording in progress')).toHaveCount(0);
 await page.getByRole('button',{name:'Show full transcript and translation'}).first().click();
 await expect(page.getByText('すみません。日本語を入力したいです。どうすればいいですか。',{exact:false}).first()).toBeVisible();
});
test('optional speaking remains accessible at 320px with keyboard focus',async({page})=>{
 await page.setViewportSize({width:320,height:720}); await page.goto(url);
 await expect(page.getByRole('button',{name:'Start optional recording'})).toBeVisible();
 await page.getByRole('button',{name:'Show full transcript and translation'}).first().focus();
 await expect(page.getByRole('button',{name:'Show full transcript and translation'}).first()).toBeFocused();
});
