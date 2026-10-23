P='sophia-ao-vivo/index.html'; s=open(P).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a); assert n==cnt,(n,a[:90]); s=s.replace(a,b)
n=s.count('2026.10.20-chamada2'); s=s.replace('2026.10.20-chamada2','2026.10.20-ouvido'); print('versão',n)
css=open('patch/ear.css').read(); js=open('patch/ear.js').read()
i=s.index('</style>'); s=s[:i]+css+s[i:]
# markup: painel + entrada no menu + botão na tela inicial
rep('<button type="button" id="mmRev" hidden>📋 Revisão da última chamada</button></div>','<button type="button" id="mmRev" hidden>📋 Revisão da última chamada</button><button type="button" id="mmEar">🎧 Treino de ouvido (5 min)</button></div><div id="ear" aria-live="polite"></div>')
rep('<div id="callHint"></div>','<button type="button" id="earGo">🎧 Treino de ouvido (5 min)</button><div id="callHint"></div>')
# fala: "mais devagar" ≈ 0,75 e velocidade nativa no treino (ignora o ajuste de velocidade do usuário)
rep("u.rate=S.slow?.72:1","u.rate=S.slow?(S.slowR||.72):1")
rep("function azSSML(text,slow,v){v=v||azVoice(slow);const st=azStyleFor(v),rate=+(CFG.azRate||0);","function azSSML(text,slow,v){v=v||azVoice(slow);const st=azStyleFor(v),rate=(typeof EAR!=='undefined'&&EAR.on)?0:+(CFG.azRate||0);")
rep("const r=slow?'-30%':rate?","const r=slow?(S.slowR?Math.round((S.slowR-1)*100)+'%':'-30%'):rate?")
# STT: repetir a frase dela no treino não é eco; fim de turno vai para o treino
rep("if(echo((fin+int).trim()))return;","if(!(typeof EAR!=='undefined'&&earNoEcho())&&echo((fin+int).trim()))return;")
rep("function endOfTurn(){\n const txt0=(S.finalTxt+' '+S.interim).replace(/\\s+/g,' ').trim();const txt=txt0;",
    "function endOfTurn(){\n const txt0=(S.finalTxt+' '+S.interim).replace(/\\s+/g,' ').trim();const txt=txt0;\n if(EAR.on){S.lastWordsAt=0;S.lastWords='';S.pttFlush=0;S.interim='';$('capInt').textContent='';$('capFinal').textContent='';setState('ATTENDING');earAnswer(txt);return} // treino de ouvido")
rep("const f=$('capFinal').textContent.trim(),it=$('capInt').textContent.trim();","const f=$('capFinal').textContent.trim(),it=$('capInt').textContent.trim();if(EAR.on){const e=$('earLive');if(e)e.textContent=(f+' '+it).trim();return}")
# sessão do treino: sem "Hi! I'm Sophia" nem sessão de conversa
rep(" D.step=0;HIST.length=0;S.state='IDLE';if(isConv())convSessionStart();"," if(EAR.on){S.state='IDLE';return earBegin()} // treino de ouvido\n D.step=0;HIST.length=0;S.state='IDLE';if(isConv())convSessionStart();")
# cartões: etiqueta "ouvido"; a conversa só puxa os cartões dela
rep("old.okNow=!!it.ok;continue}","old.okNow=!!it.ok;if(it.tag)old.tag=it.tag;continue}")
rep("created:now,step:0,due:SR_DAYS.map(d=>now+d*DAY),next:now+DAY,okNow:!!it.ok})}","created:now,step:0,due:SR_DAYS.map(d=>now+d*DAY),next:now+DAY,okNow:!!it.ok,tag:it.tag||null})}")
rep("return cardsGet().filter(c=>c.step<SR_DAYS.length&&c.next<=now)","return cardsGet().filter(c=>c.tag!=='ouvido'&&c.step<SR_DAYS.length&&c.next<=now)")
# barra da chamada durante o treino
rep("$('mmRev').hidden=!(CV.turns.length&&!run);capsApply()}","$('mmRev').hidden=!(CV.turns.length&&!run);capsApply();if(typeof earHint==='function')earHint()}")
rep("$('cbHang').onclick=()=>{$('moreMenu').hidden=true;","$('cbHang').onclick=()=>{$('moreMenu').hidden=true;if(EAR.on)return earFinish();if(EAR.view)earClose();")
rep(" if(!S.running&&!MIC.on){ev.preventDefault();"," if(!S.running&&!MIC.on){ev.preventDefault();if(EAR.view)earClose();")
rep("const capBot=Math.max(0,Math.round(sb.bottom-bb.top+2));","const capBot=Math.max(0,Math.round(sb.bottom-bb.top+2));st.style.setProperty('--earBot',capBot+'px');")
rep("function applyUI(){","function applyUI(){if(typeof EAR!=='undefined'&&!isCall()&&(EAR.on||EAR.view)){if(EAR.on)earFinish();earClose()}")
# módulo antes dos ganchos de teste
rep("/* ============ Ganchos de teste","\n"+js+"\n/* ============ Ganchos de teste")
rep("window.sophiaTest={S,D,VIS,","window.sophiaTest={EAR,earScore,earTok,EAR_SET,S,D,VIS,")
open(P,'w').write(s); print('ok')
