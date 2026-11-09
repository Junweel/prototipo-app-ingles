/* Crachá Paulista como identidade. Interface aditiva: as telas aprovadas continuam no mesmo lugar.
 * Nenhum nó legado é reparentado, clonado ou reescrito. Estado: motor local do próprio app.
 */
(function(){
'use strict';
const A='../cartao-paulista/assets/', testMode=location.pathname.includes('/teste/');
const PREFIX=testMode?'teste_':'';
const $=(q,r=document)=>r.querySelector(q);
const $$=(q,r=document)=>[...r.querySelectorAll(q)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaults={company:'Nexa Logística',photo:A+'marina-circle.png',logo:A+'logo-nexa.png'};
function read(n,fallback={}){try{const v=localStorage.getItem(PREFIX+n);return v?JSON.parse(v):fallback}catch(_){return fallback}}
function identity(){
 const saved=read('cartaoPaulista'),profile=read('perfil');
 const configured=Object.hasOwn(saved,'company')||Object.hasOwn(saved,'logo');
 const company=configured?String(saved.company||'').trim():defaults.company;
 const logo=configured?(Object.hasOwn(saved,'logo')?saved.logo:read('cpLogo',null))||'':read('cpLogo',null)||defaults.logo;
 const name=saved.name||(testMode?profile.nome||'Ana Teste':'Joël');
 return {name,first:name.split(/\s+/)[0]||name,company,companyReady:!!(company&&logo),
  photo:saved.photo||read('cpPhoto',null)||defaults.photo,logo,
  status:saved.status||'🔥 Em Stretch',level:typeof meLabel==='function'?meLabel():'A2+ · Nove de Julho'};
}
window.cartaoPaulistaIdentity=identity;
function isStepDone(k){try{const d=mergeTest.today();return !!d.steps[k]?.done}catch(_){return false}}
const practices=[
 {key:'aquec',icon:'◕',who:'Erick',title:'Aquecimento',desc:'Revisões espaçadas · 3 cards',route:'d-warm',min:'3 min',button:'Aquecer memória'},
 {key:'ep',icon:'◉',who:'Erick',title:'Ouvir a história',desc:'Episódio do dia · pegue o trecho',route:'d-ouvir',min:'6 min',button:'Ouvir agora'},
 {key:'trail',icon:'✧',who:'Erick',title:'Praticar na trilha',desc:'Frases, pistas e pronúncia',route:'d-trail',min:'9 min',button:'Entrar na trilha'},
 {key:'call',icon:'◖',who:'Sophia',title:'Falar de verdade',desc:'Update curto · +20 Capital',route:'d-call',min:'6 min',button:'Ligar para a Sophia'},
 {key:'lili',icon:'✓',who:'Teacher Lili',title:'Fechamento',desc:'Autoavaliação e próximo passo',route:'d-close',min:'3 min',button:'Fechar com a Lili'}
];
function currentStep(){if(!isStepDone('aquec'))return 0;if(!isStepDone('ep'))return 1;if(!isStepDone('trail'))return 2;if(!isStepDone('call'))return 3;return 4}
function completed(){return [isStepDone('aquec'),isStepDone('ep')&&isStepDone('trail'),isStepDone('call'),isStepDone('lili')].filter(Boolean).length}
function capital(){try{return Number(mergeTest.capitalOf().total)||0}catch(_){return 0}}
function streak(){try{return mergeTest.streakInfo().streak||0}catch(_){return 0}}
function fire(){return streak()||1}
function nextStepText(){return ['Aquecimento com o Erick: 3 cards para relembrar o que importa.','Ouça o episódio da sua unidade e encontre os trechos-chave.','Pratique inglês em voz alta com pistas e autocorreção.','Fale com a Sophia numa situação real de reunião.','Feche com a Teacher Lili: o que você consegue e o que volta amanhã.'][currentStep()]}
function resumeLabel(){return isStepDone('lili')?'Ver minha sessão de hoje':completed()?'Continuar sessão de hoje':'Começar sessão de hoje'}
function practiceResume(){return practices[currentStep()].route}
function go(route){location.hash=route}
function avatar(size='',photo,name){const i=identity(),sm=size==='sm'||size==='xs';return `<span class="cpi-avatarwrap"><span class="cpi-avatar ${size}"><img src="${esc(photo||i.photo)}" alt="Crachá Paulista de ${esc(name||i.name)}" class="cpi-photo"></span><span class="cpi-fire" aria-label="${fire()} dias de ofensiva">${sm?'🔥':'🔥 '+fire()}</span>${sm?'':'<span class="cpi-sticker">'+esc(i.status)+'</span>'}</span>`}
function shirtChip(ready=true){return `<button type="button" class="cpi-camiseta" data-company-edit data-company-state="${ready?'on':'off'}" title="${ready?'Logo presente no cordão · editar a empresa do meu Crachá Paulista':'Adicionar empresa e logo ao meu Crachá Paulista'}">${ready?'Vestindo a camisa ✓':'Vista a camisa +'}</button>`}
function company(){const i=identity();return `<div class="cpi-company"><img ${i.logo?`src="${esc(i.logo)}"`:'hidden'} alt="Logo ${esc(i.company)}"><div><b class="cpi-company-name">${esc(i.company||'Sua empresa')}</b><small>${i.companyReady?'Squad da Sprint · exemplo fictício':'Coloque sua logo no cordão'}</small></div>${shirtChip(i.companyReady)}</div>`}
function renderHome(){
 const h=$('#cpi-home');if(!h)return;const i=identity(),n=completed(),pct=n/4*100;
 const last=n?['Aquecimento concluído','Episódio ouvido','Exercícios em trilha','Sophia · missão concluída','Teacher Lili · sessão fechada'][Math.min(n,4)]:'Último registro anterior: Can-do · ticket SAP (exemplo)';
 h.innerHTML=`<section class="cpi-hero" data-company-ready="${i.companyReady}" aria-labelledby="cpi-home-name"><div class="cpi-kicker"><span>🪪 Crachá Paulista</span><a href="#profile">seu crachá ↗</a></div><div class="cpi-idbody">${avatar()}<div class="cpi-idinfo"><h2 class="cpi-idname" id="cpi-home-name">${esc(i.name)}</h2><div class="cpi-idmeta"><a href="#rota">${esc(i.level)}</a><div class="cpi-division">✦ Divisão Mirante · Top 8% <span>(exemplo)</span></div></div></div></div>${company()}</section>
 <p class="cpi-greeting">Olá, ${esc(i.first)}. Seu inglês em movimento, um passo por vez.</p>
 <section class="cpi-action" aria-labelledby="cpi-now-title"><div class="cpi-nowtag"><span>O que fazer agora · ${4-n} etapas restantes</span><a href="#trilha">ver plano</a></div><h2 id="cpi-now-title">${n===4?'Sessão concluída. Amanhã seguimos.':esc(nextStepText())}</h2><p class="cpi-can">Sua missão: <b>“${esc(typeof SESSION!=='undefined'?SESSION.cando:'dar um update curto no inglês do trabalho')}”</b><br>Uma sessão guiada de aproximadamente 26 min.</p><div class="cpi-lili"><img src="${A}lili-3d.png" alt="Teacher Lili, avatar 3D"><p><b>Teacher Lili</b>${n?'Continuidade vence pressa: retome de onde parou. O que já foi feito continua salvo.':'Comece só pelo aquecimento. Eu aviso qual é o próximo passo.'}</p></div><button type="button" class="cpi-primary" data-cpi-go="${practiceResume()}">▶ ${resumeLabel()}</button><a href="#practice" class="cpi-secondary">Ver a trilha visual de hoje →</a><div class="cpi-action-note"><span>Sem perder Capital por errar</span><a href="#capital">Regras do Capital →</a></div></section>
 <div class="cpi-recap"><section class="cpi-recapitem"><h3>Onde estou</h3><p><a href="#rota">${esc(i.level)}</a></p><small>Fala A2+ · escuta B1 · ${pct}% da sessão</small><div class="cpi-studybar" role="progressbar" aria-label="Etapas da sessão" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${n}"><i style="width:${pct}%"></i></div></section><section class="cpi-recapitem"><h3>O que fiz</h3><p>${esc(last)}</p><small><a href="#progress">Ver relatório →</a></small><small>${n} de 4 etapas hoje</small></section></div>
 <section class="cpi-forecast" aria-labelledby="cpi-forecast-title"><h2 id="cpi-forecast-title">Ao seguir a trilha, o que vem?</h2><p>Conclua a sessão. Depois transforme o inglês da próxima reunião em evidência.</p><div class="cpi-goals"><a class="cpi-goal" href="#capital"><strong>+${Math.max(0,80-(isStepDone('lili')?80:0))}</strong><span>Capital do fechamento<br>até ${capital()+80} hoje</span></a><a class="cpi-goal" href="#cartao-paulista"><strong>★</strong><span>Selo: sign-off<br>em status update</span></a><a class="cpi-goal" href="#rota"><strong>Consolação</strong><span>Próxima parada<br>rumo ao B1</span></a></div><details><summary>Ver o que eu vou conseguir e conquistar</summary><ul><li><b>Hoje:</b> dar um status update curto e responder como está um projeto.</li><li><b>Próxima trilha:</b> explicar um atraso ao cliente e propor um novo prazo.</li><li><b>Próxima evidência B1:</b> falar do previsível com mais autonomia.</li><li>🔥 Manter sua ofensiva · ◆ selo para a sua vitrine · 👕 contribuir para ${esc(i.company)}.</li></ul><small>Objetivos de aprendizagem e previsão de recompensas do protótipo, não promessa de nível ou prazo. Divisão Mirante e empresa são exemplos fictícios.</small></details></section>
 <details class="cpi-collapsed"><summary>Minha liga, conquistas e selos <span class="cpi-pfire">🔥 ${fire()} dias</span></summary><div class="cpi-morebody"><p class="small">Capital real neste navegador: <b>${capital()} hoje</b>. Acompanhe a equipe e o que fica no seu Crachá.</p><div class="cpi-shortcuts"><a href="#leagues">👕 Minha empresa na liga →</a><a href="#season-end">🏆 Fim da temporada 2 →</a><a href="#cartao-paulista">🎖️ Meus selos →</a><a href="#progress">📈 Meu progresso →</a></div></div></details>
 <details class="cpi-collapsed"><summary>Atalhos e visão do método</summary><div class="cpi-morebody"><div class="cpi-shortcuts"><a href="#d-call">🎤 Sophia · conversa</a><a href="#d-warm">🧠 Erick · aquecimento</a><a href="#progress">👩‍🏫 Lili · relatório</a><a href="#c-groups">👥 Grupo SAP</a><a href="#c-challenge">🎯 Desafio</a><a href="#m-cycle">🧩 Memória → Uso → Avaliação</a></div></div></details>
 `;
}
function renderPractice(){
 const h=$('#cpi-practice');if(!h)return;const i=identity(),pos=currentStep(),target=pos/4;
 h.innerHTML=`<div class="cpi-practicebar" data-company-ready="${i.companyReady}">${avatar('sm')}<div class="cpi-miniident"><div class="cpi-minifire">🔥 ${fire()} dias de ofensiva</div><div class="cpi-mininame">${esc(i.first)}</div><div class="cpi-minico"><img ${i.logo?`src="${esc(i.logo)}"`:'hidden'} alt=""><span>${esc(i.company||'Sua empresa')}</span></div></div><div class="cpi-minicap">${capital()} Capital<br><span class="cpi-minilev">hoje · ${esc(i.level.split(' · ')[0])}</span></div></div><div class="cpi-trailhead"><div><h2>Sua trilha de hoje</h2><p>Um passo puxa o próximo. Sem escolher tudo de novo.</p></div><span>dados locais</span></div><div class="cpi-nextcoach"><img src="${A}lili-3d.png" alt=""><span><b>Teacher Lili:</b> ${esc(nextStepText())}</span></div><ol class="cpi-pathnodes" aria-label="Progresso na sessão de hoje"><svg class="cpi-pathline" viewBox="0 0 336 600" preserveAspectRatio="none" aria-hidden="true"><path d="M74 45C74 96 262 75 262 142S74 199 74 235S262 280 262 320S74 384 74 420S262 465 262 535"/><path class="cpi-pathdone" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${Math.max(0,1-target)}" d="M74 45C74 96 262 75 262 142S74 199 74 235S262 280 262 320S74 384 74 420S262 465 262 535"/></svg>${practices.map((p,k)=>{const state=k<pos?'done':k===pos?'current':'locked',status=state==='done'?'Feito · retomar se quiser':state==='current'?'Sua vez · comece por aqui':'Depois da etapa atual';return `<li class="cpi-nodeitem is-${state}" data-step="${p.key}" aria-current="${state==='current'?'step':'false'}"><span class="cpi-step" aria-hidden="true">${state==='done'?'✓':state==='locked'?'🔒':p.icon}</span><div class="cpi-steptext"><small>${k+1} / 5 · ${p.who} · ${p.min}</small><b>${p.title}</b><span data-cp-role>${p.desc}</span><span class="cpi-state">${status}</span><button type="button" class="cpi-stepbutton" data-cpi-go="${state==='locked'?practiceResume():p.route}" aria-label="${state==='locked'?'Ir para etapa atual: ':state==='done'?'Rever: ':''}${p.title}">${state==='done'?'↻ Rever':state==='current'?'▶ '+p.button:'Fazer etapa atual →'}</button></div></li>`}).join('')}</ol><p class="cpi-endcap"><span class="cpi-check">✓</span><span>${completed()} de 4 etapas registradas. O nó final orienta; o resumo fecha o ciclo em ${capital()} Capital.</span></p>`;
}
const people=[
 {name:'Marina C.',photo:A+'marina-circle.png',company:'Nexa Logística',logo:A+'logo-nexa.png',role:'SAP FI/CO · B1 · há 2 h',status:'🔥 Em Stretch'},
 {name:'Rafael T.',photo:A+'rafael-circle.png',company:'Órbitas Tech',logo:A+'logo-orbitas.png',role:'TI & Cloud · A2 · há 5 h',status:'🎯 Focus Mode'},
 {name:'Patrícia L.',photo:A+'bia-circle.png',company:'Atlasul Bank',logo:A+'logo-atlasul.png',role:'Mercado Financeiro · B2 · ontem',status:'📞 Em Call'}
];
const companies=[['Nexa Logística','nexa','12,4k'],['Órbitas Tech','orbitas','11,9k'],['Atlasul Bank','atlasul','10,2k'],['Vértice Cloud','vertice','9,6k'],['Calhau Indústria','calhau','8,1k']];
function renderCommunity(){
 teamStow();const h=$('#cpi-community');if(!h)return;
 if(!h.dataset.ready){
  h.innerHTML=`<section class="cpi-restaurant"><h2>Quem pratica com você.</h2><p>Crachá Paulista, camiseta da empresa e conquistas em inglês. Pessoas em comunidade, empresas em disputa — tudo fictício.</p><a href="#c-rules" class="cpi-textlink">O que compartilho? Privacidade →</a></section><section class="cpi-companybattle"><div class="cpi-battlehead"><small>Company vs company · Sprint 3 (exemplo)</small><b>A camiseta também entra em campo.</b><a href="#leagues">Ver Liga completa →</a></div><div class="cpi-rankrow" tabindex="0" aria-label="Classificação de empresas fictícias">${companies.map(([co,im,score],i)=>`<article class="cpi-rankcard"><div class="cpi-rankname"><span>${i+1}</span><img src="${A}logo-${im}.png" alt=""> ${co}</div><p>Média de Capital ${score} (exemplo) · ${[128,117,98,75,62][i]} ativos fictícios</p></article>`).join('')}</div><div class="cpi-duel"><div><strong><img src="${A}logo-nexa.png" alt="">Nexa Logística</strong><small>Operações · 4.128</small></div><span>×</span><div><strong><img src="${A}logo-orbitas.png" alt="">Órbitas Tech</strong><small>Cloud · 3.994</small></div></div><div class="cpi-duelgoal"><b>Squad em disputa:</b> 3 pessoas fizeram a missão de update. Falta uma para o selo "Squad Hero". <a href="#c-challenge">Ver desafio</a> · <a href="#cp-liga">Empresas fictícias</a></div></section><h2 class="cpi-sectiontitle" id="cpi-people-title">Pessoas da comunidade</h2><div class="cpi-filters" role="group" aria-label="Filtrar publicações por empresa"><button data-cpi-filter="all" aria-pressed="true">Todas</button><button data-cpi-filter="Nexa Logística" aria-pressed="false">Nexa</button><button data-cpi-filter="Órbitas Tech" aria-pressed="false">Órbitas</button><button data-cpi-filter="Atlasul Bank" aria-pressed="false">Atlasul</button></div><details class="cpi-communitylinks"><summary>Explorar comunidade</summary><div class="cpi-shortcuts cpi-communitynav"><a href="#c-groups">Grupos</a><a href="#c-challenge">Desafio da semana</a><a href="#c-rooms">Salas · Etapa 2</a><a href="#c-rules">Regras</a><a href="#leagues">Liga</a><a href="#capital">Capital</a></div></details><p class="cpi-smallnote">Feed original · toda empresa, divisão e ofensiva é fictícia.</p>`;
  const users={'Marina C.':people[0],'Rafael T.':people[1],'Patrícia L.':people[2]};
  $$('#community .post').forEach(post=>{if(post.classList.contains('mine'))return;
   const found=Object.keys(users).find(n=>post.querySelector('.row')?.textContent.includes(n));if(!found)return;
   const p=users[found],badge=document.createElement('div'),k=Object.keys(users).indexOf(found);
   badge.className='cpi-personbadge';badge.dataset.cpiCompany=p.company;
   badge.innerHTML=`<span class="cpi-avatarwrap"><span class="cpi-avatar xs"><img src="${p.photo}" alt="Crachá Paulista de ${p.name}"></span><span class="cpi-personsticker">${p.status.replace(/^\S+\s*/,'')}</span></span><div class="cpi-pdetail"><div class="cpi-pname"><strong>${p.name}</strong><em>(exemplo)</em><span class="cpi-pfire">🔥 ${[12,8,15][k]} dias</span></div><div class="cpi-pmeta">${p.role}</div><div class="cpi-pstatus">${p.status} · <span>Lvl ${['B1','A2','B2'][k]}</span><span>✦ ${found==='Rafael T.'?'Faria Lima':'Mirante'}</span></div><div class="cpi-company"><img src="${p.logo}" alt="Logo ${p.company}"><div><b>${p.company}</b></div>${shirtChip(true)}</div></div>`;
   post.prepend(badge);post.dataset.cpiCompany=p.company;post.classList.add('cpi-person-enhanced');
  });
  h.dataset.ready='true';
 }
 h.querySelectorAll('[data-cpi-filter]').forEach(b=>b.onclick=()=>{
  h.querySelectorAll('[data-cpi-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  $$('#community .post').forEach(post=>{post.hidden=b.dataset.cpiFilter!=='all'&&post.dataset.cpiCompany!==b.dataset.cpiFilter});
  const n=$$('#community .post:not([hidden])').length;h.querySelector('.cpi-smallnote').textContent=n+' publicações · empresas, divisões e ofensivas fictícias.';
 });
}
function enrichCommunityContexts(){
 peopleByNameData['Marina C.']=people[0];peopleByNameData['Rafael T.']=people[1];peopleByNameData['Patrícia L.']=people[2];
 const peopleByName=peopleByNameData;
 peopleByName['Lucas A.']={photo:A+'erick-hi.png',company:'Vértice Cloud',logo:A+'logo-vertice.png'};
 for(const route of ['c-challenge','c-rooms']){
  const sc=$('#'+route+'>.scroll');if(!sc||sc.dataset.cpiCard)return;
  let box=$('#'+route+'-identity');if(!box){box=document.createElement('div');box.id=route+'-identity';box.className='cpi-contextidentity';sc.append(box)}
  Object.entries(peopleByName).forEach(([name,p])=>{
   const nodes=[...sc.querySelectorAll('.bb .n>span,.post b')].filter(el=>el.textContent.startsWith(name));
   nodes.forEach(n=>{
    const badge=document.createElement('div');badge.className='cpi-contextbadge';badge.innerHTML=`<span class="cpi-avatar"><img src="${p.photo}" alt=""></span><div><b>🪪 ${name} · 🔥 <span>12 dias</span> · ${p.company}</b><small>Crachá Paulista · Em Stretch · Divisão Mirante · exemplo</small></div><img src="${p.logo}" alt="Logo ${p.company}">`;
    (n.closest('.rm,.post')||n.parentElement).after(badge);
   });
  });
  sc.dataset.cpiCard='true';
 }
}
const peopleByNameData={};
function closeCallFromChip(){const b=$('#oSClose');if(b)b.click()}
function renderProfile(){
 const w=$('#cpiProfileWrapper');if(!w)return;const i=identity();
 if(!$('#cpiProfileFrame'))w.innerHTML=`<div class="cpi-kicker"><span>🪪 Crachá Paulista · sua identidade</span><a href="#cp-divisions">divisões →</a></div><div class="cpi-profileid" data-company-ready="${i.companyReady}">${avatar('sm')}<div><b>${esc(i.name)}</b><span>${esc(i.level)} · ${fire()} 🔥</span></div><div class="cpi-company"><img ${i.logo?`src="${esc(i.logo)}"`:'hidden'} alt=""><div><b>${esc(i.company||'Sua empresa')}</b></div></div></div><div id="cpiProfileFrameWrap"><iframe id="cpiProfileFrame" title="Crachá Paulista interativo" src="../cartao-paulista/cartao-paulista.html?v=cordao-v-20261109" data-current="cartao-paulista"></iframe></div><p class="cpi-profilehint">Use a rolagem interna para ver o crachá completo. Toque em Editar no topo do Crachá.</p><nav class="cpi-profilecontrols" aria-label="Telas do Crachá Paulista"><button type="button" data-cpi-profile="cartao-paulista">Crachá</button><button type="button" data-cpi-profile="cp-status-picker">Status</button><button type="button" data-cpi-profile="cp-divisions">Divisões</button><button type="button" data-cpi-profile="cp-edit">✎ Editar</button><button type="button" data-cpi-profile="cp-liga">Liga</button></nav><details class="cpi-collapsed" data-cpi-original><summary>Preferências, aprendizado e dados</summary><p class="cpi-originalhint">Use os atalhos acima para editar. As demais configurações ficam logo abaixo.</p></details>`;
 $$('[data-cpi-profile]',w).forEach(b=>b.onclick=()=>{loadFrame(b.dataset.cpiProfile);$$('[data-cpi-profile]',w).forEach(c=>c.setAttribute('aria-pressed',String(c===b)))});
 fitProfile();
}
function loadFrame(route){const f=$('#cpiProfileFrame');if(!f||f.dataset.current===route)return;f.dataset.current=route;f.src='../cartao-paulista/'+route+'.html?v=cordao-v-20261109'}
function fitProfile(){const w=$('#cpiProfileFrameWrap'),f=$('#cpiProfileFrame');if(!w||!f)return;const s=w.clientWidth/1080;f.style.transform=`scale(${s})`;try{w.style.height=(Math.max((f.contentDocument.querySelector('.phone')||f.contentDocument.body).scrollHeight,800)*s)+'px'}catch(_){w.style.height=2340*s+'px'}}
function teamStow(){const d=$('#community>.scroll>.cpi-native'),team=d?.querySelector(':scope>.cpi-teamdetails');if(!team)return;d.querySelectorAll('.o-team,.exb,.g-head,h4').forEach(n=>{if(!team.contains(n)&&!n.closest('.post'))team.append(n)});}
function nativeProgressive(sc,id,label){
 if(!sc||sc.querySelector(':scope>.cpi-legacy'))return;
 const d=document.createElement('details');d.className='cpi-legacy';d.dataset.cpiLegacy=id;
 const sum=document.createElement('summary');sum.textContent=label;d.append(sum);
 [...sc.children].filter(x=>x.id!=='cpi-'+id&&x.id!=='cpiProfileWrapper'&&(!['home','practice','community','profile'].includes(id)||x.id!=='cpi-'+id)).forEach(n=>d.append(n));
 sc.append(d);
 if(id==='community'){
  // Start with real people visible; the overview can be disclosed independently.
  d.open=true;d.classList.add('cpi-feed');
  sum.textContent='Pessoas, conquistas e a prática compartilhada';
  const team=document.createElement('details');team.className='cpi-teamdetails';
  team.innerHTML='<summary>Ofensiva da equipe e informações</summary>';d.append(team);teamStow();

 }
}
function init(){
 // Uma única organização dos contêineres. Conteúdo de estudo só muda de contêiner estrutural.
 // Organização executada uma vez; reações e formulários preservam os nós originais, sem clonagem.
 for(const id of ['home','practice','community','profile']){
  const sc=$('#'+id+'>.scroll'),newid=id==='profile'?'cpiProfileWrapper':'cpi-'+id;
  if(!sc||$('#'+newid))continue;

  nativeProgressive(sc,id,{home:'Conteúdo original e personalização',practice:'Extras, revisão, missões e caixa de ferramentas',profile:'Preferências, aprendizado e dados'}[id]||'');
  const stable=sc.querySelector(':scope>.cpi-legacy');
  if(stable)stable.className='cpi-native'
  enrichCommunityContexts();const box=document.createElement('div');box.id=newid;box.className='cpi'+(id==='profile'?' cpi-profiletop':'');sc.prepend(box);sc.classList.add('cpi-layer-managed');
  if(id==='community')sc.querySelector(':scope>.cpi-native>div.row')?.classList.add('cpi-native-message');
 }
 document.addEventListener('load',e=>{if(e.target.id==='cpiProfileFrame')fitProfile()},true);
 window.addEventListener('resize',fitProfile);
 const upstream=window.onShowMerge;
 window.onShowMerge=function(id,arg){try{if(upstream)upstream(id,arg);if(id==='community')teamStow()}catch(e){console.error('Crachá: rota legada',e)}
  queueMicrotask(()=>{try{if(id==='c-challenge'||id==='c-rooms'||id==='leagues')enrichCommunityContexts();if(id==='home'){const sc=$('#home>.scroll'),dest=$('#home>.scroll>.cpi-native');if(sc&&dest)[...sc.children].filter(x=>x!==dest&&x.id!=='cpi-home'&&(x.id==='oHomeToday'||x.classList.contains('o-lemb'))).forEach(x=>dest.prepend(x))}render(id)}catch(e){console.error('Crachá: '+id,e)}});
 };
 document.addEventListener('click',e=>{if(e.target.closest('[data-company-edit]')){e.preventDefault();go('profile');renderProfile();loadFrame('cp-edit');$('#cpiProfileFrameWrap')?.scrollIntoView({block:'start'});return}const b=e.target.closest('[data-cpi-go]');if(b){e.preventDefault();go(b.dataset.cpiGo)}});
 window.addEventListener('message',e=>{
  if(e.origin!==location.origin)return;const d=e.data||{},f=$('#cpiProfileFrame');if(!f||f.contentWindow!==e.source)return;
  e.stopImmediatePropagation();
  if(d.type==='cp-nav'){const mapped={profile:'cartao-paulista',back:'cartao-paulista'}[d.dest]||d.dest;if(['cartao-paulista','cp-edit','cp-status-picker','cp-divisions','cp-liga'].includes(mapped))loadFrame(mapped);else location.hash=mapped}
  if(d.type==='cp-size')fitProfile();
  if(d.type==='cp-profile'){try{const old=read('cartaoPaulista');localStorage.setItem(PREFIX+'cartaoPaulista',JSON.stringify(Object.assign(old,d.value)))}catch(_){}queueMicrotask(()=>{const host=$('.cpi-profileid');if(host){host.querySelector('b').textContent=identity().name;host.dataset.companyReady=String(identity().companyReady);host.querySelector('.cpi-company b').textContent=identity().company||'Sua empresa';const im=host.querySelector('.cpi-company img');im.hidden=!identity().logo;if(identity().logo)im.src=identity().logo;else im.removeAttribute('src')}if(f.dataset.current==='cartao-paulista')f.src=f.src;render('home');render('practice')})}
 },true);
 render($('.screen.on')?.id||location.hash.slice(1)||'home');
}
function render(id){if(id==='home')renderHome();else if(id==='practice')renderPractice();else if(id==='community')renderCommunity();else if(id==='profile'){renderProfile();requestAnimationFrame(fitProfile)} }
init();
window.cartaoIdentidade={identity,practices,completed,currentStep,practiceResume,render,loadFrame};
})();
