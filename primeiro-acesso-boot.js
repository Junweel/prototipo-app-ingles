/* Resolve only the entry route, before the approved router initializes. */
(function(){
 'use strict';
 const FLAG='spla_onboarded_v1',prefix=location.pathname.includes('/teste/')?'teste_':'';
 const read=(key)=>{try{return JSON.parse(localStorage.getItem(prefix+key)||'null')}catch(_){return null}};
 const params=new URLSearchParams(location.search),originalHash=location.hash;
 const completed=read(FLAG)?.completed===true,preview=params.get('novo')==='1';
 let reviewing=false;try{reviewing=sessionStorage.getItem(prefix+'spla_review')==='1'}catch(_){}
 const study=read('rotinaState'),legacy=Object.values(study?.days||{}).some(day=>Object.values(day.steps||{}).some(step=>step?.done)||(day.extra||[]).length||(day.xcalls||[]).length);
 const intro=['','welcome','onboard','placement','turma','plan'].includes(originalHash.slice(1).split('~')[0]);
 const isDemo=/\/demo(\/|$)/.test(location.pathname);
 function nextStep(){
  const days=study&&study.days||{},keys=Object.keys(days).sort(),last=keys.length?days[keys[keys.length-1]]:null,s=last&&last.steps||{};
  if(!last)return null;
  if(!s.aquec||!s.aquec.done)return 'd-warm';
  if(!s.ep||!s.ep.done)return 'd-ouvir';
  if(!s.trail||!s.trail.done)return 'd-trail';
  if(!s.call||!s.call.done)return 'sophia~sessao';
  if(!s.lili||!s.lili.done)return 'd-close';
  return 'home';
 }
 const saved=read('spla_resume');
 function stepOf(hash){
  const base=String(hash||'').split('~')[0];
  if(base==='d-warm')return 'aquec';
  if(base==='d-ouvir'||base==='ep')return 'ep';
  if(base==='d-trail'||base==='foco'||base==='cartoes'||base.indexOf('m-')===0)return 'trail';
  if(base==='sophia'||base==='d-call')return 'call';
  if(base==='d-close')return 'lili';
  return '';
 }
 function resumeHash(){
  if(!saved||!saved.hash||!stepOf(saved.hash))return '';
  const days=study&&study.days||{},keys=Object.keys(days).sort(),last=keys.length?days[keys[keys.length-1]]:null;
  const step=last&&last.steps&&last.steps[stepOf(saved.hash)];
  return step&&step.done?'':saved.hash;
 }
 const returning=completed||legacy||!!(saved&&saved.hash);
 const target=isDemo?null:preview?(!originalHash?'welcome':null):returning&&!reviewing&&intro?(resumeHash()||nextStep()||'home'):null;
 window.splaEntry={FLAG,prefix,originalHash,completed,legacy,preview,target};
 if(target)history.replaceState(null,'',location.pathname+location.search+'#'+target);
})();
