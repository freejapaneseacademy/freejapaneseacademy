/**
 * Same-origin Japanese WAV delivery on Cloudflare Pages.
 * Serves four pinned legacy WAVs plus canonical versioned L06 lesson WAVs from Pages static assets via env.ASSETS.
 * Source WAVs are validated against lesson manifest SHA-256 by CI before deployment.
 * Every response verifies deployed RIFF/PCM bytes and supports GET/HEAD/ranges.
 * Never reaches the legacy workers.dev audio Worker or KV.
 */
const AUDIO = Object.freeze({
  'fja-lesson-audio-l06-a.wav': 1344706,
  'fja-lesson-audio-l06-b.wav': 992532,
  'fja-l06-real-dialogue-a-v2.wav': 1178840,
  'fja-l06-real-dialogue-b-v2.wav': 1447256,
});
const CANONICAL_LESSON_WAV = /^fja-(?:l0|n[1-5])-m[0-9]{2}-c[0-9]{2}-l06-[ab]-v[1-9][0-9]*[.]wav$/;
function rangeFor(header, total) {
  if (!header) return { from: 0, to: total - 1, partial: false };
  const m = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!m || (!m[1] && !m[2])) return null;
  let from, to;
  if (!m[1]) {
    const n = Number(m[2]);
    if (!Number.isSafeInteger(n) || n < 1) return null;
    from = Math.max(0, total - n); to = total - 1;
  } else {
    from = Number(m[1]);
    to = m[2] ? Number(m[2]) : total - 1;
    if (to >= total) to = total - 1;
  }
  if (!Number.isSafeInteger(from) || !Number.isSafeInteger(to) || from < 0 || from >= total || to < from) return null;
  return { from, to, partial: true };
}
export async function onRequest(context) {
  const { request, env, params } = context;
  const name = params.name;
  if (typeof name !== 'string' || (!(name in AUDIO) && !CANONICAL_LESSON_WAV.test(name))) return new Response('Not Found', { status: 404 });
  const common = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Range',
    'Accept-Ranges': 'bytes',
    'X-Content-Type-Options': 'nosniff',
  };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: common });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: {...common, Allow: 'GET, HEAD, OPTIONS' } });
  }
  try {
    // env.ASSETS.fetch requests the deployed Pages static file without routing back through this Function.
    const url = new URL(request.url);
    url.search = '';
    const upstream = await env.ASSETS.fetch(new Request(url.toString(), { method: 'GET' }));
    if (!upstream.ok) throw new Error('Static asset unavailable: HTTP ' + upstream.status);
    const bytes = new Uint8Array(await upstream.arrayBuffer());
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const ascii = (offset, length) => String.fromCharCode(...bytes.subarray(offset, offset + length));
    const total = bytes.length;
    if (total < 12000 || total > 32000000 || ((name in AUDIO) && total !== AUDIO[name]) || ascii(0, 4) !== 'RIFF' || ascii(8, 4) !== 'WAVE' ||
        view.getUint32(4, true) + 8 !== total || view.getUint32(24, true) !== 44100 ||
        view.getUint16(22, true) !== 1) throw new Error('Static audio is incomplete or corrupted');
    const span = rangeFor(request.headers.get('range'), total);
    if (!span) return new Response('Unsatisfiable Range', { status: 416, headers: {...common, 'Content-Range': 'bytes */' + total} });
    const headers = {
      ...common,
      'Content-Type': 'audio/wav',
      'Content-Length': String(span.to - span.from + 1),
      'Cache-Control': 'public, max-age=3600',
    };
    if (span.partial) headers['Content-Range'] = 'bytes ' + span.from + '-' + span.to + '/' + total;
    return new Response(request.method === 'HEAD' ? null : bytes.subarray(span.from, span.to + 1), {
      status: span.partial ? 206 : 200, headers,
    });
  } catch (error) {
    console.error('fja_pages_audio_error', name, String(error?.message || error));
    return new Response('Audio temporarily unavailable', {
      status: 503, headers: {...common, 'Retry-After': '2', 'Cache-Control': 'no-store'},
    });
  }
}
