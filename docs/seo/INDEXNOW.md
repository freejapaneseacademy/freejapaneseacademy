# IndexNow: FreeJapaneseAcademy

IndexNow is configured for `https://free-japanese-academy.pages.dev` with a root key file at `public/722667cd0b13f77b4f75fead7224eec8.txt`.

- `.github/workflows/indexnow.yml` runs on trusted `main` pushes or manual dispatch.
- It waits for Cloudflare's injected `CF_PAGES_COMMIT_SHA` at `/indexnow-deployment.txt` to equal the exact production commit before submission. It does not submit preview builds.
- First install (or manual bootstrap) checks every live canonical URL in the XML sitemap; subsequent pushes submit only affected public lessons and static Astro pages.
- All URL candidates must belong to the exact host, appear in the live sitemap, return HTML successfully, declare their own canonical URL, and not be `noindex`.
- IndexNow receives batches of at most 10,000 URLs through `https://api.indexnow.org/indexnow`. HTTP 200 or 202 means receipt, not guaranteed search indexing.
- The verification key file is necessarily public; no private API credential or extra npm package is required.
- On moving to a custom domain, rotate the host-specific key, adjust SITE and reconfigure after the canonical domain changes.

Monitor results in GitHub Actions > IndexNow production notifications, and in Bing Webmaster Tools > IndexNow.
