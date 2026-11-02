import { describe, it, expect } from 'vitest';
import { onRequest } from '../functions/audio/[name].js';

function wav(bytes = 12044) {
  const out = new Uint8Array(bytes);
  const view = new DataView(out.buffer);
  const text = (offset, value) => { for(let i=0;i<value.length;i++)out[offset+i]=value.charCodeAt(i); };
  text(0,'RIFF'); view.setUint32(4,bytes-8,true); text(8,'WAVE');
  text(12,'fmt '); view.setUint32(16,16,true); view.setUint16(20,1,true);
  view.setUint16(22,1,true); view.setUint32(24,44100,true);
  view.setUint32(28,88200,true); view.setUint16(32,2,true);
  view.setUint16(34,16,true); text(36,'data'); view.setUint32(40,bytes-44,true);
  out[44]=42;
  return out;
}
const name='fja-n5-m01-c02-l06-a-v3.wav';
const testUrl='https://free-japanese-academy.pages.dev/audio/'+name;
function context({method='GET',range,body=wav(),file=name}={}) {
  const request=new Request('https://free-japanese-academy.pages.dev/audio/'+file,{
    method,headers:range?{Range:range}:{}
  });
  return {request,params:{name:file},env:{ASSETS:{fetch:async()=>new Response(body)}}};
}
describe('Pages future versioned lesson audio delivery', () => {
  it('serves canonical N5 WAVs with complete and byte-range bodies',async()=>{
    const full=await onRequest(context());
    expect(full.status).toBe(200);
    expect(Number(full.headers.get('content-length'))).toBe(12044);
    expect(full.headers.get('content-type')).toBe('audio/wav');
    expect((await full.arrayBuffer()).byteLength).toBe(12044);
    const ranged=await onRequest(context({range:'bytes=0-43'}));
    expect(ranged.status).toBe(206);
    expect(ranged.headers.get('content-range')).toBe('bytes 0-43/12044');
    expect((await ranged.arrayBuffer()).byteLength).toBe(44);
  });
  it('allows HEAD and reports invalid byte ranges accurately',async()=>{
    const head=await onRequest(context({method:'HEAD'}));
    expect(head.status).toBe(200);
    expect((await head.arrayBuffer()).byteLength).toBe(0);
    const invalid=await onRequest(context({range:'bytes=99999-'}));
    expect(invalid.status).toBe(416);
    expect(invalid.headers.get('content-range')).toBe('bytes */12044');
  });
  it('rejects unauthorised filenames and corruption',async()=>{
    const outside=await onRequest(context({file:'../../private.wav'}));
    expect(outside.status).toBe(404);
    const random=await onRequest(context({file:'fja-n5-m01-c02-l05-a-v3.wav'}));
    expect(random.status).toBe(404);
    const broken=await onRequest(context({body:new Uint8Array(12044)}));
    expect(broken.status).toBe(503);
  });
});
