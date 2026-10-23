'use strict';
/* ============ ROTINA DO DIA — São Paulo Languages Academy (demo) ============
   Hoje: Aquecimento (Erick) → Episódio do dia (Ouvir com o Erick) → Treino focado (Erick) → Chamada com a Sophia → Fechamento com a Tia Lili.
   Estado só no localStorage deste navegador. Chaves: só lemos a chave Azure que o usuário já salvou nos ⚙︎ Ajustes do sophia-ao-vivo (mesma origem). */
const APP_V='rotina 2026.10.20';
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>(s||'').toLowerCase().replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
const CFG=(()=>{try{return JSON.parse(localStorage.getItem('sophiaCfg')||'{}')}catch(_){return{}}})();
let toastT=0;function toast(t,ms=2600){const e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>e.hidden=true,ms)}
const mmss=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---- cartões de revisão espaçada: o MESMO armazenamento do sophia-ao-vivo (sophiaCards) ---- */
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

/* ---- pontuação tolerante (copiada do Treino de ouvido do sophia-ao-vivo) ---- */
/*@@SCORING@@*/
function revealHTML(target,heard,chunks){const sc=earScore(target,heard),ck=earChunks({c:chunks||[]},sc.words),ws=sc.words;const NUM='①②③④⑤';let h='',k=0;
 while(k<ws.length){const o=ws[k];
  if(o.ck>=0){let g='';const c=o.ck,cm=ck[c];while(k<ws.length&&ws[k].ck===c){g+=`<span class="w ${ws[k].ok?'ok':'miss'}">${esc(ws[k].w)}</span> `;k++}h+=`<span class="ck${cm.miss?' ckm':''}">${g.trim()}<sup>${NUM[c]||''}</sup></span> `}
  else{h+=`<span class="w ${o.ok?'ok':'miss'}">${esc(o.w)}</span> `;k++}}
 const tips=ck.length?`<ul class="tips">${ck.map(c=>`<li class="${c.miss?'m':''}"><b>${NUM[c.k]||'•'} ${esc(c.t)}</b> → ${esc(c.snd)}${c.tip?`<br><span>${esc(c.tip)}</span>`:''}</li>`).join('')}</ul>`:'';
 return {sc,ck,html:`<p class="sent">${h.trim()}</p>`,tips}}

/* ---- estado do dia ---- */
const ST_KEY='rotinaState';
let ST=(()=>{try{return Object.assign({days:{},eps:{}},JSON.parse(localStorage.getItem(ST_KEY)||'{}'))}catch(_){return{days:{},eps:{}}}})();
const save=()=>{try{localStorage.setItem(ST_KEY,JSON.stringify(ST))}catch(_){}};
const dk=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function today(){const k=dk();ST.days[k]=ST.days[k]||{steps:{}};return ST.days[k]}
const dayStart=()=>{const d=new Date();d.setHours(0,0,0,0);return d.getTime()};
function epOfDay(){const d=today();let e=d.ep&&EPS.find(x=>x.id===d.ep);
 if(!e){e=EPS.find(x=>!(ST.eps[x.id]&&ST.eps[x.id].done))||EPS[new Date().getDate()%EPS.length];d.ep=e.id;save()}return e}
function stepDone(k,data){const d=today();d.steps[k]=Object.assign({},d.steps[k]||{},data||{},{done:true,at:Date.now()});save()}
const isFri=()=>new Date().getDay()===5;
function dayCount(k){const d=ST.days[k];return d?Object.values(d.steps||{}).filter(s=>s&&s.done).length:0}
function streak(){let n=0;const t=new Date();if(dayCount(dk(t))>=3)n++;
 for(let i=1;i<400;i++){const d=new Date(t);d.setDate(t.getDate()-i);const w=d.getDay(),k=dk(d);
  if(dayCount(k)>=3){n++;continue} if(w===0||w===6)continue; break} // fim de semana não quebra a sequência (só episódios opcionais)
 return n}
const STEPS=()=>{const e=epOfDay(),fri=isFri();return [
 {k:'aquec',t:'Aquecimento com o Erick',min:'2 min',who:'erick',sub:()=>{const n=cardsDue().length;return n?`${Math.min(4,n)} cartões vencidos + frases de ontem`:'frases de ontem, de cabeça'},href:'#aquecimento'},
 {k:'ep',t:'Episódio do dia',min:'5 min',who:'erick',sub:()=>`Ouvir com o Erick · Ep. ${e.n} “${e.t}”`,href:'#ep/'+e.id},
 {k:'foco',t:'Treino focado',min:'3–4 min',who:'erick',sub:()=>e.foco.t,href:'#foco'},
 {k:'call',t:'Chamada com a Sophia',min:'5–7 min',who:'sophia',sub:()=>`tema: ${e.temaPt}`,href:'../sophia-ao-vivo/?tema='+encodeURIComponent(e.tema)+'&from=rotina'},
 {k:'lili',t:fri?'Checkpoint semanal com a Tia Lili':'Fechamento com a Tia Lili',min:fri?'4 min':'1–2 min',who:'lili',sub:()=>fri?'balanço honesto da semana':'resumo honesto + o que revisar',href:fri?'#checkpoint':'#lili'}]};
/* volta da chamada: o sophia-ao-vivo grava sophiaRotinaCall ao desligar */
function checkCall(){try{const c=JSON.parse(localStorage.getItem('sophiaRotinaCall')||'null');if(!c||c.at<dayStart())return;const d=today(),s=d.steps.call;
 if(c.turns>=1&&(!s||s.sid!==c.sid||(s.at||0)<c.at)){d.steps.call={done:true,at:c.at,sid:c.sid,turns:c.turns,errs:c.errs||[],tema:c.tema,secs:c.secs};save();
  if(route()[0]==='hoje'){render();toast('📞 Chamada com a Sophia concluída. ✓')}}}catch(_){}}
addEventListener('pageshow',checkCall);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkCall()});

/* ---- voz: Azure TTS (chave do sophia-ao-vivo) com cache; senão a voz do navegador ---- */
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
/* voz do navegador */
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

/* ---- player do episódio: Azure → um WAV com as falas (rate sem mudar o tom); navegador → fala a fala num relógio virtual ---- */
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
  catch(e){console.warn('Azure TTS',e.message);toast('Voz Azure indisponível ('+e.message+'). Usando a voz do navegador.',3500)}}
 const tm=plTiming(ep,ep.lines.map(l=>estDur(l[1])));Object.assign(PL,{mode:'speech',lines:tm.lines,dur:tm.dur,silent:false})}
const plTime=()=>PL.mode==='audio'&&PL.audio?PL.audio.currentTime:PL.t;
function plLineAt(t){let c=-1;PL.lines.forEach((l,i)=>{if(t>=l.start-.05)c=i});return c}
function plLoop(){cancelAnimationFrame(PL.raf);let last=performance.now();
 const f=now=>{if(!PL.playing)return;const dt=Math.min(.1,(now-last)/1000);last=now;
  if(PL.mode==='speech'){const nxt=PL.lines[PL.cur+1];
   if(!(PL.spk&&!PL.silent&&nxt&&PL.t>=nxt.start-.02))PL.t+=dt*PL.rate; // segura o relógio enquanto a fala ainda não terminou
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
function plPause(){PL.playing=false;cancelAnimationFrame(PL.raf);if(PL.mode==='audio')PL.audio.pause();else{PL.tok++;try{speechSynthesis.cancel()}catch(_){}PL.spk=false}PL.onTick&&PL.onTick()}
function plSeek(t){t=Math.max(0,Math.min(PL.dur,t));if(PL.mode==='audio')PL.audio.currentTime=t;else{PL.t=t;PL.cur=-1;PL.tok++;try{speechSynthesis.cancel()}catch(_){}PL.spk=false}PL.onTick&&PL.onTick()}
function plRate(r){PL.rate=r;if(PL.mode==='audio')PL.audio.playbackRate=r}
/* toca só uma fala (Pegue o trecho); "mais devagar" = mesma gravação a 0,75 (Azure) ou fala a 0,75 (navegador) */
function plSegment(i,rate=1){return new Promise(res=>{plPause();const l=PL.lines[i];
 if(PL.mode==='audio'){PL.audio.currentTime=l.start;PL.audio.playbackRate=rate;PL.segEnd=l.end+.05;PL.onSeg=()=>{PL.audio.playbackRate=PL.rate;res()};PL.playing=true;PL.audio.play().catch(res);plLoop()}
 else{const ln=PL.ep.lines[i];bSay(ln[1],ln[0],rate).then(res)}})}

/* ---- microfone (Web Speech, segurar para falar) ---- */
const SRc=window.SpeechRecognition||window.webkitSpeechRecognition;
function micBind(btn,onText,onLive){if(!btn)return;if(!SRc){btn.hidden=true;return}
 let rec=null,acc='',cur='',on=false;
 const mk=()=>{const r=new SRc();r.lang='en-US';r.interimResults=true;r.continuous=!/Android/i.test(navigator.userAgent);
  r.onresult=ev=>{let f='',i='';for(let k=ev.resultIndex;k<ev.results.length;k++){const x=ev.results[k];if(x.isFinal)f+=x[0].transcript+' ';else i+=x[0].transcript}if(f)acc=(acc+' '+f).trim();cur=i;onLive&&onLive((acc+' '+cur).trim())};
  r.onerror=ev=>{const m={'not-allowed':'Microfone bloqueado: toque no cadeado 🔒 ao lado do endereço → Permissões → Microfone.','service-not-allowed':'Microfone bloqueado: toque no cadeado 🔒 → Permissões → Microfone.','audio-capture':'Não consegui usar o microfone. Feche outros apps que usam o microfone.','network':'O reconhecimento de voz precisa de internet.'}[ev.error];if(m)toast(m,5000)};
  r.onend=()=>{if(on){try{r.start()}catch(_){}return}const t=(acc+' '+cur).trim();rec=null;if(t)onText(t)};return r};
 btn.addEventListener('pointerdown',e=>{e.preventDefault();if(on)return;on=true;acc='';cur='';btn.classList.add('held');try{btn.setPointerCapture(e.pointerId)}catch(_){}stopSay();rec=mk();try{rec.start()}catch(_){}});
 const up=()=>{if(!on)return;on=false;btn.classList.remove('held');try{rec&&rec.stop()}catch(_){}};
 btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);['contextmenu','selectstart'].forEach(t=>btn.addEventListener(t,e=>e.preventDefault()))}
const inputRow=(id,ph)=>`<form class="inrow" id="${id}F"><input id="${id}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" placeholder="${ph}"><button type="button" class="mic" id="${id}M" aria-label="Segure para falar">🎙</button><button class="btn pri" type="submit">OK</button></form><p class="live" id="${id}L"></p>`;
function bindInput(id,fn){const f=$(id+'F');if(!f)return;f.onsubmit=e=>{e.preventDefault();const v=$(id).value.trim();if(v)fn(v)};micBind($(id+'M'),t=>{$(id).value=t;fn(t)},t=>{$(id+'L').textContent=t})}

/* ================= TELAS ================= */
const route=()=>(location.hash||'#hoje').slice(1).split('/');
addEventListener('hashchange',render);
function render(){plStop();stopSay();const sh=$('sheet');if(sh)sh.hidden=true;document.body.classList.remove('pod');window.scrollTo(0,0);const r=route();
 if(r[0]==='ouvir')return viewList();if(r[0]==='ep')return viewEp(r[1]);if(r[0]==='aquecimento')return viewAquec(r[1]);
 if(r[0]==='foco')return viewFoco(r[1]);if(r[0]==='lili')return viewLili(false);if(r[0]==='checkpoint')return viewLili(true);return viewHoje()}
const AV=w=>w==='lili'?'<div class="av lili">TL</div>':`<div class="av ${w}"></div>`;
function ring(p){const r=30,c=2*Math.PI*r;return `<svg class="ring" viewBox="0 0 74 74" aria-hidden="true"><circle cx="37" cy="37" r="${r}" fill="none" stroke="#ffffff1a" stroke-width="8"/>
 <circle cx="37" cy="37" r="${r}" fill="none" stroke="#1ED760" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(c*p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 37 37)"/>
 <text x="37" y="42" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${Math.round(p*100)}%</text></svg>`}
function viewHoje(){checkCallSilent();const d=today(),S=STEPS(),done=S.filter(s=>d.steps[s.k]&&d.steps[s.k].done).length,nx=S.find(s=>!(d.steps[s.k]&&d.steps[s.k].done));
 const dt=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}),st=streak(),due=cardsDue().length;
 $('app').innerHTML=`<header class="top"><div><p class="date">${esc(dt)}</p><h1>Hoje</h1></div><div class="streak" title="Dias seguidos com 3+ etapas (fim de semana não quebra)">🔥 <b>${st}</b><span>${st===1?'dia':'dias'}</span></div></header>
 <section class="hero">${ring(done/S.length)}<div><b>${done===S.length?'Rotina completa! 🎉':done?`${done} de ${S.length} etapas`:'Sua rotina de hoje'}</b>
  <p>${done===S.length?'Até amanhã. Se quiser mais, tem extras aí embaixo.':'~18 min no total, sem pressa: dá para parar e voltar quando quiser.'}</p></div></section>
 <ol class="steps">${S.map((s,i)=>{const ok=d.steps[s.k]&&d.steps[s.k].done,isN=s===nx;
  return `<li><a class="step ${s.who}${ok?' done':''}${isN?' next':''}" href="${s.href}" data-step="${s.k}"><span class="chk">${ok?'✓':i+1}</span>${AV(s.who)}
   <span class="tx"><b>${esc(s.t)}</b><span>${esc(s.sub())}</span></span><span class="min">${s.min}<span class="go">${s.k==='call'?'Ligar':'Começar'}</span></span></a></li>`}).join('')}</ol>
 <h3>Extras (opcional)</h3>
 <div class="extras"><a class="tile" href="#ouvir"><i>🎧</i><b>Mais episódios</b><span>Ouvir com o Erick</span></a>
  <a class="tile" href="../sophia-ao-vivo/"><i>💬</i><b>Conversa livre</b><span>com a Sophia, sem tema</span></a>
  <a class="tile" href="#aquecimento/cartoes"><i>🗂️</i><b>Revisar cartões</b><span>${due?due+' vencidos agora':'nenhum vencido agora'}</span></a>
  <a class="tile" href="#checkpoint"><i>📊</i><b>Checkpoint da semana</b><span>com a Tia Lili${isFri()?' · hoje!':' · sexta'}</span></a></div>
 <footer><button type="button" id="howBtn">Como funciona</button> · <span class="ver">${APP_V}</span></footer>`;
 $('howBtn').onclick=openHow}
function checkCallSilent(){try{const c=JSON.parse(localStorage.getItem('sophiaRotinaCall')||'null');if(!c||c.at<dayStart()||c.turns<1)return;const d=today(),s=d.steps.call;
 if(!s||s.sid!==c.sid||(s.at||0)<c.at){d.steps.call={done:true,at:c.at,sid:c.sid,turns:c.turns,errs:c.errs||[],tema:c.tema,secs:c.secs};save()}}catch(_){}}

/* ---------- Ouvir com o Erick: lista ---------- */
function epDur(e){const s=ST.eps[e.id];return s&&s.dur?s.dur:Math.round(plTiming(e,e.lines.map(l=>estDur(l[1]))).dur)}
const epProg=e=>{const s=ST.eps[e.id]||{};return s.done?1:(s.stage||0)/4};
function viewList(){document.body.classList.add('pod');const de=epOfDay();
 $('app').innerHTML=`<section class="podhero"><div class="hd" style="margin:0"><a class="back" href="#hoje" aria-label="Voltar">‹</a><div class="tt"><b>Podcast</b></div></div>
  <div class="art" role="img" aria-label="Capa: Erick no estúdio"></div><h1>Ouvir com o Erick</h1><p>Inglês do trabalho em velocidade real. Episódios de 1 a 2 min, com perguntas, “pegue o trecho” e letra.</p>
  <div class="playday"><a class="pbtn" href="#ep/${de.id}" aria-label="Tocar o episódio do dia">▶</a><div><b>Episódio do dia</b><p style="margin:2px 0 0">Ep. ${de.n} · ${esc(de.t)}</p></div></div></section>
 <ul class="eps">${EPS.map(e=>`<li><a class="ep" href="#ep/${e.id}" style="--c:${e.color}"><div class="cover"><b>EP ${e.n}</b></div><div class="tx"><b>${esc(e.t)}</b>
  <span>${e.guest?'Erick & '+esc(e.guest.name):'Erick, solo'} · ${mmss(epDur(e))}${ST.eps[e.id]&&ST.eps[e.id].done?' · ✓ ouvido':''}</span>
  <div class="chips"><i class="lv">${e.lv}</i>${e.th.map(t=>`<i>${esc(t)}</i>`).join('')}</div><div class="bar"><i style="width:${Math.round(epProg(e)*100)}%"></i></div></div></a></li>`).join('')}</ul>
 <footer><button type="button" id="howBtn">Como funciona</button> · <span class="ver">${APP_V}</span></footer>`;$('howBtn').onclick=openHow}

/* ---------- Episódio: 1) ouvir sem texto → 2) 2 perguntas → 3) pegue o trecho → 4) ouvir com letra ---------- */
let EF=null;
function viewEp(id){document.body.classList.add('pod');const ep=EPS.find(e=>e.id===id)||epOfDay();const s=ST.eps[ep.id]||{};
 EF={ep,phase:s.done?'again':'listen',letra:!!s.done,gist:[],ti:0,tv:'answer',tres:[],ready:false,heardOnce:false,chunkI:0,maxT:0};
 epShell();PL.onTick=epTick;PL.onEnd=()=>{EF.heardOnce=true;epTick(true)};
 plPrepare(ep,(a,b)=>{const p=$('prep');if(p)p.textContent=`Preparando o áudio… ${a}/${b}`}).then(()=>{if(!EF||EF.ep!==ep)return;EF.ready=true;epShell()})}
const PH=['listen','gist','trecho','again','done'];
function epStage(n){const s=ST.eps[EF.ep.id]=ST.eps[EF.ep.id]||{};s.stage=Math.max(s.stage||0,n);save()}
function epShell(){const ep=EF.ep,ph=EF.phase,pi=PH.indexOf(ph);
 const stp=['Ouvir','Perguntas','Pegue o trecho','Com letra'].map((t,i)=>`<i class="${i===Math.min(pi,3)&&ph!=='done'?'on':i<pi?'ok':''}">${i<pi?'✓ ':''}${t}</i>`).join('');
 let body='';
 if(ph==='listen'||ph==='again')body=epPlayerHTML();
 else if(ph==='gist')body=epGistHTML();else if(ph==='trecho')body=epTrechoHTML();else body=epDoneHTML();
 $('app').innerHTML=`<div class="player" style="--c:${ep.color}"><div class="phd"><a href="#ouvir" aria-label="Voltar">⌄</a><div class="c"><small>Ouvir com o Erick</small><b>Ep. ${ep.n} · ${ep.lv}</b></div><a href="#hoje" aria-label="Hoje" style="font-size:15px">⌂</a></div>
  <div class="stp">${stp}</div>${body}</div>`;
 epBind()}
function epPlayerHTML(){const ep=EF.ep,first=EF.phase==='listen';
 return `${EF.letra?`<div class="lyr" id="lyr">${ep.lines.map((l,i)=>`<p data-i="${i}"><small>${l[0]==='E'?'Erick':esc(ep.guest.name)}</small>${esc(l[1])}</p>`).join('')}</div>`:`<div class="bigart"><b>EP ${ep.n} · ${esc(ep.en.toUpperCase())}</b></div>`}
 <div class="ti"><b>${esc(ep.t)}</b><span>${ep.guest?'Erick & '+esc(ep.guest.name):'Erick'} · ${ep.th.join(' · ')}</span></div>
 ${EF.ready?`<input type="range" class="scrub" id="scrub" min="0" max="${PL.dur.toFixed(1)}" step="0.1" value="${plTime().toFixed(1)}" aria-label="Posição"><div class="tm"><span id="tNow">${mmss(plTime())}</span><span>${mmss(PL.dur)}</span></div>
 <div class="ctl"><button type="button" id="spd" aria-label="Velocidade">${PL.rate}×</button><button type="button" id="b15" aria-label="Voltar 15 segundos">↺15</button><button type="button" class="pp" id="pp" aria-label="Tocar">${PL.playing?'❚❚':'▶'}</button>
  <button type="button" class="lt${EF.letra?' on':''}" id="lt" ${first?'disabled':''} aria-pressed="${EF.letra}">${first?'🔒 ':''}Letra</button></div>
 ${first?`<p class="prep">${EF.heardOnce?'':'1ª escuta sem texto — tente pegar a ideia geral. A letra libera depois.'}</p><button type="button" class="btn ${EF.heardOnce?'pri':''} wide" id="toGist">${EF.heardOnce?'Responder 2 perguntas →':'Já ouvi → perguntas'}</button>`
  :`<button type="button" class="btn pri wide" id="finish">Concluir episódio ✓</button>`}`
 :`<p class="prep" id="prep">${azOK()?'Preparando o áudio…':'Preparando…'}</p>`}`}
function epTick(ended){if(!EF||!EF.ready)return;const t=plTime(),sc=$('scrub');if(!sc)return;if(!sc.__drag)sc.value=t.toFixed(1);$('tNow').textContent=mmss(t);$('pp').textContent=PL.playing?'❚❚':'▶';
 EF.maxT=Math.max(EF.maxT,t);if(EF.phase==='listen'&&!EF.heardOnce&&(ended===true||EF.maxT>=PL.dur*.92)){EF.heardOnce=true;epShell();return}
 const ly=$('lyr');if(ly){const c=plLineAt(t);ly.querySelectorAll('p').forEach((p,i)=>{p.className=i===c?'on':i<c?'past':''});
  if(c!==EF.lyc){EF.lyc=c;const p=ly.querySelector(`p[data-i="${c}"]`);if(p)ly.scrollTop=p.offsetTop-ly.clientHeight*.35}}}
function epGistHTML(){const g=EF.ep.gist;return `<div class="pcard"><p class="big">Pegou a ideia geral?</p><p class="mut small">Sem pressão: é só para conferir o sentido.</p>
 ${g.map((q,qi)=>`<div style="margin-top:14px"><b>${qi+1}. ${esc(q[0])}</b>${q[1].map((o,oi)=>{const a=EF.gist[qi];const cls=a==null?'':oi===q[2]?'ok':oi===a?'bad':'';return `<button type="button" class="opt ${cls}" data-q="${qi}" data-o="${oi}" ${a!=null?'disabled':''}>${esc(o)}${a!=null&&oi===q[2]?' ✓':''}</button>`}).join('')}</div>`).join('')}
 ${EF.gist.filter(x=>x!=null).length===g.length?`<button type="button" class="btn pri wide" style="margin-top:14px" id="toTr">Pegue o trecho →</button>`:''}</div>`}
function epTrechoHTML(){const ep=EF.ep,tr=ep.tr[EF.ti],n=ep.tr.length;
 if(EF.tv==='answer')return `<div class="pcard"><span class="tag">Pegue o trecho · ${EF.ti+1} de ${n}</span><p class="big">O que ${ep.lines[tr[0]][0]==='E'?'o Erick':esc(ep.guest.name)} disse?</p>
  <p class="mut small">Ouça e escreva (ou segure 🎙 e repita). Velocidade real, sem texto.</p>${inputRow('trIn','Escreva o que ouviu…')}
  <div class="btns"><button type="button" class="btn" id="trAgain">🔁 Ouvir de novo</button><button type="button" class="btn" id="trSkip">🤷 Não peguei</button></div></div>`;
 const r=EF.tres[EF.ti],rv=revealHTML(ep.lines[tr[0]][1],r.heard,tr[2]);
 return `<div class="pcard"><span class="tag">Pegue o trecho · ${EF.ti+1} de ${n}</span><div class="score"><b>${Math.round(rv.sc.pct*100)}%</b><span class="mut">${rv.sc.got} de ${rv.sc.total} palavras</span></div>${rv.html}
  <p class="small mut">Você: “${esc(r.heard||'—')}”</p><p class="small mut" style="font-style:italic">${esc(tr[1])}</p>${rv.tips}${r.card?'<p class="small mut">📌 Virou cartão “ouvido” (amanhã, em 3 e em 7 dias).</p>':''}
  <div class="btns"><button type="button" class="btn" id="trAgain">🔁 Ouvir de novo</button><button type="button" class="btn" id="trSlow">🐢 Mais devagar</button>
  <button type="button" class="btn" id="trChunk">🎯 Só o trecho</button><button type="button" class="btn pri" id="trNext">${EF.ti+1>=n?'Ouvir com letra →':'Próximo →'}</button></div></div>`}
function epDoneHTML(){const ep=EF.ep,s=ST.eps[ep.id]||{},rs=EF.tres.filter(Boolean),got=rs.reduce((a,r)=>a+r.got,0),tot=rs.reduce((a,r)=>a+r.total,0);
 const pct=tot?Math.round(got/tot*100):s.pct,gok=EF.gist.filter((a,i)=>a===ep.gist[i][2]).length,cards=rs.filter(r=>r.card).length;
 return `<div class="pcard"><p class="big">Episódio concluído 🎧</p><div class="score"><b>${pct!=null?pct+'%':'—'}</b><span class="mut">das palavras nos trechos</span></div>
  <ul style="padding-left:18px;margin:10px 0"><li>${gok} de 2 perguntas de sentido</li><li>${cards?cards+' trecho(s) viraram cartões de revisão':'nenhum trecho perdido'}</li></ul>
  <div class="btns"><a class="btn pri full" href="#foco/${ep.id}">Treino focado: ${esc(ep.foco.t)} →</a><a class="btn" href="#hoje">Voltar para Hoje</a><a class="btn" href="#ouvir">Outros episódios</a></div></div>`}
function epBind(){const q=s=>document.querySelector(s);
 if($('pp')){$('pp').onclick=()=>{PL.playing?plPause():plPlay()};$('b15').onclick=()=>plSeek(plTime()-15);
  $('spd').onclick=()=>{const r=PL.rate===1?1.25:PL.rate===1.25?.75:1;plRate(r);$('spd').textContent=r+'×'};
  const sc=$('scrub');sc.oninput=()=>{sc.__drag=true;$('tNow').textContent=mmss(+sc.value)};sc.onchange=()=>{sc.__drag=false;plSeek(+sc.value)};
  $('lt').onclick=()=>{EF.letra=!EF.letra;EF.lyc=-2;epShell();epTick()};
  const ly=$('lyr');if(ly)ly.onclick=e=>{const p=e.target.closest('p[data-i]');if(p){plSeek(PL.lines[+p.dataset.i].start);if(!PL.playing)plPlay()}};epTick()}
 if($('toGist'))$('toGist').onclick=()=>{plPause();EF.phase='gist';epStage(1);epShell()};
 document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{EF.gist[+b.dataset.q]=+b.dataset.o;epShell()});
 if($('toTr'))$('toTr').onclick=()=>{EF.phase='trecho';EF.ti=0;EF.tv='answer';epStage(2);epShell();trPlay()};
 if(EF.phase==='trecho'){bindInput('trIn',v=>trAnswer(v));
  if($('trAgain'))$('trAgain').onclick=()=>trPlay();if($('trSkip'))$('trSkip').onclick=()=>trAnswer('');
  if($('trSlow'))$('trSlow').onclick=()=>trPlay(.75);
  if($('trChunk'))$('trChunk').onclick=()=>{const tr=EF.ep.tr[EF.ti],r=EF.tres[EF.ti],ms=r.miss.length?r.miss:tr[2].map(c=>({t:c[0]}));const c=ms[EF.chunkI++%ms.length];if(c)say(c.t,EF.ep.lines[tr[0]][0],1,EF.ep)};
  if($('trNext'))$('trNext').onclick=()=>{EF.ti++;EF.tv='answer';EF.chunkI=0;if(EF.ti>=EF.ep.tr.length){EF.phase='again';EF.letra=true;epStage(3);epShell();plSeek(0);plPlay()}else{epShell();trPlay()}}}
 if($('finish'))$('finish').onclick=()=>epFinish()}
function trPlay(rate=1){if(!EF.ready)return;stopSay();plSegment(EF.ep.tr[EF.ti][0],rate)}
function trAnswer(v){if(EF.tv!=='answer')return;plPause();stopSay();const ep=EF.ep,tr=ep.tr[EF.ti],target=ep.lines[tr[0]][1],sc=earScore(target,v),ck=earChunks({c:tr[2]},sc.words);
 const miss=ck.filter(c=>c.miss),r={heard:v,got:sc.got,total:sc.total,miss,card:false};
 if(sc.words.some(o=>!o.ok)){cardsSave([{target,said:v||'(nada)',why:miss.map(c=>c.t+' → '+c.snd).join(' · ')||null,pt:tr[1],cat:'ouvido',tag:'ouvido'}]);r.card=true}
 EF.tres[EF.ti]=r;EF.tv='reveal';epShell()}
function epFinish(){plPause();const ep=EF.ep,rs=EF.tres.filter(Boolean),got=rs.reduce((a,r)=>a+r.got,0),tot=rs.reduce((a,r)=>a+r.total,0);
 const s=ST.eps[ep.id]=Object.assign(ST.eps[ep.id]||{},{done:true,stage:4});if(tot)s.pct=Math.round(got/tot*100);
 const d=today();if(!(d.steps.ep&&d.steps.ep.done)){stepDone('ep',{id:ep.id,gist:EF.gist.filter((a,i)=>a===ep.gist[i][2]).length,pct:tot?Math.round(got/tot*100):null,
   miss:[...new Map(rs.flatMap(r=>r.miss).map(c=>[c.t.toLowerCase(),{t:c.t,snd:c.snd,tip:c.tip}])).values()].slice(0,6),cards:rs.filter(r=>r.card).length})}
 d.phr=ep.tr.map(t=>({en:ep.lines[t[0]][1],pt:t[1]})).concat(ep.foco.items.map(i=>({en:i.en,pt:i.pt})));save();
 EF.phase='done';epShell()}

/* ---------- Aquecimento: recuperação rápida (cartões vencidos primeiro, depois frases de ontem) ---------- */
let AQ=null;
function yesterdayPhr(){const ks=Object.keys(ST.days).filter(k=>k<dk()).sort().reverse();for(const k of ks){const p=ST.days[k].phr;if(p&&p.length)return shuffle(p).slice(0,3)}return null}
function viewAquec(mode){const all=mode==='cartoes',due=cardsDue().slice(0,all?10:4),q=due.map(c=>({card:c,en:c.target,pt:c.pt,kind:c.tag==='ouvido'||!c.pt?'dict':'prod',why:c.why}));
 if(!all&&q.length<3){const y=yesterdayPhr();(y||STARTER).slice(0,3-q.length+(q.length?0:0)).forEach(p=>q.push({en:p.en,pt:p.pt,kind:'prod',src:y?'ontem':'início'}))}
 AQ={all,q,i:0,v:'ask',res:[]};aqShell()}
function aqShell(){const A=AQ,n=A.q.length;let body='';
 if(!n)body=`<div class="card"><p class="big">Nada vencido agora 🎉</p><p class="mut">Seus cartões aparecem aqui no dia certo (1, 3 e 7 dias depois).</p><a class="btn wide" href="#hoje">Voltar</a></div>`;
 else if(A.i>=n){const ok=A.res.filter(r=>r.ok).length;
  body=`<div class="card"><p class="big">${ok===n?'Aquecido! 🔥':'Pronto, aquecido.'}</p><p>${ok} de ${n} de cabeça.${ok<n?' As outras voltam amanhã — normal, é assim que a memória fixa.':''}</p>
   <a class="btn pri wide" href="${A.all?'#hoje':'#ep/'+epOfDay().id}">${A.all?'Voltar para Hoje':'Episódio do dia →'}</a></div>`}
 else{const it=A.q[A.i],tag=it.card?(it.card.tag==='ouvido'?'🎧 cartão de escuta':'🗂️ cartão de revisão'):it.src==='ontem'?'↩ frase de ontem':'👋 aquecimento';
  if(A.v==='ask')body=`<div class="card"><span class="tag">${tag} · ${A.i+1} de ${n}</span>${it.kind==='dict'?`<p class="big">Ouça e escreva</p><p class="mut small">O Erick fala a frase. Escreva ou repita.</p><button type="button" class="btn" id="aqPlay">🔁 Ouvir</button>`
    :`<p class="mut small">Como se diz em inglês?</p><p class="big">“${esc(it.pt)}”</p>`}${inputRow('aqIn','Em inglês…')}<div class="btns"><button type="button" class="btn full" id="aqSkip">Não lembro</button></div></div>`;
  else{const r=A.res[A.i],rv=revealHTML(it.en,r.heard,[]);
   body=`<div class="card"><span class="tag">${tag} · ${A.i+1} de ${n}</span><div class="score"><b>${r.ok?'✓':'↻'}</b><span class="mut">${r.ok?'Lembrou!':'Quase — olha como fica:'}</span></div>${rv.html}
    <p class="small mut">Você: “${esc(r.heard||'—')}”</p>${it.why&&!r.ok?`<p class="small mut">Dica: ${esc(it.why)}</p>`:''}${it.card?`<p class="small mut">${r.ok?'📅 Próxima revisão mais para frente.':'📅 Volta amanhã.'}</p>`:''}
    <div class="btns"><button type="button" class="btn" id="aqHear">🔊 Ouvir</button><button type="button" class="btn pri" id="aqNext">Próxima →</button></div></div>`}}
 $('app').innerHTML=`<div class="hd"><a class="back" href="#hoje" aria-label="Voltar">‹</a>${AV('erick')}<div class="tt"><b>${AQ.all?'Revisar cartões':'Aquecimento com o Erick'}</b><span>${AQ.all?'cartões vencidos':'2 min · recuperação rápida'}</span></div></div>${body}`;
 bindInput('aqIn',v=>aqAnswer(v));const it=A.q[A.i];
 if($('aqPlay')){$('aqPlay').onclick=()=>say(it.en);say(it.en)}
 if($('aqSkip'))$('aqSkip').onclick=()=>aqAnswer('');if($('aqHear'))$('aqHear').onclick=()=>say(it.en);
 if($('aqNext'))$('aqNext').onclick=()=>{A.i++;A.v='ask';aqShell()};
 if(A.i>=n&&n&&!A.all&&!(today().steps.aquec&&today().steps.aquec.done))stepDone('aquec',{n,ok:A.res.filter(r=>r.ok).length})}
function aqAnswer(v){const A=AQ,it=A.q[A.i],sc=earScore(it.en,v),ok=sc.words.every(o=>o.ok);A.res[A.i]={heard:v,ok};if(it.card)cardResult(it.card.id,ok);A.v='show';aqShell();if(!ok)say(it.en)}

/* ---------- Treino focado: uma estrutura do episódio, como equação; prompts (dica antes da resposta) ---------- */
let FO=null;
function viewFoco(id){const ep=EPS.find(e=>e.id===id)||epOfDay();FO={ep,i:0,tries:0,state:'ask',built:[],res:[],tiles:null};foShell()}
function foShell(){const F=FO,f=F.ep.foco,n=f.items.length;let body='';
 const eq=`<div class="card"><span class="tag">ligado ao Ep. ${F.ep.n}</span><p class="big">${esc(f.t)}</p><p class="mut small">${esc(f.d)}</p>
  <div class="eq">${f.eq.map((p,i)=>`${i?'<em>+</em>':''}<span>${esc(p[0])}<small>${esc(p[1])}</small></span>`).join('')}<em>=</em><span>${esc(f.ex)}</span></div></div>`;
 if(F.i>=n){const first=F.res.filter(r=>r.first).length;
  body=eq+`<div class="card"><p class="big">${first===n?'Perfeito! 💪':'Feito!'}</p><p>${first} de ${n} certas de primeira${first<n?'; as outras você acertou com a dica — é assim que se aprende.':'.'}</p><a class="btn sophia wide" href="${STEPS()[3].href}">Agora use na chamada com a Sophia →</a><a class="btn wide" style="margin-top:8px" href="#hoje">Voltar para Hoje</a></div>`;
  if(!(today().steps.foco&&today().steps.foco.done))stepDone('foco',{n,first,t:f.t,miss:F.res.filter(r=>!r.first).map(r=>r.en)})}
 else{const it=f.items[F.i],tilesMode=!!it.x;
  if(tilesMode&&!F.tiles)F.tiles=shuffle(it.en.replace(/[.,?!]/g,'').split(/\s+/).concat(it.x)).map((w,k)=>({w,k,used:false}));
  const fb=F.state==='hint'?`<div class="fb hint">💡 Quase. ${esc(it.hint)} Tente de novo.</div>`:F.state==='ok'?`<div class="fb ok">✓ Isso! <b>${esc(it.en)}</b></div>`
   :F.state==='ans'?`<div class="fb ans">Assim: <b>${esc(it.en)}</b><br><span class="small">${revealHTML(it.en,F.last||'',[]).html.replace('class="sent"','class="sent" style="font-size:16px;margin:6px 0 0"')}</span></div>`:'';
  body=eq+`<div class="card"><span class="tag">${F.i+1} de ${n} · ${tilesMode?'monte a frase':'diga ou escreva'}</span><p class="big">“${esc(it.pt)}”</p>
   ${F.state==='ok'||F.state==='ans'?'':tilesMode?`<div class="build" id="build">${F.built.map(k=>`<button type="button" data-k="${k}">${esc(F.tiles[k].w)}</button>`).join('')}</div>
    <div class="tiles" id="tiles">${F.tiles.map(t=>`<button type="button" data-k="${t.k}" ${t.used?'disabled':''}>${esc(t.w)}</button>`).join('')}</div>
    <div class="btns"><button type="button" class="btn" id="foClr">Limpar</button><button type="button" class="btn pri" id="foChk">Verificar</button></div>`:inputRow('foIn','Em inglês…')}
   ${fb}${F.state==='ok'||F.state==='ans'?`<div class="btns"><button type="button" class="btn" id="foHear">🔊 Ouvir</button><button type="button" class="btn pri" id="foNext">Próxima →</button></div>`:''}</div>`}
 $('app').innerHTML=`<div class="hd"><a class="back" href="#hoje" aria-label="Voltar">‹</a>${AV('erick')}<div class="tt"><b>Treino focado com o Erick</b><span>3–4 min · ${esc(f.t)}</span></div></div>${body}`;
 const it=f.items[F.i];if(!it)return;
 if($('tiles'))$('tiles').onclick=e=>{const b=e.target.closest('button[data-k]');if(!b)return;const k=+b.dataset.k;F.tiles[k].used=true;F.built.push(k);F.state='ask';foShell()};
 if($('build'))$('build').onclick=e=>{const b=e.target.closest('button[data-k]');if(!b)return;const k=+b.dataset.k;F.tiles[k].used=false;F.built=F.built.filter(x=>x!==k);foShell()};
 if($('foClr'))$('foClr').onclick=()=>{F.tiles.forEach(t=>t.used=false);F.built=[];foShell()};
 if($('foChk'))$('foChk').onclick=()=>foCheck(F.built.map(k=>F.tiles[k].w).join(' '));
 bindInput('foIn',v=>foCheck(v));
 if($('foHear'))$('foHear').onclick=()=>say(it.en);
 if($('foNext'))$('foNext').onclick=()=>{F.i++;F.tries=0;F.state='ask';F.built=[];F.tiles=null;foShell()}}
function foCheck(v){const F=FO,it=F.ep.foco.items[F.i],sc=earScore(it.en,v),exact=sc.pct>=1&&earTok(v).length===sc.total;F.tries++;F.last=v;
 if(exact){F.state='ok';F.res[F.i]={en:it.en,first:F.tries===1};foShell();say(it.en);return}
 if(F.tries===1){F.state='hint';if(F.tiles){F.tiles.forEach(t=>t.used=false);F.built=[]}foShell();return} // 1º erro: prompt (dica), sem dar a resposta
 F.state='ans';F.res[F.i]={en:it.en,first:false};foShell();say(it.en)}

/* ---------- Tia Lili: fechamento honesto (e checkpoint semanal às sextas) ---------- */
function viewLili(week){const d=today(),s=d.steps,ep=epOfDay(),good=[],rev=[],miss=[];
 const S=STEPS();S.forEach(x=>{if(x.k!=='lili'&&!(s[x.k]&&s[x.k].done))miss.push(x.t)});
 if(s.aquec)good.push(`Aquecimento: ${s.aquec.ok} de ${s.aquec.n} de cabeça.`);
 if(s.ep){const e=EPS.find(x=>x.id===s.ep.id)||ep;good.push(`Episódio “${e.t}”: ${s.ep.gist}/2 perguntas de sentido${s.ep.pct!=null?` e ${s.ep.pct}% das palavras nos trechos`:''}.`)}
 if(s.foco)good.push(`Treino focado (${s.foco.t}): ${s.foco.first} de ${s.foco.n} certas de primeira.`);
 if(s.call)good.push(`Conversou com a Sophia: ${s.call.turns} ${s.call.turns===1?'fala':'falas'}${s.call.secs?` em ${Math.max(1,Math.round(s.call.secs/60))} min`:''}${s.call.tema?` sobre ${(EPS.find(x=>x.tema===s.call.tema)||{}).temaPt||s.call.tema}`:''}.`);
 (s.ep&&s.ep.miss||[]).slice(0,2).forEach(c=>rev.push(`<b>${esc(c.t)}</b> → ${esc(c.snd)} <span class="mut">(escuta)</span>`));
 (s.call&&s.call.errs||[]).slice(0,2).forEach(e=>rev.push(`“${esc(e.said)}” → <b>${esc(e.corrected)}</b> <span class="mut">(da chamada)</span>`));
 (s.foco&&s.foco.miss||[]).slice(0,1).forEach(e=>rev.push(`<b>${esc(e)}</b> <span class="mut">(treino focado)</span>`));
 const now=Date.now(),cs=cardsGet(),created=cs.filter(c=>c.created>=dayStart()).length,tom=cs.filter(c=>c.step<3&&c.next>now&&c.next<=dayStart()+2*DAY).length,wk=cs.filter(c=>c.step<3&&c.next>now&&c.next<=now+7*DAY).length;
 const nEp=EPS.find(x=>x.id!==ep.id&&!(ST.eps[x.id]&&ST.eps[x.id].done))||EPS[(EPS.indexOf(ep)+1)%EPS.length];
 const doneN=S.filter(x=>x.k!=='lili'&&s[x.k]&&s[x.k].done).length;
 const intro=!doneN?'Hoje ainda não tem atividade registrada. Sem culpa: que tal só o aquecimento de 2 minutos? Pouco todo dia vale mais que muito de vez em quando.'
  :doneN===4?'Dia completo. Vou ser honesta com você: o que conta é isso aqui embaixo, não a sequência de dias.':`Você fez ${doneN} de 4 atividades. Vou ser honesta: o que deu certo e o que ainda pede atenção.`;
 let weekHTML='';
 if(week){const mon=new Date();mon.setHours(0,0,0,0);mon.setDate(mon.getDate()-((mon.getDay()+6)%7));const days=[];for(let i=0;i<5;i++){const x=new Date(mon);x.setDate(mon.getDate()+i);days.push(x)}
  const dd=days.map(x=>ST.days[dk(x)]),ok=dd.filter((x,i)=>dayCount(dk(days[i]))>=3).length,pcts=dd.map(x=>x&&x.steps&&x.steps.ep&&x.steps.ep.pct).filter(x=>x!=null);
  const freq=new Map();dd.forEach(x=>(x&&x.steps&&x.steps.ep&&x.steps.ep.miss||[]).forEach(c=>freq.set(c.t,(freq.get(c.t)||0)+1)));const rep=[...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3);
  weekHTML=`<div class="card"><h4>📊 Checkpoint da semana</h4><div class="wk">${days.map((x,i)=>`<i class="${dayCount(dk(x))>=3?'ok':''}">${['seg','ter','qua','qui','sex'][i]}</i>`).join('')}</div>
   <p>${ok} de 5 dias com a rotina feita.${ok>=4?' Consistência excelente.':ok>=2?' Bom ritmo; o ideal é 4 ou 5 dias curtos.':' Semana leve — tudo bem. Na próxima, tente 3 dias, mesmo que só o aquecimento e o episódio.'}</p>
   ${pcts.length?`<p>Escuta: média de <b>${Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length)}%</b> das palavras nos trechos (${pcts.join('% → ')}%).</p>`:''}
   ${rep.length?`<p>Trechos que voltaram mais vezes: ${rep.map(r=>`<b>${esc(r[0])}</b>`).join(', ')}.</p>`:''}
   <p class="mut small">Fim de semana: só episódios, se tiver vontade. A sequência não quebra.</p></div>`}
 $('app').innerHTML=`<div class="hd"><a class="back" href="#hoje" aria-label="Voltar">‹</a><div class="tt"><b>${week?'Checkpoint semanal':'Fechamento do dia'}</b><span>com a Tia Lili · avaliação e feedback</span></div></div>
 <div class="lili-h">${AV('lili').replace('av lili','av lili big')}<div><b>Tia Lili</b><p>${esc(intro)}</p></div></div>${weekHTML}
 <div class="card"><h4>✅ O que deu certo</h4>${good.length?`<ul>${good.map(g=>`<li>${esc(g)}</li>`).join('')}</ul>`:'<p class="mut">Ainda nada hoje.</p>'}</div>
 <div class="card"><h4>🔁 Para revisar (${Math.min(3,rev.length)})</h4>${rev.length?`<ul>${rev.slice(0,3).map(r=>`<li>${r}</li>`).join('')}</ul><p class="mut small">Isso volta nos próximos aquecimentos; não precisa decorar agora.</p>`:'<p class="mut">Nada pendente do dia.</p>'}</div>
 ${miss.length&&doneN?`<div class="card"><h4>⏭️ Ficou faltando</h4><p>${miss.map(esc).join(' · ')}. Dá para fazer agora ou amanhã.</p></div>`:''}
 <div class="card"><h4>📅 Próximos passos</h4><ul><li>Amanhã: aquecimento com as frases de hoje e o Ep. ${nEp.n} “${esc(nEp.t)}”.</li>
  <li>Cartões: ${created} ${created===1?'novo hoje':'novos hoje'} · ${tom} para amanhã · ${wk} nos próximos 7 dias.</li></ul></div>
 <button type="button" class="btn lili wide" id="liliDone">Fechar o dia ✓</button>`;
 $('liliDone').onclick=()=>{stepDone('lili',{week:!!week});toast('Até amanhã! 👋 — Tia Lili');location.hash='#hoje'}}

/* ---------- Como funciona (ROTEIRO.md) ---------- */
function md(t){const L=t.split('\n');let h='',inl=false;const il=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
 for(const l of L){const m=l.match(/^(#{1,3})\s+(.*)/);if(/^\s*[-*]\s+/.test(l)){if(!inl){h+='<ul>';inl=true}h+='<li>'+il(l.replace(/^\s*[-*]\s+/,''))+'</li>';continue}
  if(inl){h+='</ul>';inl=false}if(m)h+=`<h${m[1].length}>${il(m[2])}</h${m[1].length}>`;else if(l.trim())h+='<p>'+il(l)+'</p>'}return h+(inl?'</ul>':'')}
async function openHow(){const sh=$('sheet');sh.hidden=false;sh.innerHTML='<div class="in"><p class="mut">Carregando…</p></div>';
 let t='';try{const r=await fetch('ROTEIRO.md?v=2026.10.20');t=await r.text()}catch(_){t='# Como funciona\nNão foi possível carregar o roteiro agora.'}
 sh.innerHTML=`<div class="in"><div class="md">${md(t)}</div><button type="button" class="btn wide" id="howX" style="margin-top:12px">Fechar</button></div>`;
 $('howX').onclick=()=>sh.hidden=true;sh.onclick=e=>{if(e.target===sh)sh.hidden=true}}

window.rotinaTest={ST,EPS,PL,earScore,cardsGet,today,streak,get EF(){return EF},get AQ(){return AQ},get FO(){return FO}};
if('speechSynthesis'in window)speechSynthesis.getVoices();
render();
