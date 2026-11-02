/* FreeJapaneseAcademy read-only Japanese WAV service. Original KV audio is immutable.
 * Cache successful validated bytes per Cloudflare edge, retry transient KV reads,
 * and log sanitized failures. Source of truth: two original L06 recordings.
 */
addEventListener('fetch', event => event.respondWith(handle(event.request, event)));
const TRACKS = Object.freeze({
  '/l0-m01-c01-l06-a.wav': Object.freeze({ key: 'l0-m01-c01-l06-track-a.wav.b64', bytes: 1344706 }),
  '/l0-m01-c01-l06-b.wav': Object.freeze({ key: 'l0-m01-c01-l06-track-b.wav.b64', bytes: 992532 }),
});
const inFlight = new Map();
const FULL_CACHE_SECONDS = 86400;
const PUBLIC_CACHE_SECONDS = 3600;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const uint32 = (data, pos) => new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(pos, true);
const uint16 = (data, pos) => new DataView(data.buffer, data.byteOffset, data.byteLength).getUint16(pos, true);
function validatedWav(encoded, track) {
  if (typeof encoded !== 'string' || !encoded.startsWith('UklGR')) throw new Error('Missing or invalid audio KV value');
  const raw = atob(encoded);
  if (raw.length !== track.bytes) throw new Error('Unexpected WAV byte length: ' + raw.length);
  const bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
  if (String.fromCharCode(...bytes.subarray(0, 4)) !== 'RIFF' || String.fromCharCode(...bytes.subarray(8, 12)) !== 'WAVE') throw new Error('Invalid WAV signature');
  if (uint32(bytes, 4) + 8 !== bytes.length) throw new Error('Truncated WAV RIFF length');
  if (uint16(bytes, 20) !== 1 || uint16(bytes, 22) !== 1 || uint32(bytes, 24) !== 44100) throw new Error('Unexpected WAV audio format');
  return bytes;
}
function logFailure(code, key, err) {
  console.error('fja_audio_' + code, JSON.stringify({ key, message: String(err?.message || err).slice(0, 250) }));
}
async function readFromKV(track) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await sleep(100 * (2 ** (attempt - 1)));
    try { return validatedWav(await AUDIO_KV.get(track.key, 'text'), track); }
    catch (error) { lastError = error; logFailure('kv_attempt_' + (attempt + 1), track.key, error); }
  }
  throw lastError;
}
function edgeCache() {
  try { return typeof caches === 'undefined' ? null : caches.default; }
  catch (_) { return null; }
}
async function loadAudio(track, pathname, event) {
  const cache = edgeCache();
  const cacheKey = new Request('https://fja-lesson-audio.internal.invalid' + pathname);
  if (cache) {
    try {
      const hit = await cache.match(cacheKey);
      if (hit?.ok) {
        const payload = new Uint8Array(await hit.arrayBuffer());
        if (payload.length === track.bytes && uint32(payload, 4) + 8 === payload.length &&
            String.fromCharCode(...payload.subarray(0, 4)) === 'RIFF' &&
            String.fromCharCode(...payload.subarray(8, 12)) === 'WAVE') return { bytes: payload, source: 'edge' };
        logFailure('corrupt_cache', track.key, 'Invalid cached media');
        try { await cache.delete(cacheKey); } catch (_) { /* refetch from KV */ }
      }
    } catch (error) { logFailure('cache_read', track.key, error); }
  }
  if (!inFlight.has(track.key)) {
    const work = readFromKV(track).then(bytes => {
      if (cache) {
        const response = new Response(bytes, {
          headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'public, max-age=' + FULL_CACHE_SECONDS },
        });
        const save = cache.put(cacheKey, response).catch(error => logFailure('cache_write', track.key, error));
        if (event?.waitUntil) event.waitUntil(save);
      }
      return bytes;
    }).finally(() => { inFlight.delete(track.key); });
    inFlight.set(track.key, work);
  }
  return { bytes: await inFlight.get(track.key), source: 'kv' };
}
function rangeFor(value, total) {
  if (!value) return { start: 0, end: total - 1, partial: false };
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2])) return null;
  let start, end;
  if (!match[1]) {
    const count = Number(match[2]);
    if (!Number.isSafeInteger(count) || count === 0) return null;
    start = Math.max(0, total - count); end = total - 1;
  } else {
    start = Number(match[1]); end = match[2] ? Number(match[2]) : total - 1;
    if (end >= total) end = total - 1;
  }
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= total || end < start) return null;
  return { start, end, partial: true };
}
async function handle(request, event) {
  const pathname = new URL(request.url).pathname;
  const track = TRACKS[pathname];
  if (!track) return new Response('Not Found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  const common = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Range',
    'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff',
  };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: common });
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method Not Allowed', { status: 405, headers: { ...common, Allow: 'GET, HEAD, OPTIONS' } });
  const range = rangeFor(request.headers.get('range'), track.bytes);
  if (!range) return new Response('Unsatisfiable Range', { status: 416, headers: { ...common, 'Content-Range': 'bytes */' + track.bytes } });
  try {
    const { bytes, source } = await loadAudio(track, pathname, event);
    const headers = { ...common, 'Content-Type': 'audio/wav',
      'Cache-Control': 'public, max-age=' + PUBLIC_CACHE_SECONDS,
      'Content-Length': String(range.end - range.start + 1),
      'X-Audio-Cache': source,
    };
    if (range.partial) headers['Content-Range'] = 'bytes ' + range.start + '-' + range.end + '/' + bytes.length;
    return new Response(request.method === 'HEAD' ? null : bytes.subarray(range.start, range.end + 1), { status: range.partial ? 206 : 200, headers });
  } catch (error) {
    logFailure('unavailable', track.key, error);
    return new Response('Audio temporarily unavailable. Please retry.', { status: 503,
      headers: { ...common, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '2' } });
  }
}