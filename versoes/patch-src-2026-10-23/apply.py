import re
P='sophia-ao-vivo/index.html'
s=open(P).read()
def rep(old,new,count=1):
    global s
    n=s.count(old)
    assert n==count, (n,old[:90])
    s=s.replace(old,new)
css=open('patch/conv.css').read(); art=open('patch/art.js').read(); conv=open('patch/conv.js').read()
# versão
s=s.replace('2026.10.20-aria','2026.10.20-conversa')
rep('</style></head>',css+'</style></head>')
# HTML: palco
rep('<div id="stage"><div id="svgHost"></div>','<div id="stage"><div id="bgHost" aria-hidden="true"></div><div id="svgHost"></div><div id="practice" hidden aria-live="polite"><span id="prLbl"></span><div id="prTxt"></div><div id="prHint"></div></div><div id="caps" aria-live="polite"></div>')
rep('<div id="controls"><button class="big" id="btnStart">','<div id="controls"><button type="button" id="btnEnd" hidden>Terminar</button><button type="button" id="btnRev" hidden title="Revisão da última conversa">📋 Revisão</button><button class="big" id="btnStart">')
rep('<button class="sec" id="btnStop" hidden>Parar</button></div>','<button class="sec" id="btnStop" hidden>Parar</button><button type="button" id="btnKbd" title="Digitar em vez de falar" aria-label="Digitar">⌨️</button><button type="button" id="btnGear" title="Ajustes" aria-label="Ajustes">⚙︎</button></div>')
rep('</main>\n<dialog id="cfg">','''</main>
<section id="review" hidden aria-label="Revisão da conversa">
 <div class="rvh"><b>Revisão da conversa</b><button type="button" id="rvClose" aria-label="Fechar">✕</button></div>
 <div class="rvsum" id="rvSum"></div>
 <nav class="rvtabs"><button type="button" data-t="tr" class="on">Conversa</button><button type="button" data-t="er" id="rvTabEr">Erros</button><button type="button" data-t="cd">Cartões</button></nav>
 <div id="rvBody"></div>
 <div class="rvfoot"><button type="button" class="big" id="rvNew">🎙️ Nova conversa</button></div>
</section>
<dialog id="cfg">''')
rep(''' <p>As chaves ficam <b>só neste aparelho</b> (localStorage). Nada é enviado ao nosso site.</p>''',''' <p>As chaves ficam <b>só neste aparelho</b> (localStorage). Nada é enviado ao nosso site. <a href="../">← Protótipo</a></p>
 <label>Modo</label><select id="cUi"><option value="conversa">Conversa (novo) — sem interrupções, revisão no fim</option><option value="treino">Treino com correção na hora (atual)</option></select>
 <label>Quem responde</label><select id="cMode"><option value="demo">Demo roteirizado (sem chave)</option><option value="llm">IA de verdade (sua chave)</option></select>
 <label style="display:flex;gap:8px;align-items:center"><input id="cFree" type="checkbox" style="width:auto"> Mãos livres (sem segurar o botão)</label>
 <label>Fundo de São Paulo (modo Conversa)</label><select id="cBg"><option value="auto">Automático — um marco por sessão</option></select>''')
rep('<label>Arte da Sophia</label><select id="cArt">','<label>Arte da Sophia <small style="font-weight:400;opacity:.7">(no modo Conversa, a frontal aparece de corpo inteiro)</small></label><select id="cArt">')
# JS: arte + fundos antes do $
rep("const $=id=>document.getElementById(id);",art+"\nconst $=id=>document.getElementById(id);")
# CFG
rep("lvl:'B1',mode:'demo',diag:false,","lvl:'B1',mode:'demo',diag:false,ui:'conversa',bg:'auto',")
rep("buildRig();\n$('btnAvatar').onclick","document.body.classList.toggle('conv',isConv());if(isConv())pickBg();\nbuildRig();\n$('btnAvatar').onclick")
# buildRig: corpo inteiro
rep("$('oHeadset').setAttribute('display',CFG.art==='frontal-hs'?'inline':'none');setVis('sil')}",
    "$('oHeadset').setAttribute('display',CFG.art==='frontal-hs'?'inline':'none');setVis('sil');\n  if(isConv())Object.assign(R,{full:true},makeFullBody(R.svg))}")
rep("function avatarView(){const mini=$('stage').classList.contains('mini');",
    "function avatarView(){if(R.full){R.svg.setAttribute('viewBox',`0 ${FB_TOP} ${FB_W} ${FB_H}`);R.svg.setAttribute('preserveAspectRatio','xMidYMax meet');return}\n const mini=$('stage').classList.contains('mini');")
# frame dt
rep(" const now=clockNow(),dt=Math.min(.05,Math.max(0,now-(S.t||now)));S.t=now;"," const now=clockNow(),dt=Math.min(.05,Math.max(0,now-(S.t||now)));S.t=now;S.dt=dt;")
# renderFrontal: corpo inteiro inclina pela cintura, menos; braços
rep(" R.torso.style.transform=`scaleY(${(1+breath*.012).toFixed(4)})`;\n const rot=clamp(c.rot.x,-10,10)",
    " R.torso.style.transform=`scaleY(${(1+breath*.012).toFixed(4)})`;\n if(R.full){R.body.style.transform=`translateY(${(Math.max(0,c.bodyY.x)*.6).toFixed(2)}px) scale(${(1+(c.lean.x-1)*.55).toFixed(4)}) skewX(${(c.skew.x*.6).toFixed(2)}deg)`;renderArms(now,S.dt||.016,breath)}\n const rot=clamp(c.rot.x,-10,10)")
# endOfTurn
rep(" if(S.rep)return handleRepeat(txt,S.lastMe); // tentativa do \"repita comigo\"",
    " if(S.prac)return handlePractice(txt,S.lastMe); // modo Conversa: treino do fim (A: repita comigo, B: de memória)\n if(S.rep)return handleRepeat(txt,S.lastMe); // tentativa do \"repita comigo\"")
rep("S.corrP=correctTurn(txt,alts,S.lastQ).then(c=>{el.dataset.corrSrc='call';showHeard({heard:c.said,isError:c.isError,corrected:c.corrected,why:c.why_pt},el,true);diag('err','');return c})",
    "S.corrP=correctTurn(txt,alts,S.lastQ).then(c=>{el.dataset.corrSrc='call';showHeard({heard:c.said,isError:c.isError,corrected:c.corrected,why:c.why_pt,important:c.important,meaning:c.meaning,cat:c.category,pt:c.corrected_pt},el,true);diag('err','');return c})")
rep(" respond(txt);\n}"," if(isConv()){CV.pend.push(S.corrP);if(isGoodbye(txt))return endConversation(true)} // despedida → revisão do fim\n respond(txt);\n}")
# showHeard: registra
rep(" const corr=r.corrected&&r.isError!==false&&norm(r.corrected)!==norm(heard)?r.corrected.trim():null;\n",
    " const corr=r.corrected&&r.isError!==false&&norm(r.corrected)!==norm(heard)?r.corrected.trim():null;\n convOnCorr(el,r,heard,corr); // modo Conversa: legenda vermelho/verde + registro do erro\n")
# legendas: addMsg/renderMsg
rep("function addMsg(who,text,emph,pt){const d=document.createElement('div');d.className='msg '+who;d.dataset.sent=text;renderMsg(d,text,emph,pt);logAdd(d);return d}",
    "function addMsg(who,text,emph,pt){const d=document.createElement('div');d.className='msg '+who;d.dataset.sent=text;if(isConv())convTurn(d,who,text);renderMsg(d,text,emph,pt);logAdd(d);return d}")
rep(" d.innerHTML=h+(pt?`<span class=\"pt\">${esc(pt)}</span>`:'');$('log').scrollTop=1e9}",
    " d.innerHTML=h+(pt?`<span class=\"pt\">${esc(pt)}</span>`:'');$('log').scrollTop=1e9;\n const t=d._turn;if(t&&t.who==='so'){t.text=text;if(pt)t.pt=pt;capRender(t)}}")
rep("else if(q.bubble&&!q.final)q.bubble.textContent=q.said.join(' ');","else if(q.bubble&&!q.final)renderMsg(q.bubble,q.said.join(' '));")
# sem "repita" no meio da conversa no modo Conversa
rep(" const target=pickRepeat(c,r);\n if(target)return startRepeat"," const target=isConv()?null:pickRepeat(c,r);\n if(target)return startRepeat")
rep(" if(r.repeat)return startRepeat(r.repeat,lastQuestion(r.reply));"," if(r.repeat&&!isConv())return startRepeat(r.repeat,lastQuestion(r.reply));")
rep(" if(r.tip)addTip(r.tip);\n S.lastQ=lastQuestion(r.reply)||r.reply;\n const out"," if(r.tip&&!isConv())addTip(r.tip);\n S.lastQ=lastQuestion(r.reply)||r.reply;\n const out")
# prompt
rep("const{full}=await llmCall([{role:'system',content:SYS.replace('{LVL}',CFG.lvl)},...HIST.slice(-12)],{onDelta});",
    "const sys=isConv()?SYS_CONV.replace(/\\{LVL\\}/g,CFG.lvl).replace('{ELICIT}',elicitText()):SYS.replace(/\\{LVL\\}/g,CFG.lvl);\n const{full}=await llmCall([{role:'system',content:sys},...HIST.slice(-12)],{onDelta});")
# esquema de correção: sentido, categoria, tradução
rep("important:{type:'boolean'},unclear:{type:'boolean'},why_pt:{type:['string','null']}},required:['said','corrected','isError','important','unclear','why_pt']",
    "important:{type:'boolean'},unclear:{type:'boolean'},why_pt:{type:['string','null']},meaning:{type:'boolean'},category:{type:['string','null']},corrected_pt:{type:['string','null']}},required:['said','corrected','isError','important','unclear','why_pt','meaning','category','corrected_pt']")
rep("- why_pt: very short reason in Brazilian Portuguese, or null.\n",
    "- why_pt: very short reason in Brazilian Portuguese, or null.\n- meaning: true if the mistake changes or obscures what they meant (wrong tense/time, false friend, missing negation, unclear word), else false.\n- category: 2-4 word English label of the mistake type (e.g. \"past tense\", \"preposition on/in\", \"he/she -s\", \"have for age\"), or null.\n- corrected_pt: Brazilian Portuguese translation of \"corrected\", or null.\n")
rep("why_pt:o.why_pt&&o.why_pt!=='null'?String(o.why_pt):null};",
    "why_pt:o.why_pt&&o.why_pt!=='null'?String(o.why_pt):null,meaning:b(o.meaning),category:o.category&&o.category!=='null'?String(o.category):null,corrected_pt:o.corrected_pt&&o.corrected_pt!=='null'?String(o.corrected_pt):null};")
rep("const said=g('said');if(said===undefined)return null;o={said,corrected:g('corrected'),isError:g('isError'),important:g('important'),unclear:g('unclear'),why_pt:g('why_pt')}}",
    "const said=g('said');if(said===undefined)return null;o={said,corrected:g('corrected'),isError:g('isError'),important:g('important'),unclear:g('unclear'),why_pt:g('why_pt'),meaning:g('meaning'),category:g('category'),corrected_pt:g('corrected_pt')}}")
# legenda ao vivo
rep("function capSync(){const on=","function capSync(){convLive();const on=")
# sessão
rep(" D.step=0;HIST.length=0;S.state='IDLE';"," D.step=0;HIST.length=0;S.state='IDLE';if(isConv())convSessionStart();")
# talkUI: botões do modo Conversa
rep(" $('btnTalk').hidden=!(run&&ptt);$('btnDone').hidden=!(run&&!ptt);",
    " $('btnTalk').hidden=!(run&&ptt);$('btnDone').hidden=!(run&&!ptt);\n $('btnEnd').hidden=!(run&&isConv());$('btnEnd').textContent=S.prac||CV.ending?'Pular':'Terminar';$('btnRev').hidden=!(isConv()&&!run&&CV.turns.length>0);")
# stop: libera o fim
rep("analyser=null;setState('IDLE');$('btnStart').hidden=false;$('btnStop').hidden=true;diag('mic','fechado')}",
    "analyser=null;setState('IDLE');$('btnStart').hidden=false;$('btnStop').hidden=true;diag('mic','fechado');if(S.prac){CV.abort=true;S.prac=null;prHide()}CV.ending=false;talkUI()}")
# demo: no modo Conversa o roteiro também não pede repetição
# Ajustes
rep("$('cArt').value=CFG.art||'frontal';$('appV').textContent='versão '+APP_V;$('cfg').showModal()};",
    "$('cArt').value=CFG.art||'frontal';$('appV').textContent='versão '+APP_V;$('cUi').value=isConv()?'conversa':'treino';$('cMode').value=CFG.mode;$('cFree').checked=CFG.talk==='free';$('cBg').value=CFG.bg||'auto';$('cfg').showModal()};\n$('cBg').innerHTML+=BG_LIST.map(([v,n])=>`<option value=\"${v}\">${esc(n)}</option>`).join('');")
rep(" if((CFG.art||'frontal')!==$('cArt').value){CFG.art=$('cArt').value;buildRig()}",
    " const uiCh=(isConv()?'conversa':'treino')!==$('cUi').value;CFG.ui=$('cUi').value;\n if(CFG.mode!==$('cMode').value){CFG.mode=$('cMode').value;$('modeSel').value=CFG.mode}\n if((CFG.talk==='free')!==$('cFree').checked){$('freeTgl').checked=$('cFree').checked;$('freeTgl').onchange({target:$('freeTgl')})}\n if((CFG.bg||'auto')!==$('cBg').value){CFG.bg=$('cBg').value;if(isConv())pickBg()}\n if(uiCh)applyUI(); else if((CFG.art||'frontal')!==$('cArt').value){CFG.art=$('cArt').value;buildRig()}\n if(uiCh&&(CFG.art||'frontal')!==$('cArt').value){CFG.art=$('cArt').value;buildRig()}")
# lógica do modo conversa antes dos ganchos de teste
rep("/* ============ Ganchos de teste (simulam fala do aluno sem microfone) ============ */",conv+"\n/* ============ Ganchos de teste (simulam fala do aluno sem microfone) ============ */")
rep("state:()=>S.state,MO,","state:()=>S.state,MO,CV,cards:()=>cardsGet(),end:()=>endConversation(false),diffHTML:(a,b)=>diffHTML(a,b),dueAll:()=>{const L=cardsGet();L.forEach(c=>c.next=0);cardsSet(L)},")
open(P,'w').write(s)
print('ok',len(s))
