import { test, expect } from '@playwright/test';
const url='/learn/start/module-01/chapter-04/lesson-07/';
test('writing lesson supports keyboard, local feedback and self-review',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Write and type Japanese classroom requests'})).toBeVisible();
 const input=page.getByLabel('1. Japanese language (hiragana)');
 await input.fill('にほんご');
 await page.getByRole('button',{name:'Check 12 Japanese spellings'}).click();
 await expect(page.getByText('1 / 12')).toBeVisible();
 await page.getByRole('button',{name:'Reveal models for self-review'}).click();
 await expect(page.getByRole('region').getByText('ひらがなで かいてください。')).toBeVisible();
 await page.getByLabel(/Ask a teacher to write in hiragana/).fill('ひらがなで かいてください。');
 await page.getByRole('button',{name:'Clear my drafts'}).click();
 await expect(page.getByLabel(/Ask a teacher to write in hiragana/)).toHaveValue('');
});
test('writing lesson remains usable at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.goto(url);
 await expect(page.getByRole('button',{name:'Check 12 Japanese spellings'})).toBeVisible();
 await page.getByLabel('1. Japanese language (hiragana)').fill('にほんご');
 await page.getByRole('button',{name:'Check 12 Japanese spellings'}).click();
 await expect(page.getByText('1 / 12')).toBeVisible();
});
