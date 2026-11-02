const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../infra/workers/fja-lesson-audio.js'),'utf8');
const url='https://fja-lesson-audio.example.workers.dev/l0-m01-c01-l06-a.wav',len=1344706;
function encodeWav() {
 const b=Buffer.alloc(len);b.write('RIFF');b.writeUInt32LE(len-8,4);b.write('WAVE',8);
 b.write('fmt ',12);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);
 b.writeUInt32LE(44100,24);b.writeUInt32LE(88200,28);b.writeUInt16LE(2,32);
 b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(len-44,40);
 for(let i=44;i<len;i+=2048)b.writeInt16LE(500,i);
 return b.toString('base64');
}
const audio=encodeWav();
function harness(read=async()=>audio){
 const saved=new Map(),tasks=[],errors=[],stats={reads:0};
 const cache={match:async r=>saved.get(r.url)?.clone(),put:async(r,v)=>{saved.set(r.url,v.clone())},delete:async r=>saved.delete(r.url)};
 const context=vm.createContext({addEventListener:()=>{},Request,Response,Headers,URL,Uint8Array,DataView,Map,atob,setTimeout,
   console:{error:(...x)=>errors.push(x.join(' '))},AUDIO_KV:{get:async(key,type)=>{stats.reads++;assert.equal(type,'text');return read(key)}},caches:{default:cache}});
 vm.runInContext(source,context);
 return {send:(method='GET',range)=>context.handle(new Request(url,{method,headers:range?{Range:range}:{}}),{waitUntil:p=>tasks.push(p)}),tasks,errors,stats};
}
test('valid full WAV, range, HEAD and edge cache',async()=>{
 const h=harness(),r=await h.send('GET','bytes=0-43');
 assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),'bytes 0-43/'+len);
 assert.equal(Buffer.from(await r.arrayBuffer()).toString('ascii',0,4),'RIFF');
 await Promise.all(h.tasks);
 const b=await h.send('GET','bytes=44-99');assert.equal(b.status,206);
 assert.equal(b.headers.get('x-audio-cache'),'edge');assert.equal(h.stats.reads,1);
 const full=await h.send();assert.equal(full.status,200);assert.equal((await full.arrayBuffer()).byteLength,len);
 const head=await h.send('HEAD');assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);
});
test('invalid ranges fail with 416 without KV access',async()=>{
 const h=harness();
 for(const range of ['bytes=2-1','bytes=9999999-','bytes=0-10,20-30','bytes=-0']) assert.equal((await h.send('GET',range)).status,416);
 assert.equal(h.stats.reads,0);
});
test('temporary KV failures recover on third attempt',async()=>{
 let calls=0;const h=harness(async()=>++calls<=2?Promise.reject(Error('temporary')):audio);
 assert.equal((await h.send('GET','bytes=0-43')).status,206);assert.equal(calls,3);
});
test('permanent failures are not cached, successful retry later recovers',async()=>{
 let value=null;const h=harness(async()=>value);
 const lost=await h.send('GET','bytes=0-43');assert.equal(lost.status,503);assert.equal(lost.headers.get('retry-after'),'2');
 value=audio;assert.equal((await h.send('GET','bytes=0-43')).status,206);
});
test('concurrent cold requests share one KV read',async()=>{
 let ready;const gate=new Promise(r=>ready=r);
 const h=harness(async()=>{await gate;return audio});
 const requests=Array.from({length:6},()=>h.send('GET','bytes=0-43'));
 setTimeout(ready,10);
 assert.deepEqual((await Promise.all(requests)).map(r=>r.status),[206,206,206,206,206,206]);
 assert.equal(h.stats.reads,1);
});