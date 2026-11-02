# Google AdSense integration — Free Japanese Academy

## Site-wide installation

Publisher/client ID: `ca-pub-3399213817491318`.
The exact Google AdSense async script is included **once** in the shared
`src/layouts/Base.astro` HTML head. All current Astro pages inherit it, as
must all future pages and lessons. Never paste another loader into individual
MDX lessons, React components, or Astro pages.

The published `public/ads.txt` authorizes
`google.com, pub-3399213817491318, DIRECT, f08c47fec0942fa0` for this
publisher. Check its actual root URL after deployment.

## Owner's AdSense account steps

1. Add and verify the live site URL in AdSense **Sites** and request site review
   where applicable. Script installation alone does not mean that site review
   is complete or that ads are eligible to appear.
2. If you want Google **Auto ads**, turn them on for the site in AdSense
   **Ads** settings and adjust ad load, excluded areas, and page exclusions.
   The publisher script alone doesn't configure your account's Auto ads.
   In particular, protect study exercises and listening controls from intrusive
   overlays; use exclusions in AdSense where appropriate.
3. Configure and publish a **Google-certified TCF consent management platform**
   for applicable EEA, UK, and Swiss advertising through AdSense Privacy &
   messaging or another approved CMP. Do not claim a custom banner alone
   satisfies these requirements. Review the privacy notice and legal obligations.
4. Ensure the site remains free for learners. Do not insert ads into quiz
   options, interactive answer controls, or simulated instructional dialogue.

## Verification

The automated Playwright test `tests/e2e/adsense.spec.ts` ensures exactly
one loader in the document head across representative page types, and validates
`/ads.txt`. Source/config tests do not confirm actual AdSense approval,
impressions, revenue, or correctness of external consent account settings.

See Google's official setup instructions:
https://support.google.com/adsense/answer/7584263
https://support.google.com/adsense/answer/12171612
https://support.google.com/adsense/answer/9261307
https://support.google.com/adsense/answer/13554116
