'use strict';
// Trusted main-branch release coordinator. Never execute code from incoming PRs.
const EXPECTED_REPO = 'freejapaneseacademy/freejapaneseacademy';
const idPattern = /^l0-m(\d{2})-c(\d{2})-(l(\d{2})|chk)$/;
const branchPattern = /^lesson\/(l0-m\d{2}-c\d{2}-(?:l\d{2}|chk))(?:-|$)/;

function nextId(items) {
  const last=items.at(-1)?.id;
  const x=idPattern.exec(last||'');
  if(!x) throw new Error('Unrecognized latest published lesson: '+last);
  let m=Number(x[1]), c=Number(x[2]), slot;
  if(x[3]==='chk'){if(c===4){m++;c=1;}else c++;slot='l01';}
  else if(Number(x[4])===8)slot='chk';
  else slot='l'+String(Number(x[4])+1).padStart(2,'0');
  return 'l0-m'+String(m).padStart(2,'0')+'-c'+String(c).padStart(2,'0')+'-'+slot;
}
function entryFor(mainItems, branchItems, target) {
  const published=new Set(mainItems.filter(x=>x.level==='l0'&&x.status==='published').map(x=>x.id));
  const additions=branchItems.filter(x=>x.level==='l0'&&!published.has(x.id)&&
    ['draft','reviewed','published'].includes(x.status));
  if(additions.length!==1 || additions[0].id!==target)throw new Error('Exactly one new candidate required: '+target);
  const entry=additions[0], match=idPattern.exec(target);
  const url='/learn/start/module-'+match[1]+'/chapter-'+match[2]+'/' +
    (match[3]==='chk'?'checkpoint/':'lesson-'+match[4]+'/');
  if(entry.url!==url || !entry.content?.startsWith('src/content/lessons/l0/') ||
    !entry.content.endsWith('.mdx'))throw new Error('Wrong lesson route or source: '+target);
  return entry;
}
function allowed(path, id, entry) {
  if(path==='docs/LESSON_INVENTORY.json'||path===entry.content)return true;
  if(path===entry.url.replace(/^\//,'src/pages/').replace(/\/$/,'.astro'))return true;
  if(path.startsWith('scripts/tts/jobs/'))return path==='scripts/tts/jobs/'+id+'.json';
  if(path.startsWith('public/audio/'))return path.includes(id)&&path.endsWith('.wav');
  if(path.startsWith('src/content/audio/'))return path.includes(id)&&path.endsWith('.json');
  return /^(src\/components\/interactive\/[^/]+\.tsx|src\/lib\/[^/]+\.ts|src\/content\/exercises\/[^/]+\.json|tests\/(?:e2e\/)?[^/]+\.(?:spec|test)\.(?:ts|tsx)|docs\/QA[^/]+\.md|docs\/automation\/OWNERS\/[^/]+\.md)$/.test(path);
}
function exactSuccess(runs, sha, repo){
  return runs.some(r=>r.head_sha===sha&&['push','workflow_dispatch'].includes(r.event)&&
    r.conclusion==='success'&&r.head_repository?.full_name===repo);
}
async function getText(github,owner,repo,path,ref){
  const x=(await github.rest.repos.getContent({owner,repo,path,ref})).data;
  if(!x.content||Array.isArray(x))throw new Error('Cannot read '+path+' at '+ref);
  return Buffer.from(x.content,'base64').toString('utf8');
}
async function getTree(github,owner,repo,sha){
  const commit=(await github.rest.git.getCommit({owner,repo,commit_sha:sha})).data;
  const tree=(await github.rest.git.getTree({owner,repo,tree_sha:commit.tree.sha,recursive:'true'})).data;
  if(tree.truncated)throw new Error('Git tree truncated; unsafe to reconcile.');
  return {sha:commit.tree.sha, files:new Map(tree.tree.filter(x=>x.type==='blob').map(x=>[x.path,x]))};
}
async function run({github,core,context}){
  const {owner,repo}=context.repo,full=owner+'/'+repo;
  if(full!==EXPECTED_REPO)throw new Error('Wrong repository for this release coordinator.');
  const main=(await github.rest.repos.getBranch({owner,repo,branch:'main'})).data.commit.sha;
  const mainDoc=JSON.parse(await getText(github,owner,repo,'docs/LESSON_INVENTORY.json',main));
  const mainPublished=mainDoc.items.filter(x=>x.level==='l0'&&x.status==='published');
  const target=nextId(mainPublished);
  const open=await github.paginate(github.rest.pulls.list,{owner,repo,state:'open',per_page:100});
  const claimed=open.filter(p=>p.base.ref==='main'&&p.head.repo?.full_name===full&&
    p.user?.login===owner&&branchPattern.exec(p.head.ref)?.[1]===target);
  if(claimed.length>1)throw new Error('Duplicate candidate PRs for '+target);
  const pr=claimed[0];
  if(!pr){core.info('No owner PR yet for '+target+'; other lessons can be authored ahead.');return;}
  if(pr.draft){core.info('Awaiting complete authoring for '+target);return;}
  const branch=pr.head.ref,head=pr.head.sha;
  let candidateDoc, entry;
  try {
    candidateDoc=JSON.parse(await getText(github,owner,repo,'docs/LESSON_INVENTORY.json',head));
    entry=entryFor(mainDoc.items,candidateDoc.items,target);
  }catch(e){core.warning('Candidate is not ready: '+String(e));return;}
  const files=await github.paginate(github.rest.pulls.listFiles,
    {owner,repo,pull_number:pr.number,per_page:100});
  if(files.some(f=>!allowed(f.filename,target,entry)||['removed','renamed','copied'].includes(f.status))){
    core.warning('PR contains non-isolated changes: '+files.filter(f=>!allowed(f.filename,target,entry)||
      ['removed','renamed','copied'].includes(f.status)).map(f=>f.filename).join(', '));return;
  }
  const route=entry.url.replace(/^\//,'src/pages/').replace(/\/$/,'.astro');
  if(!files.some(f=>f.filename===route)||!files.some(f=>f.filename===entry.content)){
    core.warning('Complete lesson must include its own MDX and Astro route.');return;
  }
  const source=await getText(github,owner,repo,entry.content,head);
  if(!source.includes('lessonId: "'+target+'"')&&!source.includes('lessonId: '+target)){
    core.warning('Incorrect lessonId in MDX frontmatter.');return;
  }
  if(!/^publicationStatus:\s*(?:draft|reviewed|published)\s*$/m.test(source)){
    core.warning('Missing publicationStatus in frontmatter.');return;
  }
  const history=(await github.rest.actions.listWorkflowRuns(
    {owner,repo,workflow_id:'lesson-quality.yml',branch,per_page:80})).data.workflow_runs;
  const green=exactSuccess(history,head,full);
  const mainTree=await getTree(github,owner,repo,main);
  const headTree=await getTree(github,owner,repo,head);
  // The L06 audio generator may be running for up to 55 minutes.
  // Never touch its branch while the genuine WAVs/manifest are still absent.
  if(target.endsWith('-l06')){
    const names=[...headTree.files.keys()];
    const manifest=names.some(p=>p.startsWith('src/content/audio/'+target+'-v')&&p.endsWith('.json'));
    const waves=['a','b'].every(track=>names.some(p=>
      p.startsWith('public/audio/fja-'+target+'-'+track+'-v')&&p.endsWith('.wav')));
    if(!manifest||!waves){
      core.info('Audio generator has not finished both real recordings for '+target+
        '; other owners can complete later lessons in parallel.');
      return;
    }
  }
  const ancestor=(await github.rest.repos.compareCommits({owner,repo,base:main,head})).data.merge_base_commit.sha;
  const needsReconcile=ancestor!==main||entry.status!=='published'||entry.noindex!==false;
  if(needsReconcile){
    const baseTree=ancestor===main?mainTree:await getTree(github,owner,repo,ancestor);
    const treeEntries=[];
    for(const f of files){
      if(f.filename==='docs/LESSON_INVENTORY.json'||f.filename===entry.content)continue;
      const obj=headTree.files.get(f.filename);
      if(!obj){core.warning('Missing branch blob '+f.filename);return;}
      const before=baseTree.files.get(f.filename)?.sha;
      const now=mainTree.files.get(f.filename)?.sha;
      if((f.status==='added'&&now&&now!==obj.sha)||
         (f.status==='modified'&&now!==before&&now!==obj.sha)){
        core.warning('Concurrent modification requires owner repair: '+f.filename);return;
      }
      if(now!==obj.sha)treeEntries.push({path:f.filename,mode:obj.mode,type:'blob',sha:obj.sha});
    }
    const promoted=source.replace(/^publicationStatus:\s*(?:draft|reviewed|published)\s*$/m,
      'publicationStatus: published');
    const normalized={...entry,status:'published',noindex:false};
    treeEntries.push({path:entry.content,mode:'100644',type:'blob',content:promoted});
    treeEntries.push({path:'docs/LESSON_INVENTORY.json',mode:'100644',type:'blob',
      content:JSON.stringify({...mainDoc,items:[...mainDoc.items,normalized]},null,2)+'\n'});
    const current=(await github.rest.repos.getBranch({owner,repo,branch:'main'})).data.commit.sha;
    const currentHead=(await github.rest.git.getRef({owner,repo,ref:'heads/'+branch})).data.object.sha;
    if(current!==main||currentHead!==head){core.info('Repository changed; retry on next queue tick.');return;}
    const tree=(await github.rest.git.createTree({owner,repo,base_tree:mainTree.sha,tree:treeEntries})).data;
    const mergeCommit=(await github.rest.git.createCommit({owner,repo,tree:tree.sha,
      parents:[head,main],message:'ci(release): reconcile '+target+' with production main'})).data;
    await github.rest.git.updateRef({owner,repo,ref:'heads/'+branch,sha:mergeCommit.sha,force:false});
    await github.rest.actions.createWorkflowDispatch({
      owner,repo,workflow_id:'lesson-quality.yml',ref:branch
    });
    core.notice('Integrated complete '+target+' at '+mergeCommit.sha+
      '; dispatched exact-head CI for automatic release.');
    return;
  }
  if(!green){
    const active=history.some(r=>r.head_sha===head&&r.status!=='completed'&&
      ['push','workflow_dispatch'].includes(r.event));
    if(active){core.info('Quality CI still running for '+target);return;}
    const failed=history.some(r=>r.head_sha===head&&r.status==='completed'&&
      ['push','workflow_dispatch'].includes(r.event)&&r.conclusion!=='success');
    if(failed){core.warning('Owner must self-fix failed exact-head CI for '+target);return;}
    await github.rest.actions.createWorkflowDispatch({
      owner,repo,workflow_id:'lesson-quality.yml',ref:branch
    });
    core.notice('Dispatched missing CI for '+target);return;
  }
  const currentPr=(await github.rest.pulls.get({owner,repo,pull_number:pr.number})).data;
  if(currentPr.draft||currentPr.head.sha!==head||currentPr.mergeable!==true||
    (await github.rest.repos.getBranch({owner,repo,branch:'main'})).data.commit.sha!==main){
    core.info('Merge state changed; queue will retry safely.');return;
  }
  const result=await github.rest.pulls.merge({owner,repo,pull_number:pr.number,sha:head,
    merge_method:'squash',commit_title:'feat(curriculum): publish '+target+' (#'+pr.number+')'});
  if(!result.data.merged)throw new Error('Exact-head merge rejected by GitHub.');
  core.notice('Merged '+target+' at '+result.data.sha+'; checking Cloudflare Pages production.');
  for(let attempt=0;attempt<28;attempt++){
    const runs=(await github.rest.checks.listForRef({
      owner,repo,ref:result.data.sha,per_page:100})).data.check_runs;
    const cf=runs.find(x=>x.name==='Cloudflare Pages');
    if(cf?.status==='completed'){
      if(cf.conclusion==='success')core.notice('PUBLISHED '+target+' at '+result.data.sha);
      else core.setFailed('Cloudflare Pages failed at '+result.data.sha+
        '; owning author must repair. Do not claim published.');
      return;
    }
    await new Promise(resolve=>setTimeout(resolve,15000));
  }
  core.warning('Merged '+target+' but exact-commit Cloudflare is pending. Verify before claiming live.');
}
module.exports={run,nextId,entryFor,allowed,exactSuccess};
