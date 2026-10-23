/* ============ MODO CHAMADA (novo, padrão): chamada de vídeo estilo Teams ============
   Sophia = foto 9:16 (UI embutida removida: miniatura/título apagados por inpainting, legenda e barra cortadas) com Ken Burns lento,
   pulso de escala/brilho pela amplitude da voz e anel de "quem fala". Overlays de verdade em HTML: barra superior + cronômetro,
   miniatura da câmera frontal (só local), legendas subindo (as do modo Conversa) e barra de controles. Correção = a do modo Conversa. */
let TTSAN=null,TTSBUF=null,CALLAMP=0;
function callUpdate(now){if(!document.body.classList.contains('call'))return;
 let a=0;const sp=S.state==='SPEAKING'||(S.hmmOnly&&S.sayingTxt);
 if(sp){ if(TTSAN&&AC&&AC.currentTime<(S.azPlayUntil||0)){TTSAN.getFloatTimeDomainData(TTSBUF);let s=0;for(let i=0;i<TTSBUF.length;i++)s+=TTSBUF[i]*TTSBUF[i];a=Math.min(1,Math.sqrt(s/TTSBUF.length)*7)}
   else a=Math.min(1,(S.mouth.o||0)/3.2)} // voz do navegador não expõe o áudio → usa a abertura da boca da linha do tempo (visemas)
 CALLAMP=lerp(CALLAMP,a,a>CALLAMP?.35:.12);$('stage').style.setProperty('--amp',CALLAMP.toFixed(3))}
const CALL={t0:0,iv:0};
const mmss=ms=>{const t=Math.max(0,Math.floor(ms/1000));return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')};
function callStart(){CALL.t0=Date.now();clearInterval(CALL.iv);$('callTime').textContent='00:00';document.body.classList.add('oncall');
 CALL.iv=setInterval(()=>{$('callTime').textContent=mmss(Date.now()-CALL.t0)},1000)}
function callStop(){if(!CALL.iv)return;clearInterval(CALL.iv);CALL.iv=0;document.body.classList.remove('oncall');$('callTime').textContent='encerrada · '+mmss(Date.now()-CALL.t0);camOff(true)}
let toastT=0;function toast(t,ms=2600){const e=$('toast');e.textContent=t;e.hidden=false;e.style.animation='none';void e.offsetWidth;e.style.animation='';clearTimeout(toastT);toastT=setTimeout(()=>{e.hidden=true},ms)}
/* câmera frontal: só vídeo, pedida à parte do microfone (não mexe no reconhecimento de voz); nada é gravado nem enviado */
let camStream=null;
function camOff(quiet){if(camStream){camStream.getTracks().forEach(t=>t.stop());camStream=null}const v=$('selfVid');v.srcObject=null;$('selfView').hidden=true;
 $('cbCam').classList.add('off');$('cbCam').setAttribute('aria-pressed','false');if(!quiet)toast('Câmera desligada')}
async function camToggle(){if(camStream)return camOff();
 if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){toast('Câmera indisponível neste navegador.');return}
 $('cbCam').disabled=true;
 try{camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:480},height:{ideal:640}},audio:false});
  const v=$('selfVid');v.srcObject=camStream;try{await v.play()}catch(_){}
  $('selfView').hidden=false;$('cbCam').classList.remove('off');$('cbCam').setAttribute('aria-pressed','true');
  camStream.getVideoTracks().forEach(t=>t.onended=()=>camOff(true));
  toast('📷 Sua imagem fica só no seu celular: nada é gravado nem enviado.',3400)}
 catch(e){camStream=null;console.warn('câmera',e.name);
  toast(e.name==='NotAllowedError'||e.name==='SecurityError'?'Câmera bloqueada. Para liberar: cadeado 🔒 ao lado do endereço → Permissões → Câmera. A chamada continua sem vídeo.':
   e.name==='NotFoundError'||e.name==='OverconstrainedError'?'Nenhuma câmera frontal encontrada. A chamada continua sem vídeo.':'Não deu para abrir a câmera ('+e.name+'). A chamada continua sem vídeo.',4200)}
 finally{$('cbCam').disabled=false}}
function capsApply(){document.body.classList.toggle('capsoff',!!CFG.capsOff);const b=$('cbChat');b.classList.toggle('off',!!CFG.capsOff);b.setAttribute('aria-pressed',CFG.capsOff?'false':'true')}
function callUI(){if(!$('callBar'))return;const run=S.running,ptt=CFG.talk==='ptt',m=$('cbMic');
 m.classList.toggle('held',!!S.ptt);m.setAttribute('aria-pressed',S.ptt?'true':'false');
 const h=$('cbHang');h.classList.toggle('join',!run);h.setAttribute('aria-label',run?(S.prac||CV.ending?'Pular e ver o resumo':'Desligar e revisar'):'Ligar para a Sophia');h.title=h.getAttribute('aria-label');
 $('callHint').textContent=!run?(CV.turns.length?'Chamada encerrada · toque no verde para ligar de novo':'Toque no botão verde para ligar para a Sophia'):S.ptt?(S.pttToggle?'toque de novo para enviar':'ouvindo… solte para enviar'):ptt?'segure para falar':'mãos livres: fale normalmente · toque no 🎙 para enviar';
 $('mmRev').hidden=!(CV.turns.length&&!run);capsApply()}
const cbMic=$('cbMic');
cbMic.addEventListener('pointerdown',ev=>{ev.preventDefault();if(!S.running){start();talkUI();return}if(CFG.talk!=='ptt'){$('btnDone').click();return}pttDown(ev)});
cbMic.addEventListener('pointerup',ev=>{if(CFG.talk==='ptt')pttUp(ev)});cbMic.addEventListener('pointercancel',ev=>{if(CFG.talk==='ptt')pttUp(ev,true)});
cbMic.addEventListener('contextmenu',e=>e.preventDefault());
cbMic.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();if(!S.running){start();talkUI()}else if(CFG.talk==='ptt')pttDown()}});
cbMic.addEventListener('keyup',e=>{if((e.key===' '||e.key==='Enter')&&CFG.talk==='ptt'){e.preventDefault();pttUp(null)}});
$('cbCam').onclick=()=>camToggle();
$('cbChat').onclick=()=>{CFG.capsOff=!CFG.capsOff;save();capsApply();toast(CFG.capsOff?'Legendas desligadas':'Legendas ligadas',1800)};
$('cbHang').onclick=()=>{$('moreMenu').hidden=true;if(!S.running&&!CV.ending){$('review').hidden=true;$('caps').innerHTML='';start();talkUI();return}$('btnEnd').onclick()};
$('cbMore').onclick=e=>{e.stopPropagation();callUI();$('moreMenu').hidden=!$('moreMenu').hidden};
document.addEventListener('click',e=>{const m=$('moreMenu');if(!m.hidden&&!m.contains(e.target)&&e.target!==$('cbMore'))m.hidden=true});
$('mmKbd').onclick=()=>{$('moreMenu').hidden=true;$('btnKbd').click()};
$('mmCfg').onclick=()=>{$('moreMenu').hidden=true;$('btnCfg').click()};
$('mmRev').onclick=()=>{$('moreMenu').hidden=true;openReview()};
