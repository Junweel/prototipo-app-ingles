/* ===== Versão de teste (camada aditiva): perfil próprio, números reais e "Recomeçar do zero" ===== */
(function(){
const TV=window.TESTE_V||'teste';
const M=window.mergeTest||{};
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PK='perfil';
const getP=()=>{try{return JSON.parse(localStorage.getItem(PK)||'null')}catch(_){return null}};
const setP=p=>localStorage.setItem(PK,JSON.stringify(p));
let P=getP();
window.TESTE_START=(P&&P.criado)||null;
const nome=()=>(P&&P.nome)||'';
const first=()=>(nome().split(/\s+/)[0]||'você');
const ini=()=>(nome().trim()[0]||'?').toUpperCase();
const dk=M.dk||(d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')});
const ST=()=>M.ST||{days:{}};
const STEPS=['aquec','ep','trail','call','lili'];
const done=(D,k)=>!!(D&&D.steps&&D.steps[k]&&D.steps[k].done);
const studied=D=>!!D&&(STEPS.some(k=>done(D,k))||Object.values(D.steps||{}).some(s=>s&&s.done)||(D.extra||[]).length>0||(D.xcalls||[]).length>0);
const full=D=>!!D&&STEPS.every(k=>done(D,k));
const days=()=>Object.entries(ST().days||{});
const capDay=k=>{const D=ST().days[k];return D&&M.capitalOf?M.capitalOf(D,k).total:0};
const capTotal=()=>days().reduce((t,[k])=>t+capDay(k),0);
const capToday=()=>capDay(dk());
const capWeek=()=>M.capitalWeek?M.capitalWeek():0;
const streak=()=>{try{return M.streakInfo().streak}catch(_){return 0}};
const cards=()=>{try{return (M.cardsGet&&M.cardsGet())||[]}catch(_){return[]}};
const dueN=()=>{const n=Date.now();return cards().filter(c=>(c.step||0)<3&&(c.next||0)<=n).length};
const monday=()=>{const m=new Date();m.setHours(0,0,0,0);m.setDate(m.getDate()-((m.getDay()+6)%7));return m};
const weekKeys=()=>{const m=monday();return [0,1,2,3,4,5,6].map(i=>{const x=new Date(m);x.setDate(m.getDate()+i);return dk(x)})};
const etapasSemana=()=>weekKeys().reduce((t,k)=>t+STEPS.filter(s=>done(ST().days[k],s)).length,0);
const fullDays=()=>days().filter(([k,D])=>full(D)).map(([k])=>k).sort();
const nCando=()=>fullDays().length?1:0;
const diasEstudo=()=>days().filter(([k,D])=>studied(D)).length;
const pl=(n,a,b)=>n+' '+(n===1?a:b);
const fmtD=k=>k.slice(8,10)+'/'+k.slice(5,7);
const set=(sel,v,html)=>document.querySelectorAll('[data-t="'+sel+'"]').forEach(e=>{if(html)e.innerHTML=v;else e.textContent=v});

/* ---- nome e inicial em todo o app (textos estáticos e gerados) ---- */
function fixText(root){if(!nome())return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while((n=w.nextNode()))if(n.nodeValue.indexOf('Joël')>=0)n.nodeValue=n.nodeValue.replace(/Joël/g,first());
 if(root.querySelectorAll)root.querySelectorAll('.t-ini').forEach(e=>{if(e.textContent!==ini())e.textContent=ini()});
 if(root.classList&&root.classList.contains('t-ini')&&root.textContent!==ini())root.textContent=ini()}
new MutationObserver(ms=>{if(!nome())return;for(const m of ms){if(m.type==='characterData'){if(m.target.nodeValue.indexOf('Joël')>=0)m.target.nodeValue=m.target.nodeValue.replace(/Joël/g,first())}
 else m.addedNodes.forEach(x=>{if(x.nodeType===3){if(x.nodeValue.indexOf('Joël')>=0)x.nodeValue=x.nodeValue.replace(/Joël/g,first())}else if(x.nodeType===1)fixText(x)})}})
 .observe(document.body,{subtree:true,childList:true,characterData:true});

/* ---- onboarding: nome + escolhas próprias ---- */
const ob=$('onboard');
const grp=()=>{const w=ob.querySelectorAll('.row.wrap');return{obj:w[0],area:w[1],tempo:ob.querySelector('.tabs2'),conf:ob.querySelector('.conf')}};
ob.addEventListener('click',e=>{const c=e.target.closest('.chip');const g=grp();
 if(c&&g.area&&g.area.contains(c)){e.stopPropagation();const on=!c.classList.contains('on');g.area.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));if(on)c.classList.add('on')}},true);
ob.querySelector('.foot [data-go]').addEventListener('click',e=>{const inp=$('tNome'),v=(inp.value||'').trim().replace(/\s+/g,' ');
 if(!v){e.preventDefault();e.stopPropagation();inp.focus();inp.classList.add('t-err');tToast('Digite seu nome para continuar.');return}
 const g=grp(),txt=el=>el?[...el.querySelectorAll('.on')].map(b=>b.textContent.trim()):[];
 const old=getP();
 P={nome:v.slice(0,40),obj:txt(g.obj),area:txt(g.area)[0]||'',tempo:txt(g.tempo)[0]||'',conf:+(txt(g.conf)[0]||0)||null,criado:(old&&old.criado)||dk(),v:TV};
 setP(P);window.TESTE_START=P.criado;fixText(document.body)},true);
$('tNome')&&$('tNome').addEventListener('input',e=>e.target.classList.remove('t-err'));
function fillOnboard(){const p=getP();if(!p)return;$('tNome').value=p.nome||'';const g=grp();
 const mark=(el,vals,single)=>{if(!el)return;el.querySelectorAll('button').forEach(b=>b.classList.toggle('on',vals.includes(b.textContent.trim())))};
 mark(g.obj,p.obj||[]);mark(g.area,[p.area]);mark(g.tempo,[p.tempo]);mark(g.conf,[String(p.conf||'')])}
function tToast(m){const t=$('toast');if(!t)return alert(m);t.textContent=m;t.style.display='block';clearTimeout(tToast._t);tToast._t=setTimeout(()=>t.style.display='none',2800)}

/* ---- welcome: "Já tenho conta" ---- */
const wb=[...document.querySelectorAll('#welcome .foot button')].find(b=>/Já tenho conta/.test(b.textContent));
if(wb)wb.addEventListener('click',()=>{if(getP())location.hash='home';else tToast('Nesta versão de teste não há conta: toque em “Começar”.')});

/* ---- textos por tela ---- */
const objTxt=()=>{const p=P||{};const o=(p.obj||[]).join(' + ')||'Inglês para o trabalho';return o+(p.area?' · '+p.area:'')};
const tempoTxt=()=>(P&&P.tempo)?P.tempo+' por dia':'a combinar';
function common(){set('nome',nome()||'você');set('nome1',first());document.querySelectorAll('.t-ini').forEach(e=>e.textContent=ini())}
function home(){const h=new Date().getHours();set('saud',(h<12?'Bom dia':h<18?'Boa tarde':'Boa noite')+',');
 const wk=document.querySelector('[data-t="weekdots"]');if(wk){const L=['S','T','Q','Q','S'],ks=weekKeys().slice(0,5),tk=dk();let n=0;
  wk.innerHTML=ks.map((k,i)=>{const s=studied(ST().days[k]);if(s)n++;return `<span class="${[s?'d':'',k===tk?'t':''].join(' ').trim()}"><i></i>${L[i]}</span>`}).join('');
  wk.setAttribute('aria-label','Esta semana: '+n+' de 5 dias com prática')}
 const s=streak(),c=capToday(),d=dueN(),nc=cards().length;
 set('fogo','🔥 '+pl(s,'dia','dias')+' · +'+c+' Capital hoje');
 set('rev','Erick · '+(nc?pl(d,'revisão','revisões'):'3 frases iniciais'));
 set('lilistreak',s?pl(s,'dia','dias')+' com prática.':(diasEstudo()?'Recomeçando hoje.':'Primeiro dia: bem-vinda(o)!'));
 set('duetxt',nc?(d?pl(d,'card vence','cards vencem')+' hoje':'Nenhum card vence hoje'):'3 frases iniciais no aquecimento');
 set('etsem',String(etapasSemana()));set('ncando',String(nCando()));set('ncards',String(nc));
 const w=capWeek();set('capwk',w+' Capital');set('capwk2','esta semana · hoje +'+c);
 const hm=document.querySelector('#home .homematch');if(hm)hm.setAttribute('aria-label','Liga da semana (exemplo fictício). Sua contribuição: '+w+' Capital');
 const fd=fullDays();set('n3s',fd.length?'Concluída em '+fmtD(fd[fd.length-1])+' · dá para repetir':'Hoje · sessão guiada em 4 etapas')}
function profile(){const p=P||{};set('perfsub',[p.area||'área não informada',p.tempo?p.tempo+' por dia':'',p.conf?'confiança '+p.conf+'/5':''].filter(Boolean).join(' · '));
 set('captot',String(capTotal()));set('capline','Esta semana: '+capWeek()+' · hoje: +'+capToday());set('ncando2',nCando()+' ›')}
function practice(){const L=cards(),n=Date.now(),d=dueN(),rv=L.filter(c=>(c.step||0)<3).length,dom=L.filter(c=>(c.step||0)>=3).length;
 set('cardsline',L.length?`${d} vencidos · ${rv} em revisão · ${dom} dominados`:'nenhum card ainda · eles nascem dos seus erros na conversa');set('cardscnt',String(d));
 const last=L[L.length-1];set('chunks',last?'"'+last.target+'" · salvo nos seus cards':'nada salvo ainda')}
function leagues(){const w=capWeek(),c=capToday(),fd=fullDays().filter(k=>weekKeys().includes(k)).length;
 set('capwkn',String(w));set('contribtxt',`${pl(fd,'sessão completa','sessões completas')} nesta semana · ${pl(etapasSemana(),'etapa','etapas')} feitas. A média da equipe sobe com cada sessão sua.`);
 set('teto','Teto diário: 200 Capital · hoje: '+c+' de 200');const b=document.querySelector('[data-t="tetobar"]');if(b)b.style.width=Math.min(100,Math.round(c/2))+'%'}
function closing(){const s=streak();set('streakd',pl(s,'dia','dias'));set('dclosecap','+'+capToday()+' Capital para a SAP')}
function plan(){set('obj',objTxt());set('ritmo',tempoTxt())}
function cycle(){set('fogo2','🔥 '+pl(streak(),'dia','dias'))}
function progress(){const sc=document.querySelector('#progress .scroll');if(!sc)return;
 if(!sc.querySelector('.t-exdet')){const head=sc.firstElementChild;const det=document.createElement('details');det.className='t-exdet';
  det.innerHTML='<summary>Ver como esta tela fica com semanas de uso <span class="tag o">exemplo fictício</span></summary>';
  [...sc.children].filter(x=>x!==head).forEach(x=>det.appendChild(x));sc.appendChild(det);
  const tg=head.querySelector('.tag');if(tg)tg.textContent='seus dados (real)';
  const box=document.createElement('div');box.id='tProg';head.after(box)}
 const L=cards(),fd=fullDays(),s=streak();
 $('tProg').innerHTML=`<div class="card t-real"><div class="row between"><b>Seu progresso neste teste</b><span class="tag y">real · só neste navegador</span></div>
  <div class="stat3" style="margin-top:10px"><div><b>${diasEstudo()}</b>${diasEstudo()===1?'dia':'dias'} com prática</div><div><b>${s}</b>de ofensiva</div><div><b>${capTotal()}</b>Capital no total</div></div>
  <div class="stat3"><div><b>${fd.length}</b>sessões completas</div><div><b>${etapasSemana()}</b>etapas nesta semana</div><div><b>${L.length}</b>cards salvos</div></div>
  <div class="small muted" style="margin-top:8px">${fd.length?'Can-do “dar um status update curto numa reunião semanal”: concluído em '+fmtD(fd[0])+'.':'Nenhuma sessão completa ainda. Comece em Hoje › Começar sessão de hoje.'} Os números abaixo do botão são um exemplo fictício de como esta tela evolui com o tempo.</div></div>`}
function render(id){P=getP();common();
 if(id==='home')home();else if(id==='profile')profile();else if(id==='practice')practice();else if(id==='leagues')leagues();
 else if(id==='d-close'||id==='summary')closing();else if(id==='plan')plan();else if(id==='m-cycle')cycle();else if(id==='progress')progress();
 else if(id==='onboard')fillOnboard();
 fixText(document.body)}
const prev=window.onShowMerge;
window.onShowMerge=function(id,arg){if(prev)try{prev(id,arg)}catch(e){console.error(e)}try{render(id)}catch(e){console.error(e)}};

/* ---- Perfil: versão + Recomeçar do zero ---- */
const prof=document.querySelector('#profile .scroll');
if(prof){const c=document.createElement('div');c.className='card t-reset';c.innerHTML=`<div class="row between"><b>Versão de teste</b><span class="tag">${esc(TV)}</span></div>
 <div class="small muted" style="margin:6px 0 12px">Seus dados (nome, sessões, cards, Capital, ofensiva) ficam só neste navegador, separados do protótipo principal.</div>
 <button class="btn" id="tReset" type="button">Recomeçar do zero</button>`;prof.appendChild(c)}
document.addEventListener('click',e=>{if(!e.target.closest('#tReset'))return;
 if(!confirm('Recomeçar do zero?\n\nIsso apaga tudo desta versão de teste neste navegador: nome, respostas do início, sessões, cards, Capital, ofensiva e conversas.\nAs configurações/chaves da Sophia desta versão de teste são mantidas.\nO protótipo principal não é afetado.'))return;
 window.testeReset(true);location.hash='welcome';location.reload()});

/* ---- etiqueta discreta ---- */
const tag=document.createElement('div');tag.className='t-vtag';tag.textContent='Versão de teste · '+TV;document.body.appendChild(tag);
document.title=document.title.replace(/·.*$/,'')+'· Versão de teste';

/* ---- abertura: sem perfil começa no welcome; com perfil vai para Hoje ---- */
const h0=location.hash.slice(1);
if(!getP()&&h0&&!['welcome','onboard','placement','turma','plan','about'].includes(h0.split('~')[0]))location.hash='welcome';
else if(getP()&&(!h0||h0==='welcome'))location.hash='home';
render((document.querySelector('.screen.on')||{}).id||'welcome');
window.testeOverlay={render,getP,TV};
})();
