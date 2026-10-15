(async function(){
let state='idle';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const $=s=>document.querySelector(s), st=$('#sophiaStatus'), cap=$('#sophiaCap');
const CHARS={
 sophia:{nome:'Sophia',svg:'sophia.svg',skin:'#C46203',head:['hair_back','head','earring','headset','mouth_variants'],pivot:'181 190',body:['torso','body_arm_L','body_arm_R'],
   lidColor:'#03091A',poseNaoOuvi:[['cupped-ear','R']],lamp:'body_hint_lamp',gestures:{tchau:'gestos/tchau',comemorando:'gestos/comemorando'},manus:'gestos/sophia_fala_manus',
   azVoice:'en-US-JennyNeural',voiceRe:/female|samantha|zira|jenny|aria|google us english/i,
   texto:"Hey! I'm Sophia. So, how was your weekend? Anything fun?",
   conv:["I go to the beach in the weekend.","Oh nice, the beach! Quick tip: you went to the beach on the weekend. Wanna try it again?","Awesome, that was great! See you soon!"]},
 erick:{nome:'Erick',svg:'erick.svg',skin:'#C06006',head:['hair_back','hair_front','head','mouth_variants'],pivot:'181 215',body:['torso','body_arm_L','body_arm_R'],
   lidColor:'#3B1D0B',poseNaoOuvi:[],lamp:null,gestures:{tchau:'gestos/erick_tchau'},manus:'gestos/erick_fala_manus',
   azVoice:'en-US-AndrewNeural',voiceRe:/\b(male|david|guy|andrew|daniel|alex|fred|christopher|eric|mark)\b/i,
   texto:"Hey, what's up? I'm Erick. Tell me, what did you do today?",
   conv:["Yesterday I watch a movie very good.","Cool! Oh, just say: I watched a really good movie. What was it?","Nice one! Catch you later!"]},
 lili:{nome:'Lili',svg:'lili.svg',skin:'#D98020',head:['head','mouth_variants'],pivot:'180 200',body:['torso'],
   lidColor:'#1E1209',poseNaoOuvi:[],lamp:null,gestures:{tchau:'gestos/lili_tchau'},manus:'gestos/lili_fala_manus',
   azVoice:'en-US-NancyNeural',voiceRe:/female|samantha|zira|nancy|aria|karen|google us english/i,
   texto:"Hi there! I'm Lili. So, what's new with you?",
   conv:["I am cooking since two hours.","Mmm, sounds yummy! Just say: I've been cooking for two hours. What are you making?","Love it! Talk to you soon!"]}
};
const CK=(new URLSearchParams(location.search).get('c')||'sophia').toLowerCase(); const CFG=CHARS[CK]||CHARS.sophia;
document.querySelectorAll('[data-char]').forEach(b=>{ if(b.dataset.char===CK) b.classList.add('on'); b.onclick=()=>{ location.search='?c='+b.dataset.char; }; });
document.title=CFG.nome+' v3 – boneco SVG ao vivo'; $('h1').textContent=CFG.nome+' v3 · boneco SVG ao vivo'; $('#txt').value=CFG.texto; document.querySelector('label[for=txt]').textContent=CFG.nome+' diz:';
const svgTxt=await (await fetch(CFG.svg)).text();
$('#stage').innerHTML=svgTxt;
const svg=$('#stage svg'), NS='http://www.w3.org/2000/svg';
svg.removeAttribute('width'); svg.removeAttribute('height');
const g=id=>svg.querySelector('#'+CSS.escape(id));
// ---------- rig setup ----------
const MV=g('mouth_variants'); MV.removeAttribute('display');
const SHAPES=['sil','MBP','AA','EE','OO','UU','FV','L_TH_D','smile_closed','smile_open','surprise_o'].filter(k=>g('variant_'+k));
const mouths={}; SHAPES.forEach(k=>{mouths[k]=g('variant_'+k); mouths[k].setAttribute('display','none');});
if(g('mouth')) g('mouth').setAttribute('display','none'); // reference mouth == variant_sil
const headParts=CFG.head.map(g).filter(Boolean);
const PIV=CFG.pivot;
// eyelids: skin plate clipped to each eye white, scaled from the top
const lids={};
['L','R'].forEach(s=>{ const w=g('eye_white_'+s); if(!w) return; const bb=w.getBBox(); const x1=bb.x-3,y1=bb.y-3,W=bb.width+6,H=bb.height+6;
  const grp=document.createElementNS(NS,'g'); grp.setAttribute('clip-path',`url(#eye_clip_${s})`);
  const r=document.createElementNS(NS,'rect'); Object.entries({x:x1,y:y1,width:W,height:H,fill:CFG.skin}).forEach(([k,v])=>r.setAttribute(k,v));
  grp.appendChild(r); const lu=g('lid_upper_'+s), host=g('eye_'+s)||w.parentNode; if(lu&&lu.parentNode===host) host.insertBefore(grp,lu); else host.appendChild(grp); lids[s]=r; gsap.set(r,{scaleY:0,svgOrigin:`${x1+W/2} ${y1}`});
});
const lidLines=[g('lid_upper_L'),g('lid_upper_R')].filter(Boolean);
const pupils=['iris_L','pupil_L','iris_R','pupil_R'].map(g).filter(Boolean);
const brows=[g('brow_L'),g('brow_R')].filter(Boolean);
const poseEl=(n,s)=>g(`body_pose_${n}_${s}`);
// ---------- mouth ----------
let curMouth='sil';
function setMouth(k){ if(!mouths[k]) k='sil'; if(k===curMouth) return; mouths[curMouth].setAttribute('display','none'); mouths[k].setAttribute('display','inline'); curMouth=k; }
mouths.sil.setAttribute('display','inline');
SHAPES.forEach(k=>{const b=document.createElement('button');b.textContent=k;b.onclick=()=>{stopSpeech();setMouth(k)};$('#mouthBtns').appendChild(b)});
// ---------- idle ----------
gsap.to(CFG.body.map(g).filter(Boolean).concat(headParts),{y:-1.4,duration:2.2,ease:'sine.inOut',yoyo:true,repeat:-1}); // breathing
const headTl=gsap.timeline({repeat:-1,yoyo:true}); headTl.to(headParts,{rotation:1.6,svgOrigin:PIV,duration:3.1,ease:'sine.inOut'}).to(headParts,{rotation:-1.2,svgOrigin:PIV,duration:3.4,ease:'sine.inOut'});
function blink(){ const t=gsap.timeline(); t.to([lids.L,lids.R],{scaleY:1,duration:.07,ease:'power1.in'}).to(lidLines,{y:5,duration:.07},0).to([lids.L,lids.R],{scaleY:0,duration:.11,ease:'power1.out'},'+=.05').to(lidLines,{y:0,duration:.11},'<'); }
(function loopBlink(){ blink(); if(Math.random()<.18) setTimeout(blink,260); setTimeout(loopBlink,2200+Math.random()*3200); })();
let gaze={x:0,y:0}; function look(x,y,d=.35){ if(!pupils.length) return; gsap.to(pupils,{x,y,duration:d,ease:'power2.out'});}
(function saccade(){ if(state==='idle'||state==='falando'||state==='ouvindo') look((Math.random()-.5)*1.6,(Math.random()-.5)*0.8,.12); setTimeout(saccade,1200+Math.random()*2000); })();
// ---------- states ----------
let stateTl=null, activePoses=[];
const labels={idle:'parada',ouvindo:'ouvindo…',pensando:'pensando…',falando:'falando',comemorando:'comemorando!',naoouvi:'não ouvi…'};
function showPose(names){ names=names||[]; activePoses.forEach(p=>gsap.to(p,{opacity:0,duration:.25})); activePoses=names.map(([n,s])=>poseEl(n,s)).filter(Boolean); activePoses.forEach(p=>gsap.to(p,{opacity:1,duration:.25})); }
function setState(s){
  state=s; st.textContent=CFG.nome+': '+labels[s]; if(stateTl){stateTl.kill();stateTl=null;}
  gsap.killTweensOf(brows); {const ex=['body_hint_lamp','body_celebrate_confetti'].map(g).filter(Boolean); if(ex.length) gsap.to(ex,{opacity:0,duration:.2});}
  const tl=gsap.timeline(); stateTl=tl; headTl.timeScale(1);
  const restHead=()=>gsap.to(headParts,{x:0,y:0,duration:.4});
  if(s!=='falando' && s!=='comemorando') setMouth(s==='naoouvi'?'smile_closed':'sil');
  if(s==='idle'){ restHead(); gsap.to(brows,{y:0,rotation:0,duration:.3}); look(0,0); showPose([]); }
  if(s==='ouvindo'){ gsap.to(brows,{y:-1,duration:.3}); look(0,0); showPose([]); tl.to(headParts,{y:2.5,duration:.35,ease:'sine.inOut',yoyo:true,repeat:1}).to(headParts,{y:0,duration:.6}).repeat(-1).repeatDelay(.9); }
  if(s==='pensando'){ showPose([]); /* pose mão-no-queixo da fonte fica fora do enquadramento 360x360: omitida */ gsap.to(brows[0],{y:-3.5,duration:.35}); if(brows[1]){const b=brows[1].getBBox(); gsap.to(brows[1],{y:-1.5,rotation:4,svgOrigin:`${b.x+b.width/2} ${b.y+b.height/2}`,duration:.35});} look(2.2,-2.6,.5); if(CFG.lamp) gsap.to(g(CFG.lamp),{opacity:1,duration:.4}); tl.to(headParts,{x:-1.5,y:-1,duration:1.2,ease:'sine.inOut',yoyo:true,repeat:-1}); }
  if(s==='falando'){ restHead(); gsap.to(brows,{y:0,rotation:0,duration:.3}); look(0,0); showPose([]); tl.to(headParts,{y:-1,duration:.5,ease:'sine.inOut',yoyo:true,repeat:-1}); }
  if(s==='comemorando'){ look(0,0); gsap.to(brows,{y:-3,rotation:0,duration:.25}); setMouth('smile_open'); showPose([]); if(g('body_celebrate_confetti')) gsap.to(g('body_celebrate_confetti'),{opacity:1,duration:.3}); }
  if(s==='naoouvi'){ showPose(CFG.poseNaoOuvi); gsap.to(brows,{y:-3.5,duration:.3}); gsap.to(headParts,{x:3,duration:.5}); look(-1.5,0); headTl.timeScale(.2); }
  return tl;
}
document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ if(b.dataset.s==='comemorando'){ window.sophia.gesture('comemorando'); return;} stopSpeech();setState(b.dataset.s)});
// ---------- text -> viseme approximation (fallback) ----------
const DIG=[['th','L_TH_D'],['sh','UU'],['ch','UU'],['ph','FV'],['wh','UU'],['oo','UU'],['ee','EE'],['ea','EE'],['ou','OO'],['ow','OO'],['ai','EE'],['ay','EE'],['igh','AA'],['qu','UU'],['ck','EE'],['ng','EE']];
const LET={a:'AA',e:'EE',i:'EE',o:'OO',u:'UU',y:'EE',b:'MBP',m:'MBP',p:'MBP',f:'FV',v:'FV',w:'UU',r:'UU',l:'L_TH_D',t:'L_TH_D',d:'L_TH_D',n:'L_TH_D',s:'EE',z:'EE',c:'EE',k:'EE',g:'EE',j:'UU',x:'EE',h:'AA',q:'UU'};
function wordVisemes(w){ w=w.toLowerCase().replace(/[^a-z']/g,''); const out=[]; let i=0;
  while(i<w.length){ let hit=null; for(const [d,v] of DIG) if(w.startsWith(d,i)){hit=[d,v];break;}
    if(hit){out.push(hit[1]);i+=hit[0].length;continue;}
    const c=w[i]; if(c==='e'&&i===w.length-1&&i>1){i++;continue;} // silent e
    if(LET[c] && (out[out.length-1]!==LET[c]||'aeiou'.includes(c))) out.push(LET[c]); i++; }
  return out.length?out:['sil']; }
let timers=[], speaking=false, speakToken=0;
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
function playWord(word,dur){ const vs=wordVisemes(word); const step=dur/vs.length; vs.forEach((v,i)=>timers.push(setTimeout(()=>setMouth(v),i*step))); timers.push(setTimeout(()=>setMouth('sil'),dur+20)); }
function highlight(words,idx){ cap.innerHTML=words.map((w,i)=>i===idx?`<b>${w}</b>`:w).join(' '); }
function wordDur(w,rate){ return Math.max(140, w.replace(/[^a-z]/gi,'').length*68)/rate; }
// simulated clock (no audio / no boundary events)
function simulate(text,token,rate=1){ return new Promise(res=>{ const words=text.split(/\s+/).filter(Boolean); let t=0;
  words.forEach((w,i)=>{ const d=wordDur(w,rate); timers.push(setTimeout(()=>{ if(token!==speakToken) return; highlight(words,i); playWord(w,d*0.85); },t)); t+=d+(/[,.!?]$/.test(w)?260:60); });
  timers.push(setTimeout(res,t+100)); }); }
function pickVoice(){ const all=speechSynthesis.getVoices().filter(v=>/^en(-|_)US/i.test(v.lang)); const nat=all.filter(v=>/natural|neural|online|enhanced|premium/i.test(v.name)); const vs=nat.filter(v=>CFG.voiceRe.test(v.name)).length?nat:all; return vs.find(v=>CFG.voiceRe.test(v.name)&&!(CK==='erick'&&/female/i.test(v.name))&&!(CK!=='erick'&&/\bmale/i.test(v.name)&&!/female/i.test(v.name)))||vs[0]||null; }
function speakBrowser(text,token){ return new Promise(res=>{
  if(!('speechSynthesis' in window)) return simulate(text,token).then(res);
  const words=text.split(/\s+/).filter(Boolean); const u=new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=1.08; u.pitch=CK==='erick'?1.0:1.08; const v=pickVoice(); if(v) u.voice=v;
  let gotBoundary=false, started=false, done=false; const fin=()=>{ if(done) return; done=true; res(); };
  // char index -> word index
  const starts=[]; let p=0; words.forEach(w=>{p=text.indexOf(w,p);starts.push(p);p+=w.length;});
  u.onstart=()=>{started=true;};
  u.onboundary=e=>{ if(e.name&&e.name!=='word') return; gotBoundary=true; let wi=starts.findIndex((s,i)=>e.charIndex>=s&&(i===starts.length-1||e.charIndex<starts[i+1])); if(wi<0) return; highlight(words,wi); clearTimers(); playWord(words[wi], e.charLength? wordDur(words[wi],u.rate)*0.85 : wordDur(words[wi],u.rate)*0.85); };
  u.onend=()=>{ if(!gotBoundary && token===speakToken){} fin(); }; u.onerror=()=>{ if(!gotBoundary) simulate(text,token).then(fin); else fin(); };
  speechSynthesis.cancel(); speechSynthesis.speak(u);
  // no audio engine or no boundary events (some voices): drive mouth from estimated clock
  setTimeout(()=>{ if(!gotBoundary && token===speakToken && !done){ engineNote=' (sem eventos de palavra: relógio estimado)'; st.textContent=CFG.nome+': falando'+engineNote; simulate(text,token,u.rate).then(()=>{ if(!started) fin(); }); } },700);
}); }
let engineNote='';
// ---------- Azure path ----------
const AZ={get key(){return localStorage.getItem('sophiaAzKey')||''},get reg(){return localStorage.getItem('sophiaAzReg')||''},get voice(){return localStorage.getItem('sophiaAzVoice_'+CK)||CFG.azVoice}};
const AZMAP={0:'sil',1:'AA',2:'AA',3:'OO',4:'EE',5:'EE',6:'EE',7:'UU',8:'OO',9:'AA',10:'OO',11:'AA',12:'AA',13:'UU',14:'L_TH_D',15:'EE',16:'UU',17:'L_TH_D',18:'FV',19:'L_TH_D',20:'EE',21:'MBP'};
let sdkP=null; function loadSdk(){ return sdkP||(sdkP=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/microsoft-cognitiveservices-speech-sdk@1.40.0/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle-min.js';s.onload=()=>res(window.SpeechSDK);s.onerror=rej;document.head.appendChild(s);})); }
let azPlayer=null, azRaf=0;
async function speakAzure(text,token){ const SDK=await loadSdk(); return new Promise((res,rej)=>{
  const cfg=SDK.SpeechConfig.fromSubscription(AZ.key,AZ.reg); cfg.speechSynthesisVoiceName=AZ.voice;
  const player=new SDK.SpeakerAudioDestination(); azPlayer=player; const ac=SDK.AudioConfig.fromSpeakerOutput(player);
  const syn=new SDK.SpeechSynthesizer(cfg,ac); const vis=[], wb=[]; const words=text.split(/\s+/).filter(Boolean);
  syn.visemeReceived=(s,e)=>vis.push([e.audioOffset/1e4,AZMAP[e.visemeId]||'sil']);
  syn.wordBoundary=(s,e)=>wb.push(e.audioOffset/1e4);
  let t0=0; player.onAudioStart=()=>{ t0=performance.now(); const tick=()=>{ if(token!==speakToken) return; const ms=performance.now()-t0; let k='sil'; for(const [t,v] of vis){ if(t<=ms) k=v; else break; } setMouth(k); let wi=-1; wb.forEach((t,i)=>{if(t<=ms) wi=i;}); if(wi>=0) highlight(words,wi); azRaf=requestAnimationFrame(tick); }; tick(); };
  player.onAudioEnd=()=>{ cancelAnimationFrame(azRaf); setMouth('sil'); res(); };
  syn.speakTextAsync(text,r=>{ syn.close(); if(r.reason!==SDK.ResultReason.SynthesizingAudioCompleted){ rej(new Error(r.errorDetails||'Azure falhou')); } },err=>{syn.close();rej(err);});
}); }
// ---------- speak orchestrator ----------
function stopSpeech(){ speakToken++; clearTimers(); try{speechSynthesis.cancel()}catch(e){} if(azPlayer){try{azPlayer.pause()}catch(e){} azPlayer=null;} cancelAnimationFrame(azRaf); setMouth('sil'); }
async function say(text){ stopSpeech(); const token=++speakToken; engineNote=''; setState('falando');
  let eng='voz do navegador + fonemas aproximados';
  try{ if(AZ.key&&AZ.reg){ eng='Azure '+AZ.voice+' + visemas'; st.textContent=CFG.nome+': falando ('+eng+')'; await speakAzure(text,token); }
       else { st.textContent=CFG.nome+': falando ('+eng+')'; await speakBrowser(text,token); } }
  catch(e){ console.warn('Azure indisponível, usando fallback:',e&&e.message); st.textContent=CFG.nome+': falando (fallback: '+eng+')'; await speakBrowser(text,token); }
  if(token===speakToken){ clearTimers(); setMouth('sil'); setState('idle'); } }
// ---------- Runway gesture clips (hybrid) ----------
const stage=$('#stage'); const vids={};
Object.entries(CFG.gestures).forEach(([k,base])=>{ const v=document.createElement('video'); v.muted=true; v.playsInline=true; v.preload='auto'; v.className='gesto'; v.dataset.g=k;
  v.innerHTML=`<source src="${base}.webm" type="video/webm"><source src="${base}.mp4" type="video/mp4">`; stage.appendChild(v); vids[k]=v; });
let gesturing=null; const FADE=.15;
function gesture(k){ const v=vids[k]; if(!v){ if(k==='comemorando'){ stopSpeech(); setState('comemorando'); return wait(2200).then(()=>setState('idle')); } if(k==='tchau'){ stopSpeech(); setState('idle'); setMouth(mouths.smile_closed?'smile_closed':'sil'); st.textContent=CFG.nome+': tchau! (sem clipe de gesto ainda)'; return wait(1500);} return Promise.resolve(); } if(gesturing) return gesturing;
  stopSpeech(); const confetti=svg.querySelector('#body_celebrate_confetti');
  gesturing=new Promise(res=>{ const go=()=>{ v.currentTime=0; setMouth('sil'); setState('idle');
      v.play().then(()=>{ gsap.to(v,{opacity:1,duration:FADE}); gsap.to(svg,{opacity:0,duration:FADE,delay:FADE*.5});
        st.textContent=CFG.nome+': '+(k==='tchau'?'tchau!':'comemorando!');
}).catch(e=>{console.warn('gesto',e);done();});
      const done=()=>{ v.removeEventListener('timeupdate',tu); gsap.to(svg,{opacity:1,duration:FADE}); gsap.to(v,{opacity:0,duration:FADE,delay:FADE*.5,onComplete:()=>{v.pause();}}); setTimeout(()=>{gesturing=null;res();},FADE*1500); };
      const tu=()=>{ if(v.duration && v.currentTime>=v.duration-FADE-0.05) done(); }; v.addEventListener('timeupdate',tu); };
    if(v.readyState>=3) go(); else { v.addEventListener('canplaythrough',go,{once:true}); v.load(); } });
  return gesturing; }
const _say=say; async function sayQueued(t){ if(gesturing) await gesturing; return _say(t); }
window.sophia={say:sayQueued,gesture,setState,setMouth,wordVisemes,stop:stopSpeech};
$('#bSpeak').onclick=()=>sayQueued($('#txt').value);
$('#bStop').onclick=()=>{stopSpeech();setState('idle')};
$('#bConv').onclick=async()=>{ const [aluno,resp,fim]=CFG.conv; cap.textContent='Aluno: "'+aluno+'"'; setState('ouvindo'); await wait(2600); cap.textContent=''; setState('pensando'); await wait(1400);
  await sayQueued(resp); await wait(350); await sayQueued(fim); await gesture('tchau'); };
$('#bTchau').onclick=()=>gesture('tchau');
// ---------- Fala gravada (Manus): roteirizada, com áudio, em painel neutro ----------
const mp=$('#manusPanel'), mv=$('#manusVid');
mv.innerHTML=`<source src="${CFG.manus}.webm" type="video/webm"><source src="${CFG.manus}.mp4" type="video/mp4">`;
async function manus(){ if(gesturing) await gesturing; stopSpeech(); setState('idle'); mv.currentTime=0; mv.muted=false;
  gsap.to(mp,{autoAlpha:1,duration:.15}); gsap.to('#stage',{opacity:.25,duration:.15}); st.textContent=CFG.nome+': fala gravada (Manus)';
  try{ await mv.play(); }catch(e){ console.warn('manus play',e&&e.message); mv.muted=true; await mv.play().catch(()=>{}); }
  await new Promise(r=>{ mv.onended=r; $('#manusClose').onclick=r; });
  mv.pause(); gsap.to(mp,{autoAlpha:0,duration:.15}); gsap.to('#stage',{opacity:1,duration:.15}); setState('idle'); }
$('#bManus').onclick=manus; window.sophia.manus=manus;
// settings
$('#azKey').value=AZ.key; $('#azReg').value=AZ.reg; $('#azVoice').value=AZ.voice; const info=()=>$('#azInfo').textContent=AZ.key?'Azure ativo neste navegador':'sem chave (fallback)'; info();
$('#azSave').onclick=()=>{localStorage.setItem('sophiaAzKey',$('#azKey').value.trim());localStorage.setItem('sophiaAzReg',$('#azReg').value.trim());localStorage.setItem('sophiaAzVoice_'+CK,$('#azVoice').value.trim()||CFG.azVoice);info();};
$('#azClear').onclick=()=>{['sophiaAzKey','sophiaAzReg'].forEach(k=>localStorage.removeItem(k));$('#azKey').value='';$('#azReg').value='';info();};
setState('idle'); window.sophiaReady=true;
})().catch(e=>{console.error('Sophia init falhou',e);document.querySelector('#sophiaStatus').textContent='erro: '+e.message;});
