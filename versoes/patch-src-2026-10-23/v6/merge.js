/* ============ v7 · Rotina dentro da trilha (2026.10.20-trilha) ============
   A sessão diária segue o método (Método v1.3 §4 · Proposta §4.1): Aquecimento (Erick, revisão espaçada) → Trilha (Erick: Input =
   episódio "Ouvir com o Erick" + Pegue o trecho; depois foco na forma e pronúncia) → Bate-papo (Sophia, tarefa) → Fechamento (Teacher Lili).
   Estado real só neste navegador (localStorage). Chave Azure: só lida dos ⚙︎ Ajustes do sophia-ao-vivo (mesma origem); nunca gravada aqui. */
(function(){
'use strict';
const MV='2026.10.20-trilha';
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>(s||'').toLowerCase().replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
const CFG=(()=>{try{return JSON.parse(localStorage.getItem('sophiaCfg')||'{}')}catch(_){return{}}})();
const say_toast=(m)=>{try{window.toast(m)}catch(_){}};
const mmss=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const go=h=>{location.hash=h};

/*@@EPS@@*/

/* ---- cartões: o MESMO armazenamento do sophia-ao-vivo (sophiaCards) ---- */
const DAY=864e5,SR_DAYS=[1,3,7];
const cardsGet=()=>{try{return JSON.parse(localStorage.getItem('sophiaCards')||'[]')}catch(_){return[]}};
const cardsSet=L=>localStorage.setItem('sophiaCards',JSON.stringify(L.slice(-60)));
function cardsSave(items){const L=cardsGet(),now=Date.now();
 for(const it of items){const k=norm(it.target);const old=L.find(c=>norm(c.target)===k);
  if(old){old.step=0;old.created=now;old.due=SR_DAYS.map(d=>now+d*DAY);old.next=old.due[0];old.okNow=!!it.ok;if(it.tag)old.tag=it.tag;continue}
  L.push({id:now+'-'+Math.random().toString(36).slice(2,6),target:it.target,said:it.said,why:it.why||null,pt:it.pt||null,cat:it.cat||null,created:now,step:0,due:SR_DAYS.map(d=>now+d*DAY),next:now+DAY,okNow:!!it.ok,tag:it.tag||null})}
 cardsSet(L)}
function cardResult(id,ok){const L=cardsGet(),c=L.find(x=>x.id===id);if(!c)return;const now=Date.now();
 if(ok){c.step++;c.next=c.step<SR_DAYS.length?Math.max((c.due||[])[c.step]||0,now+DAY):now+3650*DAY}else{c.step=0;c.due=SR_DAYS.map(d=>now+d*DAY);c.next=c.due[0]}cardsSet(L)}
const cardsDue=()=>{const now=Date.now();return cardsGet().filter(c=>c.step<SR_DAYS.length&&c.next<=now).sort((a,b)=>a.next-b.next)};

/* ---- pontuação tolerante (a mesma do Treino de ouvido do sophia-ao-vivo) ---- */
/*@@SCORING@@*/
function revealHTML(target,heard,chunks){const sc=earScore(target,heard),ck=earChunks({c:chunks||[]},sc.words),ws=sc.words;const NUM='①②③④⑤';let h='',k=0;
 while(k<ws.length){const o=ws[k];
  if(o.ck>=0){let g='';const c=o.ck,cm=ck[c];while(k<ws.length&&ws[k].ck===c){g+=`<span class="o-w ${ws[k].ok?'ok':'miss'}">${esc(ws[k].w)}</span> `;k++}h+=`<span class="o-ck${cm.miss?' ckm':''}">${g.trim()}<sup>${NUM[c]||''}</sup></span> `}
  else{h+=`<span class="o-w ${o.ok?'ok':'miss'}">${esc(o.w)}</span> `;k++}}
 const tips=ck.length?`<ul class="o-tips">${ck.map(c=>`<li class="${c.miss?'m':''}"><b>${NUM[c.k]||'•'} ${esc(c.t)}</b> → ${esc(c.snd)}${c.tip?`<br><span>${esc(c.tip)}</span>`:''}</li>`).join('')}</ul>`:'';
 return {sc,ck,html:`<p class="o-sent">${h.trim()}</p>`,tips}}

/* ---- estado real do dia (mesma chave da Rotina: rotinaState) ---- */
const ST_KEY='rotinaState';
let ST=(()=>{try{return Object.assign({days:{},eps:{},weeks:{}},JSON.parse(localStorage.getItem(ST_KEY)||'{}'))}catch(_){return{days:{},eps:{},weeks:{}}}})();
ST.weeks=ST.weeks||{};
const save=()=>{try{localStorage.setItem(ST_KEY,JSON.stringify(ST))}catch(_){}};
const dk=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function today(){const k=dk();ST.days[k]=ST.days[k]||{steps:{}};return ST.days[k]}
const dayStart=()=>{const d=new Date();d.setHours(0,0,0,0);return d.getTime()};
function stepDone(k,data){const d=today();d.steps[k]=Object.assign({},d.steps[k]||{},data||{},{done:true,at:Date.now()});save()}
const isDone=(k,d=today())=>!!(d.steps[k]&&d.steps[k].done);
/* sessão de hoje = unidade A2.2 · Missão 3 (status update) → episódio da unidade */
const SESSION={ep:'ep0',cando:'Consigo dar um status update curto numa reunião semanal',alvos:'running behind / on track · Could you…?'};
const sessEp=()=>EPS.find(e=>e.id===SESSION.ep);
const ETAPAS=[['Aquecimento',d=>isDone('aquec',d)],['Trilha',d=>isDone('ep',d)&&isDone('trail',d)],['Bate-papo',d=>isDone('call',d)],['Fechamento',d=>isDone('lili',d)]];
const weekKey=(d=new Date())=>{const m=new Date(d);m.setHours(0,0,0,0);m.setDate(m.getDate()-((m.getDay()+6)%7));return dk(m)};
/* Capital (regras originais da tela "Como funciona o Capital"): sessão completa +80 · conversa +20 · revisões no dia +20 · checkpoint +60 · teto 200/dia · erro nunca tira */
function capitalOf(d,key){d=d||today();const r=[];
 const core=isDone('aquec',d)&&isDone('ep',d)&&isDone('trail',d)&&isDone('call',d);
 if(core&&isDone('lili',d))r.push(['Sessão diária completa (4 etapas)',80]);
 if(isDone('call',d))r.push([d.steps.call.real?'Conversa com a Sophia (ao vivo)':'Conversa com a Sophia (simulada)',20]);
 if(isDone('aquec',d)&&(d.steps.aquec.n||0)>0)r.push(['Revisões no dia do vencimento',20]);
 const wk=ST.weeks[weekKey(key?new Date(key+'T12:00'):new Date())];if(wk&&wk.done&&wk.day===(key||dk()))r.push(['Checkpoint semanal',60]);
 const raw=r.reduce((a,x)=>a+x[1],0);return {rows:r,total:Math.min(200,raw),raw}}
function capitalWeek(){const m=new Date();m.setHours(0,0,0,0);m.setDate(m.getDate()-((m.getDay()+6)%7));let t=0;
 for(let i=0;i<7;i++){const x=new Date(m);x.setDate(m.getDate()+i);const k=dk(x);if(ST.days[k])t+=capitalOf(ST.days[k],k).total}return t}
function hasReal(d=today()){return Object.values(d.steps||{}).some(s=>s&&s.done)}

/* volta da chamada ao vivo: o sophia-ao-vivo grava sophiaRotinaCall ao desligar (só quando aberto com from=rotina) */
function checkCall(){try{const c=JSON.parse(localStorage.getItem('sophiaRotinaCall')||'null');if(!c||c.at<dayStart()||c.turns<1)return false;const d=today(),s=d.steps.call;
 if(!s||!s.real||s.sid!==c.sid||(s.at||0)<c.at){d.steps.call={done:true,real:true,at:c.at,sid:c.sid,turns:c.turns,errs:c.errs||[],tema:c.tema,secs:c.secs};save();return true}}catch(_){}return false}
addEventListener('pageshow',()=>{if(checkCall())refresh()});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&checkCall()){refresh();say_toast('📞 Chamada com a Sophia registrada. ✓')}});

/* ---- voz: Azure TTS (chave salva no sophia-ao-vivo) com cache no aparelho; senão a voz do navegador ---- */
const azOK=()=>!!(CFG.azKey&&String(CFG.azKey).trim());
const azReg=()=>(CFG.azReg||'brazilsouth').trim().toLowerCase().replace(/\s+/g,'');
const VOICES={E:['en-US-AndrewMultilingualNeural','en-US-AndrewNeural','en-US-GuyNeural']};
const voicesFor=(ep,sp)=>sp==='G'&&ep&&ep.guest?[ep.guest.v,ep.guest.g==='m'?'en-US-GuyNeural':'en-US-JennyNeural']:VOICES.E;
async function azFetch(text,voice){const key='https://erick-tts.local/'+encodeURIComponent([azReg(),voice,text].join('|'));let c=null;
 try{c=await caches.open('erick-tts-v1');const hit=await c.match(key);if(hit)return await hit.arrayBuffer()}catch(_){}
 const r=await fetch(`https://${azReg()}.tts.speech.microsoft.com/cognitiveservices/v1`,{method:'POST',headers:{'Ocp-Apim-Subscription-Key':CFG.azKey,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3'},
  body:`<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${voice}">${esc(text)}</voice></speak>`});
 if(!r.ok){const e=new Error('HTTP '+r.status+(r.status===401?' (chave ou região)':r.status===429?' (limite do plano)':''));e.status=r.status;throw e}
 const ab=await r.arrayBuffer();try{c&&await c.put(key,new Response(ab.slice(0),{headers:{'Content-Type':'audio/mpeg'}}))}catch(_){}return ab}
async function azSynth(text,voices){let last;for(const v of voices){try{return await azFetch(text,v)}catch(e){last=e;if(e.status===400||e.status===404)continue;throw e}}throw last||new Error('sem voz')}
let ACX=null;function acx(){if(!ACX){try{ACX=new (window.AudioContext||window.webkitAudioContext)({sampleRate:24000})}catch(_){ACX=new (window.AudioContext||window.webkitAudioContext)()}}return ACX}
const decode=ab=>new Promise((res,rej)=>acx().decodeAudioData(ab.slice(0),res,rej));
function wavBlob(f32,sr){const n=f32.length,b=new ArrayBuffer(44+n*2),v=new DataView(b),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
 w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
 for(let i=0;i<n;i++){const s=Math.max(-1,Math.min(1,f32[i]));v.setInt16(44+i*2,s<0?s*32768:s*32767,true)}return new Blob([b],{type:'audio/wav'})}
function bVoices(){const vs=('speechSynthesis'in window?speechSynthesis.getVoices():[]).filter(v=>/^en[-_]/i.test(v.lang));
 const m=vs.find(v=>/\b(male|guy|david|daniel|alex|aaron|fred|tom|andrew|rishi)\b/i.test(v.name)&&!/female/i.test(v.name));
 const f=vs.find(v=>/\b(female|samantha|zira|jenny|aria|victoria|karen|ava|google us english)\b/i.test(v.name));
 const us=vs.find(v=>/en[-_]US/i.test(v.lang))||vs[0]||null;return {E:m||us,G:f||vs.find(v=>v!==(m||us))||us}}
const estDur=(t,rate=1)=>(String(t).split(/\s+/).length*.36+.35)/rate;
let SPK=0;
function bSay(text,sp='E',rate=1){const tok=++SPK;return new Promise(res=>{
 if(!('speechSynthesis'in window)){setTimeout(res,estDur(text,rate)*1000);return}
 try{speechSynthesis.cancel()}catch(_){}
 const u=new SpeechSynthesisUtterance(text),V=bVoices();u.voice=V[sp]||null;u.lang='en-US';u.rate=rate;u.pitch=sp==='G'&&V.G===V.E?1.18:sp==='E'?.95:1.05;
 let done=false;const fin=()=>{if(!done){done=true;res()}};u.onend=fin;u.onerror=fin;speechSynthesis.speak(u);
 const chk=()=>{if(done||tok!==SPK)return fin();if(!speechSynthesis.speaking&&!speechSynthesis.pending)return fin();setTimeout(chk,400)};setTimeout(chk,estDur(text,rate)*1000+900)})}
let SAY_A=null;
async function say(text,sp='E',rate=1,ep=null){stopSay();
 if(azOK()){try{const ab=await azSynth(text,voicesFor(ep,sp));const url=URL.createObjectURL(new Blob([ab],{type:'audio/mpeg'}));const a=new Audio(url);SAY_A=a;a.playbackRate=rate;a.preservesPitch=true;
   await new Promise(res=>{a.onended=res;a.onerror=res;a.onpause=()=>{if(a.__stop)res()};a.play().catch(res)});URL.revokeObjectURL(url);return}catch(e){console.warn('Azure TTS',e.message)}}
 return bSay(text,sp,rate)}
function stopSay(){SPK++;if(SAY_A){SAY_A.__stop=true;try{SAY_A.pause()}catch(_){}SAY_A=null}try{speechSynthesis.cancel()}catch(_){}}

/* ---- player: Azure → um WAV com todas as falas (velocidade sem mudar o tom); navegador → fala a fala num relógio virtual ---- */
const PL={ep:null,mode:null,audio:null,url:null,lines:[],dur:0,rate:1,t:0,playing:false,segEnd:null,raf:0,cur:-1,onEnd:null,onTick:null,spk:false,silent:false,tok:0};
function plStop(){PL.playing=false;PL.segEnd=null;cancelAnimationFrame(PL.raf);if(PL.audio)try{PL.audio.pause()}catch(_){}PL.tok++;try{speechSynthesis.cancel()}catch(_){};stopSay()}
function plTiming(ep,durs){let t=.4;const L=[];ep.lines.forEach((l,i)=>{if(i)t+=ep.lines[i-1][0]===l[0]?.3:.5;L.push({start:t,end:t+durs[i]});t+=durs[i]});return {lines:L,dur:t+.6}}
async function plPrepare(ep,onProg){plStop();if(PL.url){URL.revokeObjectURL(PL.url);PL.url=null}Object.assign(PL,{ep,audio:null,t:0,cur:-1,rate:PL.rate||1});
 if(azOK()){try{let done=0;const bufs=new Array(ep.lines.length);let next=0;
   const worker=async()=>{while(next<ep.lines.length){const i=next++;bufs[i]=await decode(await azSynth(ep.lines[i][1],voicesFor(ep,ep.lines[i][0])));onProg&&onProg(++done,ep.lines.length)}};
   await Promise.all([worker(),worker(),worker(),worker()]);
   const sr=bufs[0].sampleRate,tm=plTiming(ep,bufs.map(b=>b.duration)),out=new Float32Array(Math.ceil(tm.dur*sr));
   bufs.forEach((b,i)=>out.set(b.getChannelData(0),Math.floor(tm.lines[i].start*sr)));
   PL.url=URL.createObjectURL(wavBlob(out,sr));const a=new Audio(PL.url);a.preload='auto';a.preservesPitch=true;a.playbackRate=PL.rate;
   a.onended=()=>{PL.playing=false;PL.onEnd&&PL.onEnd()};
   Object.assign(PL,{mode:'audio',audio:a,lines:tm.lines,dur:tm.dur});ST.eps[ep.id]=Object.assign(ST.eps[ep.id]||{},{dur:Math.round(tm.dur)});save();return}
  catch(e){console.warn('Azure TTS',e.message);say_toast('Voz Azure indisponível ('+e.message+'). Usando a voz do navegador.')}}
 const tm=plTiming(ep,ep.lines.map(l=>estDur(l[1])));Object.assign(PL,{mode:'speech',lines:tm.lines,dur:tm.dur,silent:false})}
const plTime=()=>PL.mode==='audio'&&PL.audio?PL.audio.currentTime:PL.t;
function plLineAt(t){let c=-1;PL.lines.forEach((l,i)=>{if(t>=l.start-.05)c=i});return c}
function plLoop(){cancelAnimationFrame(PL.raf);let last=performance.now();
 const f=now=>{if(!PL.playing)return;const dt=Math.min(.1,(now-last)/1000);last=now;
  if(PL.mode==='speech'){const nxt=PL.lines[PL.cur+1];
   if(!(PL.spk&&!PL.silent&&nxt&&PL.t>=nxt.start-.02))PL.t+=dt*PL.rate;
   const c=plLineAt(PL.t);if(c!==PL.cur&&c>=0){PL.cur=c;plSpeakLine(c)}
   if(PL.t>=PL.dur){PL.playing=false;PL.t=PL.dur;PL.onTick&&PL.onTick();PL.onEnd&&PL.onEnd();return}}
  const t=plTime();if(PL.segEnd!=null&&t>=PL.segEnd){plPause();PL.segEnd=null;PL.onSeg&&PL.onSeg();PL.onSeg=null}
  PL.onTick&&PL.onTick();PL.raf=requestAnimationFrame(f)};PL.raf=requestAnimationFrame(f)}
function plSpeakLine(i){const tok=++PL.tok,l=PL.ep.lines[i];PL.spk=true;const t0=performance.now();
 bSay(l[1],l[0],PL.rate).then(()=>{if(tok!==PL.tok)return;PL.spk=false;if(performance.now()-t0<300)PL.silent=true;
  const nx=PL.lines[i+1];if(PL.playing&&nx&&PL.t<nx.start-.15&&!PL.silent)PL.t=nx.start-.15})}
function plPlay(){if(!PL.ep)return;if(plTime()>=PL.dur-.05)plSeek(0);PL.playing=true;
 if(PL.mode==='audio'){PL.audio.playbackRate=PL.rate;PL.audio.play().catch(e=>{console.warn(e);PL.playing=false;PL.onTick&&PL.onTick()})}else{PL.cur=-1}
 plLoop();PL.onTick&&PL.onTick()}
function plPause(){PL.playing=false;cancelAnimationFrame(PL.raf);if(PL.mode==='audio'&&PL.audio)PL.audio.pause();else{PL.tok++;try{speechSynthesis.cancel()}catch(_){}PL.spk=false}PL.onTick&&PL.onTick()}
function plSeek(t){t=Math.max(0,Math.min(PL.dur,t));if(PL.mode==='audio')PL.audio.currentTime=t;else{PL.t=t;PL.cur=-1;PL.tok++;try{speechSynthesis.cancel()}catch(_){}PL.spk=false}PL.onTick&&PL.onTick()}
function plRate(r){PL.rate=r;if(PL.mode==='audio')PL.audio.playbackRate=r}
function plSegment(i,rate=1){return new Promise(res=>{plPause();const l=PL.lines[i];
 if(PL.mode==='audio'){PL.audio.currentTime=l.start;PL.audio.playbackRate=rate;PL.segEnd=l.end+.05;PL.onSeg=()=>{PL.audio.playbackRate=PL.rate;res()};PL.playing=true;PL.audio.play().catch(res);plLoop()}
 else{const ln=PL.ep.lines[i];bSay(ln[1],ln[0],rate).then(res)}})}

/* ---- microfone (Web Speech, segurar para falar) ---- */
const SRc=window.SpeechRecognition||window.webkitSpeechRecognition;
function micBind(btn,onText,onLive){if(!btn)return;if(!SRc){btn.hidden=true;return}
 let rec=null,acc='',cur='',on=false;
 const mk=()=>{const r=new SRc();r.lang='en-US';r.interimResults=true;r.continuous=!/Android/i.test(navigator.userAgent);
  r.onresult=ev=>{let f='',i='';for(let k=ev.resultIndex;k<ev.results.length;k++){const x=ev.results[k];if(x.isFinal)f+=x[0].transcript+' ';else i+=x[0].transcript}if(f)acc=(acc+' '+f).trim();cur=i;onLive&&onLive((acc+' '+cur).trim())};
  r.onerror=ev=>{const m={'not-allowed':'Microfone bloqueado: toque no cadeado 🔒 ao lado do endereço → Permissões → Microfone.','service-not-allowed':'Microfone bloqueado: toque no cadeado 🔒 → Permissões → Microfone.','audio-capture':'Não consegui usar o microfone. Feche outros apps que usam o microfone.','network':'O reconhecimento de voz precisa de internet.'}[ev.error];if(m)say_toast(m)};
  r.onend=()=>{if(on){try{r.start()}catch(_){}return}const t=(acc+' '+cur).trim();rec=null;if(t)onText(t)};return r};
 btn.addEventListener('pointerdown',e=>{e.preventDefault();if(on)return;on=true;acc='';cur='';btn.classList.add('held');try{btn.setPointerCapture(e.pointerId)}catch(_){}stopSay();rec=mk();try{rec.start()}catch(_){}});
 const up=()=>{if(!on)return;on=false;btn.classList.remove('held');try{rec&&rec.stop()}catch(_){}};
 btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);['contextmenu','selectstart'].forEach(t=>btn.addEventListener(t,e=>e.preventDefault()))}
const inputRow=(id,ph)=>`<form class="o-inrow" id="${id}F"><input id="${id}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" placeholder="${ph}"><button type="button" class="o-mic" id="${id}M" aria-label="Segure para falar">🎙</button><button class="o-btn pri" type="submit">OK</button></form><p class="o-live" id="${id}L"></p>`;
function bindInput(id,fn){const f=$(id+'F');if(!f)return;f.onsubmit=e=>{e.preventDefault();const v=$(id).value.trim();if(v)fn(v)};micBind($(id+'M'),t=>{$(id).value=t;fn(t)},t=>{$(id+'L').textContent=t})}

/* ================= TELAS NOVAS DENTRO DO v6 ================= */
const LV_ORDER=['A2+','A2','B1','B2'];
function epDur(e){const s=ST.eps[e.id];return s&&s.dur?s.dur:Math.round(plTiming(e,e.lines.map(l=>estDur(l[1]))).dur)}
const epProg=e=>{const s=ST.eps[e.id]||{};return s.done?1:(s.stage||0)/4};
const callHref=ep=>'../sophia-ao-vivo/?tema='+encodeURIComponent(ep.tema)+(ep.alvos?'&alvos='+encodeURIComponent(ep.alvos):'')+'&from=rotina';

const IC_PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6a.6.6 0 0 0 .9.5l10.6-6.8a.6.6 0 0 0 0-1L8.9 4.7a.6.6 0 0 0-.9.5z"/></svg>';
const IC_PAUSE='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>';
const icSkip=fw=>`<svg viewBox="0 0 24 24" aria-hidden="true" class="sk"><path d="${fw?'M12 5a7 7 0 1 1-7 7':'M12 5a7 7 0 1 0 7 7'}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="${fw?'M12 1.8v6.4l4-3.2z':'M12 1.8v6.4L8 5z'}" fill="currentColor"/><text x="12" y="15.6" text-anchor="middle" font-size="7.4" font-weight="800" fill="currentColor">15</text></svg>`;
const SPLA='<svg viewBox="0 0 80 80" aria-hidden="true" class="spla"><use href="#mk8"/></svg>';

/* ---- Ouvir com o Erick: biblioteca estilo podcast (Praticar) ---- */
function renderList(){const box=$('oList');if(!box)return;const se=sessEp();
 const groups=[['A2.2 · sua unidade agora',EPS.filter(e=>e.sub==='A2.2')],['B1.1 · próximo nível (trilhas setoriais)',EPS.filter(e=>e.sub==='B1.1')],['B2.1 · mais à frente',EPS.filter(e=>e.sub==='B2.1')]];
 box.innerHTML=`<div class="o-lib"><div class="o-libh"><button type="button" class="o-back" data-go="practice" aria-label="Voltar">‹</button>${SPLA}<span>Podcast · São Paulo Languages Academy</span></div>
 <div class="o-libart" role="img" aria-label="Capa do podcast: Erick no estúdio"></div>
 <h1>Ouvir com o Erick</h1><p>Inglês do trabalho em velocidade real, 1 a 2 min. 1ª escuta sem texto, 2 perguntas, “pegue o trecho” e letra.</p>
 <div class="o-libmeta"><span class="o-tag y">input da trilha</span><span>${EPS.length} episódios · A2+ → B2</span></div>
 <div class="o-playday" data-go="d-ouvir" role="button" tabindex="0"><span class="pp">${IC_PLAY}</span><div><b>Episódio da sessão de hoje</b><small>Ep. ${se.n} · ${esc(se.t)} · ${esc(se.unitT)}</small></div></div></div>
${groups.map(([g,L])=>`<div class="o-lv">${esc(g)}</div><ul class="o-eps">${L.map(e=>`<li><button class="o-ep" data-go="ep~${e.id}" style="--c:${e.color}"><span class="o-cv"><b>EP ${e.n}</b></span><span class="tx"><b>${esc(e.t)}</b>
  <span>${e.guest?'Erick & '+esc(e.guest.name):'Erick, solo'} · ${mmss(epDur(e))} · ${esc(e.unitT)}${ST.eps[e.id]&&ST.eps[e.id].done?' · <b style="display:inline;color:var(--ok)">✓ ouvido</b>':''}</span>
  <span class="o-chips"><i class="o-tag k">${e.lv}</i>${e.th.map(t=>`<i class="o-tag">${esc(t)}</i>`).join('')}</span><span class="o-bar" style="display:block"><i style="width:${Math.round(epProg(e)*100)}%"></i></span></span></button></li>`).join('')}</ul>`).join('')}
 <div class="o-card o-dk" style="margin-top:14px"><b>Onde isso entra no método</b><p class="o-sm o-mut" style="margin-top:4px">Na sessão diária, o episódio é o bloco de <b>input</b> da Trilha (P4) e treina a escuta da fala encadeada. Fora da sessão, é o “trilho extra de input”: livre, no seu ritmo, inclusive no fim de semana.</p></div>`}

/* ---- Episódio: 1) ouvir sem texto → 2) 2 perguntas → 3) pegue o trecho → 4) ouvir com letra ---- */
let EF=null;const PH=['listen','gist','trecho','again','done'];
function openEp(id,ctx){const ep=EPS.find(e=>e.id===id)||sessEp();const s=ST.eps[ep.id]||{};const box=ctx==='sessao'?$('oEpD'):$('oEp');
 if(ctx!=='sessao'){const t=$('oEpTag');if(t)t.textContent=ep.sub+' · '+ep.lv}
 EF={ep,ctx,box,phase:s.done&&ctx!=='sessao'?'again':'listen',letra:!!(s.done&&ctx!=='sessao'),gist:[],ti:0,tv:'answer',tres:[],ready:false,heardOnce:false,chunkI:0,maxT:0,lyc:-2};
 epShell();PL.onTick=epTick;PL.onEnd=()=>{EF&&(EF.heardOnce=true);epTick(true)};
 plPrepare(ep,(a,b)=>{const p=$('oPrep');if(p)p.textContent=`Preparando o áudio… ${a}/${b}`}).then(()=>{if(!EF||EF.ep!==ep)return;EF.ready=true;epShell()})}
function epStage(n){const s=ST.eps[EF.ep.id]=ST.eps[EF.ep.id]||{};s.stage=Math.max(s.stage||0,n);save()}
function epShell(){if(!EF)return;const ep=EF.ep,ph=EF.phase,pi=PH.indexOf(ph);
 const stp=['Ouvir','Perguntas','Pegue o trecho','Com letra'].map((t,i)=>`<i class="${i===Math.min(pi,3)&&ph!=='done'?'on':i<pi?'ok':''}">${i<pi?'✓ ':''}${t}</i>`).join('');
 const body=ph==='listen'||ph==='again'?epPlayerHTML():ph==='gist'?epGistHTML():ph==='trecho'?epTrechoHTML():epDoneHTML();
 const np=`<div class="o-np"><small>${EF.ctx==='sessao'?'Tocando na sessão · Trilha 2a · input':'Tocando agora · Ouvir com o Erick'}</small><b>Ep. ${ep.n} · ${esc(ep.sub)} · ${esc(ep.lv)}</b></div>`;
 EF.box.innerHTML=`<div class="o-pl" style="--c:${ep.color}">${np}<div class="o-stp">${stp}</div>${body}</div>`;epBind()}
function epPlayerHTML(){const ep=EF.ep,first=EF.phase==='listen';
 return `${EF.letra?`<div class="o-lyr" id="oLyr">${ep.lines.map((l,i)=>`<p data-i="${i}"><small>${l[0]==='E'?'Erick':esc(ep.guest.name)}</small>${esc(l[1])}</p>`).join('')}</div>`
   :`<div class="o-cover" role="img" aria-label="Capa do episódio: Erick no estúdio"><span class="lbl">EP ${ep.n} · ${esc(ep.en.toUpperCase())}</span><span class="who">Erick${ep.guest?' & '+esc(ep.guest.name):''}</span></div>`}
 <div class="o-ti"><b>${esc(ep.t)}</b><span>${ep.guest?'Erick & '+esc(ep.guest.name):'Erick'} · ${esc(ep.unitT)} · ${ep.lv}</span></div>
 ${EF.ready?`<input type="range" class="o-scrub" id="oScrub" min="0" max="${PL.dur.toFixed(1)}" step="0.1" value="${plTime().toFixed(1)}" style="--p:${(plTime()/PL.dur*100).toFixed(1)}%" aria-label="Posição"><div class="o-tm"><span id="oNow">${mmss(plTime())}</span><span>${mmss(PL.dur)}</span></div>
 <div class="o-ctl"><button type="button" id="oSpd" aria-label="Velocidade">${PL.rate}×</button><button type="button" id="oB15" aria-label="Voltar 15 segundos">${icSkip(0)}</button><button type="button" class="pp" id="oPP" aria-label="Tocar ou pausar">${PL.playing?IC_PAUSE:IC_PLAY}</button><button type="button" id="oF15" aria-label="Avançar 15 segundos">${icSkip(1)}</button>
  <button type="button" class="lt${EF.letra?' on':''}" id="oLt" ${first?'disabled':''} aria-pressed="${EF.letra}">${first?'🔒 ':''}Letra</button></div>
 ${first?`<p class="o-prep">${EF.heardOnce?'Ouviu tudo. Agora, 2 perguntas de sentido.':'1ª escuta sem texto: tente pegar a ideia geral. A letra libera depois.'}</p><button type="button" class="o-btn ${EF.heardOnce?'pri':''} wide" id="oToGist">${EF.heardOnce?'Responder 2 perguntas →':'Já ouvi → perguntas'}</button>`
  :`<button type="button" class="o-btn pri wide" id="oFinish">Concluir episódio ✓</button>`}`
 :`<p class="o-prep" id="oPrep">Preparando o áudio…</p>`}
 ${EF.ctx==='sessao'?`<button type="button" class="o-btn wide" style="margin-top:8px;background:transparent" data-go="d-trail">Pular para os exercícios da Trilha</button>`:''}`}
function epTick(ended){if(!EF||!EF.ready)return;const t=plTime(),sc=$('oScrub');if(!sc)return;if(!sc.__drag){sc.value=t.toFixed(1);sc.style.setProperty('--p',(t/PL.dur*100).toFixed(1)+'%')}$('oNow').textContent=mmss(t);const pp=$('oPP'),pl=!!PL.playing;if(pp.__pl!==pl){pp.innerHTML=pl?IC_PAUSE:IC_PLAY;pp.__pl=pl}
 EF.maxT=Math.max(EF.maxT,t);if(EF.phase==='listen'&&!EF.heardOnce&&(ended===true||EF.maxT>=PL.dur*.92)){EF.heardOnce=true;epShell();return}
 if(EF.phase==='listen'&&ended===true){epShell();return}
 const ly=$('oLyr');if(ly){const c=plLineAt(t);ly.querySelectorAll('p').forEach((p,i)=>{p.className=i===c?'on':i<c?'past':''});
  if(c!==EF.lyc){EF.lyc=c;const p=ly.querySelector(`p[data-i="${c}"]`);if(p)ly.scrollTop=p.offsetTop-ly.clientHeight*.35}}}
function epGistHTML(){const g=EF.ep.gist;return `<div class="o-card"><p class="o-big">Pegou a ideia geral?</p><p class="o-mut o-sm">Sem pressão: é só para conferir o sentido.</p>
 ${g.map((q,qi)=>`<div style="margin-top:14px"><b>${qi+1}. ${esc(q[0])}</b>${q[1].map((o,oi)=>{const a=EF.gist[qi];const cls=a==null?'':oi===q[2]?'ok':oi===a?'bad':'';return `<button type="button" class="o-opt ${cls}" data-q="${qi}" data-o="${oi}" ${a!=null?'disabled':''}>${esc(o)}${a!=null&&oi===q[2]?' ✓':''}</button>`}).join('')}</div>`).join('')}
 ${EF.gist.filter(x=>x!=null).length===g.length?`<button type="button" class="o-btn pri wide" style="margin-top:14px" id="oToTr">Pegue o trecho →</button>`:''}</div>`}
function epTrechoHTML(){const ep=EF.ep,tr=ep.tr[EF.ti],n=ep.tr.length;
 if(EF.tv==='answer')return `<div class="o-card"><span class="o-tag y">Pegue o trecho · ${EF.ti+1} de ${n}</span><p class="o-big">O que ${ep.lines[tr[0]][0]==='E'?'o Erick':esc(ep.guest.name)} disse?</p>
  <p class="o-mut o-sm">Ouça e escreva (ou segure 🎙 e repita). Velocidade real, sem texto.</p>${inputRow('oTrIn','Escreva o que ouviu…')}
  <div class="o-btns"><button type="button" class="o-btn" id="oTrAgain">🔁 Ouvir de novo</button><button type="button" class="o-btn" id="oTrSkip">🤷 Não peguei</button></div></div>`;
 const r=EF.tres[EF.ti],rv=revealHTML(ep.lines[tr[0]][1],r.heard,tr[2]);
 return `<div class="o-card"><span class="o-tag y">Pegue o trecho · ${EF.ti+1} de ${n}</span><div class="o-score"><b>${Math.round(rv.sc.pct*100)}%</b><span class="o-mut">${rv.sc.got} de ${rv.sc.total} palavras</span></div>${rv.html}
  <p class="o-sm o-mut">Você: “${esc(r.heard||'—')}”</p><p class="o-sm o-mut" style="font-style:italic">${esc(tr[1])}</p>${rv.tips}${r.card?'<p class="o-sm o-mut">📌 Virou cartão “ouvido”: volta no aquecimento amanhã, em 3 e em 7 dias.</p>':''}
  <div class="o-btns"><button type="button" class="o-btn" id="oTrAgain">🔁 Ouvir de novo</button><button type="button" class="o-btn" id="oTrSlow">🐢 Mais devagar</button>
  <button type="button" class="o-btn" id="oTrChunk">🎯 Só o trecho</button><button type="button" class="o-btn pri" id="oTrNext">${EF.ti+1>=n?'Ouvir com letra →':'Próximo →'}</button></div></div>`}
function epDoneHTML(){const ep=EF.ep,s=ST.eps[ep.id]||{},rs=EF.tres.filter(Boolean),got=rs.reduce((a,r)=>a+r.got,0),tot=rs.reduce((a,r)=>a+r.total,0);
 const pct=tot?Math.round(got/tot*100):s.pct,gok=EF.gist.filter((a,i)=>a===ep.gist[i][2]).length,cards=rs.filter(r=>r.card).length;
 const sess=EF.ctx==='sessao';
 return `<div class="o-card"><p class="o-big">Episódio concluído 🎧</p><div class="o-score"><b>${pct!=null?pct+'%':'—'}</b><span class="o-mut">das palavras nos trechos</span></div>
  <ul style="padding-left:18px;margin:10px 0"><li>${gok} de 2 perguntas de sentido</li><li>${cards?cards+' trecho(s) viraram cartões de escuta':'nenhum trecho perdido'}</li></ul>
  ${sess?`<p class="o-sm o-mut">Agora a segunda parte da Trilha: foco na forma e pronúncia com os alvos de hoje (${esc(SESSION.alvos)}).</p>
   <div class="o-btns"><button class="o-btn pri full" data-go="d-trail">Continuar a Trilha: exercícios com o Erick →</button></div>`
  :`<div class="o-btns"><button class="o-btn pri full" data-go="foco~${ep.id}">Treino focado: ${esc(ep.foco.t)} →</button><button class="o-btn" data-go="ouvir">Outros episódios</button><button class="o-btn" data-go="home">Hoje</button></div>
   <p class="o-sm o-mut" style="margin-top:10px">Episódio extra: é input livre. Os cartões de escuta entram na sua revisão; Capital vem da sessão diária (regras do Capital).</p>`}</div>`}
function epBind(){
 if($('oPP')){$('oPP').onclick=()=>{PL.playing?plPause():plPlay()};$('oB15').onclick=()=>plSeek(plTime()-15);$('oF15').onclick=()=>plSeek(Math.min(PL.dur-.1,plTime()+15));
  $('oSpd').onclick=()=>{const r=PL.rate===1?1.25:PL.rate===1.25?.75:1;plRate(r);$('oSpd').textContent=r+'×'};
  const sc=$('oScrub');sc.oninput=()=>{sc.__drag=true;sc.style.setProperty('--p',(+sc.value/PL.dur*100).toFixed(1)+'%');$('oNow').textContent=mmss(+sc.value)};sc.onchange=()=>{sc.__drag=false;plSeek(+sc.value)};
  $('oLt').onclick=()=>{EF.letra=!EF.letra;EF.lyc=-2;epShell();epTick()};
  const ly=$('oLyr');if(ly)ly.onclick=e=>{const p=e.target.closest('p[data-i]');if(p){plSeek(PL.lines[+p.dataset.i].start);if(!PL.playing)plPlay()}};epTick()}
 if($('oToGist'))$('oToGist').onclick=()=>{plPause();EF.phase='gist';epStage(1);epShell()};
 EF.box.querySelectorAll('.o-opt').forEach(b=>b.onclick=()=>{EF.gist[+b.dataset.q]=+b.dataset.o;epShell()});
 if($('oToTr'))$('oToTr').onclick=()=>{EF.phase='trecho';EF.ti=0;EF.tv='answer';epStage(2);epShell();trPlay()};
 if(EF.phase==='trecho'){bindInput('oTrIn',v=>trAnswer(v));
  if($('oTrAgain'))$('oTrAgain').onclick=()=>trPlay();if($('oTrSkip'))$('oTrSkip').onclick=()=>trAnswer('');
  if($('oTrSlow'))$('oTrSlow').onclick=()=>trPlay(.75);
  if($('oTrChunk'))$('oTrChunk').onclick=()=>{const tr=EF.ep.tr[EF.ti],r=EF.tres[EF.ti],ms=r.miss.length?r.miss:tr[2].map(c=>({t:c[0]}));const c=ms[EF.chunkI++%ms.length];if(c)say(c.t,EF.ep.lines[tr[0]][0],1,EF.ep)};
  if($('oTrNext'))$('oTrNext').onclick=()=>{EF.ti++;EF.tv='answer';EF.chunkI=0;if(EF.ti>=EF.ep.tr.length){EF.phase='again';EF.letra=true;epStage(3);epShell();plSeek(0);plPlay()}else{epShell();trPlay()}}}
 if($('oFinish'))$('oFinish').onclick=()=>epFinish()}
function trPlay(rate=1){if(!EF.ready)return;stopSay();plSegment(EF.ep.tr[EF.ti][0],rate)}
function trAnswer(v){if(EF.tv!=='answer')return;plPause();stopSay();const ep=EF.ep,tr=ep.tr[EF.ti],target=ep.lines[tr[0]][1],sc=earScore(target,v),ck=earChunks({c:tr[2]},sc.words);
 const miss=ck.filter(c=>c.miss),r={heard:v,got:sc.got,total:sc.total,miss,card:false};
 if(sc.words.some(o=>!o.ok)){cardsSave([{target,said:v||'(nada)',why:miss.map(c=>c.t+' → '+c.snd).join(' · ')||null,pt:tr[1],cat:'ouvido',tag:'ouvido'}]);r.card=true}
 EF.tres[EF.ti]=r;EF.tv='reveal';epShell()}
function epFinish(){plPause();const ep=EF.ep,rs=EF.tres.filter(Boolean),got=rs.reduce((a,r)=>a+r.got,0),tot=rs.reduce((a,r)=>a+r.total,0);
 const s=ST.eps[ep.id]=Object.assign(ST.eps[ep.id]||{},{done:true,stage:4});if(tot)s.pct=Math.round(got/tot*100);
 const info={id:ep.id,gist:EF.gist.filter((a,i)=>a===ep.gist[i][2]).length,pct:tot?Math.round(got/tot*100):null,
   miss:[...new Map(rs.flatMap(r=>r.miss).map(c=>[c.t.toLowerCase(),{t:c.t,snd:c.snd,tip:c.tip}])).values()].slice(0,6),cards:rs.filter(r=>r.card).length};
 const d=today();if(EF.ctx==='sessao')stepDone('ep',info);else{d.extra=d.extra||[];d.extra.push(info)}
 d.phr=ep.tr.map(t=>({en:ep.lines[t[0]][1],pt:t[1]})).concat(ep.foco.items.map(i=>({en:i.en,pt:i.pt})));save();
 EF.phase='done';epShell()}

/* ---- Treino focado de um episódio extra (equação + prompts: 1º erro = pista, 2º = resposta) ---- */
let FO=null;
function openFoco(id){const ep=EPS.find(e=>e.id===id)||sessEp();FO={ep,i:0,tries:0,state:'ask',built:[],res:[],tiles:null};foShell()}
function foShell(){const F=FO,f=F.ep.foco,n=f.items.length,box=$('oFoco');let body='';
 const eq=`<div class="o-card o-pv"><span class="o-tag">ligado ao Ep. ${F.ep.n} · ${esc(F.ep.sub)}</span><p class="o-big">${esc(f.t)}</p><p class="o-mut o-sm">${esc(f.d)}</p>
  <div class="o-eq">${f.eq.map((p,i)=>`${i?'<em>+</em>':''}<span>${esc(p[0])}<small>${esc(p[1])}</small></span>`).join('')}<em>=</em><span class="res">${esc(f.ex)}</span></div></div>`;
 if(F.i>=n){const first=F.res.filter(r=>r.first).length;
  body=eq+`<div class="o-card"><p class="o-big">${first===n?'Perfeito! 💪':'Feito!'}</p><p>${first} de ${n} certas de primeira${first<n?'; as outras você acertou depois da pista, que é como se aprende.':'.'}</p>
   <a class="o-btn pri wide" href="#sophia~ep-${F.ep.id}">Usar na chamada com a Sophia (vídeo) →</a><button class="o-btn wide" style="margin-top:8px" data-go="ouvir">Voltar aos episódios</button></div>`}
 else{const it=f.items[F.i],tilesMode=!!it.x;
  if(tilesMode&&!F.tiles)F.tiles=shuffle(it.en.replace(/[.,?!]/g,'').split(/\s+/).concat(it.x)).map((w,k)=>({w,k,used:false}));
  const fb=F.state==='hint'?`<div class="o-fb hint">💡 Quase. ${esc(it.hint)} Tente de novo.</div>`:F.state==='ok'?`<div class="o-fb ok">✓ Isso! <b>${esc(it.en)}</b></div>`
   :F.state==='ans'?`<div class="o-fb ans">Assim: <b>${esc(it.en)}</b>${revealHTML(it.en,F.last||'',[]).html.replace('class="o-sent"','class="o-sent" style="font-size:16px;margin:6px 0 0"')}</div>`:'';
  const fin=F.state==='ok'||F.state==='ans';
  body=eq+`<div class="o-card"><span class="o-tag">${F.i+1} de ${n} · ${tilesMode?'monte a frase':'diga ou escreva'}</span><p class="o-big">“${esc(it.pt)}”</p>
   ${fin?'':tilesMode?`<div class="o-build" id="oBuild">${F.built.map(k=>`<button type="button" data-k="${k}">${esc(F.tiles[k].w)}</button>`).join('')}</div>
    <div class="o-tiles" id="oTiles">${F.tiles.map(t=>`<button type="button" data-k="${t.k}" ${t.used?'disabled':''}>${esc(t.w)}</button>`).join('')}</div>
    <div class="o-btns"><button type="button" class="o-btn" id="oFoClr">Limpar</button><button type="button" class="o-btn pri" id="oFoChk">Verificar</button></div>`:inputRow('oFoIn','Em inglês…')}
   ${fb}${fin?`<div class="o-btns"><button type="button" class="o-btn" id="oFoHear">🔊 Ouvir</button><button type="button" class="o-btn pri" id="oFoNext">Próxima →</button></div>`:''}</div>`}
 box.innerHTML=body;const it=f.items[F.i];if(!it)return;
 if($('oTiles'))$('oTiles').onclick=e=>{const b=e.target.closest('button[data-k]');if(!b)return;const k=+b.dataset.k;F.tiles[k].used=true;F.built.push(k);F.state='ask';foShell()};
 if($('oBuild'))$('oBuild').onclick=e=>{const b=e.target.closest('button[data-k]');if(!b)return;const k=+b.dataset.k;F.tiles[k].used=false;F.built=F.built.filter(x=>x!==k);foShell()};
 if($('oFoClr'))$('oFoClr').onclick=()=>{F.tiles.forEach(t=>t.used=false);F.built=[];foShell()};
 if($('oFoChk'))$('oFoChk').onclick=()=>foCheck(F.built.map(k=>F.tiles[k].w).join(' '));
 bindInput('oFoIn',v=>foCheck(v));
 if($('oFoHear'))$('oFoHear').onclick=()=>say(it.en);
 if($('oFoNext'))$('oFoNext').onclick=()=>{F.i++;F.tries=0;F.state='ask';F.built=[];F.tiles=null;foShell()}}
function foCheck(v){const F=FO,it=F.ep.foco.items[F.i],sc=earScore(it.en,v),exact=sc.pct>=1&&earTok(v).length===sc.total;F.tries++;F.last=v;
 if(exact){F.state='ok';F.res[F.i]={en:it.en,first:F.tries===1};foShell();say(it.en);return}
 if(F.tries===1){F.state='hint';if(F.tiles){F.tiles.forEach(t=>t.used=false);F.built=[]}foShell();return}
 F.state='ans';F.res[F.i]={en:it.en,first:false};foShell();say(it.en)}

/* ---- Seus cartões reais (revisão espaçada com evocação: escuta → ditado; fala → PT → EN) ---- */
let AQ=null;
function yesterdayPhr(){const ks=Object.keys(ST.days).filter(k=>k<dk()).sort().reverse();for(const k of ks){const p=ST.days[k].phr;if(p&&p.length)return shuffle(p).slice(0,3)}return null}
function openCards(ctx){const due=cardsDue().slice(0,ctx==='sessao'?4:10),q=due.map(c=>({card:c,en:c.target,pt:c.pt,kind:c.tag==='ouvido'||!c.pt?'dict':'prod',why:c.why}));
 if(!q.length){const y=yesterdayPhr();(y||[]).forEach(p=>q.push({en:p.en,pt:p.pt,kind:'prod',src:'ontem'}))}
 AQ={ctx,q,i:0,v:'ask',res:[]};aqShell()}
function aqShell(){const A=AQ,n=A.q.length,box=$('oCards');let body='';const nextBtn=A.ctx==='sessao'?`<button class="o-btn pri wide" data-go="d-ouvir">Continuar: Trilha · episódio do dia →</button><button class="o-btn wide" style="margin-top:8px" data-go="d-warm">Voltar aos cards do aquecimento</button>`:`<button class="o-btn pri wide" data-go="practice">Voltar a Praticar</button>`;
 if(!n)body=`<div class="o-card"><p class="o-big">Nada vencido agora 🎉</p><p class="o-mut">Seus cartões aparecem aqui no dia certo (1, 3 e 7 dias depois). Eles nascem dos trechos que escaparam no episódio e dos erros da conversa com a Sophia.</p>${nextBtn}</div>`;
 else if(A.i>=n){const ok=A.res.filter(r=>r.ok).length;
  body=`<div class="o-card"><p class="o-big">${ok===n?'Aquecido! 🔥':'Pronto, aquecido.'}</p><p>${ok} de ${n} de cabeça.${ok<n?' As outras voltam amanhã: é assim que a memória fixa.':''}</p>${nextBtn}</div>`;
  if(A.ctx==='sessao'&&!isDone('aquec'))stepDone('aquec',{n:A.q.filter(x=>x.card).length,ok,real:true})}
 else{const it=A.q[A.i],tag=it.card?(it.card.tag==='ouvido'?'🎧 cartão de escuta':'🗂️ cartão da conversa'):'↩ frase de ontem';
  if(A.v==='ask')body=`<div class="o-card o-pv"><span class="o-tag">${tag} · ${A.i+1} de ${n}</span>${it.kind==='dict'?`<p class="o-big">Ouça e escreva</p><p class="o-mut o-sm">O Erick fala a frase. Escreva ou repita.</p><button type="button" class="o-btn" id="oAqPlay">🔁 Ouvir</button>`
    :`<p class="o-mut o-sm">Como se diz em inglês?</p><p class="o-big">“${esc(it.pt)}”</p>`}${inputRow('oAqIn','Em inglês…')}<div class="o-btns"><button type="button" class="o-btn full" id="oAqSkip">Não lembro</button></div></div>`;
  else{const r=A.res[A.i],rv=revealHTML(it.en,r.heard,[]);
   body=`<div class="o-card"><span class="o-tag">${tag} · ${A.i+1} de ${n}</span><div class="o-score"><b>${r.ok?'✓':'↻'}</b><span class="o-mut">${r.ok?'Lembrou!':'Quase. Olha como fica:'}</span></div>${rv.html}
    <p class="o-sm o-mut">Você: “${esc(r.heard||'—')}”</p>${it.why&&!r.ok?`<p class="o-sm o-mut">Dica: ${esc(it.why)}</p>`:''}${it.card?`<p class="o-sm o-mut">${r.ok?'📅 Próxima revisão mais para a frente.':'📅 Volta amanhã. Errar não tira Capital.'}</p>`:''}
    <div class="o-btns"><button type="button" class="o-btn" id="oAqHear">🔊 Ouvir</button><button type="button" class="o-btn pri" id="oAqNext">Próxima →</button></div></div>`}}
 box.innerHTML=body;bindInput('oAqIn',v=>aqAnswer(v));const it=A.q[A.i];
 if($('oAqPlay')){$('oAqPlay').onclick=()=>say(it.en);say(it.en)}
 if($('oAqSkip'))$('oAqSkip').onclick=()=>aqAnswer('');if($('oAqHear'))$('oAqHear').onclick=()=>say(it.en);
 if($('oAqNext'))$('oAqNext').onclick=()=>{A.i++;A.v='ask';aqShell()}}
function aqAnswer(v){const A=AQ,it=A.q[A.i],sc=earScore(it.en,v),ok=sc.words.every(o=>o.ok);A.res[A.i]={heard:v,ok};if(it.card)cardResult(it.card.id,ok);A.v='show';aqShell();if(!ok)say(it.en)}
function renderWarmBanner(){const el=$('oWarmReal');if(!el)return;const n=cardsDue().length;
 el.innerHTML=n?`<button class="o-card o-pv" data-go="cartoes~sessao" style="width:100%;text-align:left;cursor:pointer;border-color:var(--ink)"><span class="o-tag y">seus cartões reais</span><b style="display:block;margin-top:6px">${n} ${n===1?'cartão seu vence':'cartões seus vencem'} hoje</b><span class="o-sm o-mut">Dos trechos do Erick e dos erros da conversa com a Sophia. Revise estes primeiro (~${Math.max(1,Math.round(Math.min(4,n)*0.5))} min).</span></button>`:`<p class="o-sm o-mut" style="margin:0 0 8px">Seus cartões reais: nenhum vence hoje. Os cards abaixo são de exemplo. <a href="#cartoes~sessao">ver seus cartões</a></p>`}

/* ---- Fechamento real (Teacher Lili) dentro do D4 ---- */
function renderClose(){const el=$('oReal');if(!el)return;const d=today(),s=d.steps,real=hasReal(d);
 if(!real){el.innerHTML=`<div class="o-card"><span class="o-tag">neste navegador</span><p class="o-sm" style="margin-top:6px">Ainda não há atividade registrada hoje neste aparelho. Abaixo, o fechamento de <b>exemplo</b> (dados fictícios). Faça as etapas e eu troco pelo seu resumo real.</p></div>`;return}
 const good=[],rev=[],ep=EPS.find(e=>s.ep&&e.id===s.ep.id)||sessEp();
 if(s.aquec)good.push(s.aquec.real?`Aquecimento: ${s.aquec.ok} de ${s.aquec.n} cartões seus de cabeça.`:`Aquecimento: ${s.aquec.n||0} cards revisados.`);
 if(s.ep)good.push(`Episódio “${ep.t}”: ${s.ep.gist}/2 perguntas de sentido${s.ep.pct!=null?` e ${s.ep.pct}% das palavras nos trechos`:''}.`);
 if(s.trail)good.push('Exercícios da Trilha com os alvos de hoje.');
 if(s.call)good.push(s.call.real?`Conversou ao vivo com a Sophia: ${s.call.turns} ${s.call.turns===1?'fala':'falas'}${s.call.secs?` em ${Math.max(1,Math.round(s.call.secs/60))} min`:''}.`:'Bate-papo com a Sophia (simulado no protótipo).');
 (s.ep&&s.ep.miss||[]).slice(0,2).forEach(c=>rev.push(`<b>${esc(c.t)}</b> → ${esc(c.snd)} <span class="o-mut">(escuta)</span>`));
 (s.call&&s.call.errs||[]).slice(0,2).forEach(e=>rev.push(`“${esc(e.said)}” → <b>${esc(e.corrected)}</b> <span class="o-mut">(da conversa)</span>`));
 const cap=capitalOf(d),now=Date.now(),cs=cardsGet(),created=cs.filter(c=>c.created>=dayStart()).length,tom=cs.filter(c=>c.step<3&&c.next>now&&c.next<=dayStart()+2*DAY).length;
 const SELF=['Ainda não','Com muita ajuda','Com pouca ajuda','Sozinho(a)'];const sv=d.self;
 const coreOK=isDone('aquec',d)&&isDone('ep',d)&&isDone('trail',d)&&isDone('call',d);
 el.innerHTML=`<div class="o-card o-real o-pv"><span class="o-tag k">Hoje, neste navegador · dados reais</span>
  <div class="o-steps4">${ETAPAS.map(([t,f])=>`<i class="${f(d)?'ok':''}">${f(d)?'✓ ':''}${t}</i>`).join('')}</div>
  <h4>✅ O que deu certo</h4><ul>${good.map(g=>`<li>${esc(g)}</li>`).join('')}</ul>
  <h4 style="margin-top:10px">🔁 Para revisar (${Math.min(3,rev.length)})</h4>${rev.length?`<ul>${rev.slice(0,3).map(r=>`<li>${r}</li>`).join('')}</ul><p class="o-sm o-mut">Já viraram cartões: voltam nos próximos aquecimentos.</p>`:'<p class="o-sm o-mut">Nada pendente do dia.</p>'}
  <h4 style="margin-top:10px">Autoavaliação do can-do</h4><p class="o-sm">De 1 a 4, quanto você consegue agora: <b>${esc(SESSION.cando)}</b>?</p>
  <div class="o-self" id="oSelf">${SELF.map((t,i)=>`<button type="button" data-v="${i+1}" class="${sv===i+1?'on':''}">${i+1}<small>${t}</small></button>`).join('')}</div>
  <h4 style="margin-top:12px">Capital (regras do Capital)</h4>
  ${cap.rows.map(r=>`<div class="rw"><span>${esc(r[0])}</span><b>+${r[1]}</b></div>`).join('')||'<p class="o-sm o-mut">Ainda nenhum.</p>'}
  ${coreOK&&!isDone('lili',d)?'<div class="rw"><span>Sessão diária completa (ao concluir)</span><b>+80</b></div>':''}
  <div class="rw" style="border:none"><span><b>Total de hoje</b> · teto 200</span><b>${cap.total}${coreOK&&!isDone('lili',d)?' → '+Math.min(200,cap.raw+80):''}</b></div>
  <p class="o-sm o-mut">Errar ou usar pista nunca tira Capital. Cartões: ${created} ${created===1?'novo':'novos'} hoje · ${tom} para amanhã.</p></div>`;
 $('oSelf').onclick=e=>{const b=e.target.closest('button[data-v]');if(!b)return;d.self=+b.dataset.v;save();renderClose()}}
function closeSession(){const d=today();if(hasReal(d)||true){stepDone('lili',{self:d.self||null})}const c=capitalOf(today());say_toast(c.total?`Sessão registrada: +${c.total} Capital hoje para a SAP. Até amanhã! — Teacher Lili`:'Até amanhã! — Teacher Lili')}

/* ---- Checkpoint semanal real ---- */
function renderWeek(){const el=$('oWeek');if(!el)return;const mon=new Date();mon.setHours(0,0,0,0);mon.setDate(mon.getDate()-((mon.getDay()+6)%7));const days=[];for(let i=0;i<5;i++){const x=new Date(mon);x.setDate(mon.getDate()+i);days.push(x)}
 const cnt=x=>{const D=ST.days[dk(x)];return D?ETAPAS.filter(([t,f])=>f(D)).length:0};
 const ok=days.filter(x=>cnt(x)>=3).length,pcts=days.map(x=>{const D=ST.days[dk(x)];return D&&D.steps&&D.steps.ep&&D.steps.ep.pct}).filter(x=>x!=null);
 const freq=new Map();days.forEach(x=>{const D=ST.days[dk(x)];(D&&D.steps&&D.steps.ep&&D.steps.ep.miss||[]).forEach(c=>freq.set(c.t,(freq.get(c.t)||0)+1))});const rep=[...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3);
 const wk=ST.weeks[weekKey()];
 el.innerHTML=`<div class="o-card o-real"><span class="o-tag k">Sua semana neste navegador · dados reais</span>
  <div class="o-wk">${days.map((x,i)=>`<i class="${cnt(x)>=3?'ok':''}">${['seg','ter','qua','qui','sex'][i]}</i>`).join('')}</div>
  <p class="o-sm">${ok} de 5 dias com 3+ etapas da sessão.${ok>=4?' Constância excelente.':ok>=2?' Bom ritmo: o ideal são 4 ou 5 dias curtos.':' Semana leve, tudo bem. Na próxima, tente 3 dias, mesmo que só aquecimento e episódio.'}</p>
  ${pcts.length?`<p class="o-sm">Escuta: média de <b>${Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length)}%</b> das palavras nos trechos (${pcts.join('% → ')}%).</p>`:''}
  ${rep.length?`<p class="o-sm">Trechos que mais voltaram: ${rep.map(r=>`<b>${esc(r[0])}</b>`).join(', ')}. Entram na revisão D+7 do checkpoint.</p>`:''}
  ${wk&&wk.done?`<p class="o-sm"><b>✓ Checkpoint desta semana concluído</b> (+60 Capital).</p>`:`<button class="o-btn pri wide" id="oWeekDone" style="margin-top:8px">Concluir checkpoint da semana (+60 Capital)</button>`}</div>`;
 if($('oWeekDone'))$('oWeekDone').onclick=()=>{ST.weeks[weekKey()]={done:true,at:Date.now(),day:dk()};save();renderWeek();say_toast('Checkpoint registrado: +60 Capital. — Teacher Lili')}}

/* ---- Hoje: etapas reais marcadas, Capital real, Liga ---- */
function renderHome(){const d=today(),bl=document.querySelectorAll('#home .today .blocks>div');
 bl.forEach((b,i)=>{const f=ETAPAS[i]&&ETAPAS[i][1](d);b.classList.toggle('o-ok',!!f)});
 const nx=ETAPAS.findIndex(([t,f])=>!f(d)),btn=document.querySelector('#home .today .btn.primary');
 if(btn){const targets=['d-warm','d-ouvir','d-call','d-close'];if(nx<0){btn.innerHTML='✓ Sessão de hoje concluída';btn.dataset.go='d-close'}else if(nx>0){btn.innerHTML=`▶ Continuar: ${ETAPAS[nx][0]}`;btn.dataset.go=targets[nx]}}
 const sub=document.querySelector('#home .today .blocks>div:nth-child(2)');if(sub&&!sub.querySelector('.o-sub'))sub.insertAdjacentHTML('beforeend','<small class="o-sub" style="display:block;font-size:11px;opacity:.85;margin-top:2px">ouvir + exercícios</small>');
 const cap=capitalOf(d).total,wk=capitalWeek();
 document.querySelectorAll('.o-realcap').forEach(e=>e.remove());
 if(hasReal(d)||wk){const t=`neste navegador: +${cap} Capital hoje · ${wk} na semana (real)`;
  const v6=document.querySelector('#home .v6home .trio6');if(v6)v6.insertAdjacentHTML('beforeend',`<span class="tag o-realcap" style="background:var(--ink);color:var(--cream)">${t}</span>`);
  const hm=document.querySelector('#home .homematch .contrib');if(hm)hm.insertAdjacentHTML('beforeend',`<span class="o-realtag o-realcap">+${cap} hoje neste navegador (real)</span>`)}}
function renderLeagues(){document.querySelectorAll('#leagues .o-realcap').forEach(e=>e.remove());const cap=capitalOf().total,wk=capitalWeek();
 const t=[...document.querySelectorAll('#leagues *')].find(e=>e.children.length<4&&/Sua contribuição para a SAP/.test(e.textContent)&&e.closest('.card,.capcard,div'));
 const host=t&&(t.closest('.card,.capcard')||t.parentElement);if(host)host.insertAdjacentHTML('beforeend',`<div class="o-realcap o-sm" style="margin-top:8px;padding:8px 10px;border-radius:3px;background:var(--yellow-l);color:var(--ink)"><b>Neste navegador (real):</b> +${cap} hoje · ${wk} nesta semana. Entra na média da SAP pelas mesmas regras: média por membro ativo, teto 200/dia.</div>`)}

/* ---- Trilha completa Pre-A1 → C1 (currículo v0.1) aplicada à sessão ---- */
const LADDER=[['Pre-A1','Primeiro dia no trabalho','~30–40 h'],['A1.1','Meu trabalho e minha empresa','~30 h'],['A1.2','Minha rotina e minha agenda','~30 h'],['A2.1','Ontem, hoje e amanhã no trabalho','~50 h'],['A2.2','Daily e trocas curtas de trabalho (≈ A2+)','~40–50 h'],['B1.1','Resolver o previsível','~70–90 h'],['B1.2','Lidar com o não rotineiro (≈ B1+)','~80–100 h'],['B2.1','Discutir e negociar na minha área','~80–100 h'],['B2.2','Conduzir reuniões e apresentar (≈ B2+)','~70–100 h'],['C1.1','Precisão, registro e o abstrato','~100 h'],['C1.2','Persuadir e mediar','~100 h']];
function renderTrilha(){const el=$('oTrilha');if(!el)return;const cur=4,se=sessEp(),d=today();
 el.innerHTML=`${rotaHero(true)}<div class="o-card o-pv"><span class="o-tag y">Nível medido · fala A2+ · escuta B1</span><p class="o-big">Sua trilha: do zero (Pre-A1) ao C1</p><p class="o-sm o-mut">11 subníveis do CEFR (Companion Volume 2020). Cada subnível tem unidades com 3–5 can-dos; cada unidade tem ~5 sessões de 25 min. Horas são estimativas, não promessas.</p></div>
 <ol class="o-ladder">${LADDER.map((l,i)=>`<li class="${i<cur?'done':i===cur?'cur':''}"><span class="lc">${l[0]}</span><span><b>${esc(l[1])}</b><span>${i===cur?'você está aqui · Trilha Trabalho':i<cur?'concluído no nivelamento':i===cur+1?'próximo · abre a trilha setorial TI e SAP':''}</span></span><em>${l[2]}</em></li>`).join('')}</ol>
 <div class="o-card"><span class="o-tag k">Unidade atual · A2.2</span><p class="o-big">Daily e update curto: o que fiz, o que vou fazer e o que me bloqueia</p>
  <ul><li>✓ Apresentar-se numa call com o time global</li><li>✓ Abrir um ticket SAP por e-mail</li><li><b>▶ Hoje: dar status numa reunião semanal</b> (Missão 3)</li><li>Responder ao cliente sobre um atraso</li><li>Missão final da unidade + checkpoint</li></ul>
  <p class="o-sm o-mut" style="margin-top:6px">Alvos de hoje: ${esc(SESSION.alvos)} · pronúncia: -ed e sem vogal extra no fim.</p></div>
 <div class="o-card"><h4>A sessão de hoje, bloco a bloco (método)</h4><div class="o-pil">
  <span class="n">1</span><span><b>Aquecimento · Erick</b> · revisão espaçada com evocação, cartões vencidos primeiro <span class="o-mut">(P1, P2)</span></span>
  <span class="n y">2a</span><span><b>Trilha · Ouvir com o Erick</b> · episódio da unidade (input ~95% conhecido), 2 perguntas, pegue o trecho <span class="o-mut">(P4, P9 percepção)</span></span>
  <span class="n y">2b</span><span><b>Trilha · exercícios</b> · foco na forma com pista antes da resposta, ouvir e falar <span class="o-mut">(P7, P6, P9)</span></span>
  <span class="n r">3</span><span><b>Bate-papo · Sophia</b> · tarefa com objetivo; pista primeiro nos alvos, recast no resto <span class="o-mut">(P5, P6)</span></span>
  <span class="n">4</span><span><b>Fechamento · Teacher Lili</b> · autoavaliação 1–4, o que volta amanhã, Capital <span class="o-mut">(P10, motivação)</span></span>
 </div><p class="o-sm o-mut" style="margin-top:8px">Na semana: fala relâmpago 4/3/2 em 2–3 dias (fluência), checkpoint na sexta com a Teacher Lili, e episódios livres no fim de semana.</p>
 <button class="o-btn ink wide" style="margin-top:10px" id="oHow">Como a trilha aplica o método →</button></div>
 <div class="o-card"><h4>Input desta unidade</h4><button class="o-ep" data-go="d-ouvir" style="border:none;padding:4px 0"><span class="o-cv" style="--c:${se.color}"><b>EP ${se.n}</b></span><span class="tx"><b>${esc(se.t)}</b><span>episódio da sessão de hoje${isDone('ep',d)?' · ✓ ouvido hoje':''}</span></span></button>
  <p class="o-sm o-mut">Extras do seu nível: ${EPS.filter(e=>e.sub==='A2.2'&&e.id!==se.id).map(e=>`<a href="#ep~${e.id}">Ep. ${e.n}</a>`).join(' · ')} · <a href="#ouvir">todos os episódios</a></p></div>
 <div class="o-card"><h4>Para subir de subnível (3 evidências)</h4><ul><li>Missões finais com rubrica ≥ 2 de 3 (comunicação, alvos, inteligibilidade)</li><li>Retenção: ≥ 80% em D+7 e ≥ 70% em D+30</li><li>Checkpoint adaptativo acima do ponto de corte</li></ul><p class="o-sm o-mut">Limiares são hipóteses a calibrar no piloto.</p></div>`;
 $('oHow').onclick=openHow}

/* ---- "Como a trilha aplica o método" (METODOLOGIA-NA-TRILHA.md) ---- */
function md(t){const L=t.split('\n');let h='',inl=false,tbl=null;const il=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>').replace(/`([^`]+)`/g,'<code>$1</code>');
 const flush=()=>{if(inl){h+='</ul>';inl=false}if(tbl){h+='<table>'+tbl.map((r,i)=>'<tr>'+r.map(c=>i?`<td>${il(c)}</td>`:`<th>${il(c)}</th>`).join('')+'</tr>').join('')+'</table>';tbl=null}};
 for(const l of L){if(/^\s*\|/.test(l)){if(inl){h+='</ul>';inl=false}const cells=l.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());if(cells.every(c=>/^:?-{2,}:?$/.test(c)))continue;(tbl=tbl||[]).push(cells);continue}
  if(tbl)flush();const m=l.match(/^(#{1,3})\s+(.*)/);if(/^\s*[-*]\s+/.test(l)){if(!inl){h+='<ul>';inl=true}h+='<li>'+il(l.replace(/^\s*[-*]\s+/,''))+'</li>';continue}
  if(inl){h+='</ul>';inl=false}if(m)h+=`<h${m[1].length}>${il(m[2])}</h${m[1].length}>`;else if(l.trim())h+='<p>'+il(l)+'</p>'}flush();return h}
async function openHow(){const sh=$('oSheet');sh.hidden=false;sh.innerHTML='<div class="in"><p>Carregando…</p></div>';
 let t='';try{const r=await fetch('../METODOLOGIA-NA-TRILHA.md?v='+MV);if(!r.ok)throw 0;t=await r.text()}catch(_){t='# Como a trilha aplica o método\nNão foi possível carregar agora.'}
 sh.innerHTML=`<div class="in" role="dialog" aria-label="Como a trilha aplica o método"><div class="md">${md(t)}</div><button type="button" class="o-btn ink wide" id="oHowX" style="margin-top:12px">Fechar</button></div>`;
 $('oHowX').onclick=()=>sh.hidden=true;sh.onclick=e=>{if(e.target===sh)sh.hidden=true}}

/* ---- Bate-papo = chamada de vídeo estilo Teams com a Sophia (o próprio sophia-ao-vivo, embutido em tela cheia) ----
   Sessão: tema e alvos do episódio do dia, from=sessao → ao desligar, grava sophiaRotinaCall e avisa o app (Capital +20, depois Fechamento).
   Praticar/missões: from=pratica. A simulação em balões continua como "modo texto / sem microfone". */
const SOPHIA_V='2026.10.23-voz';
const TOPICS={
 sessao:{t:'Etapa 3 de 4 · Bate-papo',from:'sessao',back:'home',texto:'d-call~texto',next:'d-close',nextT:'Fechamento →'},
 cliente:{t:'Ciclo · 2 Uso · cliente na Alemanha',tema:'telling a client in Germany their order is delayed and proposing a new date',from:'pratica',back:'m-cycle',texto:'m-talk~texto',next:'m-report',nextT:'Relatório →'},
 livre:{t:'Conversa livre com a Sophia',tema:'',from:'pratica',back:'practice',texto:'chat~texto'},
 projeto:{t:'Missão · Apresente seu projeto',tema:'presenting your project in one minute',from:'pratica',back:'practice',texto:'chat~texto'},
 smalltalk:{t:'Missão · Small talk antes da reunião',tema:'small talk before a work meeting',from:'pratica',back:'practice',texto:'chat~texto'},
 prazo:{t:'Missão · Peça mais prazo ao gerente',tema:'asking your manager for more time on a deadline',from:'pratica',back:'practice',texto:'chat~texto'},
 hotel:{t:'Missão · Quarto errado no hotel',tema:'checking in at a hotel and the room is wrong',from:'pratica',back:'practice',texto:'chat~texto'}};
function topicOf(k){if(k&&k.indexOf('ep-')===0){const ep=EPS.find(e=>e.id===k.slice(3));if(ep)return {t:'Chamada · Ep. '+ep.n+' '+ep.t,tema:ep.tema,alvos:ep.alvos||'',from:'pratica',back:'foco~'+ep.id,texto:'chat~texto'}}
 if(k==='sessao'){const ep=sessEp();return Object.assign({},TOPICS.sessao,{tema:ep.tema,alvos:ep.alvos||''})}return TOPICS[k]||TOPICS.livre}
function sophiaSrc(T){return '../sophia-ao-vivo/?v='+SOPHIA_V+(T.tema?'&tema='+encodeURIComponent(T.tema):'')+(T.alvos?'&alvos='+encodeURIComponent(T.alvos):'')+'&from='+T.from}
let SFK=null;
function openSophia(k){k=k||'livre';const T=topicOf(k),box=$('oSFrame');if(!box)return;
 $('oSbT').textContent=T.t;$('oSbX').dataset.go=T.back;$('oSbTxt').setAttribute('href','#'+T.texto);
 const nx=$('oSbNext');nx.hidden=!T.next;if(T.next){nx.dataset.go=T.next;nx.textContent=T.nextT||'Continuar →'}nx.classList.toggle('go',k==='sessao'&&isDone('call'));
 if(SFK!==k||!box.querySelector('iframe')){box.innerHTML=`<iframe src="${sophiaSrc(T)}" title="Chamada de vídeo com a Sophia" allow="microphone; camera; autoplay; fullscreen"></iframe>`;SFK=k}}
function closeSophia(){const box=$('oSFrame');if(box&&box.firstChild){box.innerHTML='';SFK=null}}
addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.type!=='sophia-call-end')return;
 if(checkCall()||isDone('call')){const n=$('oSbNext');if(n&&SFK==='sessao'){n.classList.add('go');say_toast('📞 Chamada registrada (+20 Capital). Toque em “Fechamento →” para fechar com a Teacher Lili.')}}});
function chatBanner(){const sc=document.querySelector('#chat .scroll')||document.querySelector('#chat');if(!sc||sc.querySelector('.o-vbanner'))return;
 sc.insertAdjacentHTML('afterbegin','<a class="o-vbanner" href="#sophia~hotel">📹 Modo texto (sem microfone). Voltar para a chamada de vídeo →</a>')}

/*@@ROTA@@*/

/* ---------- integração com o roteador do v6 ---------- */
let LAST='';
function onShow(id,arg){const prev=LAST;LAST=id;const sh=$('oSheet');if(sh)sh.hidden=true;
 if(!['ep','d-ouvir'].includes(id)){plStop();stopSay();EF=null}
 checkCall();
 /* marcações de etapa ao seguir o fluxo da sessão */
 if(prev==='d-warm'&&(id==='d-ouvir'||id==='d-trail')&&!isDone('aquec')){const n=typeof wi==='number'?wi:0;if(n>0)stepDone('aquec',{n,demo:true})}
 if(prev==='d-trail'&&(id==='d-call'||(id==='sophia'&&arg==='sessao')))stepDone('trail',{});
 if(id!=='sophia')closeSophia();
 if(id==='sophia')openSophia(arg);
 if(id==='chat')chatBanner();
 if(prev==='d-call'&&id==='d-transcript'&&!isDone('call'))stepDone('call',{demo:true});
 if(id==='ouvir')renderList();
 if(id==='ep')openEp(arg||'ep1','extra');
 if(id==='d-ouvir')openEp(SESSION.ep,'sessao');
 if(id==='foco')openFoco(arg);
 if(id==='cartoes')openCards(arg==='sessao'?'sessao':'livre');
 if(id==='d-warm')renderWarmBanner();
 if(id==='d-close')renderClose();
 if(id==='m-checkpoint')renderWeek();
 if(id==='home')renderHome();
 if(id==='leagues')renderLeagues();
 if(id==='trilha')renderTrilha();
 if(id==='rota')renderRota();
 if(id==='home'||id==='profile')rotaChips();
 if(id==='d-close'){const r=$('oReal');if(r&&!r.querySelector('#oCelDemo'))r.insertAdjacentHTML('beforeend','<button type="button" class="o-btn wide" id="oCelDemo" style="margin:8px 0 4px">🎉 Demonstração: “subiu de avenida”</button>');const b=$('oCelDemo');if(b)b.onclick=celebrate}
 const bk=$('oCardsBack');if(bk)bk.dataset.go=arg==='sessao'?'d-warm':'practice'}
function refresh(){onShow(LAST,window.ROUTE_ARG)}
document.addEventListener('click',e=>{if(e.target.closest('#oClose')){closeSession()}if(e.target.closest('[data-how]'))openHow()},true);
window.onShowMerge=onShow;
window.mergeTest={ST,EPS,PL,earScore,cardsGet,today,capitalOf,capitalWeek,SESSION,get EF(){return EF},get AQ(){return AQ},get FO(){return FO}};
if('speechSynthesis'in window)speechSynthesis.getVoices();
})();
