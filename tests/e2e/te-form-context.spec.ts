import {test,expect} from '@playwright/test';
const path='/learn/n5/module-06/chapter-02/lesson-01/';
test('keyboard selection, feedback, writing model and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/First Steps with the Te-Form/})).toBeVisible();
 await page.getByLabel('My two or three Japanese sentences (ungraded)').fill('顔を洗って、食べます。');
 await page.getByRole('button',{name:'Show model and self-check'}).click();
 await expect(page.getByText(/Check action order/)).toBeVisible();
 const groups=page.locator('.foundation-question');await expect(groups).toHaveCount(12);
 for(let i=0;i<12;i++){const radio=groups.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Recognition score: 12 / 12')).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeDisabled();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await page.getByLabel('My two or three Japanese sentences (ungraded)').fill('本を読んで、寝ます。');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
