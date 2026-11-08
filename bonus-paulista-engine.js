/* Original SPLA rules. No activity content or recorded audio is modified. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SplaBonusEngine=api})(typeof window==='object'?window:globalThis,function(){
'use strict';
const ROLES=[['Pre-A1','Trainee de Primeiro Dia','trainee'],['A1','Estagiário(a)','stripe1'],['A2','Assistente','stripe2'],['B1','Analista','medium'],['B1+','Analista Sênior','gold'],['B2','Coordenador(a)','dark'],['C1','Diretor(a) da Paulista','masp']];
function roleFor(level){const s=String(level||'Pre-A1');const key=/B1\+/.test(s)?'B1+':(s.match(/Pre-A1|A1|A2|B1|B2|C1/)||['Pre-A1'])[0];const r=ROLES.find(r=>r[0]===key);return {level:r[0],name:r[1],finish:r[2]}}
function createEngine({state={},persist=()=>{},capital=()=>0,random=Math.random,day=()=>new Date().toLocaleDateString('en-CA')}={}){
 for(const k of ['seen','sessions','units','promotions','bonuses'])if(!state[k]||typeof state[k]!=='object')state[k]={};
 const rows=date=>Object.values(state.bonuses).filter(x=>x.day===date&&x.amount>0).map(x=>[x.label,x.amount]);
 const rank={M:1,G:2,GG:3};
 function complete(p={}){
  if(p.demo||!p.id)return [];const date=day(),sid=p.session||date,key=`${date}:${sid}:${p.id}`;
  if(state.seen[key])return [];state.seen[key]=true;
  const session=state.sessions[sid]||(state.sessions[sid]={});let candidate;
  if(p.canDo||p.sessionEnd)candidate={level:'M',...p};
  if(p.unitComplete&&p.unit&&!state.units[p.unit])candidate={...p,level:'G'};
  if(p.promotion&&!state.promotions[p.promotion])candidate={...p,level:'GG'};
  if(candidate&&!session.major&&(!session.pending||rank[candidate.level]>rank[session.pending.level]))session.pending=candidate;
  if(Number.isFinite(p.accuracy)&&p.accuracy<60&&!p.repair){persist(state);return [{...p,level:'lili'}]}
  const result=[{...p,level:'P'}];
  if((p.sessionEnd||p.repair)&&session.pending&&!session.major){
   const major={...session.pending,session:sid};delete session.pending;session.major=major.level;
   // Draw once, only at an actual completed session; never reroll by replaying lessons.
   session.bonusDraw=random()<.2;major.bonus=0;
   if(session.bonusDraw){const room=Math.max(0,200-Number(capital(date)||0));const amount=Math.min(20,room);if(amount>0){const label=major.level==='G'||major.level==='GG'?'Bônus de Resultado':'Bônus de Meta';state.bonuses[sid]={day:date,amount,label};major.bonus=amount}}
   if(major.level==='G'){state.units[major.unit]={day:date};state.pins=Object.keys(state.units).length}
   if(major.level==='GG'){state.promotions[major.promotion]={day:date};major.oldRole=state.cargo||roleFor(major.previousLevel||'A2').name;state.cargo=roleFor(major.promotion).name;state.level=major.promotion;major.cargo=state.cargo}
   result.push(major);
  }
  persist(state);return result;
 }
 return {complete,rows,state};
}
return {createEngine,roleFor,ROLES};
});
