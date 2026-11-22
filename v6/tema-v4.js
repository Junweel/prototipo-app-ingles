/* Tema v4. Unidades: Projeto. Meta do dia = etapas do plano de hoje. Ranking: turma ou empresa, conforme o perfil. */
(function(){
'use strict';
const BASE=new URL('assets/tema/',document.currentScript.src).href;
const DEMO=/\/demo(\/|$)/.test(location.pathname);
const LOGO=BASE+'logo/spla-logo-horizontal-escuro-transparente.svg';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PLAN=[
 {key:'aquec',go:'d-warm',name:'Revisão do dia',min:'3 min',kind:'cards'},
 {key:'ep',go:'d-ouvir',name:'Ouvir o episódio',min:'6 min',kind:'audio'},
 {key:'trail',go:'d-trail',name:'Pedir mais prazo',min:'6 min',kind:'task'},
 {key:'call',go:'sophia~sessao',name:'Falar com a Sophia',min:'6 min',kind:'talk'},
 {key:'lili',go:'d-close',name:'Fechamento com a Lili',min:'3 min',kind:'close'}
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
 {id:'trilha',go:'practice',label:'Trilha',icon:'trail',on:id=>['practice','d-warm','d-ouvir','d-trail','d-close','foco','trilha','home'].includes(id)},
 {id:'revisao',go:'m-warm',label:'Revisão',icon:'review',on:id=>['m-warm','review','cartoes'].includes(id)},
 {id:'sophia',go:'sophia~sessao',label:'Sophia',icon:'sophia',on:id=>id==='sophia'||id==='d-call'||id==='chat'},
 {id:'podcast',go:'ouvir',label:'Podcast',icon:'pod',on:id=>['ouvir','ep'].includes(id)},
 {id:'cracha',go:'v4-cracha',label:'Crachá',icon:'badge',on:id=>['v4-cracha','profile','cartao-paulista'].includes(id)}
];
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
function scrub(root){
 const walker=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){
  if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
  const p=n.parentElement;if(!p||/^(SCRIPT|STYLE)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
 }});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{
  let t=n.nodeValue;
  if(t.includes('—'))t=t.replace(/\s*—\s*/g,', ');
  t=t.replace(/Divisão Mirante/g,'Ranking semanal').replace(/Em Stretch/g,'Meta do dia').replace(/Crachá Paulista/g,'Crachá SPLA').replace(/Cartão Paulista/g,'Crachá SPLA').replace(/Rota até a Paulista/g,'Rota SPLA').replace(/Capital/g,'Bônus SPLA');
  if(t!==n.nodeValue)n.nodeValue=t;
 });
 (root||document).querySelectorAll('img').forEach(img=>{
  const s=img.getAttribute('src')||'';
  if(/lili/.test(s))img.src=BASE+'chars/lili.webp';
  else if(/erick/.test(s))img.src=BASE+'chars/erick.webp';
  else if(/sophia|turma\.webp/.test(s))img.src=BASE+'chars/sophia.webp';
 });
}
function tabs(current){
 const html=TABS.map(t=>'<button type="button" data-go="'+t.go+'" data-v4="'+t.id+'"'+(t.on(current)?' class="on" aria-current="page"':'')+'>'+ICONS[t.icon]+'<span>'+t.label+'</span></button>').join('');
 document.querySelectorAll('.tabbar').forEach(bar=>{bar.innerHTML=html;bar.classList.add('v4-tabs')});
 const side=document.getElementById('dnav');
 if(side)side.innerHTML=TABS.map(t=>'<button type="button" data-go="'+t.go+'" data-v4="'+t.id+'"'+(t.on(current)?' class="on"':'')+'>'+ICONS[t.icon]+t.label+'</button>').join('');
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
 sheet.innerHTML='<div class="shead"><button class="ib" type="button" data-go="practice" aria-label="Fechar"><svg class="i" aria-hidden="true"><use href="#i-x"/></svg></button><span class="ttl">Crachá SPLA</span></div><div class="scroll" id="v4-cracha-body"></div>';
 phone.appendChild(sheet);
 const insp=document.getElementById('inspiracao');
 if(insp){
  const sc=insp.querySelector('.scroll');
  if(sc)sc.innerHTML='<div class="v4-classic" role="img" aria-label="Piso de Mirthes Bernardes, desenho preto e claro com fio dourado"></div><p class="v4-cap">Padrão redesenhado em vetor a partir do piso de Mirthes Bernardes (1966).</p><h1 class="h2">Uma cidade que mistura línguas e ideias</h1><div class="blk"><i></i><div><h3>O piso de Mirthes Bernardes</h3><p>Desenhado em 1966 para a calçada da Avenida Paulista, virou símbolo de São Paulo. É dele que vem o padrão da SPLA.</p></div></div><div class="blk"><i style="background:#E8112D"></i><div><h3>A Semana de 22</h3><p>Em 1922, artistas juntaram o que vinha de fora e o que era daqui para criar algo novo. É o que queremos com o seu inglês: o mundo, com a sua voz.</p></div></div><div class="blk"><i style="background:#8FB3FF"></i><div><h3>Por que só aqui</h3><p>Nas aulas, a tela fica limpa para você focar no que importa. O piso só volta onde sobra espaço, em tom baixo.</p></div></div>';
 }
}
function paintSheet(){
 const el=document.getElementById('v4-cracha-body');if(!el)return;
 const g=progress(),mode=rankMode(),co=companyName();
 const rank=mode==='empresa'
  ?{k:'Ranking semanal',t:'Posição da empresa na semana. Recomeça toda segunda.',n:'3ª de 12'}
  :{k:'Ranking semanal',t:'Sua posição na turma. Recomeça toda segunda.',n:'4º de 30'};
 el.innerHTML='<div class="v4-sheet"><div class="v4-who"><span class="v4-av" style="--p:'+g.p+'%"><b>'+esc(nome().slice(0,1).toUpperCase())+'</b></span><div><b>'+esc(nome())+'</b><div class="tiny">'+esc(co||'Sem empresa no perfil')+'</div></div><div class="lv">'+esc(level().split('·')[0].trim())+'</div></div><div class="rowx"><div><b>Meta do dia</b><p>As etapas que o método pede hoje. Fechar o anel mantém a ofensiva.</p></div><b class="n">'+g.done+'/'+g.total+'</b></div><div class="rowx"><div><b>Ofensiva</b><p>Dias seguidos com a meta do dia cumprida.</p></div><b class="n">'+streak()+(streak()===1?' dia':' dias')+'</b></div><div class="rowx"><div><b>Bônus SPLA</b><p>Ganha ao concluir etapas. Errar não tira pontos.</p></div><b class="n">'+bonus()+'</b></div><div class="rowx"><div><b>'+rank.k+'</b><p>'+rank.t+'</p></div><b class="n">'+rank.n+'</b></div>'+(DEMO?'<p class="v4-ranknote">Prévia do demo. Sem empresa no perfil, o ranking é da turma. Com empresa, é da empresa.</p><div class="v4-toggle"><button type="button" data-rank="turma"'+(mode==='turma'?' class="on"':'')+'>Turma</button><button type="button" data-rank="empresa"'+(mode==='empresa'?' class="on"':'')+'>Empresa</button></div>':'')+'<button class="btn primary" type="button" data-go="profile" style="margin-top:14px">Ver meu Crachá completo</button></div>';
}
function paintTrail(){
 const host=document.getElementById('cpi-practice');if(!host)return;
 const g=progress();
 const current=PLAN.findIndex(s=>!(typeof isDone==='function'&&isDone(s.key)));
 const cur=current<0?PLAN.length-1:current;
 let nodes='', y=8;
 const tops=[];
 PLAN.forEach((s,i)=>{
  const state=i<cur||current<0?'done':i===cur?'cur':'wait';
  tops.push(y);
  nodes+='<button type="button" class="v4-node '+state+'" style="top:'+y+'px" data-go="'+(state==='wait'?PLAN[cur].go:s.go)+'" aria-label="'+esc(s.name)+'">'+ICONS[s.kind]+(state==='done'?'<i class="ok" aria-hidden="true"></i>':'')+'</button>';
  if(state==='cur')nodes+='<div class="v4-card" style="top:'+(y-4)+'px"><div class="k">'+esc(s.min.toUpperCase())+'</div><b>'+esc(s.name)+'</b><button class="btn primary" type="button" data-go="'+s.go+'">Começar</button></div>';
  y+=state==='cur'?132:76;
 });
 const railH=Math.max(0,tops[cur]||0);
 const restH=Math.max(0,y-(tops[cur]||0)-70);
 host.innerHTML='<div class="v4-top"><button type="button" class="v4-av" style="--p:'+g.p+'%" data-go="v4-cracha" aria-label="Abrir o Crachá de '+esc(nome())+'"><b>'+esc(nome().slice(0,1).toUpperCase())+'</b></button><span class="v4-lvl">'+esc(level().split('·')[0].trim())+'</span><span class="v4-stat"><span class="v4-ring" style="--p:'+g.p+'%" aria-hidden="true"></span> Meta do dia '+g.done+'/'+g.total+' <span aria-hidden="true">🔥 '+streak()+'</span> <span aria-hidden="true">◆ '+bonus()+'</span></span></div><div class="v4-hd"><div class="ov">PROJETO 06 <i></i> REUNIÕES</div><h2>Dar um update curto na daily</h2></div><div class="v4-prog"><span>'+g.done+' de '+g.total+' etapas</span><div class="b"><i style="width:'+g.p+'%"></i></div><span>Bônus no fim</span></div><div class="v4-map" style="min-height:'+(y+24)+'px"><div class="v4-rail done" style="top:28px;height:'+railH+'px"></div><div class="v4-rail next" style="top:'+(28+railH)+'px;height:'+restH+'px"></div>'+nodes+'</div>';
}
let celeTimer=null, celeLeft=0, celeNext='', celePhase='';
function celeBox(){
 let el=document.getElementById('v4-cele');
 if(el)return el;
 el=document.createElement('div');el.id='v4-cele';el.className='v4-cele';el.hidden=true;
 document.getElementById('phone').appendChild(el);
 return el;
}
function goNext(){stopCele();const n=celeNext;celeNext='';if(n)location.hash=n}
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
 el.innerHTML='<div class="v4-cele-bg" style="background-image:url('+BASE+'cidade-poster.jpg)"></div><div class="v4-sparks" aria-hidden="true"></div><img class="face" alt="" src="'+BASE+'chars/sophia.webp"><div class="kicker">ETAPA CONCLUÍDA</div><h2>Mandou bem, '+esc(nome())+'.</h2><p class="sub">Agora você praticou '+esc(step.name.toLowerCase())+'.</p><div class="v4-stats"><div><b>+15</b><span>BÔNUS SPLA</span></div><div><b>'+progress().done+'/'+progress().total+'</b><span>META DO DIA</span></div><div><b>'+streak()+'</b><span>OFENSIVA</span></div></div><button type="button" class="btn primary" data-cele="go">Continuar</button><button type="button" class="v4-auto" data-cele="pause">Seguindo sozinho em 3 s · Pausar</button>'+(DEMO?'<button type="button" class="v4-skip" data-cele="go">Pular</button>':'');
 el.hidden=false;stopCele();celeTimer=setInterval(tick,1000);
}
function showStreak(){
 const el=celeBox();celePhase='streak';celeLeft=3;
 const labels=['D','S','T','Q','Q','S','S'];
 const today=new Date().getDay();
 el.innerHTML='<div class="v4-cele-bg" style="background-image:url('+BASE+'cidade-poster.jpg)"></div><div class="v4-sparks"></div><div class="v4-flame" aria-hidden="true">🔥</div><img class="face" alt="" src="'+BASE+'chars/erick.webp" style="position:absolute;top:72px;right:28px;width:64px;height:64px"><div class="kicker">OFENSIVA</div><h2>'+streak()+' dias seguidos.</h2><p class="sub">Uma etapa por dia e o hábito se forma. Amanhã tem mais.</p><div class="v4-days">'+labels.map((d,i)=>'<i class="'+(i<=today?'on':'')+'">'+d+'</i>').join('')+'</div><button type="button" class="btn primary" data-cele="go">Continuar</button><button type="button" class="v4-auto" data-cele="pause">Seguindo sozinho em 3 s · Pausar</button>'+(DEMO?'<button type="button" class="v4-skip" data-cele="go">Pular</button>':'');
 stopCele();celeTimer=setInterval(tick,1000);
}
document.addEventListener('click',e=>{
 const rank=e.target.closest('[data-rank]');
 if(rank&&DEMO){try{sessionStorage.setItem('spla_rank_preview',rank.dataset.rank)}catch(_){}paintSheet();return}
 const c=e.target.closest('[data-cele]');
 if(!c)return;
 e.preventDefault();
 if(c.dataset.cele==='pause'){stopCele();const line=celeBox().querySelector('.v4-auto');if(line)line.textContent='Pausado';return}
 if(celePhase==='done-first'&&c.dataset.cele==='go'){showStreak();return}
 goNext();
});
document.addEventListener('click',e=>{
 const trilha=e.target.closest('[data-v4="trilha"]');
 if(!trilha)return;
 let saved=null;try{saved=JSON.parse(localStorage.getItem('spla_resume')||'null')}catch(_){}
 const base=saved&&String(saved.hash||'').split('~')[0];
 if(base&&/^(d-warm|d-ouvir|d-trail|d-close|sophia)$/.test(base)){e.preventDefault();e.stopPropagation();location.hash=saved.hash}
},true);
let seen=daySteps();
window.addEventListener('spla:progress-saved',()=>{
 const now=daySteps();
 PLAN.forEach(s=>{if(now[s.key]&&now[s.key].done&&!(seen[s.key]&&seen[s.key].done))showCele(s)});
 seen=now;
});
function apply(id){
 tabs(id||'');
 if(id==='practice'||id==='home')paintTrail();
 if(id==='v4-cracha')paintSheet();
 swapLogos();scrub(document.getElementById('phone'));
}
welcome();screens();
const prev=window.onShowMerge;
window.onShowMerge=function(id,arg){if(prev)prev(id,arg);queueMicrotask(()=>apply(id))};
const opened=(location.hash||'#welcome').slice(1).split('~')[0];
if((opened==='base'||opened==='v4-cracha')&&typeof show==='function')show(opened);
apply(opened);
window.splaTema={progress,rankMode,PLAN};
})();
