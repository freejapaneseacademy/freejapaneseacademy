import { test, expect } from '@playwright/test';

test('L04 kana cards, optional drawing, keyboard input and browser-local score',async({page})=>{
  await page.goto('/learn/start/module-01/chapter-01/lesson-04/');
  await expect(page.getByRole('heading',{name:/Recognize and type your first kana/i,level:1})).toBeVisible();
  const practice=page.locator('.script-practice');
  await practice.getByRole('button',{name:'Reveal partner'}).click();
  await expect(practice.locator('.script-pair__match')).toContainText('ア');
  await practice.getByRole('button',{name:'Next',exact:true}).click();
  await expect(practice.locator('.script-pair__glyph')).toContainText('い');
  await practice.getByRole('button',{name:'Clear drawing'}).click();
  await expect(practice.locator('canvas')).toBeVisible();
  for(const fieldset of await practice.locator('fieldset').all()){
    const radios=fieldset.locator('input[type="radio"]');
    if(await radios.count())await radios.first().check();
    else {
      const id=await fieldset.getAttribute('data-question-id');
      const correct:Record<string,string>={'009':'あ','010':'イ','011':'う','012':'オ'};
      await fieldset.locator('input[type="text"]').fill(correct[(id??'').slice(-3)]??'');
    }
  }
  await practice.getByRole('button',{name:'Check answers & save score'}).click();
  await expect(practice.getByText(/Your result was saved locally/)).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Kana recognition and typing')).toBeVisible();
  await page.goto('/learn/start/module-01/chapter-01/lesson-04/');
  await page.getByRole('button',{name:/Mark lesson complete/}).click();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:/Lesson completed/})).toBeVisible();
});

test('L04 on-screen kana palette and writing self-review work without an IME',async({page})=>{
  await page.goto('/learn/start/module-01/chapter-01/lesson-04/');
  const q=page.locator('[data-question-id="ex-l0-m01-c01-l04-009"]');
  await q.getByRole('button',{name:'Enter あ'}).click();
  await expect(q.locator('input[type="text"]')).toHaveValue('あ');
  await page.locator('#script-draft').fill('さくら uses hiragana; コーヒー uses katakana.');
  await page.getByRole('button',{name:/Compare with model and checklist/}).click();
  await expect(page.getByText('Model response',{exact:true})).toBeVisible();
});

for(const width of [320,375,390,768,1024,1440])test('L04 layout has no horizontal overflow at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto('/learn/start/module-01/chapter-01/lesson-04/');
  const size=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  expect(size.body).toBeLessThanOrEqual(size.viewport+2);
  await expect(page.locator('.script-practice')).toBeVisible();
});
