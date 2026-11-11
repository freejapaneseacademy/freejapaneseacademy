import { test, expect } from '@playwright/test';

const url = '/learn/start/module-01/chapter-02/lesson-02/';

test('Chapter 02 L02 flashcards, written word quiz, feedback, retry and local progress', async ({page}) => {
  await page.goto('/learn/start/');
  await page.getByRole('link', {name:/Study Chapter 02 lesson 02/}).click();
  await expect(page.getByRole('heading',{level:1,name:/Small sounds/})).toBeVisible();
  const practice = page.locator('.sound-vocabulary-practice');
  await expect(practice.locator('fieldset')).toHaveCount(14);
  await expect(practice.locator('audio')).toHaveCount(0);
  await practice.getByRole('button',{name:'Reveal answer'}).click();
  await expect(practice.getByText('Japanese vowel /a/')).toBeVisible();
  await practice.getByRole('button',{name:'Next',exact:true}).click();
  await expect(practice.locator('.vocabulary-card__term')).toHaveText('い');
  await expect(practice.getByRole('button',{name:'Check answers & save score'})).toBeDisabled();
  for (const fieldset of await practice.locator('fieldset').all()) {
    const radio = fieldset.locator('input[type=radio]');
    if (await radio.count()) await radio.first().check();
    else {
      const id = await fieldset.getAttribute('data-question-id');
      const typed = id?.endsWith('011')?'ie':id?.endsWith('012')?'isu':id?.endsWith('013')?'kasa':'aoi';
      await fieldset.locator('input[type=text]').fill(typed);
    }
  }
  await practice.getByRole('button',{name:'Check answers & save score'}).click();
  await expect(practice.getByText(/written vocabulary score was saved in this browser/)).toBeVisible();
  await expect(practice.locator('.foundation-feedback')).toHaveCount(14);
  await practice.getByRole('button',{name:'Practice again'}).click();
  await expect(practice.getByRole('button',{name:'Check answers & save score'})).toBeDisabled();
  await practice.locator('#sound-vocabulary-draft').fill('あおい かさ describes a blue umbrella.');
  await practice.getByRole('button',{name:'Compare with model and checklist'}).click();
  await expect(practice.getByText(/The adjective あおい directly describes/)).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Vowel words and meanings')).toBeVisible();
  await page.goto(url);
  await page.getByRole('button',{name:/Mark lesson complete/}).click();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
});
for (const width of [320,375,390,768,1024,1440]) {
  test('Chapter 02 L02 responsive and keyboard accessible at '+width+'px', async ({page}) => {
    await page.setViewportSize({width,height:820});
    await page.goto(url);
    const practice = page.locator('.sound-vocabulary-practice');
    await expect(practice).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
    await page.locator('html').evaluate(element => {element.dataset.theme='dark';});
    const first = practice.locator('fieldset').first().locator('input[type=radio]').first();
    await expect(first).toBeEnabled();
    await first.focus();
    await expect(first).toBeFocused();
  });
}
