import re,sys
from urllib.parse import quote
P='v6/index.html';s=open(P).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a)
    assert n>=1,('MISSING',a[:80])
    if cnt==1: assert n==1,('MULTI',n,a[:80])
    s=s.replace(a,b) if cnt!=1 else s.replace(a,b,1)
V='2026.10.20-trilha'
# meta + título
rep('<meta name="theme-color" content="#0B1119">','<meta name="theme-color" content="#0B1119">\n<meta name="prototipo-version" content="v7 · versão %s">'%V)
rep('<title>Protótipo v5 · São Paulo Languages Academy · Inglês profissional</title>','<title>Protótipo v7 · São Paulo Languages Academy · Inglês profissional</title>')
# links quebrados para a v3 (relativos à pasta v6)
s=s.replace('href="v3/index.html"','href="../v3/index.html"')
# logo mais nítido / branco
s=s.replace('fill:#F3EBDD" aria-hidden="true"><use href="#mk8"/>','fill:#FBF8F1" aria-hidden="true"><use href="#mk8"/>')
# CSS
css=open('patch/v6/merge.css').read()
i=s.index('</style>');s=s[:i]+css+s[i:]
# roteador: argumento depois de "~" e gancho
rep("function show(id){\n  if(!document.getElementById(id)","function show(id){\n  let _arg=null;{const k=String(id).indexOf('~');if(k>0){_arg=id.slice(k+1);id=id.slice(0,k)}} window.ROUTE_ARG=_arg;\n  if(!document.getElementById(id)")
rep("  document.title=(scr.querySelector('h1,h2,.ttl')?.textContent.trim().slice(0,48)||'Protótipo')+' · São Paulo Languages Academy';\n}",
    "  document.title=(scr.querySelector('h1,h2,.ttl')?.textContent.trim().slice(0,48)||'Protótipo')+' · São Paulo Languages Academy';\n  if(window.onShowMerge) try{window.onShowMerge(id,_arg)}catch(err){console.error(err)}\n}")
# novas telas
scr=open('patch/v6/screens.html').read()
top=re.search(r'<section class="screen" id="practice" data-tab="practice">\s*(<header class="topbar">.*?</header>)',s,re.S).group(1)
scr=scr.replace('@@TOPBAR@@',top)
rep('  <div class="toast" id="toast" role="status" aria-live="polite"></div>',scr+'\n  <div class="toast" id="toast" role="status" aria-live="polite"></div>')
# D1 aquecimento: cartões reais primeiro; segue para a Trilha · episódio
rep('<div class="flash" id="wcard"></div>','<div id="oWarmReal"></div>\n      <div class="flash" id="wcard"></div>')
rep('<button class="btn primary" data-go="d-trail" id="wnext">','<button class="btn primary" data-go="d-ouvir" id="wnext">')
# D2 trilha: agora é a segunda parte (2b)
rep('<span class="char" data-who="erick" data-size="28"></span>Trilha com o Erick <span class="muted" style="margin-left:auto;font-weight:600" id="tcount">',
    '<span class="char" data-who="erick" data-size="28"></span>Trilha · exercícios <span class="muted" style="margin-left:auto;font-weight:600" id="tcount">')
# D3 bate-papo: ligar de verdade (sophia-ao-vivo com tema e alvos da sessão)
CALL='../sophia-ao-vivo/?tema='+quote('a weekly status meeting: running behind or on track')+'&alvos='+quote('running behind / on track; Could you + verb')+'&from=rotina'
rep('      <div class="callbar">\n        <button class="cb" id="cbmute">','      <a class="o-callreal" href="%s">📞 Ligar de verdade para a Sophia <small>· ao vivo, mesmo tema e alvos</small></a>\n      <div class="callbar">\n        <button class="cb" id="cbmute">'%CALL)
# D4 fechamento: resumo real + Capital real; demo fica como exemplo
rep('<div class="say r" style="margin-top:4px"><div class="char" data-who="lili" data-size="60"></div><div class="bub"><div class="who">Fechamento com a Teacher Lili</div>',
    '<div class="say r" style="margin-top:4px"><div class="char" data-who="lili" data-size="60"></div><div class="bub"><div class="who">Fechamento com a Teacher Lili</div><span class="tiny muted" style="display:block">exemplo abaixo; seu resumo real vem primeiro</span>')
rep('''<div class="c-main">
          <div class="card ink pv-band" style="padding-top:30px">''','''<div class="c-main">
          <div id="oReal"></div>
          <div class="o-lv" style="margin-top:2px">Exemplo · dados fictícios</div>
          <div class="card ink pv-band" style="padding-top:30px">''')
rep('<div class="foot"><button class="btn primary" data-go="home">Concluir sessão</button></div>','<div class="foot"><button class="btn primary" data-go="home" id="oClose">Concluir sessão</button></div>')
# checkpoint semanal real
rep('Depois eu digo o que melhorou e 1 ponto para a semana que vem.</div></div>','Depois eu digo o que melhorou e 1 ponto para a semana que vem.</div></div>\n      <div id="oWeek"></div>')
# Praticar: podcast + cartões reais
rep('<div class="card" style="padding:2px 14px">\n        <div class="tool"><div class="ico"><svg class="i " aria-hidden="true"><use href="#i-cards"/></svg></div><div style="flex:1"><div class="t">Meus cards</div>',
    '<div class="card" style="padding:2px 14px">\n        <div class="tool" data-go="ouvir" style="cursor:pointer"><div class="ico"><svg class="i " aria-hidden="true"><use href="#i-headphones"/></svg></div><div style="flex:1"><div class="t">Ouvir com o Erick · podcast</div><div class="s">7 episódios A2+–B2 · pegue o trecho + letra</div></div><span class="cnt" style="background:var(--yellow);color:var(--ink)">novo</span></div>\n        <div class="tool" data-go="cartoes" style="cursor:pointer"><div class="ico"><svg class="i " aria-hidden="true"><use href="#i-cards"/></svg></div><div style="flex:1"><div class="t">Meus cards</div>')
# Hoje: "ver tudo" abre a trilha completa
rep('<div class="sec">Trilha · Trabalho: reuniões, tickets e e-mails <a href="#practice">ver tudo</a></div>','<div class="sec">Trilha · Trabalho: reuniões, tickets e e-mails <a href="#trilha">ver a trilha</a></div>')
# ciclo: link do documento de metodologia
rep('Mais do método','<button class="lnk" data-how="1" style="font-size:14px;font-weight:700;display:block;margin:0 0 8px">Como a trilha aplica o método (1 página) ›</button>Mais do método')
# sobre: versão
rep('Protótipo v4 · dados de demonstração · <a class="lnk" href="../v3/index.html" style="font-size:12.5px">ver v3</a>',
    'Protótipo v7 (v6 + Rotina na trilha) · versão %s · dados de demonstração · <a class="lnk" href="../v3/index.html" style="font-size:12.5px">ver v3</a> · <a class="lnk" href="../versoes/2026-10-20-antes/" style="font-size:12.5px">cópia de antes</a>'%V)
# índice do protótipo
rep('<h3>Protótipo v6 · índice das telas</h3>','<h3>Protótipo v7 · índice das telas</h3>')
rep('<div class="grp">Sessão diária</div>\n  <a href="#d-warm">D1. Aquecimento · Erick</a><a href="#d-trail">D2. Trilha · Erick</a>',
    '<div class="grp">Sessão diária</div>\n  <a href="#d-warm">D1. Aquecimento · Erick</a><a href="#d-ouvir">D2a. Trilha · Ouvir com o Erick</a><a href="#d-trail">D2b. Trilha · exercícios · Erick</a>')
rep('<div class="grp">Comunidade</div>\n  <a href="#community">','<div class="grp">v7 · Rotina na trilha</div>\n  <a href="#trilha">T0. Trilha Pre-A1 → C1</a><a href="#ouvir">P1. Ouvir com o Erick · podcast</a><a href="#ep~ep1">P2. Player do episódio</a><a href="#foco~ep1">P3. Treino focado</a><a href="#cartoes">P4. Seus cartões reais</a><a href="#m-checkpoint">P5. Checkpoint real</a>\n  <div class="grp">Comunidade</div>\n  <a href="#community">')
# ===== v7.1 · Bate-papo = chamada de vídeo (Teams) · Erick = podcast (Spotify) =====
V2='2026.10.20-chamada'
s=s.replace('versão %s'%V,'versão %s'%V2)
rep("window.ROUTE_ARG=_arg;","if(id==='d-call'&&_arg!=='texto'){id='sophia';_arg='sessao'}else if(id==='chat'&&_arg!=='texto'){id='sophia';_arg=_arg||'hotel'}else if(id==='m-talk'&&_arg!=='texto'){id='sophia';_arg='cliente'} window.ROUTE_ARG=_arg;")
rep('background:var(--yellow-l);border-color:transparent" data-go="chat">','background:var(--yellow-l);border-color:transparent" data-go="sophia~livre">')
rep('<button class="mcard k" data-go="chat"><span>B1 · 6 min</span><b>Apresente','<button class="mcard k" data-go="sophia~projeto"><span>B1 · 6 min</span><b>Apresente')
rep('<button class="mcard" data-go="chat"><span>A2+ · 5 min</span><b>Small talk','<button class="mcard" data-go="sophia~smalltalk"><span>A2+ · 5 min</span><b>Small talk')
rep('<button class="mcard" data-go="chat"><span>B1 · 7 min</span><b>Peça mais prazo','<button class="mcard" data-go="sophia~prazo"><span>B1 · 7 min</span><b>Peça mais prazo')
rep('<button class="ib" data-go="chat" aria-label="Fechar">','<button class="ib" data-go="chat~texto" aria-label="Fechar">')
rep('<div class="dim" data-go="chat"></div>','<div class="dim" data-go="chat~texto"></div>')
rep("if(h==='m-talk')v6tk();","if(h==='m-talk~texto')v6tk();")
rep("if(h0==='m-talk')v6tk();","if(h0==='m-talk~texto')v6tk();")
rep('<a class="o-callreal" href="%s">📞 Ligar de verdade para a Sophia <small>· ao vivo, mesmo tema e alvos</small></a>'%CALL,
    '<a class="o-callreal" href="#sophia~sessao">📹 Voltar para a chamada de vídeo com a Sophia <small>· padrão: voz, legendas e câmera</small></a>')
rep('<a href="#d-call">D3. Bate-papo por voz · Sophia</a>','<a href="#d-call">D3. Bate-papo · chamada de vídeo · Sophia</a><a href="#d-call~texto">D3t. Bate-papo · modo texto (sem microfone)</a>')
rep('<a href="#chat">10. Missão com a Sophia</a>','<a href="#chat">10. Missão com a Sophia (chamada)</a><a href="#chat~texto">10t. Missão · modo texto</a>')
rep('<a href="#m-talk">M2. Conversa com objetivo · Sophia</a>','<a href="#m-talk">M2. Conversa com objetivo · Sophia (chamada)</a><a href="#m-talk~texto">M2t. Conversa · modo texto</a>')
# "Ouça a história" (lição do hotel): mesmo formato de podcast do Erick
SK=lambda fw:'<svg viewBox="0 0 24 24" aria-hidden="true" class="sk"><path d="%s" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="%s" fill="currentColor"/><text x="12" y="15.6" text-anchor="middle" font-size="7.4" font-weight="800" fill="currentColor">15</text></svg>'%(('M12 5a7 7 0 1 1-7 7','M12 1.8v6.4l4-3.2z') if fw else ('M12 5a7 7 0 1 0 7 7','M12 1.8v6.4L8 5z'))
rep("""      <div class="player">
        <div class="row between"><b class="disp" style="font-size:19px">Room 512</b><span class="small">3 vozes · inglês americano</span></div>
        <div class="wave" id="wave"></div>
        <div class="row between small" style="font-weight:700;font-variant-numeric:tabular-nums"><span>0:41</span><button class="ib" style="background:var(--yellow);color:var(--ink)" aria-label="Pausar"><svg class="i " aria-hidden="true"><use href="#i-pause"/></svg></button><span>1:12</span></div>
        <div class="row" style="gap:6px;margin-top:10px"><span class="tag" style="background:rgba(243,235,221,.14);color:var(--cream)">0,8×</span><span class="tag" style="background:rgba(243,235,221,.14);color:var(--cream)">Legenda EN</span></div>
      </div>""","""      <div class="player o-mini">
        <div class="o-mrow"><span class="o-mcv" role="img" aria-label="Capa: Erick no estúdio"></span><div style="min-width:0"><small>Ouvir com o Erick · história</small><b class="disp">Room 512</b><span class="small">3 vozes · inglês americano</span></div></div>
        <div class="wave" id="wave"></div>
        <div class="o-mbar"><i style="width:57%"></i></div>
        <div class="row between small" style="font-weight:700;font-variant-numeric:tabular-nums;margin-top:4px"><span>0:41</span><span>1:12</span></div>
        <div class="o-ctl o-ctl-sm"><span class="tag" style="background:rgba(251,248,241,.14);color:var(--cream)">0,8×</span><button type="button" aria-label="Voltar 15 segundos">"""+SK(0)+"""</button><button type="button" class="pp" aria-label="Pausar"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg></button><button type="button" aria-label="Avançar 15 segundos">"""+SK(1)+"""</button><span class="tag" style="background:rgba(251,248,241,.14);color:var(--cream)">Legenda EN</span></div>
      </div>""")
# ===== v7.2 · Rota até a Paulista =====
V3='2026.10.20-rota2'
s=s.replace('versão %s'%V2,'versão %s'%V3)
rep("""    <div class="pv-strip"></div>
    <div class="scroll">
      <div class="row" style="gap:14px;margin:8px 0 16px">
        <div class="av y" style="width:68px;height:68px;font-size:26px;""","""    <div class="pv-strip"></div>
    <div class="scroll">
      <div id="oRotaHero"></div>
      <div class="row" style="gap:14px;margin:8px 0 16px">
        <div class="av y" style="width:68px;height:68px;font-size:26px;""")
rep('<div><div class="muted small">Boa noite,</div><h2 style="font-size:26px">Joël</h2></div>','<div><div class="muted small">Boa noite,</div><h2 style="font-size:26px">Joël</h2><a class="o-rchip" href="#rota">📍 A2+ · Nove de Julho</a></div>')
rep('<a href="#trilha">T0. Trilha Pre-A1 → C1</a>','<a href="#trilha">T0. Trilha Pre-A1 → C1</a><a href="#rota">T1. Rota até a Paulista (níveis)</a>')
# ===== v7.4 · Humanizer (pt-BR): revisão leve do texto fixo, mesmo sentido, tom honesto =====
V4='2026.10.23-humano'
s=s.replace('versão %s'%V3,'versão %s'%V4)
rep('Constância conta mais do que maratona. Se a semana apertar,','Um pouco todo dia rende mais do que muito de uma vez. Se a semana apertar,')
rep('Hoje você resolveu um problema real em inglês. Isso é progresso de verdade, e dá para medir.','Hoje você resolveu um problema real em inglês. No resumo dá para ver o que melhorou.')
rep('uma revisão rápida amanhã de manhã ajuda a fixar: o sono consolida o que você estudou hoje.','uma revisão rápida amanhã de manhã ajuda a fixar, porque o sono consolida o que você estudou hoje.')
rep('fazendo o que ensina de verdade: praticar com frequência,','fazendo o que mais ajuda a aprender: praticar com frequência,')
rep('O que fica da temporada não é o 2º lugar: são os 4 can-dos novos. A temporada 3 começa segunda, com o placar zerado.','Você fechou a temporada em 2º, com 4 can-dos novos. Na segunda começa a temporada 3: o placar zera, os can-dos ficam com você.')
rep('Agora, um resumo curto e honesto do que aconteceu na sessão.','Abaixo, o que aconteceu na sessão, sem enfeite.')
# ===== v7.5 · Voz: Sophia com voz em streaming + opção voz do Grok (sophia-ao-vivo 2026.10.23-voz) =====
V5='2026.10.23-voz'
s=s.replace('versão %s'%V4,'versão %s'%V5)
# módulo
js=open('patch/v6/merge.js').read().replace('/*@@EPS@@*/',open('patch/v6/eps.js').read()).replace('/*@@SCORING@@*/',open('patch/v6/scoring.js').read()).replace('/*@@ROTA@@*/',open('patch/v6/rota.js').read())
js=js.replace("window.onShowMerge=onShow;","window.onShowMerge=onShow;\n{const h=location.hash.slice(1)||'welcome';const k=h.indexOf('~');onShow(k>0?h.slice(0,k):h,k>0?h.slice(k+1):null)}")
i=s.rindex('</script>')+len('</script>');s=s[:i]+'\n<script>\n'+js+'\n</script>'+s[i:]
open(P,'w').write(s);print('ok',len(s))
