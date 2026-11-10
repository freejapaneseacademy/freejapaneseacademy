import { test, expect } from '@playwright/test';
test('Level 0 vocabulary lesson flashcards, quiz, and local progress work',async({page})=>{
  await page.goto('/learn/start/module-01/chapter-01/lesson-02/');
  await expect(page.getByRole('heading',{name:/Words for your first Japanese classroom/i})).toBeVisible();
  await page.getByRole('button',{name:'Reveal answer'}).click();
  await expect(page.getByText('rounded-looking kana; many words and grammar parts')).toBeVisible();
  await page.getByRole('button',{name:'Next',exact:true}).click();
  await expect(page.getByText('カタカナ',{exact:true}).last()).toBeVisible();
  const practice=page.locator('.vocabulary-practice');
  for(const fieldset of await practice.locator('fieldset').all()){
    const radio=fieldset.locator('input[type="radio"]');
    if(await radio.count()) await radio.first().check();
    else {
      const id=await fieldset.getAttribute('data-question-id');
      await fieldset.locator('input[type="text"]').fill(id?.endsWith('011')?'hiragana':'imi');
    }
  }
  await practice.getByRole('button',{name:/Check answers & save score/}).click();
  await expect(practice.getByText(/Your practice result was saved on this browser/)).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Classroom vocabulary')).toBeVisible();
  await page.goto('/learn/start/module-01/chapter-01/lesson-02/');
  await page.getByRole('button',{name:/Mark lesson complete/}).click();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
});
for(const width of [320,375,390,768,1024,1440]) test('vocabulary lesson has no horizontal overflow at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto('/learn/start/module-01/chapter-01/lesson-02/');
  const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:window.innerWidth}));
  expect(dims.scroll).toBeLessThanOrEqual(dims.width+2);
  await expect(page.locator('.vocabulary-practice')).toBeVisible();
});
