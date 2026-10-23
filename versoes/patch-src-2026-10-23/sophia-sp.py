import re
P='sophia-ao-vivo/index.html';s=open(P).read()
def rep(a,b,n=None):
    global s
    c=s.count(a);assert c>=1,('MISSING',a[:90])
    if n: assert c==n,('COUNT',c,a[:90])
    s=s.replace(a,b)
s=s.replace('2026.10.20-tema','2026.10.20-sp')
# links de volta: protótipo principal (a Rotina agora vive dentro da trilha do v6)
rep('href="../rotina/#ouvir"','href="../v6/#ouvir"')
rep('href="../rotina/#hoje"','href="../v6/#d-close"')
rep('↩ Voltar para a rotina de hoje','↩ Voltar ao fechamento com a Teacher Lili')
rep('↩ Voltar para a rotina</a>','↩ Voltar ao fechamento da sessão</a>')
# logo SPLA na barra da chamada
rep('<div id="callTop"><span class="rec"></span><span class="tt">Sophia · São Paulo Languages Academy</span>',
    '<div id="callTop"><svg class="spla" viewBox="0 0 80 80" aria-hidden="true"><path d="M20 10 10 10 0 0 0 10 0 20 10 20ZM40 20 50 20 60 10 50 10 40 0 30 0 20 10 30 10ZM0 30 10 30 20 40 30 40 40 30 30 30 20 20 10 20ZM10 60 20 50 10 50 0 40 0 50 0 60ZM20 50 30 50 40 60 50 60 60 50 50 50 40 40 30 40ZM20 80 30 80 40 70 30 70 20 60 10 60 0 70 10 70ZM40 30 50 30 60 40 70 40 80 30 70 30 60 20 50 20ZM60 80 70 80 80 70 70 70 60 60 50 60 40 70 50 70ZM80 10 80 0 70 0 60 10 70 10 80 20ZM80 60 80 50 80 40 70 40 60 50 70 50Z"/></svg><span class="rec"></span><span class="tt">Sophia · São Paulo Languages Academy</span>')
PV="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 40 40'%3E%3Cpath d='M0 20 10 20 20 10 10 10 0 0 0 10ZM20 40 30 40 40 30 30 30 20 20 10 20 0 30 10 30ZM40 20 40 10 40 0 30 0 20 10 30 10Z' fill='%23F5C518'/%3E%3C/svg%3E\")"
CSS='''
/* ===== 2026.10.20-sp · identidade São Paulo na chamada: logo SPLA, módulos do piso paulista, navy translúcido, amarelo e vermelho ===== */
#callTop .spla{display:none}
body.call #callTop{background:linear-gradient(180deg,#0B1119e6,#0B1119b8);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);padding-bottom:10px;text-shadow:none}
body.call #callTop::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:6px;background-image:PV;background-size:6px 6px;background-color:#0B1119}
body.call #callTop::before{content:"";position:absolute;right:0;bottom:-6px;width:42px;height:6px;background:#C8102E;z-index:1}
body.call #callTop .spla{display:block;width:22px;height:22px;fill:#FBF8F1;flex-shrink:0}
body.call.oncall #callTop .rec{background:#F5C518;box-shadow:0 0 6px #F5C518}
body.call #spkRing{box-shadow:inset 0 0 0 3px #F5C518,0 0 0 1px #F5C51866,inset 0 0 26px #F5C51833}
body.call #callTime{color:#F5C518}
body.call #pill{top:calc(48px + env(safe-area-inset-top))}
body.call #callBar{background:#0B1119e0;border:1px solid #F5C51833;overflow:hidden;padding-top:16px}
body.call #callBar::before{content:"";position:absolute;left:0;right:0;top:0;height:6px;background-image:PV;background-size:6px 6px;opacity:.95;pointer-events:none}
body.call #callBar::after{content:"";position:absolute;left:0;top:0;width:34px;height:6px;background:#C8102E;pointer-events:none}
body.call #callBar button{background:#FBF8F11c}
body.call #callBar button.on{background:#FBF8F1;color:#0B1119}
body.call #cbMic.held{background:#F5C518;color:#0B1119}
body.call #cbMic::after{border-color:#F5C518}
body.call #cbHang{background:#C8102E!important}
body.call #cbHang.join{background:#F5C518!important;color:#0B1119}
body.call .rvtabs button.on{border-bottom-color:#F5C518}
body.call .rvfoot .big{background:#F5C518;color:#0B1119}
body.call .rve .tag{color:#F5C518}
#ear .earLink{color:#F5C518}
'''.replace('PV',PV)
i=s.index('</style></head>');s=s[:i]+CSS+s[i:]
# posição do callBar precisa de contexto para os ::before
# alvos do dia (vindos da trilha): pista primeiro nos alvos, recast no resto (Método v1.3 §6)
rep("FROM_ROTINA=QS.get('from')==='rotina';","FROM_ROTINA=QS.get('from')==='rotina',ALVOS=(QS.get('alvos')||'').replace(/[<>\"`{}\\\\]/g,'').replace(/\\s+/g,' ').trim().slice(0,100);",1)
rep("if they change the subject, follow them naturally.`:''}",
    "if they change the subject, follow them naturally.${ALVOS?` Today's target language from the lesson: \"${ALVOS}\". Create natural chances for the student to use it. If they try a target and get it wrong, give a short hint first (a prompt, not the answer) and let them try again; for other errors, just recast naturally inside your reply. At most 3 live corrections in the whole call.`:''}`:''}",1)
open(P,'w').write(s);print('ok')
s=open(P).read()
for a,b in [("toque no verde para ligar de novo","toque no amarelo para ligar de novo"),("' · toque no verde para ligar'","' · toque no amarelo para ligar'"),("'Toque no botão verde para ligar para a Sophia'","'Toque no botão amarelo para ligar para a Sophia'")]:
    assert s.count(a)==1,a;s=s.replace(a,b)
open(P,'w').write(s);print('ok2')
