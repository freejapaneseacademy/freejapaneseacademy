import {test,expect} from '@playwright/test';
const path='/learn/n5/module-07/chapter-03/lesson-03/';
test('keyboard selection, answer feedback, retry and ungraded writing',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Comparing Choices/})).toBeVisible();
 const writing=page.getByLabel('Write three or four polite sentences with より, どちら and 一番');
 await writing.fill('バスより電車のほうが速いです。');
 await page.getByRole('button',{name:'Show writing model and self-check'}).click();
 await expect(page.getByText(/Check: baseline after/)).toBeVisible();
 const groups=page.locator('.foundation-question');
 await expect(groups).toHaveCount(12);
 const correct=[0,1,1,2,0,1,2,0,1,0,1,2];
 for(let i=0;i<12;i++){const radio=groups.nth(i).getByRole('radio').nth(correct[i]);await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Recognition score: 12 / 12')).toBeVisible();
 await expect(groups.first().getByText(/Evidence:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeDisabled();
 await expect(writing).toHaveValue('バスより電車のほうが速いです。');
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await page.getByLabel('Write three or four polite sentences with より, どちら and 一番').fill('緑カフェのほうが静かです。');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
