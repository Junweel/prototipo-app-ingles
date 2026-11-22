/* Quiz de boas-vindas. O teste de nível que já existe continua sendo a medida oficial. */
(function(){
'use strict';
const DEMO=/\/demo(\/|$)/.test(location.pathname);
const VOZ=new URL('assets/voz/',document.currentScript.src).href;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const Q=[
 {id:'objetivo',title:'Para que você quer inglês?',sophia:'Por que o inglês importa para você agora? Pode marcar mais de um.',voz:'q-objetivo',type:'multi',options:['Reuniões e calls','E-mails e tickets','Apresentações','Entrevista','Viagem a trabalho','Conversar no dia a dia com mais confiança']},
 {id:'area',title:'Sua área',sophia:'Sua área ajuda a escolher o vocabulário das primeiras sessões.',voz:'q-area',type:'single',options:['SAP','TI e Cloud','Finanças','Bancos','Indústria','Logística','Saúde','Educação','Outra']},
 {id:'nivel',title:'Como você descreveria seu inglês hoje?',sophia:'Como você descreveria seu inglês hoje? Depois a gente mede de verdade no teste de nível. Isto aqui só ajuda a calibrar a primeira semana.',voz:'q-nivel',type:'single',hint:'Isso não é um nível CEFR e não vai para o Crachá como nível medido.',options:['Ainda estou começando','Me viro no básico, com apoio','Dou conta em situações conhecidas','Me comunico bem, com algumas travas','Já uso com naturalidade no trabalho, e quero mais segurança']},
 {id:'trava',title:'O que mais te trava na hora de falar?',sophia:'O que mais te trava na hora de falar? Marque o que for verdade. Não tem resposta errada.',voz:'q-trava',type:'multi',options:['Travo na hora de falar','Entendo, mas não consigo responder','Não acho as palavras com rapidez','Tenho vergonha do sotaque','Tenho medo de errar na frente dos outros','Me falta tempo para praticar','Outra razão']},
 {id:'situacoes',title:'Em quais situações a tensão aparece?',sophia:'Em quais situações a tensão aparece? Assim a primeira semana treina o que você realmente vai viver.',voz:'q-situacoes',type:'multi',hint:'Se quase não trava, escolha as situações em que você quer mais segurança.',options:['Reunião ou call','Apresentação para um grupo','Entrevista','Conversar com nativos','Ligação ou telefone','Conversa informal (small talk)','Pedir a palavra ou interromper com educação','Também trava na escrita']},
 {id:'tempo',title:'Quanto tempo por dia, de verdade?',sophia:'Quanto tempo por dia, de verdade? Constância conta mais do que maratona.',voz:'q-tempo',type:'tabs',options:['10 minutos','15 minutos','25 minutos','30 minutos']},
 {id:'momentos',title:'Quando é mais fácil encaixar a sessão?',sophia:'Quando é mais fácil encaixar a sessão? Pode marcar mais de um. A Teacher Lili só lembra se faltar a meta do dia, sem chantagem de sequência.',voz:'q-momentos',type:'multi',options:['De manhã, antes do expediente','No deslocamento','No horário de almoço','No fim da tarde','À noite, em casa','Quando der, sem horário fixo']},
 {id:'interesses',title:'O que você gostaria de ouvir e ler?',sophia:'O que você gostaria de ouvir e ler no seu nível? Isso deixa o input mais gostoso de sustentar.',voz:'q-interesses',type:'multi',options:['Situações reais do meu trabalho','Viagem e cotidiano','São Paulo e cultura da cidade','Tecnologia','Atualidades','Cinema e séries','Música','Esporte']},
 {id:'experiencia',title:'O que você já tentou?',sophia:'O que você já tentou? Ajuda a não repetir o que já cansou e a aproveitar o que já existe.',voz:'q-experiencia',type:'single',options:['Nunca estudei de verdade','Escola ou cursinho, há bastante tempo','Apps por conta própria','Aulas particulares ou curso recente','Já uso inglês no trabalho, mas ainda travo','Já fiz intercâmbio ou morei fora']},
 {id:'confianca',title:'E hoje, como você se sente falando inglês?',sophia:'E hoje, como você se sente falando inglês?',voz:'q-confianca',type:'scale',left:'Travo muito',right:'Super à vontade',options:['1','2','3','4','5']}
];
const face='<img src="assets/sophia.webp" width="52" height="52" alt="Sophia, personagem ilustrada e fictícia" style="width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:center 18%;background:#F3EBDD;box-shadow:0 0 0 2px #F5C518">';
let qi=0;
let answers={};
let nome='';
const audio=new Audio();
audio.preload='none';
function load(){try{const s=JSON.parse(localStorage.getItem('splaQuiz')||'null');if(s&&s.answers)answers=s.answers;if(s&&s.nome)nome=s.nome;if(typeof s?.qi==='number')qi=s.qi}catch(_){}}
function persist(){try{localStorage.setItem('splaQuiz',JSON.stringify({answers,nome,qi,at:new Date().toISOString()}))}catch(_){}}
function selected(id){const v=answers[id];return Array.isArray(v)?v:(v?[v]:[])}
function valid(i){const q=Q[i],v=answers[q.id];if(q.type==='multi')return Array.isArray(v)&&v.length>0;return v!=null&&v!==''}
function speak(file){if(!file)return;try{window.SplaDialogueAudio&&window.SplaDialogueAudio.stop()}catch(_){}audio.pause();audio.src=VOZ+file+'.mp3';audio.play().catch(()=>{});}
function go(hash){if(location.hash==='#'+hash){window.show&&window.show(hash)}else location.hash=hash}
function reviewOn(){try{sessionStorage.setItem('spla_review','1')}catch(_){}}
function sample(){
 answers={objetivo:['Reuniões e calls','Entrevista'],area:'SAP',nivel:'Dou conta em situações conhecidas',trava:['Travo na hora de falar','Não acho as palavras com rapidez','Tenho medo de errar na frente dos outros'],situacoes:['Reunião ou call','Entrevista'],tempo:'25 minutos',momentos:['No deslocamento','À noite, em casa'],interesses:['Situações reais do meu trabalho','São Paulo e cultura da cidade'],experiencia:'Apps por conta própria',confianca:'2'};
 persist();
}
function canDo(p){
 const obj=p.obj,area=p.area,conf=p.conf;
 if(obj.includes('Entrevista'))return 'Consigo responder, com calma, "tell me about yourself" na entrevista'+(area&&area!=='sua área'?' de '+area:'')+'.';
 if(obj.includes('Apresentações'))return 'Consigo abrir uma apresentação curta e dizer o objetivo, mesmo se o nervoso aparecer.';
 if(obj.includes('Viagem a trabalho'))return 'Consigo pedir informação e confirmar um horário, mesmo se travar no começo.';
 if(obj.includes('Reuniões e calls'))return 'Consigo me apresentar e dar um status curto numa call com o time'+(area&&area!=='sua área'?', em contexto de '+area:'')+'.';
 if(obj.includes('E-mails e tickets'))return 'Consigo explicar um ponto por voz, não só por escrito, com frases do trabalho em '+area+'.';
 if(obj.includes('Conversar no dia a dia com mais confiança'))return 'Consigo manter uma conversa curta do dia a dia, cumprimentar e fazer uma pergunta, mesmo se uma palavra faltar.';
 if(conf<=2)return 'Consigo cumprimentar e fazer uma pergunta simples sem desistir no meio.';
 return 'Consigo participar de uma conversa curta sobre o meu trabalho em '+area+', com mais calma.';
}
function plan(){
 const obj=selected('objetivo'),trava=selected('trava'),sit=selected('situacoes'),int=selected('interesses'),mom=selected('momentos');
 const conf=Number(answers.confianca||'3'),area=answers.area||'sua área',tempo=answers.tempo||'25 minutos',exp=answers.experiencia||'';
 const focos=[],principios=[];
 const low=conf<=3||trava.some(t=>['Travo na hora de falar','Tenho medo de errar na frente dos outros','Tenho vergonha do sotaque'].includes(t));
 if(low){focos.push('Confiança na fala: prática segura. Errar faz parte, e a Sophia corrige só os alvos do dia, com a pista antes da resposta.');principios.push(['Ansiedade em língua estrangeira','Horwitz, Horwitz e Cope, 1986','porque a trava na fala é o que você pediu para cuidar.'])}
 if(trava.includes('Não acho as palavras com rapidez')){focos.push('Frases úteis para '+(obj[0]||'o seu objetivo')+' em '+area+', com revisão nos cartões da SPLA.');principios.push(['Repetição espaçada','Cepeda et al., 2006','para as frases voltarem no tempo certo, nos cartões da SPLA.'])}
 if(trava.includes('Entendo, mas não consigo responder'))focos.push('Mais produção oral do que só escuta: respostas curtas, que dá para recuperar na hora.');
 if(trava.includes('Tenho vergonha do sotaque'))focos.push('Respeito ao seu sotaque nesta semana. A triagem de sons (ship/sheep e outros) entra no teste de nível.');
 if(trava.includes('Me falta tempo para praticar')||tempo==='10 minutos')focos.push(tempo==='10 minutos'?'É um começo honesto. O hábito diário importa mais do que alongar a sessão. A Teacher Lili só lembra se faltar a meta, com 1 folga na semana.':'Ritmo protegido no horário que você escolheu. A Teacher Lili só lembra se faltar a meta, com 1 folga na semana.');
 if(sit.length)focos.push('Situações desta semana: '+sit.slice(0,3).join(', ')+'.');
 if(int.length){focos.push('Temas para ouvir e ler: '+int.slice(0,3).join(', ')+'.');if(!principios.some(x=>x[0].indexOf('Input')===0))principios.push(['Input compreensível','Krashen, 1982','com temas que você escolheu, no seu nível.'])}
 if((exp.indexOf('Apps')===0||exp.indexOf('Escola')===0)&&trava.length)focos.push('O foco da semana é falar, em vez de repetir o mesmo tipo de lição.');
 if(exp.indexOf('Já uso')===0||exp.indexOf('Já fiz intercâmbio')===0)focos.push('Cenários mais próximos do que você já vive, com correção fina. Ainda é provisório até o teste.');
 if(!principios.length){principios.push(['Input compreensível','Krashen, 1982','para sustentar contato com o idioma no seu nível.']);principios.push(['Repetição espaçada','Cepeda et al., 2006','para o que importa voltar no tempo certo.'])}
 if(!focos.length)focos.push('Uma sessão curta por dia, com o Erick, a Sophia e a Teacher Lili, no tempo que você marcou.');
 return {obj,area,tempo,mom,focos,principios,conf,nivel:answers.nivel,canDo:canDo({obj,area,conf})};
}
function initial(name){const t=(name||'S').trim();return (t[0]||'S').toUpperCase()}
function badge(p,who){
 const obj=(p.obj.slice(0,2).join(' · ')||'Seu objetivo');
 return `<div class="hero" data-company-ready="false">
  <div class="avatar-wrap"><div class="frame"><span class="quiz-initial">${esc(initial(who))}</span></div></div>
  <div class="name">${esc(who||'Seu nome')}</div>
  <div class="quiz-facts">
   <div><span>Área</span><b>${esc(p.area)}</b></div>
   <div><span>Objetivo</span><b>${esc(obj)}</b></div>
   <div><span>Ritmo</span><b>${esc(p.tempo)}/dia</b></div>
   <div><span>Nível</span><b>A medir no teste</b></div>
   <div><span>Bônus SPLA</span><b>0</b></div>
  </div>
  <div class="company"><div class="meta"><div class="co">Sua empresa</div><div class="sub">A logo entra depois, em Vista a camisa</div></div></div>
  <p class="quiz-badge-note">Cargo do jogo no Crachá fica em branco até o teste de nível. Não indica cargo na empresa.</p>
 </div>`;
}
function shell(id,cls,html){
 const s=document.createElement('section');
 s.className='screen'+(cls?' '+cls:'');
 s.id=id;
 s.innerHTML=html;
 return s;
}
const back='<button class="ib" type="button" data-quiz-back aria-label="Voltar"><svg class="i" aria-hidden="true"><use href="#i-back"/></svg></button>';
const phone=document.getElementById('phone');
const toast=document.getElementById('toast');
phone.insertBefore(shell('quiz','dark',`
 <div style="position:relative;padding:18px 18px 0;flex:none"><span class="logo on-dark" style="gap:.7em" role="img" aria-label="São Paulo Languages Academy"><svg class="mk" style="width:2.05em;height:2.05em;fill:#FBF8F1" aria-hidden="true"><use href="#mk8"/></svg><span class="wm" aria-hidden="true"><b>São Paulo</b><span>Languages Academy</span></span></span></div>
 <div class="scroll">
  <div class="say" style="margin-top:8px"><div class="char">${face}</div><div class="bub"><div class="who">Sophia</div>Oi! Eu sou a Sophia. Vamos cuidar da sua confiança para falar inglês no trabalho?<button type="button" class="qhear" data-voz="q-intro">Ouvir a Sophia</button></div></div>
  <h1 class="h1">Um plano da primeira semana, feito a partir do que te trava na hora de falar.</h1>
  <p class="lead">São 10 perguntas, uns 3 minutos. Depois você faz o teste de nível, que mede o ponto de partida de verdade. Sem promessa milagrosa: o resultado vem da prática constante.</p>
  <div class="note" style="margin-top:18px"><span>O método da SPLA se apoia em 48 pesquisadores e em mais de 80 métodos, com bibliografia de 300+ autores e 150+ publicações com DOI. A banca científica está em formação.</span></div>
 </div>
 <div class="foot">
  <button class="btn primary" type="button" id="quiz-start">Começar o quiz</button>
  <button class="btn text" type="button" data-quiz-login>Já tenho conta</button>
  ${DEMO?'<button class="btn text" type="button" id="quiz-skip-all">Pular o quiz</button>':''}
 </div>`),toast);
phone.insertBefore(shell('quiz-q','',`
 <div class="shead">${back}<div class="steps" id="quiz-steps" aria-hidden="true"></div></div>
 <div class="scroll" id="quiz-scroll"></div>
 <div class="foot"><button class="btn primary" type="button" id="quiz-next">Continuar</button>${DEMO?'<button class="btn text" type="button" id="quiz-skip-q">Pular o quiz</button>':''}</div>`),toast);
phone.insertBefore(shell('quiz-plano','',`
 <div class="shead">${back}<span class="ttl">Seu plano</span></div>
 <div class="scroll" id="quiz-plano-scroll"></div>
 <div class="foot"><button class="btn primary" type="button" id="quiz-signup">Criar conta e guardar este plano</button><button class="btn text" type="button" data-quiz-login>Já tenho conta</button></div>`),toast);
phone.insertBefore(shell('quiz-conta','',`
 <div class="shead">${back}<span class="ttl">Cadastro</span></div>
 <div class="scroll">
  <h1 class="h2">Seu lugar na trilha começa aqui.</h1>
  <p class="muted">A conta guarda este plano e começa o Crachá SPLA. Em seguida vem o teste rápido de nível, de cerca de 4 minutos. Sua voz vira texto na hora e não é gravada.</p>
  <div style="height:14px"></div>
  <label class="pa-name" style="display:block;font-weight:700;margin-bottom:12px">Como você quer ser chamado?<input id="quiz-nome" type="text" maxlength="40" autocomplete="given-name" placeholder="Seu nome" style="width:100%;min-height:48px;margin-top:6px;padding:10px 12px;border:1.5px solid var(--line2);border-radius:3px;font:inherit"></label>
  <label style="display:block;font-weight:700">E-mail<input id="quiz-email" type="email" autocomplete="email" placeholder="voce@email.com" style="width:100%;min-height:48px;margin-top:6px;padding:10px 12px;border:1.5px solid var(--line2);border-radius:3px;font:inherit"></label>
  <p id="quiz-err" class="tiny" style="color:var(--red);display:none;margin-top:8px">Preencha o nome e um e-mail válido para continuar.</p>
  <p class="tiny muted" style="margin-top:12px">Neste protótipo não há pagamento. O próximo passo é o teste de nível que já existe.</p>
 </div>
 <div class="foot"><button class="btn primary" type="button" id="quiz-create">Criar conta e ir ao teste de nível</button><button class="btn text" type="button" data-quiz-login>Já tenho conta</button></div>`),toast);
phone.insertBefore(shell('inspiracao','',`
 <div class="shead"><button class="ib" type="button" data-go="welcome" aria-label="Voltar"><svg class="i" aria-hidden="true"><use href="#i-back"/></svg></button><span class="ttl">Nossa inspiração</span></div>
 <div class="scroll">
  <h1 class="h2">O desenho da primeira tela</h1>
  <p>O padrão da apresentação é uma homenagem ao piso das calçadas de São Paulo, criado por Mirthes Bernardes em 1966. O traço foi redesenhado em vetor. Não é um logotipo oficial da cidade.</p>
  <p>Ele aparece só nessa primeira tela, para quem chega agora. Nas perguntas, no plano e nas aulas o fundo fica liso, para a leitura não competir com o desenho.</p>
  <p>Quem já pratica não volta para esta apresentação: o app abre no ponto da trilha em que a pessoa parou.</p>
 </div>
 <div class="foot"><button class="btn primary" type="button" data-go="welcome">Voltar ao início</button></div>`),toast);

if(document.getElementById('welcome')&&!document.querySelector('#welcome>.spla-piso')){
 const band=document.createElement('div');band.className='spla-piso';band.setAttribute('aria-hidden','true');
 document.getElementById('welcome').prepend(band);
}
document.querySelectorAll('p.credit').forEach(p=>{
 if(!/Mirthes Bernardes/.test(p.textContent))return;
 const b=document.createElement('button');b.type='button';b.className='btn text spla-inspo';b.dataset.go='inspiracao';b.textContent='Nossa inspiração';
 p.replaceWith(b);
});
['side','side2'].forEach(id=>{
 const side=document.getElementById(id);
 if(!side||side.querySelector('a[href="#quiz"]'))return;
 const onboard=[...side.querySelectorAll('a')].find(a=>a.getAttribute('href')==='#onboard');
 if(!onboard)return;
 const a=document.createElement('a');a.href='#quiz';a.textContent='2b. Quiz de boas-vindas';
 const b=document.createElement('a');b.href='#inspiracao';b.textContent='Nossa inspiração';
 onboard.after(b);onboard.after(a);
});
const comecar=document.querySelector('#welcome .foot [data-go="onboard"]');
if(comecar)comecar.dataset.go='quiz';

function renderQ(){
 const q=Q[qi];
 const steps=document.getElementById('quiz-steps');
 if(steps)steps.innerHTML=Q.map((_,i)=>`<i class="${i<qi?'done':i===qi?'cur':''}"></i>`).join('');
 const box=document.getElementById('quiz-scroll');
 const next=document.getElementById('quiz-next');
 if(!box||!next)return;
 const sel=selected(q.id);
 next.disabled=DEMO?false:!valid(qi);
 next.textContent=qi===Q.length-1?'Ver meu plano':'Continuar';
 let opts='';
 if(q.type==='scale')opts=`<div class="qconf" role="group" aria-label="De 1 a 5">${q.options.map(o=>`<button type="button" class="${sel[0]===o?'on':''}" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="row between tiny muted" style="margin-top:6px;font-weight:600"><span>${esc(q.left)}</span><span>${esc(q.right)}</span></div>`;
 else if(q.type==='tabs')opts=`<div class="qtabs">${q.options.map(o=>`<button type="button" class="${sel[0]===o?'on':''}" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
 else opts=`<div class="qchips">${q.options.map(o=>`<button type="button" class="qchip ${sel.includes(o)?'on':''}" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
 box.innerHTML=`<div class="say y"><div class="char">${face}</div><div class="bub"><div class="who">Sophia</div>${esc(q.sophia)}<button type="button" class="qhear" data-voz="${q.voz}">Ouvir a Sophia</button></div></div><h2 class="qtitle">${esc(q.title)}</h2>${q.hint?`<p class="qhint">${esc(q.hint)}</p>`:''}${opts}${q.id==='nivel'?'<div class="note"><span>Não perguntamos seu "estilo de aprendizagem" (visual/auditivo): a ciência não sustenta isso. Personalizamos pelo seu <b>nível medido</b> no teste, pelo objetivo, pelo tempo e pela confiança.</span></div>':''}`;
 box.querySelectorAll('[data-opt]').forEach(b=>b.addEventListener('click',()=>{
  const label=b.getAttribute('data-opt');
  if(q.type==='multi'){const cur=selected(q.id);answers[q.id]=cur.includes(label)?cur.filter(x=>x!==label):cur.concat(label)}
  else answers[q.id]=label;
  persist();renderQ();
 }));
}
function renderResult(){
 const p=plan();
 const mom=p.mom.length?p.mom.slice(0,2).join(' e ').toLowerCase():'quando couber';
 const who=nome||'Seu nome';
 const el=document.getElementById('quiz-plano-scroll');
 if(!el)return;
 el.innerHTML=`<div class="say y"><div class="char">${face}</div><div class="bub"><div class="who">Sophia</div>Pronto. Seu plano da primeira semana está feito. Ele é provisório até o teste de nível.<button type="button" class="qhear" data-voz="q-plano">Ouvir a Sophia</button></div></div>
  <h1 class="h2" style="margin-top:0">Seu plano personalizado</h1>
  ${badge(p,who)}
  <div class="card"><dl class="kv" style="display:grid;grid-template-columns:110px 1fr;gap:6px 10px;font-size:14.5px"><dt>Objetivo</dt><dd><b>${esc((p.obj.slice(0,2).join(' · ')||'Seu objetivo')+' · '+p.area)}</b></dd><dt>Ritmo</dt><dd><b>${esc(p.tempo)} por dia, de preferência ${esc(mom)}.</b></dd><dt>Ponto de partida</dt><dd><b>Provisório (${esc(p.nivel||'sua descrição')}). O nível medido vem no teste de ~4 min.</b></dd></dl></div>
  <div class="eyebrow" style="margin:14px 0 8px">Foco desta semana</div>
  <div class="card"><ul style="margin:0;padding-left:18px">${p.focos.map(f=>`<li style="margin:0 0 8px">${esc(f)}</li>`).join('')}</ul></div>
  <div class="eyebrow" style="margin:14px 0 8px">O que vem por aí</div>
  <div class="card"><p style="margin:0 0 8px"><b>Hoje:</b> 1ª sessão, “${esc(p.canDo)}”</p><p style="margin:0 0 8px"><b>Em 7 dias:</b> checagem de memória das expressões, um número real, sem porcentagem prometida.</p><p style="margin:0"><b>Em 30 dias:</b> sua transcrição de hoje ao lado da nova. Só texto, sem áudio.</p></div>
  <div class="eyebrow" style="margin:14px 0 8px">Por que este plano é assim</div>
  <div class="card"><p style="margin:0 0 8px">No seu caso, entram estes princípios, com literatura atrás. Não é endosso de instituição:</p><ul style="margin:0;padding-left:18px">${p.principios.map(x=>`<li style="margin:0 0 8px"><b>${esc(x[0])}</b> (${esc(x[1])}), ${esc(x[2])}</li>`).join('')}</ul><p style="margin:10px 0 0">Não prometemos fluência em um número de semanas. Mostramos o que você consegue fazer e o que ainda lembra depois de 7 e 30 dias. Se você cumprir o plano e não sentir evolução em 8 semanas, refazemos o plano com você, sem custo.</p></div>
  <div class="note"><span>O método da SPLA se apoia em 48 pesquisadores e em mais de 80 métodos, com bibliografia de 300+ autores e 150+ publicações com DOI. A banca científica está em formação.</span></div>`;
}
function stepOf(hash){
 const base=String(hash||'').split('~')[0];
 if(base==='d-warm')return 'aquec';
 if(base==='d-ouvir'||base==='ep')return 'ep';
 if(base==='d-trail'||base==='foco'||base==='cartoes'||base.indexOf('m-')===0)return 'trail';
 if(base==='sophia'||base==='d-call')return 'call';
 if(base==='d-close')return 'lili';
 return '';
}
function jaTenho(){
 let saved=null,study=null;
 try{saved=JSON.parse(localStorage.getItem('spla_resume')||'null')}catch(_){}
 try{study=JSON.parse(localStorage.getItem('rotinaState')||'null')}catch(_){}
 const key=saved&&stepOf(saved.hash);
 const days=study&&study.days||{},keys=Object.keys(days).sort(),last=keys.length?days[keys[keys.length-1]]:null;
 const done=key&&last&&last.steps&&last.steps[key]&&last.steps[key].done;
 if(typeof toast==='function')toast('Neste protótipo a conta fica neste navegador.');
 go(key&&!done?saved.hash:'home');
}
function skipAll(){sample();renderResult();speak('q-plano');go('quiz-plano')}
function paint(id){
 if(id==='quiz')speak('q-intro');
 if(id==='quiz-q'){renderQ();const q=Q[qi];if(q)speak(q.voz)}
 if(id==='quiz-plano'){renderResult();speak('q-plano')}
}
let nextAt=0;
document.addEventListener('click',e=>{
 const voz=e.target.closest('[data-voz]');if(voz){e.preventDefault();speak(voz.dataset.voz);return}
 if(e.target.closest('#quiz-start')){qi=0;persist();go('quiz-q');return}
 if(e.target.closest('#quiz-next')){const now=Date.now();if(now-nextAt<400)return;nextAt=now;if(!DEMO&&!valid(qi))return;if(qi<Q.length-1){qi++;persist();renderQ();speak(Q[qi].voz)}else{persist();renderResult();go('quiz-plano')}return}
 if(e.target.closest('[data-quiz-back]')){const id=location.hash.slice(1);if(id==='quiz-q'){if(qi===0)go('quiz');else{qi--;persist();renderQ();speak(Q[qi].voz)}}else if(id==='quiz-plano')go('quiz-q');else if(id==='quiz-conta')go('quiz-plano');return}
 if(e.target.closest('#quiz-skip-all,#quiz-skip-q')){skipAll();return}
 if(e.target.closest('#quiz-signup')){go('quiz-conta');return}
 if(e.target.closest('[data-quiz-login]')){jaTenho();return}
 if(e.target.closest('#quiz-create')){
  const n=document.getElementById('quiz-nome').value.trim();
  const em=document.getElementById('quiz-email').value.trim();
  const ok=n&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  document.getElementById('quiz-err').style.display=ok?'none':'block';
  if(!ok)return;
  nome=n;persist();
  const p=plan();
  let perfil={},cp={};
  try{perfil=JSON.parse(localStorage.getItem('perfil')||'{}')||{}}catch(_){}
  try{cp=JSON.parse(localStorage.getItem('cartaoPaulista')||'{}')||{}}catch(_){}
  const nextPerfil=Object.assign({},perfil,{nome:n,email:em,area:p.area,objetivo:p.obj,tempo:p.tempo,fromQuiz:true,criado:perfil.criado||new Date().toISOString().slice(0,10)});
  const nextCp=Object.assign({},cp,{name:n});
  try{localStorage.setItem('perfil',JSON.stringify(nextPerfil));localStorage.setItem('cartaoPaulista',JSON.stringify(nextCp))}catch(_){}
  reviewOn();go('placement');
 }
});
const prev=window.onShowMerge;
window.onShowMerge=function(id,arg){
 if(prev)prev(id,arg);
 if(id==='quiz'||id==='quiz-q'||id==='quiz-plano'||id==='quiz-conta'||id==='inspiracao')document.body.classList.add('pre');
 if(id==='plan'){try{const perfil=JSON.parse(localStorage.getItem('perfil')||'null');if(perfil&&perfil.fromQuiz){perfil.fromQuiz=false;localStorage.setItem('perfil',JSON.stringify(perfil))}}catch(_){}}
 paint(id);
};
load();
const open=location.hash.replace(/^#/,'');
if(open==='quiz'||open==='quiz-q'||open==='quiz-plano'||open==='quiz-conta'||open==='inspiracao'){
 if(window.show)window.show(open);
}
window.splaQuiz={skip:skipAll,sample};
})();
