import { test, expect } from '@playwright/test';

test('contact route has a working configured HTML POST form and direct email fallback', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Get in touch');
  const form = page.locator('form.contact-form');
  await expect(form).toHaveAttribute('method', 'POST');
  await expect(form).toHaveAttribute('action', 'https://formsubmit.co/free-japanese-academy@protonmail.com');
  await expect(page.getByLabel('Your name *')).toBeVisible();
  await expect(page.getByLabel('Your email *')).toBeVisible();
  await expect(page.getByLabel('What is this about? *')).toBeVisible();
  await expect(page.getByLabel('Your message *')).toBeVisible();
  await expect(page.locator('input[name="_honey"]')).toHaveCount(1);
  await expect(page.locator('input[name="_captcha"]')).toHaveCount(0);
  await expect(page.locator('a[href="mailto:free-japanese-academy@protonmail.com"]')).toBeVisible();
  expect(await form.evaluate((node: HTMLFormElement) => node.checkValidity())).toBe(false);
  await page.getByLabel('Your name *').fill('Academy tester');
  await page.getByLabel('Your email *').fill('tester@example.com');
  await page.getByLabel('What is this about? *').selectOption('Content correction');
  await page.getByLabel('Your message *').fill('This reading lesson contains a typo to review.');
  expect(await form.evaluate((node: HTMLFormElement) => node.checkValidity())).toBe(false);
  await page.getByRole('checkbox').check();
  expect(await form.evaluate((node: HTMLFormElement) => node.checkValidity())).toBe(true);
  // Never transmit fake user messages to the real Proton mailbox in CI.
});

test('contact remains discoverable through the footer and on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.site-footer a[href="/contact/"]')).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload();
  await page.locator('.mobile-nav summary').click();
  await expect(page.locator('.mobile-nav a[href="/contact/"]')).toBeVisible();
  await page.locator('.mobile-nav a[href="/contact/"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Get in touch');
});
