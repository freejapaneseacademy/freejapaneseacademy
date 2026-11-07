import { test, expect } from '@playwright/test';
test('L07 writing keyboard and 320px mobile', async ({ page }) => {
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-03/chapter-04/lesson-07/');
 await expect(page.getByRole('heading',{name:'Write the library words and sentences'})).toBeVisible();
 const values=['ほん','ねこ','としょかん','となり','ねこのほん','ほんをみます。','ほんはありますか。','ねこのほんはあそこです。'];
 for(let i=0;i<values.length;i++){await page.locator('input[id="ex-l0-m03-c04-l07-0'+(i+1)+'"]').fill(values[i]);}
 await page.getByRole('button',{name:'Check eight answers'}).click();
 await expect(page.getByText('Writing score: 8/8.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check eight answers'})).toBeDisabled();
 await page.getByLabel('Your fictional library note').fill('ねこのほんはあそこです。');
 await page.getByLabel('I distinguish topic は and object を.').check();
 await expect(page.getByText('1/4 self-review criteria checked.',{exact:false})).toBeVisible();
 await expect(page.locator('body')).toHaveJSProperty('scrollWidth',320);
});