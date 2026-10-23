P='sophia-ao-vivo/index.html'; s=open(P).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a); assert n==cnt,(n,a[:90]); s=s.replace(a,b)
n=s.count('2026.10.20-ouvido'); s=s.replace('2026.10.20-ouvido','2026.10.20-tema'); print('versão',n)
# parâmetro ?tema= (e ?from=rotina)
rep("const CFG=Object.assign(","""/* ?tema=… abre a chamada já no assunto (ex.: vindo do episódio do dia na Rotina); ?from=rotina mostra o "voltar". Nada mais muda. */
const QS=new URLSearchParams(location.search),TEMA=(QS.get('tema')||'').replace(/[<>"`{}\\\\]/g,'').replace(/\\s+/g,' ').trim().slice(0,80),FROM_ROTINA=QS.get('from')==='rotina';
const CFG=Object.assign(""")
rep(".replace('{ELICIT}',elicitText())",".replace('{ELICIT}',elicitText()+temaText())")
rep("function elicitText(){","""function temaText(){return TEMA?`\\nToday's topic: "${TEMA}". The student ${FROM_ROTINA?'just listened to a short podcast episode about it (hosted by Erick, the course coach)':'chose this topic'}. Open and keep the chat around it, asking about their own experience; if they change the subject, follow them naturally.`:''}
function elicitText(){""")
i=s.index(" const hello=CFG.mode==='llm'&&CFG.key?"); j=s.index("\n",i)
old=s[i:j]
s=s[:i]+""" const hello=TEMA?(CFG.mode==='llm'&&CFG.key?(FROM_ROTINA?`Hi, I'm Sophia! Erick said you just heard his episode about ${TEMA}. Did you like it?`:`Hi! I'm Sophia. Today let's talk about ${TEMA}. Have you ever dealt with that at work?`)
   :`Hi! I'm Sophia. Today's topic is ${TEMA}, but first, what's your name?`)
  :CFG.mode==='llm'&&CFG.key?"Hi, I'm Sophia! What's your name?":"Hi, I'm Sophia! What's your name?";"""+s[j:]
rep("deliver({reply:hello,pt:'Oi! Eu sou a Sophia. Qual é o seu nome?'});","deliver({reply:hello,pt:TEMA?'Oi! Eu sou a Sophia. Tema de hoje: '+TEMA+'.':'Oi! Eu sou a Sophia. Qual é o seu nome?'});")
# dica na tela inicial com o tema
rep("$('callHint').textContent=!run?(CV.turns.length?'Chamada encerrada · toque no verde para ligar de novo':'Toque no botão verde para ligar para a Sophia')",
    "$('callHint').textContent=!run?(CV.turns.length?'Chamada encerrada · toque no verde para ligar de novo':TEMA?'Tema: '+TEMA+' · toque no verde para ligar':'Toque no botão verde para ligar para a Sophia')")
# marca para a Rotina: chamada feita (desligar) — a Rotina lê ao voltar
rep("$('cbHang').onclick=()=>{$('moreMenu').hidden=true;if(EAR.on)return earFinish();if(EAR.view)earClose();",
    "$('cbHang').onclick=()=>{$('moreMenu').hidden=true;if(EAR.on)return earFinish();if(EAR.view)earClose();if(S.running)rotinaMark();")
rep(" cardsAdvance();CV.ended=true;CV.ending=false;\n if(S.running)stop();talkUI();openReview()}",
    " cardsAdvance();CV.ended=true;CV.ending=false;rotinaMark();\n if(S.running)stop();talkUI();openReview()}")
rep("async function finishConversation(){","""function rotinaMark(){ // a etapa "Chamada com a Sophia" da Rotina marca como feita quando o aluno volta (mesma origem, localStorage)
 try{if(typeof EAR!=='undefined'&&EAR&&EAR.on)return;const me=CV.turns.filter(t=>t.who==='me'&&!t.practice);
  const old=JSON.parse(localStorage.getItem('sophiaRotinaCall')||'null'),same=old&&old.sid===CV.sessionAt;
  localStorage.setItem('sophiaRotinaCall',JSON.stringify({sid:CV.sessionAt,at:Date.now(),tema:TEMA||null,turns:me.length,
   secs:same?old.secs:Math.round((Date.now()-(CV.sessionAt||Date.now()))/1000),
   errs:me.filter(t=>t.isError&&t.corrected).map(t=>({said:t.heard||t.text,corrected:t.corrected,why:t.why||null})).slice(0,6)}))}catch(_){}}
async function finishConversation(){""")
# links: voltar para a Rotina + "Também no app: Ouvir com o Erick"
rep('<button type="button" id="mmEar">🎧 Treino de ouvido (5 min)</button></div>',
    '<button type="button" id="mmEar">🎧 Treino de ouvido (5 min)</button><a id="mmErick" href="../rotina/#ouvir">🎙️ Também no app: Ouvir com o Erick</a><a id="mmRotina" href="../rotina/#hoje" hidden>↩ Voltar para a rotina de hoje</a></div>')
rep('id="rvNew">🎙️ Nova conversa</button></div>','id="rvNew">🎙️ Nova conversa</button><a class="big" id="rvRotina" href="../rotina/#hoje" hidden>↩ Voltar para a rotina</a></div>')
rep("#moreMenu button:hover{background:#ffffff14}","#moreMenu button:hover{background:#ffffff14}#moreMenu a{color:#fff;text-decoration:none;padding:11px 12px;font-size:15px;border-radius:9px;display:block}#moreMenu a:hover{background:#ffffff14}#moreMenu a[hidden]{display:none}\n.rvfoot a.big{display:block;text-align:center;text-decoration:none;margin-top:8px;background:#ffffff1f;color:inherit;padding:12px;border-radius:14px;font-weight:600}.rvfoot a[hidden]{display:none}\n#ear .earLink{display:block;text-align:center;font-size:13.5px;color:#9FF0BE;margin-top:10px;text-decoration:none}")
rep("$('mmEar').onclick=()=>earOpen();","$('mmEar').onclick=()=>earOpen();if(FROM_ROTINA){$('mmRotina').hidden=false;$('rvRotina').hidden=false}")
# no resumo do treino: link para o podcast
rep("""<div class="earBtns two"><button type="button" class="pri" data-a="again-all">🎧 Treinar de novo</button><button type="button" data-a="close">Fechar</button></div>`}""",
    """<div class="earBtns two"><button type="button" class="pri" data-a="again-all">🎧 Treinar de novo</button><button type="button" data-a="close">Fechar</button></div><a class="earLink" href="../rotina/#ouvir">🎙️ Também no app: Ouvir com o Erick — episódios curtos</a>`}""")
open(P,'w').write(s); print('ok')
