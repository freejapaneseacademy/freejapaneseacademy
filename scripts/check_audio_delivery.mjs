/* Strict real-network audio test: no mocks, no hidden retries. */
import { createHash } from 'node:crypto';
const base = (process.env.FJA_AUDIO_BASE_URL || 'https://fja-lesson-audio.free-japanese-academy.workers.dev').replace(/\/$/, '');
if (!/^https:\/\/[a-z0-9.-]+\.workers\.dev$/.test(base)) throw Error('Expected trusted workers.dev HTTPS origin');
const tracks = [{path:'/l0-m01-c01-l06-a.wav',bytes:1344706},{path:'/l0-m01-c01-l06-b.wav',bytes:992532}];
const checks=['bytes=0-43','bytes=0-1023','bytes=50000-50127','bytes=-128',null];
const hashes=new Map();let total=0;
async function probe(track, range, method='GET') {
 const url=base+track.path, start=Date.now();
 const res=await fetch(url,{method,headers:range?{Range:range}:{},signal:AbortSignal.timeout(20000),cache:'no-store'});
 total++;
 const label=track.path+' '+method+' '+(range||'full');
 console.log(label+': HTTP '+res.status+' ray='+res.headers.get('cf-ray')+' cache='+res.headers.get('x-audio-cache')+' '+(Date.now()-start)+'ms');
 const expected=range?206:200;
 if(res.status!==expected)throw Error(label+': expected '+expected+', got '+res.status+': '+(await res.text()).slice(0,180));
 if(res.headers.get('content-type')?.split(';')[0]!=='audio/wav')throw Error(label+': bad MIME');
 if(res.headers.get('accept-ranges')!=='bytes')throw Error(label+': missing Accept-Ranges');
 const buf=Buffer.from(await res.arrayBuffer());
 if(method==='HEAD'){
  if(buf.length!==0||Number(res.headers.get('content-length'))!==track.bytes)throw Error(label+': invalid HEAD');
  return;
 }
 let from=0,end=track.bytes-1;
 if(range){
  const m=/^bytes=(\d*)-(\d*)$/.exec(range);
  from=m[1]?Number(m[1]):track.bytes-Number(m[2]);
  end=m[1]?(m[2]?Number(m[2]):end):end;
  if(res.headers.get('content-range')!=='bytes '+from+'-'+end+'/'+track.bytes)throw Error(label+': wrong Content-Range');
 }
 if(buf.length!==Number(res.headers.get('content-length'))||buf.length!==end-from+1)throw Error(label+': truncated audio');
 if(from===0){
  if(buf.toString('ascii',0,4)!=='RIFF'||buf.toString('ascii',8,12)!=='WAVE'||buf.readUInt32LE(4)+8!==track.bytes||buf.readUInt32LE(24)!==44100||buf.readUInt16LE(22)!==1)throw Error(label+': invalid WAV');
 }
 if(!range){
  const sha=createHash('sha256').update(buf).digest('hex');
  if(hashes.has(track.path)&&hashes.get(track.path)!==sha)throw Error(label+': WAV hash changed');
  hashes.set(track.path,sha);
  let nonzero=0;for(let i=44;i+1<buf.length;i+=2048)if(buf.readInt16LE(i)!==0)nonzero++;
  if(nonzero<20)throw Error(label+': silent WAV');
  console.log('Full WAV OK: '+buf.length+' bytes; sha256 '+sha);
 }
}
try{
 for(let round=0;round<3;round++){
  for(const track of tracks)await Promise.all([...checks.map(range=>probe(track,range)),probe(track,null,'HEAD')]);
  if(round<2)await new Promise(resolve=>setTimeout(resolve,400));
 }
 console.log('PASS '+total+' real network requests at '+base);
}catch(err){console.error('FAIL',err);process.exitCode=1;}