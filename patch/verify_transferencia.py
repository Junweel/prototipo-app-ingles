import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright
O=os.getenv('VERIFY_ORIGIN','http://127.0.0.1:8765');OUT=Path('/workspace/transferencia-odlin/capturas');OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});c.add_init_script("if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Andréa',criado:'2026-11-07'}))")
  q=c.new_page();q.set_default_timeout(8000);errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(f'{O}/{base}/#practice');assert q.locator('#transferencia-linguistica').count()==1,'missing additive lesson screen'
  q.locator('[data-tl-branch]').wait_for();assert q.locator('.cpi-nodeitem').count()==5
  q.locator('[data-tl-branch]').click();q.locator('#tl-start').wait_for();assert 'Nexa' in q.locator('#tl-identity').inner_text()
  assert q.evaluate('document.documentElement.scrollWidth<=390');q.screenshot(path=str(OUT/f'{base}-aula-abertura.png'),full_page=True)
  q.locator('#tl-start').click()
  for step in range(1,8):
   if step==1:
    q.locator('#tl-hint-button').click();assert q.locator('#tl-hint').is_visible()
   q.locator('#tl-answer').fill('My original English attempt.')
   q.locator('#tl-submit').click();assert q.locator('#tl-model').is_visible()
   assert 'não é correção automática' in q.locator('#tl-comparison').inner_text().lower()
   if step==4:q.screenshot(path=str(OUT/f'{base}-falso-amigo.png'),full_page=True)
   q.locator('#tl-next').click()
  q.locator('[data-tl-drill="pron"]').click();q.locator('#tl-drill-return').wait_for();q.locator('#tl-drill-return').click();q.locator('#tl-next').click()
  q.locator('#tl-answer').fill('Currently, we are on track. We plan to launch on Friday.');q.locator('#tl-submit').click();q.locator('#tl-next').click();q.locator('#tl-complete').wait_for()
  q.screenshot(path=str(OUT/f'{base}-aula-concluida.png'),full_page=True)
  q.locator('#tl-back-trail').click();q.locator('[data-tl-branch].tl-done').wait_for();q.reload();q.locator('[data-tl-branch].tl-done').wait_for();q.locator('[data-tl-branch]').scroll_into_view_if_needed();q.screenshot(path=str(OUT/f'{base}-trilha-ramo-concluido-live.png'),full_page=True)
  prefix='teste_' if base=='teste' else ''
  state=q.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',prefix+'spla_transfer_v1');assert state['complete'] and len(state['answers'])==8
  assert (('' if prefix else 'teste_')+'spla_transfer_v1') not in q.evaluate('Object.keys(localStorage)')
  q.goto(f'{O}/{base}/#transferencia-linguistica');q.locator('#tl-complete').wait_for();assert not errors,errors
  print(base,'PASS branch, production/hints/models, existing drill return, completion, reload, storage isolation and 390px; no JS errors')
  c.close()
 b.close()
