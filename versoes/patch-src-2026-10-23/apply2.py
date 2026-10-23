P='sophia-ao-vivo/index.html'
s=open(P).read()
def rep(old,new,count=1):
    global s
    n=s.count(old); assert n==count,(n,old[:90]); s=s.replace(old,new)
s=s.replace('2026.10.20-conversa','2026.10.20-chamada')
rep('</style></head>',open('patch/call.css').read()+'</style></head>')
IC={'mic':'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
 'cam':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-10z"/><path d="M15.5 10.5l5-3v9l-5-3z"/><path class="sl" d="M3 4l17 16"/></svg>',
 'chat':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h15v10h-9l-6 4.5z"/><path class="sl" d="M3 4l17 16"/></svg>',
 'more':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/></svg>',
 'hang':'<svg viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor;stroke:none"><path d="M2.6 14.3c5.2-5 13.6-5 18.8 0 .5.5.5 1.2 0 1.7l-2 2c-.4.4-1.1.5-1.6.1l-2.4-1.7c-.4-.3-.6-.7-.6-1.2v-1.8c-1.8-.6-3.8-.6-5.6 0v1.8c0 .5-.2.9-.6 1.2l-2.4 1.7c-.5.4-1.2.3-1.6-.1l-2-2c-.5-.5-.5-1.2 0-1.7z"/></svg>'}
rep('<div id="caps" aria-live="polite"></div>','<div id="caps" aria-live="polite"></div><div id="callImg"><img src="img/sophia-call.webp?v=2026.10.20-chamada" alt="Sophia na chamada de vídeo" decoding="async"></div><div id="spkRing"></div>'
 '<div id="callTop"><span class="rec"></span><span class="tt">Sophia · São Paulo Languages Academy</span><span id="callTime">00:00</span></div>'
 '<div id="selfView" hidden><video id="selfVid" playsinline muted autoplay></video><small>Você</small></div><div id="toast" hidden role="status"></div>'
 '<div id="moreMenu" hidden><button type="button" id="mmKbd">⌨️ Digitar em vez de falar</button><button type="button" id="mmCfg">⚙︎ Ajustes</button><button type="button" id="mmRev" hidden>📋 Revisão da última chamada</button></div>')
rep(' <div id="typeRow">',' <div id="typeRow">')
rep('<button class="sec" id="typeBtn">Enviar</button></div>\n </div>',
 '<button class="sec" id="typeBtn">Enviar</button></div>\n <div id="callHint"></div>\n <div id="callBar" role="toolbar" aria-label="Controles da chamada">'
 f'<button type="button" id="cbMic" aria-label="Microfone: segure para falar" aria-pressed="false">{IC["mic"]}</button>'
 f'<button type="button" id="cbCam" class="off" aria-label="Câmera (só no seu celular)" aria-pressed="false" title="Sua imagem fica só no seu celular">{IC["cam"]}</button>'
 f'<button type="button" id="cbChat" aria-label="Legendas" aria-pressed="true">{IC["chat"]}</button>'
 f'<button type="button" id="cbMore" aria-label="Mais opções">{IC["more"]}</button>'
 f'<button type="button" id="cbHang" class="join" aria-label="Ligar para a Sophia">{IC["hang"]}</button></div>\n </div>')
# ícone riscado só quando desligado
rep('#callBar button.on{','#callBar svg .sl{display:none}#callBar button.off svg .sl{display:inline}#callBar svg{pointer-events:none}#cbHang.join svg{transform:rotate(-135deg)}\n#callBar button.on{')
# Ajustes: modo
rep('<select id="cUi"><option value="conversa">Conversa (novo) — sem interrupções, revisão no fim</option>',
    '<select id="cUi"><option value="chamada">Chamada de vídeo (novo) — estilo Teams</option><option value="conversa">Conversa — corpo inteiro com fundos de SP</option>')
# config
rep("ui:'conversa',bg:'auto',","ui:'chamada',bg:'auto',")
rep("CFG.artV=2;","CFG.artV=2;if(CFG.uiV!==3){CFG.ui='chamada';CFG.uiV=3} // v3: Chamada vira o padrão (uma vez; Conversa e Treino seguem em Ajustes)\n")
rep("const isConv=()=>CFG.ui!=='treino';","const isConv=()=>CFG.ui!=='treino';const isCall=()=>(CFG.ui||'chamada')==='chamada';const uiName=()=>CFG.ui==='treino'?'treino':CFG.ui==='conversa'?'conversa':'chamada';")
rep("document.body.classList.toggle('conv',isConv());if(isConv())pickBg();","document.body.classList.toggle('conv',isConv());document.body.classList.toggle('call',isCall());if(isConv())pickBg();")
rep("function applyUI(){const c=isConv();document.body.classList.toggle('conv',c);","function applyUI(){const c=isConv();document.body.classList.toggle('conv',c);document.body.classList.toggle('call',isCall());$('rvNew').textContent=isCall()?'📞 Ligar de novo':'🎙️ Nova conversa';if(!isCall())camOff(true);")
rep("$('cUi').value=isConv()?'conversa':'treino';","$('cUi').value=uiName();")
rep("const uiCh=(isConv()?'conversa':'treino')!==$('cUi').value;","const uiCh=uiName()!==$('cUi').value;")
# laço: amplitude; render da arte SVG parado no modo Chamada
rep(" mouthUpdate(now,dt);    // 6 · visemas\n render(now);"," mouthUpdate(now,dt);    // 6 · visemas\n if(document.body.classList.contains('call'))callUpdate(now); else render(now);")
# anel de quem fala
rep(" if(s==='SPEAKING'){S.leanT=.2;S.gaze.hold=0}"," if(s==='SPEAKING'){S.leanT=.2;S.gaze.hold=0}\n document.body.classList.toggle('spk',s==='SPEAKING');")
# amplitude do áudio Azure
rep("const src=AC.createBufferSource();src.buffer=ab;src.connect(AC.destination);const t0=AC.currentTime+.05;src.start(t0);",
    "const src=AC.createBufferSource();src.buffer=ab;src.connect(AC.destination);const t0=AC.currentTime+.05;src.start(t0);\n if(!TTSAN){TTSAN=AC.createAnalyser();TTSAN.fftSize=1024;TTSBUF=new Float32Array(1024)}try{src.connect(TTSAN)}catch(_){}S.azPlayUntil=t0+ab.duration;")
# start/stop
rep("function start(){ // parte SÍNCRONA dentro do toque: destrava áudio e inicia o reconhecimento no gesto\n note('');",
    "function start(){ // parte SÍNCRONA dentro do toque: destrava áudio e inicia o reconhecimento no gesto\n note('');if(isCall())callStart();")
rep("CV.ending=false;talkUI()}","CV.ending=false;callStop();talkUI()}")
rep(" diag('stt',DG.stt.replace(/ · modo.*$/,'')+' · modo: '+(ptt?'aperte-para-falar':'mãos livres'))}",
    " diag('stt',DG.stt.replace(/ · modo.*$/,'')+' · modo: '+(ptt?'aperte-para-falar':'mãos livres'));if(typeof callUI==='function'&&$('callBar'))callUI()}")
rep("/* ============ Ganchos de teste (simulam fala do aluno sem microfone) ============ */",open('patch/call.js').read()+"\n$('rvNew').textContent=isCall()?'📞 Ligar de novo':'🎙️ Nova conversa';callUI();\n/* ============ Ganchos de teste (simulam fala do aluno sem microfone) ============ */")
open(P,'w').write(s); print('ok')
