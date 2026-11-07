/* Resolve only the entry route, before the approved router initializes. */
(function(){
 'use strict';
 const FLAG='spla_onboarded_v1',prefix=location.pathname.includes('/teste/')?'teste_':'';
 const read=(key)=>{try{return JSON.parse(localStorage.getItem(prefix+key)||'null')}catch(_){return null}};
 const params=new URLSearchParams(location.search),originalHash=location.hash;
 const completed=read(FLAG)?.completed===true,preview=params.get('novo')==='1';
 let reviewing=false;try{reviewing=sessionStorage.getItem(prefix+'spla_review')==='1'}catch(_){}
 const study=read('rotinaState'),legacy=Object.values(study?.days||{}).some(day=>Object.values(day.steps||{}).some(step=>step?.done)||(day.extra||[]).length||(day.xcalls||[]).length);
 const intro=['','welcome','onboard','placement','turma','plan'].includes(originalHash.slice(1));
 const target=preview?(!originalHash?'welcome':null):(completed||legacy)&&!reviewing&&intro?'practice':null;
 window.splaEntry={FLAG,prefix,originalHash,completed,legacy,preview,target};
 if(target)history.replaceState(null,'',location.pathname+location.search+'#'+target);
})();
