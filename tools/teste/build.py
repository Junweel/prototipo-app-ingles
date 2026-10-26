#!/usr/bin/env python3
"""Gera /teste/ (versão de teste zerada) a partir de v6/ e sophia-ao-vivo/.
Uso: python3 tools/teste/build.py   (na raiz do repositório)
Os vídeos da Sophia em teste/sophia-ao-vivo/anim/ só são copiados se ainda não existirem
(para que uma troca manual de clipes não seja sobrescrita); use --refresh-anim para recopiar."""
import os, re, shutil, sys
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC=os.path.join(ROOT,'tools','teste'); OUT=os.path.join(ROOT,'teste')
TESTE_V='2026.10.26-teste1'
def rd(p): return open(os.path.join(ROOT,p),encoding='utf-8').read()
def src(p): return open(os.path.join(SRC,p),encoding='utf-8').read()
def rep(s,a,b,n=1):
    c=s.count(a)
    if c!=n: sys.exit(f'esperava {n}x, achei {c}x: {a[:90]!r}')
    return s.replace(a,b)
shim=src('shim.js')
head_inj=('<meta name="robots" content="noindex,nofollow">\n<script>window.TESTE_V='+repr(TESTE_V)+';\n'+shim+'</script>\n')

# ---------------- app (v6 -> teste/index.html) ----------------
s=rd('v6/index.html')
s=rep(s,'<head>\n','<head>\n'+head_inj)
s=rep(s,'<title>Protótipo v7 · ','<title>Versão de teste · ')
s=rep(s,'1ª sessão: "Consigo me apresentar numa call com o time global"','1ª sessão: "Consigo dar um status update curto numa reunião semanal"')
s=rep(s,'href="../assets/app-icon-180.png"','href="assets/app-icon-180.png"')
s=rep(s,"'../sophia-ao-vivo/","'sophia-ao-vivo/",2)
# times de colegas e ofensiva da equipe começam no 1º dia do teste
s=rep(s,"for(let x=new Date(TEAM_START+'T12:00')","for(let x=new Date((window.TESTE_START||TEAM_START)+'T12:00')")
# iniciais
s=rep(s,'<span class="av y">J</span>','<span class="av y t-ini">J</span>',2)
s=rep(s,'<div class="av y" style="width:68px;height:68px;font-size:26px;box-shadow:0 0 0 3px var(--paper),0 0 0 5px var(--ink)">J</div>','<div class="av y t-ini" style="width:68px;height:68px;font-size:26px;box-shadow:0 0 0 3px var(--paper),0 0 0 5px var(--ink)">J</div>')
s=rep(s,"""'<span class="me" aria-hidden="true">J</span>'""","""'<span class="me t-ini" aria-hidden="true">J</span>'""")
# onboarding: nome + nada pré-selecionado
i=s.index('<section class="screen" id="onboard">'); j=s.index('</section>',i)
ob=s[i:j]
ob=rep(ob,'<div class="sec">Para que você quer inglês?</div>','<div class="sec">Como você quer ser chamada(o)?</div>\n      <input id="tNome" class="t-inp" type="text" autocomplete="given-name" maxlength="40" placeholder="Seu nome" aria-label="Seu nome">\n      <div class="sec">Para que você quer inglês? <span class="tiny muted">(toque para escolher)</span></div>')
ob=rep(ob,'<div class="sec">Sua área</div>','<div class="sec">Sua área <span class="tiny muted">(uma)</span></div>')
ob=ob.replace('class="chip on"','class="chip"').replace('<button class="on">','<button>')
s=s[:i]+ob+s[j:]
# plano
s=rep(s,'<b>Reuniões + e-mails · SAP</b>','<b data-t="obj">Reuniões + e-mails · SAP</b>')
s=rep(s,'<b>25–30 min por dia</b>','<b data-t="ritmo">25–30 min por dia</b>')
# home
s=rep(s,'<div class="muted small">Boa noite,</div><h2 style="font-size:26px">Joël</h2>','<div class="muted small" data-t="saud">Olá,</div><h2 style="font-size:26px" data-t="nome">Joël</h2>')
s=rep(s,'<div class="weekdots" aria-label="Esta semana: 3 de 5 sessões"><span class="d"><i></i>S</span><span class="d"><i></i>T</span><span class="d"><i></i>Q</span><span class="t"><i></i>Q</span><span><i></i>S</span></div>',
        '<div class="weekdots" data-t="weekdots" aria-label="Esta semana"><span><i></i>S</span><span><i></i>T</span><span><i></i>Q</span><span><i></i>Q</span><span><i></i>S</span></div>')
s=rep(s,'<span class="tag k">Erick · 4 revisões</span>','<span class="tag k" data-t="rev">Erick · 0 revisões</span>')
s=rep(s,'<span class="tag">🔥 12 dias · +40 Capital hoje</span>','<span class="tag" data-t="fogo">🔥 0 dias · +0 Capital hoje</span>')
s=rep(s,'<div class="node done"><div class="dot"><svg class="i " aria-hidden="true"><use href="#i-check"/></svg></div><div><div class="t">Apresentar-se numa call com o time global</div><div class="s">Can-do conquistado · 06/10</div></div></div>',
        '<div class="node lock"><div class="dot"><svg class="i " aria-hidden="true"><use href="#i-check"/></svg></div><div><div class="t">Apresentar-se numa call com o time global</div><div class="s">Unidade anterior · não incluída nesta versão de teste</div></div></div>')
s=rep(s,'<div class="node done"><div class="dot"><svg class="i " aria-hidden="true"><use href="#i-check"/></svg></div><div><div class="t">Abrir um ticket SAP por e-mail</div><div class="s">Can-do conquistado · 08/10</div></div></div>',
        '<div class="node lock"><div class="dot"><svg class="i " aria-hidden="true"><use href="#i-mail"/></svg></div><div><div class="t">Abrir um ticket SAP por e-mail</div><div class="s">Unidade anterior · não incluída nesta versão de teste</div></div></div>')
s=rep(s,'<div class="t">Dar status numa reunião semanal</div><div class="s">Hoje · sessão guiada em 4 etapas</div>','<div class="t">Dar status numa reunião semanal</div><div class="s" data-t="n3s">Hoje · sessão guiada em 4 etapas</div>')
s=rep(s,'<b>12 dias com prática.</b>','<b data-t="lilistreak">Primeiro dia.</b>')
s=rep(s,'<b>3 cards vencem hoje</b>','<b data-t="duetxt">3 frases iniciais no aquecimento</b>')
s=rep(s,'<div class="stat3"><div><b>74</b>min nesta semana</div><div><b>5</b>can-dos</div><div><b>41/48</b>lembradas em 7 dias</div></div>',
        '<div class="stat3"><div><b data-t="etsem">0</b>etapas nesta semana</div><div><b data-t="ncando">0</b>can-dos</div><div><b data-t="ncards">0</b>cards salvos</div></div>')
s=rep(s,'aria-label="Liga da semana: SAP 412 contra TI e Cloud 398. Sua contribuição: 360 Capital"','aria-label="Liga da semana (exemplo fictício)"')
s=rep(s,'<b>360 Capital</b><span class="tiny">esta semana · hoje +120</span>','<b data-t="capwk">0 Capital</b><span class="tiny" data-t="capwk2">esta semana · hoje +0</span>')
# resumo / fechamento
s=rep(s,'<div><b>13 dias</b>de ofensiva · 1 folga guardada</div>','<div><b data-t="streakd">0 dias</b>de ofensiva (real)</div>',2)
s=rep(s,'Bom trabalho hoje, Joël: <b>+120 Capital para a SAP</b>.','Bom trabalho hoje, <span data-t="nome1">Joël</span>: <b data-t="dclosecap">+0 Capital para a SAP</b>.')
# praticar
s=rep(s,'<div class="s">12 vencidos · 86 em revisão · 412 dominados</div></div><span class="cnt">12</span>','<div class="s" data-t="cardsline">nenhum card ainda</div></div><span class="cnt" data-t="cardscnt">0</span>')
s=rep(s,'<div class="s">"twin room" · salvo na conversa de hoje</div>','<div class="s" data-t="chunks">nada salvo ainda</div>')
# liga
s=rep(s,'<div class="big">360</div><div class="tiny muted">Capital nesta semana</div>','<div class="big" data-t="capwkn">0</div><div class="tiny muted">Capital nesta semana (real)</div>')
s=rep(s,'3 sessões completas · 2 dias de revisões em dia · 1 can-do. A média da equipe sobe com cada sessão sua.','<span data-t="contribtxt">Nenhuma sessão ainda. A média da equipe sobe com cada sessão sua.</span>')
s=rep(s,'<div class="bar" style="margin-top:12px"><i style="width:60%"></i></div><div class="tiny muted" style="margin-top:6px">Teto diário: 200 Capital · hoje: 120 de 200</div>',
        '<div class="bar" style="margin-top:12px"><i data-t="tetobar" style="width:0%"></i></div><div class="tiny muted" style="margin-top:6px" data-t="teto">Teto diário: 200 Capital · hoje: 0 de 200</div>')
# perfil
s=rep(s,'<div><h2 style="font-size:23px">Joël</h2><div class="small muted">A2+/B1 medido · SAP FI/CO · 25–30 min por dia</div></div>','<div><h2 style="font-size:23px" data-t="nome">Joël</h2><div class="small muted" data-t="perfsub">área não informada</div></div>')
s=rep(s,'<span class="big" style="color:var(--cream)">640</span>','<span class="big" style="color:var(--cream)" data-t="captot">0</span>')
s=rep(s,'Esta semana: 360 · hoje: +120','<span data-t="capline">Esta semana: 0 · hoje: +0</span>')
s=rep(s,'<span class="v">7 fatos · ver/editar ›</span>','<span class="v">exemplo · ver ›</span>')
s=rep(s,'<span class="v">5 ›</span>','<span class="v" data-t="ncando2">0 ›</span>')
# ciclo
s=rep(s,'<span class="tag y">🔥 12 dias</span></div>','<span class="tag y" data-t="fogo2">🔥 0 dias</span></div>')
# sobre
s=rep(s,'versão 2026.10.26-regras · dados de demonstração · ',f'versão de teste {TESTE_V} (base 2026.10.26-regras) · seus dados ficam só neste navegador · ')
# camada da versão de teste
s=rep(s,'</head>','<style>\n'+src('overlay.css')+'</style>\n</head>')
k=s.rindex('</body>')
s=s[:k]+'<script>\n'+src('overlay.js')+'</script>\n'+s[k:]
os.makedirs(OUT,exist_ok=True)
open(os.path.join(OUT,'index.html'),'w',encoding='utf-8').write(s)
# assets
shutil.copytree(os.path.join(ROOT,'v6','assets'),os.path.join(OUT,'assets'),dirs_exist_ok=True)
shutil.copy2(os.path.join(ROOT,'assets','app-icon-180.png'),os.path.join(OUT,'assets','app-icon-180.png'))

# ---------------- Sophia (sophia-ao-vivo -> teste/sophia-ao-vivo) ----------------
t=rd('sophia-ao-vivo/index.html')
t=rep(t,'<head><meta charset="utf-8">','<head><meta charset="utf-8">\n'+head_inj)
n=t.count('../v6/')
if n!=7: sys.exit(f'sophia: esperava 7 refs ../v6/, achei {n}')
t=t.replace('../v6/','../')
SO=os.path.join(OUT,'sophia-ao-vivo'); os.makedirs(SO,exist_ok=True)
open(os.path.join(SO,'index.html'),'w',encoding='utf-8').write(t)
shutil.copytree(os.path.join(ROOT,'sophia-ao-vivo','img'),os.path.join(SO,'img'),dirs_exist_ok=True)
A=os.path.join(SO,'anim')
if '--refresh-anim' in sys.argv or not os.path.isdir(A):
    shutil.copytree(os.path.join(ROOT,'sophia-ao-vivo','anim'),A,dirs_exist_ok=True)
for f in ['index.html','sophia-ao-vivo/index.html']:
    if re.search(r'(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_\-]{30,})',open(os.path.join(OUT,f),encoding='utf-8').read()): sys.exit('possível chave de API em '+f)
print('ok ->',OUT,TESTE_V)
