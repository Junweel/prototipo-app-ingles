/* SPLA · Modo demo. Camada leve sobre uma cópia da v6: navegação livre, sem exercícios obrigatórios.
   A v6 continua intacta em /v6/. */
(function(){
'use strict';
const STEPS=[
 {id:'welcome',t:'Boas-vindas',d:'A primeira tela que o aluno vê.'},
 {id:'home',t:'Início',d:'O plano do dia: o que fazer agora, em uma tela.'},
 {id:'trilha',t:'Trilha',d:'O caminho do aluno, do zero ao C1, por etapas.'},
 {id:'d-trail',t:'Exercício exemplo',d:'Um exercício real. Dá para pular sem responder.',ex:true},
 {id:'ep~ep1',t:'Podcast do Erick',d:'Inglês do trabalho em áudio curto. Toque no play.'},
 {id:'demo-sophia',t:'Conversa com a Sophia',d:'Diga Hello e ouça a voz dela.'},
 {id:'cartao-paulista',t:'Crachá SPLA',d:'A identidade do aluno: nível, empresa e conquistas.'},
 {id:'bonus',go:'d-close',t:'Bônus SPLA',d:'A celebração ao fechar uma prática.'},
 {id:'progress',t:'Seu progresso',d:'O que o aluno já consegue fazer, medido.'},
 {id:'profile',t:'Perfil',d:'Dados, nível e ajustes do aluno.'}
];
const A=new URL('.',document.currentScript.src);
const $=(q,r=document)=>r.querySelector(q);
let cur=1;
const routeId=()=>location.hash.slice(1)||'';
function stepIndexFor(h){const base=h.split('~')[0];let i=STEPS.findIndex(s=>s.id===h||(s.go||s.id)===h);if(i<0)i=STEPS.findIndex(s=>(s.go||s.id).split('~')[0]===base);return i}

/* ---------- Tela demo da Sophia ---------- */
const NOVID=location.search.includes('novideo');
function vid(name){return `<video muted playsinline preload="auto" ${name==='idle'?'loop autoplay':'loop'} data-v="${name}" poster="../sophia-ao-vivo/anim/poster.webp"${name==='idle'?'':' style="opacity:0"'}><source src="../sophia-ao-vivo/anim/${name}.webm" type="video/webm"><source src="../sophia-ao-vivo/anim/${name}.mp4" type="video/mp4"></video>`}
const sec=document.createElement('section');
sec.className='screen dark';sec.id='demo-sophia';sec.setAttribute('aria-label','Conversa com a Sophia (demonstração)');
sec.innerHTML=`<div class="dsh"><button class="ib" data-go="home" aria-label="Voltar"><svg class="i" aria-hidden="true"><use href="#i-x"/></svg></button><div style="flex:1"><b>Conversa com a Sophia</b><div class="tiny">demonstração · fala pré-gravada com a voz dela</div></div></div>
<div class="dsbody"><div class="dsv" style="background-image:url('../sophia-ao-vivo/anim/poster.webp')">${NOVID?'':vid('idle')+vid('speak1')}<span class="dsst"><i></i><span class="dslab">Sophia · online</span></span></div>
<div class="dsmsgs" aria-live="polite"></div>
<div class="dsact"><button type="button" class="dshello">👋 Dizer “Hello”</button></div>
<p class="dsnote">No app completo a conversa é ao vivo, por voz. Aqui a resposta é gravada para a demonstração funcionar sem internet lenta nem chave de API.</p></div>`;
const host=document.getElementById('home').parentElement;host.insertBefore(sec,document.getElementById('toast')||null);
const reply=new Audio(new URL('audio/sophia-hello.mp3',A).href);reply.preload='auto';
const msgs=$('.dsmsgs',sec),act=$('.dsact',sec),box=$('.dsv',sec),lab=$('.dslab',sec);
function setTalking(on){box.classList.toggle('speaking',on);lab.textContent=on?'Sophia está falando…':'Sophia · online';
 const idle=$('video[data-v=idle]',sec),sp=$('video[data-v=speak1]',sec);if(!idle||!sp)return;
 if(on){sp.currentTime=0;sp.play().catch(()=>{});sp.style.opacity=1;idle.style.opacity=0}else{sp.style.opacity=0;idle.style.opacity=1;idle.play().catch(()=>{});setTimeout(()=>sp.pause(),300)}}
function sayReply(){try{window.SplaDialogueAudio&&window.SplaDialogueAudio.stop()}catch(_){}
 document.querySelectorAll('audio').forEach(a=>a.pause());reply.currentTime=0;setTalking(true);
 reply.play().catch(()=>setTalking(false));}
reply.onended=()=>setTalking(false);reply.onerror=()=>setTalking(false);
function resetSophia(){reply.pause();setTalking(false);msgs.innerHTML='';act.innerHTML='<button type="button" class="dshello">👋 Dizer “Hello”</button>'}
sec.addEventListener('click',e=>{
 if(e.target.closest('.dshello')){msgs.innerHTML='<div class="dsm me">Hello, Sophia!</div>';act.innerHTML='';
  setTimeout(()=>{msgs.insertAdjacentHTML('beforeend','<div class="dsm so">Hi there! I’m Sophia, nice to meet you!<small>Oi! Eu sou a Sophia, prazer em te conhecer!</small></div>');
   act.innerHTML='<button type="button" class="sec dsagain">🔊 Ouvir de novo</button><button type="button" class="sec dsreset">↺ Recomeçar</button>';sayReply()},450);}
 else if(e.target.closest('.dsagain'))sayReply();
 else if(e.target.closest('.dsreset'))resetSophia();
});

/* ---------- Barra e menu ---------- */
const bar=document.createElement('div');bar.id='spla-demo-bar';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Controles do modo demo');
bar.innerHTML='<button type="button" class="dm-prev" aria-label="Tela anterior">‹</button><button type="button" class="dm-menu" aria-haspopup="dialog" aria-label="Abrir menu do modo demo"><b>DEMO</b><span class="lbl"></span><span aria-hidden="true">▴</span></button><button type="button" class="dm-next"></button>';
document.body.appendChild(bar);
const sheet=document.createElement('div');sheet.id='spla-demo-sheet';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-label','Menu do modo demo');
sheet.innerHTML=`<div class="dm-bg"></div><div class="dm-panel"><div class="dm-grab"></div><h3>Modo demo · SPLA</h3><p class="dm-sub">Toque numa tela para ir direto. Nada é obrigatório: dá para pular qualquer exercício.</p><ol>${STEPS.map((s,i)=>`<li><button type="button" data-i="${i}"><span class="dm-n">${i+1}</span><span><span class="dm-t">${s.t}</span><span class="dm-d">${s.d}</span></span></button></li>`).join('')}</ol><div class="dm-foot"><span>Teclado: ← → navegam · M abre o menu</span><button type="button" class="dm-close">Fechar</button></div></div>`;
document.body.appendChild(sheet);
function openSheet(){sheet.classList.add('on');sheet.querySelectorAll('li button').forEach(b=>b.classList.toggle('on',+b.dataset.i===cur));(sheet.querySelector('li button.on')||sheet.querySelector('li button')).focus({preventScroll:true})}
function closeSheet(){sheet.classList.remove('on')}
sheet.addEventListener('click',e=>{const b=e.target.closest('li button');if(b){closeSheet();goStep(+b.dataset.i);return}if(e.target.closest('.dm-close,.dm-bg'))closeSheet()});
function goStep(i){i=Math.max(0,Math.min(STEPS.length-1,i));cur=i;const s=STEPS[i],target=s.go||s.id;
 try{window.SplaBonus&&window.SplaBonus.close&&window.SplaBonus.close()}catch(_){}
 if(routeId()===target){try{window.show(target)}catch(_){}after(s)}else{location.hash=target;setTimeout(()=>after(s),60)}
 paint()}
function after(s){if(s.id==='bonus')setTimeout(()=>{try{window.SplaBonus.celebrate('M')}catch(err){console.warn('Bônus SPLA indisponível',err)}},500);
 if(s.id==='demo-sophia')resetSophia();
 if(s.ex)setTimeout(addReveal,120)}
function paint(){const s=STEPS[cur];$('.lbl',bar).textContent=`${cur+1}/${STEPS.length} ${s.t}`;
 const nx=$('.dm-next',bar),last=cur>=STEPS.length-1;nx.innerHTML=last?'Menu ☰':(s.ex?'Pular<span class="dm-long"> exercício</span> ›':'Próxima<span class="dm-long"> tela</span> ›');nx.setAttribute('aria-label',last?'Abrir menu':(s.ex?'Pular exercício e ir para a próxima tela':'Próxima tela'));
 $('.dm-prev',bar).disabled=cur===0;
 const id=routeId().split('~')[0]||'welcome';document.body.classList.toggle('spla-demo-trail',id==='d-trail');
 const scr=document.getElementById(id);document.body.classList.toggle('spla-demo-nonav',!!scr&&['demo-sophia','sophia'].includes(id))}
$('.dm-prev',bar).onclick=()=>goStep(cur-1);
$('.dm-next',bar).onclick=()=>cur>=STEPS.length-1?openSheet():goStep(cur+1);
$('.dm-menu',bar).onclick=openSheet;
document.addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]'))return;
 if(e.key==='Escape'&&sheet.classList.contains('on')){closeSheet();return}
 if(sheet.classList.contains('on'))return;
 if(e.key==='ArrowRight'){e.preventDefault();$('.dm-next',bar).click()}else if(e.key==='ArrowLeft'){e.preventDefault();goStep(cur-1)}else if(e.key==='m'||e.key==='M'){openSheet()}});

/* Exercício: mostrar resposta sem fazer */
function addReveal(){const tb=document.getElementById('tbox');if(!tb||tb.querySelector('.dm-reveal'))return;
 const b=document.createElement('button');b.type='button';b.className='dm-reveal';b.textContent='👁 Ver resposta (demo)';
 b.onclick=()=>{try{const e=EX[ei];if(['choose','fill','listen'].includes(e.type)){const o=tb.querySelector(`.opt[data-i="${e.ans}"]`);o&&o.click();const t=document.getElementById('tbtn');setTimeout(()=>{t&&!t.disabled&&t.click()},80)}else{const t=document.getElementById('tbtn');t&&!t.disabled&&t.click()}}catch(err){console.warn(err)}b.remove()};
 const fb=document.getElementById('tfb');fb?fb.before(b):tb.appendChild(b)}

/* Sincroniza com a navegação normal do app */
window.addEventListener('hashchange',()=>{const i=stepIndexFor(routeId());if(i>=0&&STEPS[i].id!=='bonus')cur=i;else if(routeId()==='d-close'&&STEPS[cur].id==='bonus'){}paint();if(routeId()==='d-trail')setTimeout(addReveal,120)});
const h=routeId();
if(!h){location.replace('#home');}
else if(h==='demo-sophia'){try{window.show('demo-sophia')}catch(_){}}
const i0=stepIndexFor(routeId()||'home');cur=i0>=0?i0:1;paint();
if(routeId()==='d-trail')setTimeout(addReveal,300);
if(!h&&!sessionStorage.getItem('spla_demo_menu_seen')){sessionStorage.setItem('spla_demo_menu_seen','1');setTimeout(openSheet,400)}
})();
