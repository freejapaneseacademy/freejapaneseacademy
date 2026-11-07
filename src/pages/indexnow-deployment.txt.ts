import type { APIRoute } from 'astro';

// Static build marker. Submissions wait until the exact commit is publicly deployed.
export const prerender = true;
export const GET: APIRoute = () => new Response(process.env.CF_PAGES_COMMIT_SHA || 'local', {
  headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
});
