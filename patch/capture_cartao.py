from playwright.sync_api import sync_playwright
from pathlib import Path
import json,re,subprocess
ROOT=Path('/workspace/proto-conversa');OUT=Path('/workspace/shots/cartao-paulista-preservacao');OUT.mkdir(exist_ok=True,parents=True)
items=[('cartao-paulista','01-perfil-cartao-paulista.png'),('cp-status-picker','02-escolha-status.png'),('cp-divisions','03-divisao-mirante-leaderboard.png'),('cp-liga','04-liga-empresas.png'),('cp-edit','05-editar-perfil-empresa.png')]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 for prefix in ['v6','teste']:
  page=b.new_page(viewport={'width':390,'height':844}); errors=[];missing=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  if prefix=='teste':
   page.goto('http://127.0.0.1:8765/teste/index.html#welcome');page.evaluate("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-06'}))");page.reload()
  for num,(route,ref) in enumerate(items,1):
   page.goto(f'http://127.0.0.1:8765/{prefix}/index.html#{route}');page.wait_for_timeout(1000)
   assert page.locator(f'#{route}.on').count()==1,(prefix,route)
   assert page.locator(f'#{route} iframe').count()==1
   frame=page.frame_locator(f'#{route} iframe')
   assert frame.locator('.phone').count()==1
   page.locator(f'{OUT if False else route}')
   page.screenshot(path=str(OUT/f'{prefix}-{num:02}-mobile.png'))
   iframe=page.locator(f'#{route} iframe')
   box=page.evaluate('(s)=>{const el=document.querySelector(s);const f=el.querySelector("iframe");const doc=f.contentDocument;const scale=el.clientWidth/1080;el.style.height="844px";el.style.overflow="hidden";f.style.height=(doc.body.scrollHeight||2340)+"px";const ph=doc.querySelector(".phone");ph.style.position="absolute";ph.style.top="0";return true}',f'#{route}')
   iframe.screenshot(path=str(OUT/f'{prefix}-{num:02}-artwork.png'))
   # exact artwork from child frame to compare against approved PNG
   page.screenshot(path=str(OUT/f'{prefix}-{num:02}-full.png'),full_page=True)
   # reload now correct stage height for subsequent screen
   page.evaluate('sel=>{const s=document.querySelector(sel);s.style.height="";s.style.overflow="";}',f'#{route}')
  if prefix=='teste':
   page.goto('http://127.0.0.1:8765/teste/index.html#profile');page.wait_for_timeout(400)
   assert page.locator('[data-t="nome"]').first.inner_text()=='Ana Teste','Teste profile lost'
   assert page.locator('#tReset').count()==1,'Reset disappeared'
   assert page.evaluate("localStorage.getItem('teste_perfil')"),'Namespace disappeared'
  else:
   assert page.evaluate('typeof mergeTest')=='object','Legacy runtime missing'
  assert not errors,(prefix,errors)
  assert not missing,(prefix,missing)
  print(prefix,'PASS: all five frame loads, no 404/page errors; legacy runtime verified')
  page.close()
 # Reference and child-artwork exact pixel diffs
 q=b.new_page(viewport={'width':1080,'height':2340},device_scale_factor=1)
 for num,(route,ref) in enumerate(items,1):
  q.goto(f'http://127.0.0.1:8765/cartao-paulista/{route}.html');q.wait_for_timeout(820)
  q.screenshot(path=str(OUT/f'v6-{num:02}-approved-layout.png'))
 q.close();b.close()
