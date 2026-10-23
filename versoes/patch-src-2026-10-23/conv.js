/* ============ MODO CONVERSA (novo, padrão) ============
   Sem interrupções: a Sophia faz "recast" dentro de uma resposta calorosa; todo erro fica registrado (chamada de correção com json_schema,
   e na falha dela os metadados da resposta / o roteiro demo). No fim ("Terminar" ou despedida): 2–3 frases mais importantes,
   "Repita comigo" (A) + "de memória" (B), aba de revisão e cartões de revisão espaçada (dia 1, 3, 7) que voltam no prompt da próxima sessão. */
const isConv=()=>CFG.ui!=='treino';
const CV={turns:[],pend:[],ending:false,elicit:[],sessionAt:0,ended:false};
function convTurn(d,who,text){const t={who,text,heard:null,at:Date.now(),practice:!!S.prac};d._turn=t;if(CV.sessionAt)CV.turns.push(t);capAdd(t);return t}
function diffOps(a,b){const A=a.map(norm),B=b.map(norm),n=A.length,m=B.length,L=Array.from({length:n+1},()=>new Array(m+1).fill(0));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const ops=[];let i=0,j=0;
 while(i<n&&j<m){if(A[i]===B[j]){ops.push(['=',a[i]]);i++;j++}else if(L[i+1][j]>=L[i][j+1]){ops.push([A[i]?'-':'=',a[i]]);i++}else{if(B[j])ops.push(['+',b[j]]);j++}}
 while(i<n){ops.push([A[i]?'-':'=',a[i]]);i++}while(j<m){if(B[j])ops.push(['+',b[j]]);j++}return ops}
function diffHTML(a0,b0){ // vermelho = palavra errada/sobrando; verde logo depois = forma certa / palavra que faltou
 const ops=diffOps(String(a0).split(/\s+/).filter(Boolean),String(b0).split(/\s+/).filter(Boolean)),out=[];let del=[],ins=[];
 const flush=()=>{if(del.length||ins.length)out.push((del.length?`<del>${esc(del.join(' '))}</del>`:'')+(ins.length?`<ins>${esc(ins.join(' '))}</ins>`:''));del=[];ins=[]};
 for(const[o,w]of ops){if(o==='=' ){flush();out.push(esc(w))}else if(o==='-')del.push(w);else ins.push(w)}
 flush();return out.join(' ')}
function capAdd(t){const box=$('caps');if(!box)return;const live=box.querySelector('.live');if(live&&t.who==='me')live.remove();
 const d=document.createElement('div');d.className='cap '+(t.who==='me'?'cme':'cso');t.cap=d;capRender(t);box.appendChild(d);
 const all=box.querySelectorAll('.cap:not(.live)');for(let k=0;k<all.length-6;k++)all[k].remove()}
function capRender(t){if(!t||!t.cap)return;const base=t.heard||t.text||'';
 const h=t.who==='me'&&t.isError&&t.corrected?diffHTML(base,t.corrected):esc(base);
 t.cap.innerHTML=h+(t.sys&&t.pt?`<span class="cpt">${esc(t.pt)}</span>`:'')}
function convLive(){ // o que o aluno está dizendo agora (parcial do STT), na mesma pilha de legendas
 const box=$('caps');if(!box||!isConv())return;const f=$('capFinal').textContent.trim(),it=$('capInt').textContent.trim();let l=box.querySelector('.live');
 if(!f&&!it){if(l)l.remove();return}
 if(!l){l=document.createElement('div');l.className='cap cme live';box.appendChild(l)} else if(l!==box.lastElementChild)box.appendChild(l);
 l.innerHTML=esc(f)+(it?' <span class="int">'+esc(it)+'</span>':'')}
function convOnCorr(el,r,heard,corr){const t=el&&el._turn;if(!t||t.who!=='me')return;
 t.heard=heard||t.text;t.checked=true;
 if(corr)Object.assign(t,{isError:true,corrected:corr,why:r.why||(r.isError?r.tip:null)||t.why||null,important:!!(r.important||t.important),meaning:!!(r.meaning||t.meaning),cat:r.cat||t.cat||null,pt:r.pt||t.pt||null});
 else if(r.isError===false&&!t.isError){t.isError=false}
 capRender(t);if($('review')&&!$('review').hidden)reviewRender()}
const GOODBYE=/\b(good ?bye|bye( bye)?|see you( later| soon| tomorrow| next time)?|gotta go|i (have|need) to go|talk (to you )?(later|soon)|that'?s (all|it) for today|have a (good|nice) (day|night|one)|tchau)\b/i;
const isGoodbye=t=>GOODBYE.test(t||'');
/* ---- prompt do modo Conversa ---- */
const SYS_CONV=`You're Sophia, a warm, curious English conversation partner for a Brazilian adult (level {LVL}). This is a relaxed, real conversation, not a lesson.
Every turn: react warmly to WHAT they said, add something of your own (a small opinion, detail or experience), then ask ONE simple follow-up question. 2-3 short sentences, max 40 words. Contractions, natural tone. No lists, no lectures.
Mistakes: NEVER point them out, never say "wrong", never explain grammar, and NEVER ask them to repeat or say it again. Instead recast: naturally reuse the correct form of what they meant inside your reply, then keep the conversation moving with new content.
Example. Student: "I go on park in the weekend". You: "Oh, I went to the park this weekend too! It's nice after a long week. What did you do there?"
Their text is en-US speech recognition of a Brazilian accent: guess the intended meaning from context. Only if you genuinely can't understand what they mean, ask one short, friendly clarification question ("Sorry, did you mean ...?").{ELICIT}
SOUND HUMAN (spoken, adapted from the MIT "humanizer" skill by Siqi Chen, github.com/blader/humanizer):
- Talk like a friend on a call, not a chatbot. Contractions always. Mix very short and normal sentences.
- Never open with praise or a wrapper: no "Great question!", "Certainly!", "Absolutely!", "I'd love to help", "Let's dive in", "Here's the thing", "Honestly?". Start with your reaction to what they said.
- Vary reactions; don't repeat the same one twice in a call ("Oh nice", "Really?", "Ha, same", "Hmm", "Wait, seriously?"). Praise only something specific they said or did.
- No dashes, no lists, no lines of three ("fun, relaxing, and rewarding"), no "It's not just X, it's Y", no wise closing lines ("That's what really matters").
- No fancy words: avoid delve, crucial, vibrant, journey, enhance, showcase, incredible, amazing. Use the plain everyday word.
- Fillers sparingly: at most one "oh", "hmm", "well" or "yeah" per turn; never "um", "uh" or "like" as filler (they confuse learners and the voice engine).
- Don't offer things ("Want me to...?", "Would you like...?", "Let me know"). Just ask your ONE real question about their life.
- Keep everything learner-friendly: these rules never override level {LVL} vocabulary, short turns, recasting, and the ONE-question rule. Prefer a common word over a natural-but-rare idiom. Never promise results ("you'll be fluent in no time").
FORMAT (always, every turn): your spoken reply as plain text, then a line ###, then one line of JSON:
{"heard":"what they most likely said, fixing only recognition errors","isError":true/false,"corrected":"minimal correction of their sentence or null","emph":"the phrase you recast or null","tip":null,"repeat":null,"pt":"short Portuguese translation of your reply"}`;
function elicitText(){if(!CV.elicit.length)return '';
 return '\nFrom earlier sessions, the student practiced these sentences. When it fits naturally, ask questions that invite them to use these structures again (never quote them, never say it is a review):\n'+CV.elicit.map(c=>`- "${c.target}"${c.why?` (${c.why})`:''}`).join('\n')}
/* ---- cartões de revisão espaçada (localStorage) ---- */
const DAY=864e5,SR_DAYS=[1,3,7];
const cardsGet=()=>{try{return JSON.parse(localStorage.getItem('sophiaCards')||'[]')}catch(_){return[]}};
const cardsSet=L=>localStorage.setItem('sophiaCards',JSON.stringify(L.slice(-60)));
function cardsDue(){const now=Date.now();return cardsGet().filter(c=>c.step<SR_DAYS.length&&c.next<=now).sort((a,b)=>a.next-b.next).slice(0,4)}
function cardsSave(items){const L=cardsGet(),now=Date.now();
 for(const it of items){const k=norm(it.target);const old=L.find(c=>norm(c.target)===k);
  if(old){old.step=0;old.created=now;old.due=SR_DAYS.map(d=>now+d*DAY);old.next=old.due[0];old.okNow=!!it.ok;continue}
  L.push({id:now+'-'+Math.random().toString(36).slice(2,6),target:it.target,said:it.said,why:it.why||null,pt:it.pt||null,cat:it.cat||null,created:now,step:0,due:SR_DAYS.map(d=>now+d*DAY),next:now+DAY,okNow:!!it.ok})}
 cardsSet(L)}
function cardsAdvance(){ // cartões que entraram no prompt desta sessão: sem erro da mesma estrutura → próximo intervalo; com erro → amanhã de novo
 if(!CV.elicit.length)return;const L=cardsGet(),now=Date.now(),errs=CV.turns.filter(t=>t.isError&&!t.practice);
 for(const e of CV.elicit){const c=L.find(x=>x.id===e.id);if(!c)continue;
  const again=errs.some(t=>(c.cat&&t.cat&&t.cat.toLowerCase()===c.cat.toLowerCase())||lev(norm(t.corrected||''),norm(c.target))<6);
  if(again){c.next=now+DAY}else{c.step++;c.next=c.step<SR_DAYS.length?c.created+SR_DAYS[c.step]*DAY:Infinity}}
 cardsSet(L);CV.elicit=[]}
/* ---- escolha das frases para treinar no fim: recorrentes e que atrapalham o sentido primeiro ---- */
function errKey(t){if(t.cat)return t.cat.toLowerCase().trim();
 const a=(t.heard||t.text).split(/\s+/),b=(t.corrected||'').split(/\s+/),{ka,kb}=wordDiff(a,b);
 return (a.filter((w,i)=>!ka[i]).map(norm).join(' ')+'>'+b.filter((w,i)=>!kb[i]).map(norm).join(' '))||norm(t.corrected)}
function pickPractice(){const errs=CV.turns.filter(t=>t.who==='me'&&!t.practice&&t.isError&&t.corrected);
 const cnt={};errs.forEach(t=>{const k=errKey(t);cnt[k]=(cnt[k]||0)+1});const best={};
 errs.forEach((t,i)=>{const k=errKey(t),n=t.corrected.split(/\s+/).length;
  const sc=(cnt[k]-1)*3+(t.meaning?3:0)+(t.important?2:0)+(n>14?-3:0)+i*.01;
  if(!best[k]||sc>best[k].sc)best[k]={t,sc,n:cnt[k],k}});
 return Object.values(best).sort((a,b)=>b.sc-a.sc).slice(0,3).map(b=>({target:b.t.corrected.replace(/[.!?]+$/,''),said:b.t.heard||b.t.text,why:b.t.why,pt:b.t.pt,cat:b.t.cat||b.k,n:b.n,attempts:[],ok:false}))}
/* ---- fala da Sophia com legenda (e apoio em português quando é instrução) ---- */
async function sayLine(text,pt,opts={}){if(!S.running&&!opts.force)return 'stopped';
 if(!opts.nocap){const d=addMsg('so',text,null,pt);if(d._turn){d._turn.sys=!!pt;capRender(d._turn)}}
 if(CV.abort)return 'stopped';const o=await speak(text,opts);return CV.abort?'stopped':o}
function prShow(lbl,txt,hint,hidden){const p=$('practice');p.hidden=false;$('prLbl').textContent=lbl;const t=$('prTxt');
 t.classList.toggle('hid',!!hidden);t.innerHTML=hidden?'• • •':txt.split(/\s+/).map(w=>`<span>${esc(w)}</span>`).join(' ');$('prHint').innerHTML=hint||'';
 t.style.animation='none';void t.offsetWidth;t.style.animation=''}
function prHide(){$('practice').hidden=true}
async function endConversation(fromGoodbye){
 if(CV.ending||!S.running)return;CV.ending=true;CV.abort=false;talkUI();
 if(S.state==='SPEAKING'){speakToken++;try{speechSynthesis.cancel()}catch(_){} if(S.cancelAz)S.cancelAz();S.visQ=[]}
 S.ptt=false;S.pttFlush=0;setState('THINKING');
 await Promise.race([Promise.all(CV.pend.map(p=>p&&p.catch?p.catch(()=>null):p)),new Promise(z=>setTimeout(z,6000))]); // nenhuma correção fica para trás
 const picks=pickPractice();CV.picks=picks;
 if(!picks.length){
  await sayLine(fromGoodbye?"Bye! That was such a nice chat. And no sentences to fix today, great job!":"That was such a nice chat! No sentences to fix today, great job!",'Foi uma ótima conversa! Nada para ajustar hoje. Mandou bem!');
  return finishConversation()}
 const n=picks.length;
 const o=await sayLine(`${fromGoodbye?'Before you go! ':''}That was a great chat! We had ${n===1?'one sentence':n===2?'a couple of sentences':'a few sentences'} to polish. Let's practice ${n===1?'it':'them'} together, okay?`,
  'Olha só, tivemos '+(n===1?'uma frase':'algumas frases')+' para ajustar. Vamos treinar juntas, rapidinho?');
 if(o==='stopped')return;
 S.prac={list:picks,i:0,step:'A',tries:0};pracStep()}
async function pracStep(){const P=S.prac;if(!P||CV.abort)return;const it=P.list[P.i];
 if(P.step==='A'){
  prShow(`Repita comigo · ${P.i+1}/${P.list.length}`,it.target,it.why?esc(it.why):'');
  const o=await sayLine(P.i===0?'First one. Repeat after me:':'Next one. Repeat after me:','Repita comigo, lendo em voz alta:');if(o==='stopped'||o==='barged')return;
  setState('SPEAKING');const o2=await speak(it.target,{});if(o2==='barged'||CV.abort)return;
  setState('ATTENDING');$('prHint').innerHTML=(it.why?esc(it.why)+'<br>':'')+'<b>Agora você:</b> '+(isPTT()?'segure o botão e leia em voz alta':'leia em voz alta');
 } else {
  prShow(`De memória · ${P.i+1}/${P.list.length}`,'',it.pt?'Como se diz: “'+esc(it.pt)+'”':'Diga a frase que você acabou de treinar',true);
  const o=await sayLine(P.tries?'Almost! Try once more.':'Now, without looking: say it from memory.',P.tries?'Quase! Mais uma vez.':'Agora sem olhar: diga de memória.');if(o==='stopped'||o==='barged')return;
  setState('ATTENDING')}}
async function handlePractice(txt,el){const P=S.prac,it=P.list[P.i];const sc=repScore(txt,it.target);
 it.attempts.push({step:P.step,said:txt,score:Math.round(sc*100)/100});
 const t=el&&el._turn;if(t){t.practice=true;t.heard=txt;if(sc<.85){t.isError=true;t.corrected=it.target}capRender(t)}
 setState('THINKING');
 if(P.step==='A'){
  // palavras que ela ouviu ficam verdes na frase grande
  const said=' '+norm(txt)+' ';[...$('prTxt').querySelectorAll('span')].forEach(s=>{const w=norm(s.textContent);if(w&&said.includes(' '+w+' '))s.classList.add('ok')});
  if(sc>=.8){S.praise=T()+1.5;nod(1.2);await sayLine(pick(['Clear. I got every word.','Yes! Easy to understand.','Nice, that sounded natural.']))}
  else await sayLine(pick(['Good try! Listen once more:','Almost! One more time with me:']));
  if(CV.abort)return;
  if(sc<.8){setState('SPEAKING');await speak(it.target,{slow:true});if(CV.abort)return}
  P.step='B';P.tries=0;return pracStep()}
 if(sc>=.8){it.ok=true;S.praise=T()+1.8;nod(1.3);prShow(`De memória · ${P.i+1}/${P.list.length}`,it.target,'<span class="res">✓ Perfeito, de memória!</span>');
  await sayLine(pick(["Yes! That's it.","Perfect, from memory!","Exactly right!"]));return nextPractice()}
 P.tries++;
 if(P.tries<2){const ws=it.target.split(/\s+/);prShow(`De memória · ${P.i+1}/${P.list.length}`,'',`Dica: começa com “${esc(ws.slice(0,Math.min(2,ws.length-1)).join(' '))}…”`,true);return pracStep()}
 prShow(`De memória · ${P.i+1}/${P.list.length}`,it.target,'<span class="res">Tudo bem! Ela volta na sua revisão.</span>');
 await sayLine("No worries, it's: "+it.target+". We'll come back to it next time.");return nextPractice()}
function nextPractice(){const P=S.prac;if(!P||CV.abort)return;P.i++;P.step='A';P.tries=0;if(P.i>=P.list.length)return finishConversation();pracStep()}
async function finishConversation(){const P=S.prac;S.prac=null;prHide();
 if(CV.picks&&CV.picks.length){cardsSave(CV.picks);
  await sayLine(pick(["That's it for today. Nice work on those sentences. See you next time!","All done for today. Nice work on those sentences. See you soon!"]),'Por hoje é isso. Mandou bem nessas frases. Até a próxima!')}
 cardsAdvance();CV.ended=true;CV.ending=false;
 if(S.running)stop();talkUI();openReview()}
/* ---- aba de revisão ---- */
let RV_TAB='tr';
function openReview(){$('review').hidden=false;reviewRender()}
function reviewRender(){const b=$('rvBody'),turns=CV.turns,errs=turns.filter(t=>t.who==='me'&&t.isError&&t.corrected&&!t.practice);
 document.querySelectorAll('.rvtabs button').forEach(x=>x.classList.toggle('on',x.dataset.t===RV_TAB));
 $('rvTabEr').textContent=`Erros (${errs.length})`;
 const pr=CV.picks||[];$('rvSum').textContent=turns.length?`${turns.filter(t=>t.who==='me'&&!t.practice).length} falas suas · ${errs.length} ${errs.length===1?'frase para ajustar':'frases para ajustar'} · ${pr.length} ${pr.length===1?'treinada':'treinadas'}${pr.length?' ('+pr.filter(p=>p.ok).length+' de memória)':''}`:'';
 if(RV_TAB==='tr'){b.innerHTML=turns.length?turns.map(t=>{const me=t.who==='me';const base=t.heard||t.text;
   const body=me&&t.isError&&t.corrected?diffHTML(base,t.corrected):esc(base);
   return `<div class="rvl ${me?'me':'so'}"><small>${me?'Você':'Sophia'}${t.practice?' · treino':''}</small>${body}${!me&&t.pt?`<span class="pt">${esc(t.pt)}</span>`:''}${me&&t.why&&t.isError?`<span class="pt">${esc(t.why)}</span>`:''}</div>`}).join(''):'<div class="rvempty">Nenhuma conversa ainda.</div>'}
 else if(RV_TAB==='er'){b.innerHTML=errs.length?errs.map(t=>{const k=errKey(t),n=errs.filter(x=>errKey(x)===k).length,picked=pr.find(p=>norm(p.target)===norm(t.corrected.replace(/[.!?]+$/,'')));
   return `<div class="rve">${picked?'<span class="tag">treinada</span>':''}${n>1?`<span class="tag">repetiu ${n}×</span>`:''}${t.meaning?'<span class="tag">muda o sentido</span>':''}<div>${diffHTML(t.heard||t.text,t.corrected)}</div><span class="good">${esc(t.corrected)}</span>${t.why?`<span class="why">${esc(t.why)}</span>`:''}</div>`}).join(''):'<div class="rvempty">Nenhum erro registrado nesta conversa. 🎉</div>'}
 else {const L=cardsGet().filter(c=>c.step<SR_DAYS.length).sort((a,b)=>a.next-b.next),fmt=x=>new Date(x).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
   b.innerHTML=L.length?'<p style="font-size:13.5px;opacity:.75;margin:0 0 8px">A Sophia vai puxar estas estruturas de novo nas próximas conversas (revisão no dia 1, 3 e 7).</p>'+L.map(c=>`<div class="rvc"><b>${esc(c.target)}</b>${c.pt?`<span>“${esc(c.pt)}”</span>`:''}<span>Próxima revisão: ${fmt(c.next)} · etapa ${c.step+1}/3 (${c.due.map(fmt).join(', ')})${c.okNow?' · acertou de memória':''}</span></div>`).join(''):'<div class="rvempty">Nenhum cartão de revisão ainda.</div>'}}
document.querySelectorAll('.rvtabs button').forEach(x=>x.onclick=()=>{RV_TAB=x.dataset.t;reviewRender()});
$('rvClose').onclick=()=>{$('review').hidden=true;talkUI()};
$('rvNew').onclick=()=>{$('review').hidden=true;$('caps').innerHTML='';talkUI();$('btnStart').click()};
/* ---- sessão: fundo do dia, cartões que voltam, layout ---- */
function pickBg(){let id=CFG.bg||'auto';if(id==='auto'){const n=+(localStorage.getItem('sophiaBgN')||0);id=BG_LIST[n%BG_LIST.length][0];CV.bgAuto=id}
 const h=$('bgHost');if(h&&h.dataset.bg!==id){h.innerHTML=bgSVG(id);h.dataset.bg=id}}
function convSessionStart(){Object.assign(CV,{turns:[],pend:[],ending:false,ended:false,abort:false,picks:[],sessionAt:Date.now()});S.prac=null;prHide();
 $('caps').innerHTML='';$('review').hidden=true;CV.elicit=cardsDue().map(c=>({id:c.id,target:c.target,why:c.why,cat:c.cat}));
 if((CFG.bg||'auto')==='auto'){localStorage.setItem('sophiaBgN',String(+(localStorage.getItem('sophiaBgN')||0)+1));pickBg()}}
function applyUI(){const c=isConv();document.body.classList.toggle('conv',c);if(c)pickBg();buildRig();talkUI()}
$('btnEnd').onclick=()=>{if(S.prac||CV.ending){CV.abort=true;S.prac=null;prHide();CV.ending=false;speakToken++;try{speechSynthesis.cancel()}catch(_){} if(S.cancelAz)S.cancelAz();cardsSave((CV.picks||[]));cardsAdvance();if(S.running)stop();talkUI();openReview();return}
 endConversation(false)};
$('btnRev').onclick=()=>openReview();
$('btnGear').onclick=()=>$('btnCfg').click();
$('btnKbd').onclick=()=>{document.body.classList.toggle('kbd');if(document.body.classList.contains('kbd'))$('typeIn').focus()};
