import re
P='sophia-ao-vivo/index.html'; s=open(P).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a); assert n==cnt,(n,a[:80]); s=s.replace(a,b)
# versão
n=s.count('2026.10.20-chamada'); s=s.replace('2026.10.20-chamada','2026.10.20-chamada2'); print('versão trocada',n)
# ---------- CSS: camada da imagem isolada, sem filtro nem variável herdada por quadro ----------
rep("""body.call #callImg{display:block;position:absolute;inset:0;overflow:hidden;animation:kenburns 28s ease-in-out infinite alternate}""",
"""body.call #callImg{display:block;position:absolute;inset:0;overflow:hidden;contain:strict;pointer-events:none;-webkit-user-select:none;user-select:none;animation:kenburns 28s ease-in-out infinite alternate;will-change:transform}""")
i=s.index("body.call #callImg img{"); j=s.index("@keyframes kenburns",i)
s=s[:i]+"""body.call #callImg img{width:100%;height:100%;object-fit:cover;object-position:52% 32%;display:block;transform-origin:52% 36%;will-change:transform;-webkit-user-drag:none}
body.call #callGlow{display:block;position:absolute;inset:0;pointer-events:none;opacity:0;will-change:opacity;background:radial-gradient(ellipse 70% 55% at 52% 42%,#fff2,#fff0 70%)}
"""+s[j:]
rep("""body.call.spk #spkRing{opacity:calc(.7 + var(--amp,0)*.3)}""","""body.call #spkRing{will-change:opacity}""")
# botão do microfone: estado pressionado sem transform nem box-shadow animado (repintava tudo sob o backdrop-filter a cada quadro)
rep("""#cbMic.held{background:#5B5FC7;color:#fff;transform:scale(1.08);box-shadow:0 0 0 6px #5B5FC755,0 0 0 12px #5B5FC722;animation:micpulse 1.1s ease-in-out infinite}
@keyframes micpulse{50%{box-shadow:0 0 0 9px #5B5FC744,0 0 0 18px #5B5FC71a}}""",
"""#cbMic.held{background:#5B5FC7;color:#fff}
#cbMic::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:3px solid #9DA2FF;opacity:0;pointer-events:none;will-change:opacity}
#cbMic.held::after{animation:micring 1.2s ease-in-out infinite}
@keyframes micring{0%,100%{opacity:.9}50%{opacity:.35}}""")
rep("transition:background .15s,transform .1s;-webkit-tap-highlight-color:transparent}","transition:background .15s;-webkit-tap-highlight-color:transparent}")
rep("""#cbMic{touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}""",
"""#callBar,#callBar button{touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
body.call #stage{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}""")
rep("""#callHint{display:block;text-align:center;font-size:12.5px;opacity:.85;margin-bottom:6px;text-shadow:0 1px 3px #000}""",
"""#callHint{display:block;text-align:center;font-size:12.5px;line-height:18px;height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.85;margin-bottom:6px;text-shadow:0 1px 3px #000}""")
rep("""body.call #tools #err{""","""body.call #tools #err:empty{display:none}body.call #tools #err{""")
# legendas: só abaixo do queixo (top calculado pela caixa renderizada da imagem) e acima da barra
rep("""body.call #caps{z-index:3;bottom:128px;height:42%;padding:0 18px 6px}""",
"""body.call #caps{z-index:3;top:var(--capTop,60%);bottom:var(--capBot,128px);height:auto;padding:22px 18px 4px;
 -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 30px,#000 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 30px,#000 100%)}""")
# markup: brilho como camada própria (opacidade), sem filter na imagem
rep('decoding="async"></div><div id="spkRing">','decoding="async" draggable="false"><div id="callGlow"></div></div><div id="spkRing">')
rep("#callImg,#callTop,","#callImg,#callGlow,#callTop,")
# ---------- JS ----------
# fala dela cancelada (barge-in): limpa o texto "em fala" (antes ficava velho e o filtro de eco descartava frases parecidas do aluno)
rep("S.cancelSpeak=()=>{speakToken++;SPK.push({a:S.spkA,b:T(),barged:true});S.visQ=[];S.lastSaid=S.sayingTxt;S.saidEnd=T();res('barged')};",
    "S.cancelSpeak=()=>{speakToken++;SPK.push({a:S.spkA,b:T(),barged:true});S.visQ=[];S.lastSaid=S.sayingTxt;S.saidEnd=T();S.sayingTxt='';S.hmmOnly=false;res('barged')};")
# medidor (oculto na chamada): só escreve quando muda
rep("$('meter').firstChild.style.width=Math.min(100,e*900)+'%';","{const mw=Math.round(Math.min(100,e*900));if(mw!==S.meterW){S.meterW=mw;$('meter').firstChild.style.width=mw+'%'}}")
# STT: um reconhecedor por vez; handlers de instâncias antigas não mexem mais no estado; mensagens claras
i=s.index("let REC=null,recOn=false;"); j=s.index("/* STT: Azure Speech-to-Text",i)
s=s[:i]+r"""let REC=null,recOn=false,recLive=false;
// mensagens de erro do reconhecedor do navegador, em português claro
function sttErrMsg(code,perm){
 if(code==='not-allowed'||code==='service-not-allowed'||perm==='denied')return 'O microfone está bloqueado para este site. Toque no cadeado 🔒 ao lado do endereço → Permissões → Microfone → Permitir. No Android, confira também Configurações → Apps → Chrome → Permissões → Microfone.';
 if(code==='audio-capture')return 'Não consegui usar o microfone: outro app (ligação, gravador, assistente) pode estar usando. Feche-o e segure o botão de novo.';
 if(code==='network')return 'O reconhecimento de voz do Chrome precisa de internet e a conexão falhou. Confira o Wi-Fi/dados e segure o botão de novo.';
 if(code==='language-not-supported')return 'Este celular não reconhece inglês pelo Chrome. Use o teclado (botão … → Digitar) ou uma chave Azure em ⚙︎ Ajustes.';
 if(code==='bad-grammar')return 'O reconhecimento de voz falhou (configuração). Recarregue a página.';
 return 'O reconhecimento de voz falhou ('+code+'). Segure o botão de novo, ou digite (botão … → Digitar).'}
function sttWarn(msg){if(isCall())toast(msg,7000);else note(msg)}
function startSTT(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){sttWarn('Reconhecimento de voz não suportado neste navegador — use o campo de digitar (ou uma chave Azure em ⚙︎ Ajustes).');diag('stt','indisponível');return false}
 // o anterior ainda está fechando (soltou e apertou de novo rápido): reaproveita quando ele terminar — dois reconhecedores disputando o microfone dão 'audio-capture' no Android
 if(REC&&recLive){recOn=true;REC.__again=true;return true}
 const me=new SR();REC=me;me.lang='en-US';me.continuous=!IS_ANDROID;me.interimResults=true; // Android: sessões curtas reiniciadas são mais estáveis
 let fails=0,restarts=[];
 me.onstart=()=>{if(REC!==me)return;diag('stt','Web Speech (ouvindo)')};
 me.onresult=ev=>{if(REC!==me)return;fails=0;let fin='',int='';for(let i=ev.resultIndex;i<ev.results.length;i++){const r=ev.results[i];if(r.isFinal)fin+=r[0].transcript;else int+=r[0].transcript}
   onSTT(fin,int)};
 me.onerror=e=>{if(REC!==me)return;
   if(e.error==='aborted')return;
   if(e.error==='no-speech'){ if(isPTT()&&!S.ptt&&S.state==='LISTENING'&&!(S.finalTxt+S.interim).trim())sttWarn('Não ouvi nada. Segure o botão, fale e só solte depois de terminar a frase.');return}
   fails++;diag('err','Web Speech: '+e.error);
   if(e.error==='not-allowed'||e.error==='service-not-allowed'||e.error==='audio-capture'){recOn=false;diag('stt','bloqueado ('+e.error+')');
     micPermState().then(st=>{diag('mic','permissão: '+st);sttWarn(sttErrMsg(e.error,st))});
     // pede a permissão de microfone ao site só se ela ainda não foi decidida
     if(e.error!=='audio-capture'&&!micStream&&navigator.mediaDevices)navigator.mediaDevices.getUserMedia({audio:true}).then(st=>{st.getTracks().forEach(t=>t.stop());diag('mic','permitido — segure o botão de novo')}).catch(er=>diag('mic','negado ('+er.name+')'));
   } else if(e.error==='network'||e.error==='language-not-supported'||fails>4){recOn=false;diag('stt','parado após erros');sttWarn(sttErrMsg(e.error))}};
 me.onend=()=>{if(REC!==me)return;recLive=false;const again=me.__again;me.__again=false;
   if(!recOn)return;if(isPTT()&&!S.ptt){recOn=false;return}const now=Date.now();restarts=restarts.filter(x=>now-x<10000);restarts.push(now);
   if(restarts.length>12){recOn=false;diag('stt','parado (reinícios demais)');sttWarn('O reconhecimento de voz parou. Desligue e ligue de novo, ou digite (botão … → Digitar).');return}
   setTimeout(()=>{if(recOn&&REC===me&&!recLive)try{me.start();recLive=true}catch(_){}},again?0:fails?600*fails:IS_ANDROID?250:50)};
 recOn=true;try{me.start();recLive=true;diag('stt','Web Speech (iniciando)')}catch(e){diag('err','Web Speech start: '+e.message)}
 return true;
}
"""+s[j:]
# chamada: amplitude SÓ da voz dela (TTS), nunca do microfone; aplicada direto na imagem/anel, só quando muda
i=s.index("let TTSAN=null,TTSBUF=null,CALLAMP=0;"); j=s.index("const CALL={t0:0,iv:0};",i)
s=s[:i]+r"""let TTSAN=null,TTSBUF=null,CALLAMP=0,CALLQ=-1,CALLSPK=null;
function callUpdate(now){if(!document.body.classList.contains('call'))return;
 // só a saída de voz da Sophia: analisador ligado APENAS na fonte de reprodução do TTS (playMp3) ou a linha do tempo de visemas do TTS.
 // Microfone/eco nunca entram. Com o botão apertado ou ouvindo o aluno, zera na hora (sem decair durante o aperto).
 const hold=!!S.ptt||S.state==='LISTENING'||S.state==='ATTENDING';
 let a=0;const sp=!hold&&(S.state==='SPEAKING'||(S.hmmOnly&&S.sayingTxt));
 if(sp){ if(TTSAN&&AC&&AC.currentTime<(S.azPlayUntil||0)){TTSAN.getFloatTimeDomainData(TTSBUF);let s=0;for(let i=0;i<TTSBUF.length;i++)s+=TTSBUF[i]*TTSBUF[i];a=Math.min(1,Math.sqrt(s/TTSBUF.length)*7)}
   else a=Math.min(1,(S.mouth.o||0)/3.2)} // voz do navegador não expõe o áudio → usa a abertura da boca da linha do tempo (visemas)
 CALLAMP=hold?0:lerp(CALLAMP,a,a>CALLAMP?.35:.12);
 const q=Math.round(CALLAMP*100)/100,spk=S.state==='SPEAKING'&&!hold;
 if(q!==CALLQ||spk!==CALLSPK){CALLQ=q;CALLSPK=spk;
  const im=$('callImg').firstElementChild;im.style.transform=q?'scale('+(1+q*.014).toFixed(4)+')':'';
  $('callGlow').style.opacity=(q*.6).toFixed(2);$('spkRing').style.opacity=spk?(.7+q*.3).toFixed(2):'0';
  $('stage').dataset.amp=q}}
/* legendas: a área começa logo abaixo do queixo dela e termina acima da barra de controles.
   O queixo está em y≈582 px na foto (720×1012); com object-fit:cover a posição na tela vem da caixa renderizada da imagem. */
const CHIN_Y=582;
function capsLayout(){const st=$('stage');if(!st)return;
 if(!isCall()){st.style.removeProperty('--capTop');st.style.removeProperty('--capBot');return}
 const im=$('callImg').firstElementChild,W=st.clientWidth,H=st.clientHeight;if(!W||!H)return;
 const nw=im.naturalWidth||720,nh=im.naturalHeight||1012,sc=Math.max(W/nw,H/nh);
 const op=(getComputedStyle(im).objectPosition||'52% 32%').split(' '),py=parseFloat(op[1]||'32')/100;
 const chin=(H-nh*sc)*py+CHIN_Y*sc;
 const kb=Math.max(0,(chin-H/2)*.055)+4; // Ken Burns aproxima até 5,5% a partir do centro: o queixo pode descer um pouco
 const sb=st.getBoundingClientRect(),bb=$('bottom').getBoundingClientRect();
 const capBot=Math.max(0,Math.round(sb.bottom-bb.top+2));
 let top=Math.round(chin+kb+6); // 6 px de folga abaixo do queixo (o padding de 22 px da área ainda é a faixa do esmaecimento)
 if(H-capBot-top<84)top=Math.max(0,H-capBot-84); // tela muito baixa (paisagem): garante ~3 linhas
 st.style.setProperty('--capTop',(top-22)+'px');st.style.setProperty('--capBot',capBot+'px');
 st.dataset.chin=Math.round(chin)}
if(window.ResizeObserver){const ro=new ResizeObserver(()=>capsLayout());ro.observe($('stage'));ro.observe($('bottom'))}
addEventListener('resize',capsLayout);if(window.visualViewport)visualViewport.addEventListener('resize',capsLayout);
$('callImg').firstElementChild.addEventListener('load',capsLayout);
"""+s[j:]
# padding 22 → top-22 faz o texto começar exatamente em 'top'; a máscara esmaece os 30 px de cima (texto que sobe some antes do queixo)
# microfone: ponteiro estável no Android
i=s.index("const cbMic=$('cbMic');"); j=s.index("$('cbCam').onclick=",i)
s=s[:i]+r"""const cbMic=$('cbMic');
/* Aperte-para-falar estável no Android: captura do ponteiro, sem menu de toque longo/seleção, pointercancel por tremida do dedo ignorado,
   e debounce (um novo aperto até 250 ms depois de soltar é repique, não conta). O reconhecimento começa DENTRO do pointerdown (gesto). */
const MIC={on:false,id:null,x:0,y:0,t:0,up:0};
function micDown(ev){
 if(ev.pointerType==='mouse'&&ev.button!==0)return; ev.preventDefault();
 if(MIC.on)return; // segundo dedo / evento repetido
 if(performance.now()-MIC.up<250&&!S.pttToggle)return; // repique
 if(!S.running)return; // ligar a chamada fica no pointerup (ativação do usuário no toque)
 MIC.on=true;MIC.id=ev.pointerId;MIC.x=ev.clientX;MIC.y=ev.clientY;MIC.t=performance.now();
 try{cbMic.setPointerCapture(ev.pointerId)}catch(_){}
 if(CFG.talk!=='ptt'){$('btnDone').click();return}
 pttDown(null)} // inicia o Web Speech aqui mesmo, dentro do gesto
function micUp(force){if(!MIC.on)return;MIC.on=false;MIC.up=performance.now();
 try{MIC.id!=null&&cbMic.hasPointerCapture&&cbMic.hasPointerCapture(MIC.id)&&cbMic.releasePointerCapture(MIC.id)}catch(_){}MIC.id=null;
 if(CFG.talk==='ptt')pttUp(null,force)}
cbMic.addEventListener('pointerdown',micDown);
cbMic.addEventListener('pointerup',ev=>{
 if(!S.running&&!MIC.on){ev.preventDefault();try{AC&&AC.resume()}catch(_){}start();talkUI();return} // 1º toque liga a chamada (gesto completo)
 if(ev.pointerId===MIC.id)micUp(false)});
cbMic.addEventListener('pointercancel',ev=>{if(ev.pointerId!==MIC.id)return;
 // o Android às vezes cancela o ponteiro por uma tremida do dedo: se mexeu pouco, continua segurando e espera o touchend
 if(Math.hypot(ev.clientX-MIC.x,ev.clientY-MIC.y)<32&&ev.clientX!==0)return; micUp(true)});
cbMic.addEventListener('touchstart',e=>{if(e.cancelable)e.preventDefault()},{passive:false}); // sem menu de toque longo, lupa, seleção nem clique emulado
cbMic.addEventListener('touchend',e=>{if(MIC.on&&e.targetTouches.length===0)micUp(false)},{passive:true});
cbMic.addEventListener('touchcancel',()=>{if(MIC.on)micUp(true)},{passive:true});
document.addEventListener('pointerup',ev=>{if(MIC.on&&ev.pointerId===MIC.id)micUp(false)},true);
addEventListener('blur',()=>{if(MIC.on)micUp(true)});document.addEventListener('visibilitychange',()=>{if(document.hidden&&MIC.on)micUp(true)});
['contextmenu','selectstart','dragstart'].forEach(t=>cbMic.addEventListener(t,e=>e.preventDefault()));
$('callBar').addEventListener('contextmenu',e=>e.preventDefault());
cbMic.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();if(!S.running){start();talkUI()}else if(CFG.talk==='ptt')pttDown()}});
cbMic.addEventListener('keyup',e=>{if((e.key===' '||e.key==='Enter')&&CFG.talk==='ptt'){e.preventDefault();pttUp(null)}});
"""+s[j:]
# applyUI recalcula a área das legendas
rep("function applyUI(){const c=isConv();","function applyUI(){setTimeout(()=>typeof capsLayout==='function'&&capsLayout(),0);const c=isConv();")
rep("$('rvNew').textContent=isCall()?'📞 Ligar de novo':'🎙️ Nova conversa';callUI();","$('rvNew').textContent=isCall()?'📞 Ligar de novo':'🎙️ Nova conversa';callUI();capsLayout();")
open(P,'w').write(s); print('ok')
