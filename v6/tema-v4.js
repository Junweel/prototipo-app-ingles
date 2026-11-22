/* Tema v4. Unidades: Projeto. Meta do dia = etapas do plano de hoje. Ranking: turma ou empresa, conforme o perfil. */
(function(){
'use strict';
const BASE=new URL('assets/tema/',document.currentScript.src).href;
const DEMO=/\/demo(\/|$)/.test(location.pathname);
const LOGO=BASE+'logo/spla-logo-horizontal-escuro-transparente.svg';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PLAN=[
 {key:'aquec',go:'d-warm',name:'Aquecimento',min:'3 min',kind:'cards'},
 {key:'ep',go:'d-ouvir',name:'Ouvir',min:'6 min',kind:'audio'},
 {key:'trail',go:'d-trail',name:'Trilha',min:'9 min',kind:'task'},
 {key:'call',go:'d-call',name:'Bate-papo',min:'6 min',kind:'talk'},
 {key:'lili',go:'d-close',name:'Fechamento',min:'3 min',kind:'close'}
];
const ICONS={
 cards:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="3" width="12" height="16" rx="2"/><path d="M9 8h5M9 12h4"/></svg>',
 audio:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 14V12a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="1.5"/><rect x="17" y="13" width="4" height="7" rx="1.5"/></svg>',
 task:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="4" width="14" height="14" rx="3"/><path d="M8 12l2.5 2.5L16 9"/></svg>',
 talk:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6h16v10H9l-5 4z"/></svg>',
 close:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><path d="M8.5 12.5l2.4 2.4 4.6-5"/></svg>',
 trail:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="17" r="2.2"/><circle cx="18" cy="7" r="2.2"/><path d="M8 17h6a3 3 0 0 0 0-6H10a3 3 0 0 1 0-6h6"/></svg>',
 review:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v6h-6"/></svg>',
 sophia:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 6h14v9H8l-3 3z"/></svg>',
 pod:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.4"/><rect x="17" y="13" width="4" height="6" rx="1.4"/></svg>',
 badge:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="10" r="2.2"/><path d="M9 16h6"/></svg>'
};
const TABS=[
 {id:'trilha',go:'practice',label:'Trilha',icon:'trail',on:(id,arg)=>['practice','d-warm','d-ouvir','d-trail','d-close','foco','trilha','home'].includes(id)&&!(id==='practice'&&arg==='pratica')},
 {id:'revisao',go:'m-warm',label:'Revisão',icon:'review',on:(id,arg)=>['m-warm','review','cartoes'].includes(id)||(id==='practice'&&arg==='pratica')},
 {id:'sophia',go:'sophia~sessao',label:'Conversa',icon:'sophia',on:id=>id==='sophia'||id==='d-call'||id==='chat'},
 {id:'podcast',go:'ouvir',label:'Podcast',icon:'pod',on:id=>['ouvir','ep'].includes(id)},
 {id:'cracha',go:'profile',label:'Perfil',icon:'badge',on:id=>['profile','progress','cartao-paulista','cp-edit','cp-status-picker','cp-divisions','cp-liga','about'].includes(id)}
];
const CO='../cartao-paulista/assets/';
const PEERS=[
 {id:'marina',first:'Marina',photo:CO+'marina-circle.png',nivel:'B1',empresa:'Nexa Logística',logo:CO+'logo-nexa.png',area:'Finanças',turma:'Turma B1',bonus:'120',streak:'12',conquista:'Missão: explicar um atraso no fechamento'},
 {id:'rafael',first:'Rafael',photo:CO+'rafael-circle.png',nivel:'A2',empresa:'Órbitas Tech',logo:CO+'logo-orbitas.png',area:'TI e Cloud',turma:'Turma A2',bonus:'90',streak:'8',conquista:'Can-do: abrir um incidente por e-mail'},
 {id:'patricia',first:'Patrícia',photo:CO+'bia-circle.png',nivel:'B2',empresa:'Atlasul Bank',logo:CO+'logo-atlasul.png',area:'Mercado Financeiro',turma:'Turma B2',bonus:'150',streak:'15',conquista:'Checkpoint semanal, 4 semanas'}
];
let routeArg='';
function read(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(_){return null}}
function nome(){const p=read('perfil'),c=read('cartaoPaulista');return (c&&c.name)||(p&&p.nome)||'Joël'}
function level(){if(typeof meLabel==='function')return meLabel();const p=read('perfil');return p&&p.fromQuiz?'A medir no teste':'A2+'}
function companyName(){
 const c=read('cartaoPaulista');
 if(!c)return '';
 const set=Object.prototype.hasOwnProperty.call(c,'company')||Object.prototype.hasOwnProperty.call(c,'logo');
 const name=String(c.company||'').trim();
 return set&&name?name:'';
}
function rankMode(){
 if(DEMO){try{const v=sessionStorage.getItem('spla_rank_preview');if(v==='turma'||v==='empresa')return v}catch(_){}}
 return companyName()?'empresa':'turma';
}
function todayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function daySteps(){const st=read('rotinaState')||{};return (st.days&&st.days[todayKey()]&&st.days[todayKey()].steps)||{}}
function progress(){
 const steps=daySteps();
 const done=PLAN.filter(s=>steps[s.key]&&steps[s.key].done).length;
 return {done,total:PLAN.length,p:PLAN.length?Math.round(done/PLAN.length*100):0};
}
function streak(){
 const st=read('rotinaState')||{};
 const days=Object.keys(st.days||{}).filter(k=>Object.values((st.days[k]&&st.days[k].steps)||{}).some(s=>s&&s.done)).sort();
 if(!days.length)return 0;
 let n=1;
 for(let i=days.length-1;i>0;i--){
  const a=new Date(days[i]+'T12:00:00'),b=new Date(days[i-1]+'T12:00:00');
  if((a-b)/86400000===1)n++;else break;
 }
 return n;
}
function bonus(){return progress().done*15}
function swapLogos(root){
 (root||document).querySelectorAll('.logo').forEach(el=>{
  if(el.querySelector('.v4-word'))return;
  el.innerHTML='<img class="v4-word" alt="São Paulo Languages Academy" src="'+LOGO+'">';
 });
}
function swapFaces(root){
 (root||document).querySelectorAll('img').forEach(img=>{
  const s=img.getAttribute('src')||'';
  if(/tema\/chars\//.test(s))return;
  if(/lili/.test(s))img.src=BASE+'chars/lili.webp';
  else if(/erick/.test(s))img.src=BASE+'chars/erick.webp';
  else if(/sophia|turma\.webp/.test(s))img.src=BASE+'chars/sophia.webp';
 });
}
function relabel(root){
 const mode=rankMode();
 const rank=mode==='empresa'?'Ranking semanal, na empresa':'Ranking semanal, na turma';
 const walker=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){
  if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
  const p=n.parentElement;if(!p||/^(SCRIPT|STYLE)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
 }});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{
  let t=n.nodeValue;
  const short=t.length<160;
  const hit=/Capital|Divisão Mirante|Em Stretch|Nove de Julho|Rota até a Paulista|Faria Lima|Rua da Consolação|Rua Augusta|Avenida Paulista/.test(t);
  if(!hit)return;
  t=t.replace(/Divisão Mirante\s*·\s*Top 8%(?:\s*\(exemplo\))?/g,rank);
  t=t.replace(/Divisão Mirante/g,'Ranking semanal');
  t=t.replace(/Em Stretch/g,'Meta do dia');
  t=t.replace(/\bCapital\b/g,'Bônus SPLA');
  if(short){
   t=t.replace(/A2\+\s*·\s*(?:Av\.\s*)?Nove de Julho/g,'Projeto 03 · Daily e update curto');
   t=t.replace(/(?:Av\.\s*)?Nove de Julho/g,'Projeto 03 · Daily e update curto');
   t=t.replace(/Rua da Consolação/g,'Projeto 04 · B1');
   t=t.replace(/Av\.\s*Brigadeiro Faria Lima|Faria Lima/g,'Projeto 05 · B2');
   t=t.replace(/Rua Augusta/g,'Projeto 06 · C1');
   t=t.replace(/Avenida Paulista/g,'Projeto 07 · C2');
   t=t.replace(/Rota até a Paulista/g,'Rota dos níveis');
   t=t.replace(/\s*—\s*/g,', ');
   t=t.replace(/—/g,', ');
  }
  if(t!==n.nodeValue)n.nodeValue=t;
 });
}
function tabs(current){
 const html=TABS.map(t=>'<button type="button" data-go="'+t.go+'" data-v4="'+t.id+'"'+(t.on(current,routeArg)?' class="on" aria-current="page"':'')+'>'+ICONS[t.icon]+'<span>'+t.label+'</span></button>').join('');
 document.querySelectorAll('.tabbar').forEach(bar=>{bar.innerHTML=html;bar.classList.add('v4-tabs')});
 const side=document.getElementById('dnav');
 if(side)side.innerHTML=TABS.map(t=>'<button type="button" data-go="'+t.go+'" data-v4="'+t.id+'"'+(t.on(current,routeArg)?' class="on"':'')+'>'+ICONS[t.icon]+'<span>'+t.label+'</span></button>').join('')+'<button type="button" data-go="about"'+(current==='about'?' class="on"':'')+'>'+ICONS.badge+'<span>Sobre</span></button>';
}
function ensureBar(id){
 const s=document.getElementById(id);if(!s||s.querySelector(':scope>.tabbar'))return;
 const bar=document.createElement('nav');bar.className='tabbar';bar.setAttribute('aria-label','Abas');s.appendChild(bar);
}
function placeSeg(screen,which){
 if(!screen)return;
 let bar=screen.querySelector(':scope>.v4-seg');
 if(!bar){
  bar=document.createElement('div');bar.className='v4-seg';bar.setAttribute('role','tablist');bar.setAttribute('aria-label','Revisão ou Prática');
  bar.innerHTML='<button type="button" role="tab" data-go="m-warm" data-seg="revisao">Revisão</button><button type="button" role="tab" data-go="practice~pratica" data-seg="pratica">Prática</button>';
  const sc=screen.querySelector(':scope>.scroll');
  screen.insertBefore(bar,sc);
 }
 bar.querySelector('[data-seg="revisao"]').classList.toggle('on',which==='revisao');
 bar.querySelector('[data-seg="pratica"]').classList.toggle('on',which==='pratica');
 bar.querySelector('[data-seg="revisao"]').setAttribute('aria-selected',which==='revisao');
 bar.querySelector('[data-seg="pratica"]').setAttribute('aria-selected',which==='pratica');
}
function praticaView(on){
 const screen=document.getElementById('practice');if(!screen)return;
 screen.classList.toggle('v4-pratica',!!on);
 const native=screen.querySelector('.cpi-native');
 if(native&&on)native.open=true;
 if(on)placeSeg(screen,'pratica');
 else{const bar=screen.querySelector(':scope>.v4-seg');if(bar)bar.remove()}
}
function unitHead(){
 let theme='Daily e update curto', n='03', title='Status da semana: atrasado ou no prazo?';
 try{
  const mt=window.mergeTest, ep=mt&&mt.EPS&&mt.SESSION&&mt.EPS.find(e=>e.id===mt.SESSION.ep);
  if(ep){
   const raw=String(ep.unitT||'');
   const bits=raw.split('·').map(s=>s.trim()).filter(Boolean);
   if(bits[0])theme=bits[0];
   const m=raw.match(/Missão\s+(\d+)/);
   if(m)n=String(m[1]).padStart(2,'0');
   if(ep.t)title=ep.t;
  }
 }catch(_){}
 return {theme,n,title};
}
function paintTrail(){
 const host=document.getElementById('cpi-practice');if(!host)return;
 const g=progress(), steps=daySteps(), u=unitHead(), p=person();
 let cur=PLAN.findIndex(s=>!(steps[s.key]&&steps[s.key].done));
 const allDone=cur<0; if(allDone)cur=PLAN.length-1;
 const face=p.photo?'<img src="'+esc(p.photo)+'" alt="">':'<b>'+esc((p.name||'S').slice(0,1).toUpperCase())+'</b>';
 const lvl=esc(String(p.level||level()).split('·')[0].trim());
 let nodes='', y=8; const tops=[];
 PLAN.forEach((s,i)=>{
  const state=allDone||i<cur?'done':i===cur?'cur':'wait';
  const go=state==='wait'?PLAN[cur].go:s.go;
  tops.push(y);
  nodes+='<button type="button" class="v4-node '+state+' k-'+s.kind+'" style="top:'+y+'px" data-go="'+go+'" aria-label="'+esc(s.name)+'">'+ICONS[s.kind]+(state==='done'?'<i class="ok" aria-hidden="true"></i>':'')+'</button>';
  if(state==='cur')nodes+='<div class="v4-card" style="top:'+(y-4)+'px"><div class="k">'+esc(s.min.toUpperCase())+'</div><b>'+esc(s.name)+'</b><button class="btn primary" type="button" data-go="'+s.go+'">Começar</button></div>';
  y+=state==='cur'?148:78;
 });
 const lineH=Math.max(24,(tops[tops.length-1]||0)-(tops[0]||0));
 host.innerHTML='<div class="v4-top"><div class="v4-avwrap"><button type="button" class="v4-av" style="--p:'+g.p+'%" data-v4-av aria-haspopup="menu" aria-expanded="false" aria-label="Abrir Perfil e Progresso de '+esc(p.name)+'">'+face+'</button><div class="v4-avmenu" role="menu" hidden><button type="button" data-go="profile">Perfil</button><button type="button" data-go="progress">Progresso</button></div></div><span class="v4-lvl">'+lvl+'</span><span class="v4-stat"><span class="v4-ring" style="--p:'+g.p+'%" aria-hidden="true"></span> Meta do dia '+g.done+'/'+g.total+' <span aria-hidden="true">🔥 '+streak()+'</span> <span aria-hidden="true">◆ '+bonus()+'</span></span></div><div class="v4-quick"><button type="button" data-go="community"><b>Comunidade</b><small>Ranking semanal</small></button><button type="button" data-go="home"><b>Hoje</b><small>Painel do dia</small></button></div><div class="v4-hd"><div class="ov">PROJETO '+esc(u.n)+' <i></i> '+esc(u.theme.toUpperCase())+'</div><h2>'+esc(u.title)+'</h2></div><div class="v4-prog"><span>'+g.done+' de '+g.total+' etapas</span><div class="b"><i style="width:'+g.p+'%"></i></div><span>Bônus no fim</span></div><div class="v4-map" style="min-height:'+(y+28)+'px"><div class="v4-rail done" style="top:'+((tops[0]||0)+28)+'px;height:'+lineH+'px"></div>'+nodes+'</div>';
}
function hubLinks(){
 return '<div class="v4-hub"><button type="button" data-go="progress">Progresso</button><button type="button" data-go="home">Hoje</button></div><p class="v4-hublinks"><button type="button" data-go="about">Sobre</button><button type="button" data-go="community">Comunidade</button></p>';
}
function peerById(id){return PEERS.find(p=>p.id===id)||null}
function peerPlace(p){
 return rankMode()==='empresa'?p.empresa:p.turma;
}
function peerHtml(p){
 const face=p.photo?'<img src="'+esc(p.photo)+'" alt="Foto de '+esc(p.first)+'">':'<span class="quiz-initial">'+esc(p.first.slice(0,1))+'</span>';
 const logo=p.logo?'<img src="'+esc(p.logo)+'" alt="Logo '+esc(p.empresa)+'">':'';
 const place=p.empresa?esc(p.empresa):esc(p.turma);
 return '<div class="v4-full"><div class="hero" data-company-ready="'+(p.logo?'true':'false')+'"><div class="avatar-wrap"><div class="frame">'+face+'</div></div><div class="name">'+esc(p.first)+'</div><div class="lvl">'+esc(p.nivel)+'</div><div class="company">'+logo+'<div><div class="co">'+place+'</div><div class="sub">'+esc(p.area)+'</div></div></div></div></div><div class="v4-sheet"><div class="rowx"><div><b>Ofensiva</b></div><b class="n">'+esc(p.streak)+' dias</b></div><div class="rowx"><div><b>Bônus SPLA</b></div><b class="n">'+esc(p.bonus)+'</b></div><div class="rowx"><div><b>Conquista</b><p>'+esc(p.conquista)+'</p></div></div><div class="rowx"><div><b>'+(rankMode()==='empresa'?'Empresa':'Turma')+'</b></div><b class="n">'+esc(peerPlace(p))+'</b></div><p class="note">Só o que um crachá de empresa mostra: foto, primeiro nome, nível, turma ou empresa, área, conquista, bônus e ofensiva. Sem e-mail, telefone, sobrenome, CPF, nascimento ou endereço.</p></div>';
}
function storiesHtml(){
 const people=PEERS.map(p=>'<button type="button" data-peer="'+p.id+'"><img src="'+esc(p.photo)+'" alt=""><small>'+esc(p.first)+'</small></button>').join('');
 const teams=[{go:'leagues',logo:CO+'logo-nexa.png',name:'Nexa'},{go:'c-groups',logo:CO+'logo-orbitas.png',name:'Órbitas'},{go:'c-challenge',logo:CO+'logo-atlasul.png',name:'Atlasul'}].map(t=>'<button type="button" data-go="'+t.go+'"><img src="'+esc(t.logo)+'" alt=""><small>'+esc(t.name)+'</small></button>').join('');
 return '<div class="v4-stories" aria-label="Colegas e empresas">'+people+teams+'</div>';
}
function paintCommunity(){
 const host=document.getElementById('cpi-community')||document.querySelector('#community>.scroll');if(!host)return;
 let card=document.getElementById('v4-rankcard');
 if(!card){card=document.createElement('section');card.id='v4-rankcard';card.className='v4-rankcard';host.prepend(card)}
 const mode=rankMode();
 const where=mode==='empresa'?'na empresa':'na turma';
 const n=mode==='empresa'?'3ª de 12':'4º de 30';
 const rows=PEERS.map(p=>'<button type="button" data-peer="'+p.id+'"><img class="ava" src="'+esc(p.photo)+'" alt=""><img class="mark" src="'+esc(p.logo)+'" alt=""><span><b>'+esc(p.first)+'</b><small>'+esc(p.empresa)+' · '+esc(p.nivel)+'</small></span></button>').join('');
 card.innerHTML=storiesHtml()+'<div class="k">COMUNIDADE</div><b>Ranking semanal, '+where+'</b><p>'+n+', de exemplo. Recomeça toda segunda. Toque uma pessoa para ver o crachá público.</p><div class="v4-peers">'+rows+'</div><div class="v4-hub"><button type="button" data-go="leagues">Ver ligas</button><button type="button" data-go="c-groups">Grupos</button><button type="button" data-go="c-challenge">Desafio</button></div><p class="v4-hublinks"><button type="button" data-go="c-rooms">Salas</button><button type="button" data-go="c-rules">Regras</button><button type="button" data-go="capital">Bônus SPLA</button><button type="button" data-go="season-end">Temporada</button></p>'+(DEMO?'<div class="v4-toggle"><button type="button" data-rank="turma"'+(mode==='turma'?' class="on"':'')+'>Turma</button><button type="button" data-rank="empresa"'+(mode==='empresa'?' class="on"':'')+'>Empresa</button></div>':'');
 document.querySelectorAll('.cpi-personbadge').forEach(b=>{
  const name=(b.querySelector('strong')||{}).textContent||'';
  const id=name.startsWith('Marina')?'marina':name.startsWith('Rafael')?'rafael':name.startsWith('Patr')?'patricia':'';
  if(!id)return;
  b.dataset.peer=id;b.setAttribute('role','button');b.tabIndex=0;
 });
}
function paintLeague(){
 const sc=document.querySelector('#leagues>.scroll');if(!sc||sc.querySelector('.v4-arena'))return;
 const seg=sc.querySelector('.cseg');
 const arena=document.createElement('section');arena.className='v4-arena';
 arena.innerHTML='<div class="v4-count"><b>3</b><span>dias para fechar a semana</span></div><div class="v4-tiers" aria-label="Séries"><span>C</span><span>B</span><span class="on">A</span></div><div class="v4-podium"><button type="button" data-go="leagues"><img src="'+CO+'logo-orbitas.png" alt=""><b>2</b><small>Órbitas Tech</small></button><button type="button" class="gold" data-go="leagues"><img src="'+CO+'logo-nexa.png" alt=""><b>1</b><small>Nexa Logística</small></button><button type="button" data-go="leagues"><img src="'+CO+'logo-atlasul.png" alt=""><b>3</b><small>Atlasul Bank</small></button></div><p class="tiny">Pódio de exemplo. A tabela da Série A, o confronto e a sua contribuição continuam abaixo.</p><div class="v4-battle"><div><img src="'+CO+'logo-nexa.png" alt=""><b>Nexa Logística</b><span>4.128</span><em>+1 nesta hora</em></div><i>×</i><div><img src="'+CO+'logo-orbitas.png" alt=""><b>Órbitas Tech</b><span>3.994</span><em>rival da semana</em></div></div><div class="v4-xp"><span>Sessões da semana</span><div class="b"><i style="width:64%"></i></div><span>64%</span></div><div class="v4-zones"><span class="up">Sobe</span><span class="me">Sua faixa</span><span class="dn">Cai</span></div><div class="v4-event"><b>Semana da Entrevista</b><span>Começa na segunda. Missões da turma e uma medalha no fim. Exemplo.</span></div>';
 if(seg)seg.after(arena);else sc.prepend(arena);
}
function paintGroups(){
 const sc=document.querySelector('#c-groups>.scroll');if(!sc||sc.querySelector('.v4-gcovers'))return;
 const seg=sc.querySelector('.cseg');
 const box=document.createElement('div');box.className='v4-gcovers';
 box.innerHTML=[{href:'#c-groups',logo:CO+'logo-nexa.png',name:'Nexa Logística',sub:'Grupo da empresa · 37 colegas'},{href:'#c-groups',logo:CO+'logo-orbitas.png',name:'Órbitas Tech',sub:'TI e Cloud · 638 colegas'},{href:'#leagues',logo:CO+'logo-atlasul.png',name:'Atlasul Bank',sub:'Liga de empresas'},{href:'#c-rooms',logo:CO+'logo-vertice.png',name:'Vértice Cloud',sub:'Salas de texto · Etapa 2'},{href:'#c-groups',logo:CO+'logo-calhau.png',name:'Calhau Indústria',sub:'Indústria e supply · 221 colegas'}].map(g=>'<a class="cover" href="'+g.href+'"><img src="'+g.logo+'" alt=""><b>'+g.name+'</b><small>'+g.sub+'</small></a>').join('');
 if(seg)seg.after(box);else sc.prepend(box);
}
function commas(root){
 if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){
  if(!n.nodeValue||n.nodeValue.indexOf('—')<0)return NodeFilter.FILTER_REJECT;
  const p=n.parentElement;if(!p||/^(SCRIPT|STYLE)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
 }});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{n.nodeValue=n.nodeValue.replace(/\s*—\s*/g,', ')});
}
function metaRing(){
 const g=progress();
 const label='Meta do dia '+g.done+'/'+g.total;
 document.querySelectorAll('.cpi-hero .cpi-idmeta, .cpi-practicebar .cpi-minicap').forEach(host=>{
  let ring=host.querySelector('.v4-metaring');
  if(!ring){ring=document.createElement('span');ring.className='v4-metaring';host.appendChild(ring)}
  ring.style.setProperty('--p',g.p+'%');
  ring.textContent=g.done+'/'+g.total;
  ring.setAttribute('aria-label',label);
 });
}
function projetoLabels(root){
 const walker=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){
  if(!n.nodeValue||!/Missão \d+/.test(n.nodeValue))return NodeFilter.FILTER_REJECT;
  const p=n.parentElement;if(!p||/^(SCRIPT|STYLE)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
 }});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{n.nodeValue=n.nodeValue.replace(/Missão (\d+)/g,(_,d)=>'Projeto '+String(d).padStart(2,'0'))});
}
function welcome(){
 const w=document.getElementById('welcome');if(!w||w.querySelector('.v4-stage'))return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const stage=document.createElement('div');stage.className='v4-stage';
 stage.innerHTML=(reduce?'':'<video class="v4-video" autoplay muted loop playsinline poster="'+BASE+'cidade-poster.jpg"><source src="'+BASE+'cidade-loop.webm" type="video/webm"><source src="'+BASE+'cidade-loop.mp4" type="video/mp4"></video>')+'<img class="v4-poster" alt="" src="'+BASE+'cidade-poster.jpg"'+(reduce?'':' hidden')+'><div class="v4-shade"></div><div class="v4-floor" aria-hidden="true"><i></i></div><div class="v4-brand"><img alt="São Paulo Languages Academy" src="'+LOGO+'"></div><div class="v4-copy"><div class="ov">SÃO PAULO LANGUAGES ACADEMY</div><h1>O inglês do seu trabalho, <em>em outro nível.</em></h1><p class="lead">Conversa com IA, trilha guiada e feedback de verdade. Feito em São Paulo, para o mundo.</p><button type="button" class="v4-sci" data-go="base"><span class="ico" aria-hidden="true">⚗</span><span><b>Base científica · 150+ publicações com DOI</b><span>48 pesquisadores · mais de 80 métodos</span></span></button></div>';
 w.appendChild(stage);
 const start=w.querySelector('.foot .btn.primary');if(start)start.textContent='Começar agora';
 const foot=w.querySelector('.foot');
 if(foot&&!foot.querySelector('.v4-row')){
  const row=document.createElement('div');row.className='v4-row';
  [...foot.querySelectorAll('.btn.text,.spla-inspo')].forEach(b=>row.appendChild(b));
  foot.appendChild(row);
 }
 if(!reduce){const v=stage.querySelector('video');if(v)v.play().catch(()=>{});}
}
function screens(){
 const phone=document.getElementById('phone');if(!phone||document.getElementById('base'))return;
 const base=document.createElement('section');base.className='screen';base.id='base';
 base.innerHTML='<div class="shead"><button class="ib" type="button" data-go="welcome" aria-label="Voltar"><svg class="i" aria-hidden="true"><use href="#i-back"/></svg></button><span class="ttl">Base científica</span></div><div class="scroll"><h1 class="h2">Um método construído sobre pesquisa.</h1><p class="lead">Reunimos o que a ciência da aprendizagem de línguas já mostrou e transformamos em prática curta, todos os dias.</p><div class="nums"><div class="n"><b>48</b><span>pesquisadores de referência</span></div><div class="n"><b>80+</b><span>métodos de ensino analisados</span></div><div class="n"><b>300+</b><span>autores citados na bibliografia</span></div><div class="n"><b>150+</b><span>publicações com DOI</span></div></div><div class="card" style="margin-top:12px"><b>18 autorizaram formalmente</b><p>a citação do seu trabalho</p></div><div class="card" style="margin-top:10px"><b>Banca científica</b><p>em formação, com convites formais</p></div><p class="tiny" style="margin-top:12px">Os números se referem à bibliografia. Citar um autor ou uma publicação não significa endosso, participação ou parceria.</p></div>';
 phone.appendChild(base);
 const sheet=document.createElement('section');sheet.className='screen';sheet.id='v4-cracha';sheet.dataset.tab='profile';
 sheet.innerHTML='<div class="shead"><button class="ib" type="button" data-go="community" aria-label="Fechar"><svg class="i" aria-hidden="true"><use href="#i-x"/></svg></button><span class="ttl">Crachá na Comunidade</span></div><div class="scroll" id="v4-cracha-body"></div>';
 phone.appendChild(sheet);
 const insp=document.querySelector('#inspiracao .scroll');
 if(insp&&!insp.querySelector('.v4-classic')){
  const band=document.createElement('div');
  band.className='v4-classic';
  band.setAttribute('role','img');
  band.setAttribute('aria-label','Piso de Mirthes Bernardes, desenho preto e claro');
  insp.prepend(band);
 }
}
function person(){
 if(window.cartaoPaulistaIdentity)return window.cartaoPaulistaIdentity();
 return {name:nome(),first:nome().split(/\s+/)[0],photo:'',company:companyName(),companyReady:!!companyName(),logo:'',level:level()};
}
function badgeHtml(kind){
 const p=person(),ready=!!(p.logo&&p.company);
 const face=p.photo?'<img src="'+esc(p.photo)+'" alt="Retrato de '+esc(p.name)+'">':'<span class="quiz-initial">'+esc((p.name||'S').slice(0,1).toUpperCase())+'</span>';
 const logo=p.logo?'<img src="'+esc(p.logo)+'" alt="Logo '+esc(p.company)+'">':'';
 if(kind==='compact')return '<section class="cpi-hero" data-company-ready="'+ready+'"><div class="cpi-kicker"><span>Crachá SPLA</span></div><div class="cpi-idbody"><span class="cpi-avatarwrap"><span class="cpi-avatar">'+face+'</span></span><div><b>'+esc(p.name)+'</b><div class="tiny">'+esc(p.level||level())+'</div></div></div><div class="cpi-company">'+logo+'<div><b>'+esc(p.company||'Sua empresa')+'</b></div></div></section>';
 return '<div class="v4-full"><div class="hero" data-company-ready="'+ready+'"><div class="avatar-wrap"><div class="frame">'+face+'</div></div><div class="name">'+esc(p.name)+'</div><div class="lvl">'+esc((p.level||level()).split('·')[0].trim())+'</div><div class="company">'+logo+'<div class="co">'+esc(p.company||'Sua empresa')+'</div><div class="sub">'+(ready?'No cordão':'A logo entra no cordão')+'</div></div></div></div>';
}
function statsHtml(){
 const g=progress(),mode=rankMode();
 const rank=mode==='empresa'
  ?{t:'Posição de exemplo da empresa. Recomeça toda segunda.',n:'3ª de 12'}
  :{t:'Posição de exemplo na turma. Recomeça toda segunda.',n:'4º de 30'};
 const off=streak();
 return '<div class="v4-sheet"><div class="rowx"><div><b>Meta do dia</b><p>As etapas que o método pede hoje. Fechar o anel mantém a ofensiva.</p></div><b class="n">'+g.done+'/'+g.total+'</b></div><div class="rowx"><div><b>Ofensiva</b><p>Dias seguidos com a meta do dia cumprida.</p></div><b class="n">'+off+(off===1?' dia':' dias')+'</b></div><div class="rowx"><div><b>Bônus SPLA</b><p>Ganha ao concluir etapas. Errar não tira pontos.</p></div><b class="n">'+bonus()+'</b></div><div class="rowx"><div><b>Ranking semanal</b><p>'+rank.t+'</p></div><b class="n">'+rank.n+'</b></div>'+(DEMO?'<p class="v4-ranknote">Prévia do demo. Sem empresa no perfil, o ranking é da turma. Com empresa, é da empresa.</p><div class="v4-toggle"><button type="button" data-rank="turma"'+(mode==='turma'?' class="on"':'')+'>Turma</button><button type="button" data-rank="empresa"'+(mode==='empresa'?' class="on"':'')+'>Empresa</button></div>':'')+'</div>';
}
function paintSheet(){
 const el=document.getElementById('v4-cracha-body');if(!el)return;
 const ttl=document.querySelector('#v4-cracha .ttl');
 const peer=peerById(routeArg);
 if(ttl)ttl.textContent=peer?'Crachá de '+peer.first:'Crachá na Comunidade';
 el.innerHTML=peer?peerHtml(peer):'<div class="v4-peers">'+PEERS.map(p=>'<button type="button" data-peer="'+p.id+'"><img src="'+esc(p.photo)+'" alt=""><span><b>'+esc(p.first)+'</b><small>Ver crachá público</small></span></button>').join('')+'</div>';
}
function paintProfile(){
 const sc=document.querySelector('#profile>.scroll');if(!sc)return;
 let host=document.getElementById('v4-profile-badge');
 if(!host){host=document.createElement('div');host.id='v4-profile-badge';sc.prepend(host)}
 host.innerHTML=badgeHtml('full')+'<p class="v4-seen">Assim os colegas veem você na Comunidade.</p>'+hubLinks()+statsHtml();
}
let celeTimer=null, celeLeft=0, celeNext='', celePhase='';
function celeBox(){
 let el=document.getElementById('v4-cele');
 if(el)return el;
 el=document.createElement('div');el.id='v4-cele';el.className='v4-cele';el.hidden=true;
 document.getElementById('phone').appendChild(el);
 return el;
}
function goNext(){stopCele();celeNext='';const el=document.getElementById('v4-cele');if(el){el.hidden=true;const fire=el.querySelector('canvas');if(fire&&fire.__stop)fire.__stop()}}
function stopCele(){clearInterval(celeTimer);celeTimer=null}
function tick(){
 const el=celeBox();const line=el.querySelector('.v4-auto');
 if(line)line.textContent='Seguindo sozinho em '+celeLeft+' s · Pausar';
 if(celeLeft<=0){if(celePhase==='done-first')showStreak();else goNext();return}
 celeLeft--;
}
function showCele(step){
 const el=celeBox();celePhase='done';celeLeft=3;celeNext=({aquec:'d-ouvir',ep:'d-trail',trail:'sophia~sessao',call:'d-close',lili:'practice'})[step.key]||'practice';
 const doneNow=PLAN.filter(s=>daySteps()[s.key]&&daySteps()[s.key].done);
 if(doneNow.length<=1)celePhase='done-first';
 el.innerHTML='<div class="v4-cele-bg" style="background-image:url('+BASE+'cidade-poster.jpg)"></div><canvas class="v4-fire" aria-hidden="true"></canvas><div class="v4-sparks" aria-hidden="true"></div><img class="face" alt="" src="'+BASE+'chars/sophia.webp"><div class="kicker">ETAPA CONCLUÍDA</div><h2>Mandou bem, '+esc(nome())+'.</h2><p class="sub">Etapa concluída: '+esc(step.name)+'.</p><div class="v4-stats"><div><b>+15</b><span>BÔNUS SPLA</span></div><div><b>'+progress().done+'/'+progress().total+'</b><span>META DO DIA</span></div><div><b>'+streak()+'</b><span>OFENSIVA</span></div></div><button type="button" class="btn primary" data-cele="go">Continuar</button><button type="button" class="v4-auto" data-cele="pause">Seguindo sozinho em 4 s · Pausar</button>'+(DEMO?'<button type="button" class="v4-skip" data-cele="go">Pular</button>':'');
 el.hidden=false;stopCele();celeLeft=4;fireworks(el.querySelector('canvas'));celeTimer=setInterval(tick,1000);
}
function fireworks(canvas){
 if(!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const ctx=canvas.getContext('2d'),host=canvas.parentElement;
 const fit=()=>{canvas.width=host.clientWidth;canvas.height=host.clientHeight};
 fit();
 const bits=[],colors=['#FFD15C','#FF8A1E','#E8112D','#7EB0FF','#FFFFFF'];
 let frame=0,raf=0;
 function boom(x,y,color){for(let i=0;i<56;i++){const a=Math.random()*Math.PI*2,s=2.4+Math.random()*5;bits.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1.6,life:1,color,r:2.8+Math.random()*2.4})}}
 boom(canvas.width*.28,canvas.height*.16,colors[0]);
 boom(canvas.width*.72,canvas.height*.2,colors[2]);
 boom(canvas.width*.5,canvas.height*.3,colors[1]);
 function draw(){
  if(!canvas.width)fit();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(frame<140&&frame%10===0)boom(canvas.width*(.15+Math.random()*.7),canvas.height*(.08+Math.random()*.36),colors[(frame/10)%colors.length|0]);
  bits.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.055;p.life-=.008;if(p.life<=0)return;ctx.globalAlpha=Math.min(1,p.life+.15);ctx.strokeStyle=p.color;ctx.fillStyle=p.color;ctx.shadowBlur=18;ctx.shadowColor=p.color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*2.4,p.y-p.vy*2.4);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill()});
  ctx.globalAlpha=1;ctx.shadowBlur=0;frame++;
  if(frame<200)raf=requestAnimationFrame(draw);
 }
 raf=requestAnimationFrame(draw);
 canvas.__stop=()=>cancelAnimationFrame(raf);
}
function showStreak(){
 const el=celeBox();celePhase='streak';celeLeft=4;
 const labels=['D','S','T','Q','Q','S','S'];
 const today=new Date().getDay();
 el.innerHTML='<div class="v4-cele-bg" style="background-image:url('+BASE+'cidade-poster.jpg)"></div><div class="v4-sparks"></div><div class="v4-flame" aria-hidden="true">🔥</div><img class="face" alt="" src="'+BASE+'chars/erick.webp" style="position:absolute;top:72px;right:28px;width:64px;height:64px"><div class="kicker">OFENSIVA</div><h2>'+streak()+' dias seguidos.</h2><p class="sub">Uma etapa por dia e o hábito se forma. Amanhã tem mais.</p><div class="v4-days">'+labels.map((d,i)=>'<i class="'+(i<=today?'on':'')+'">'+d+'</i>').join('')+'</div><button type="button" class="btn primary" data-cele="go">Continuar</button><button type="button" class="v4-auto" data-cele="pause">Seguindo sozinho em 4 s · Pausar</button>'+(DEMO?'<button type="button" class="v4-skip" data-cele="go">Pular</button>':'');
 stopCele();celeTimer=setInterval(tick,1000);
}
document.addEventListener('click',e=>{
 const rank=e.target.closest('[data-rank]');
 if(rank&&DEMO){try{sessionStorage.setItem('spla_rank_preview',rank.dataset.rank)}catch(_){}paintSheet();paintCommunity();return}
 const peer=e.target.closest('[data-peer]');
 if(peer&&(peer.tagName==='BUTTON'||!e.target.closest('button,a'))){e.preventDefault();e.stopPropagation();location.hash='v4-cracha~'+peer.dataset.peer;return}
 const av=e.target.closest('[data-v4-av]');
 if(av){e.preventDefault();e.stopPropagation();const menu=av.parentElement.querySelector('.v4-avmenu');if(menu){menu.hidden=!menu.hidden;av.setAttribute('aria-expanded',menu.hidden?'false':'true')}return}
 document.querySelectorAll('.v4-avmenu').forEach(m=>{if(!m.contains(e.target)){m.hidden=true;const b=m.parentElement&&m.parentElement.querySelector('[data-v4-av]');if(b)b.setAttribute('aria-expanded','false')}});
 const c=e.target.closest('[data-cele]');
 if(!c)return;
 e.preventDefault();
 if(c.dataset.cele==='pause'){stopCele();const line=celeBox().querySelector('.v4-auto');if(line)line.textContent='Pausado';return}
 if(celePhase==='done-first'&&c.dataset.cele==='go'){showStreak();return}
 goNext();
});
let seen=daySteps();
window.addEventListener('spla:progress-saved',()=>{
 const now=daySteps();
 PLAN.forEach(s=>{if(now[s.key]&&now[s.key].done&&!(seen[s.key]&&seen[s.key].done))showCele(s)});
 seen=now;
 if(document.getElementById('practice')&&document.getElementById('practice').classList.contains('on'))paintTrail();
});
function navFloor(){
 const phone=document.getElementById('phone');if(!phone||phone.querySelector('.v4-navfloor'))return;
 const f=document.createElement('div');f.className='v4-navfloor';f.setAttribute('aria-hidden','true');f.innerHTML='<i></i>';phone.appendChild(f);
}
function placeFloor(id){
 navFloor();
 const floor=document.querySelector('.v4-navfloor');
 const screen=id&&document.getElementById(id);
 if(!floor)return;
 if(!screen||id==='welcome'){floor.hidden=true;return}
 floor.hidden=false;
 const foot=screen.querySelector(':scope>.foot');
 const tab=screen.querySelector(':scope>.tabbar');
 const lift=(foot?foot.offsetHeight:0)+(tab?tab.offsetHeight:0);
 floor.style.bottom=lift+'px';
 const sc=screen.querySelector(':scope>.scroll');
 if(sc)sc.style.paddingBottom='72px';
}
function apply(id){
 ['m-warm','v4-cracha','community','progress','profile','home','practice'].forEach(ensureBar);
 placeFloor(id);
 tabs(id||'');
 if(id==='practice'){paintTrail();praticaView(routeArg==='pratica')}
 else praticaView(false);
 if(id==='m-warm')placeSeg(document.getElementById('m-warm'),'revisao');
 if(id==='community')paintCommunity();
 if(id==='leagues')paintLeague();
 if(id==='c-groups')paintGroups();
 if(['community','leagues','c-groups','c-challenge','c-rooms','season-end','capital'].includes(id))commas(document.getElementById(id));
 if(id==='profile'||id==='home'||id==='v4-cracha'){if(id==='v4-cracha')paintSheet();else paintProfile()}
 swapLogos();swapFaces(document.getElementById('phone'));relabel(document.getElementById('phone'));projetoLabels(document.getElementById('phone'));metaRing();
}
welcome();screens();
const prev=window.onShowMerge;
window.onShowMerge=function(id,arg){if(prev)prev(id,arg);routeArg=arg||'';queueMicrotask(()=>apply(id))};
const raw=(location.hash||'#welcome').slice(1);
const cut=raw.indexOf('~');
const opened=cut>0?raw.slice(0,cut):raw;
routeArg=cut>0?raw.slice(cut+1):'';
if((opened==='base'||opened==='v4-cracha')&&typeof show==='function')show(opened);
apply(opened);
window.splaTema={progress,rankMode,PLAN};
})();
