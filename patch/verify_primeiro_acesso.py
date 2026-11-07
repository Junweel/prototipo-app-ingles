import os
from pathlib import Path
from playwright.sync_api import sync_playwright
ORIGIN=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});q=c.new_page();q.set_default_timeout(7000);errs=[]
  q.on('pageerror',lambda e:errs.append(str(e)))
  url=f'{ORIGIN}/{base}/'
  q.goto(url);q.locator('#pa-landing').wait_for()
  assert q.locator('#welcome.on').count()==1
  assert q.locator('#pa-landing h1').inner_text()=='A próxima reunião tem espaço para a sua voz.'
  assert q.locator('#pa-landing .char,#pa-landing .trio').count()==0
  assert q.locator('#welcome .foot button').filter(has_text='Começar').count()==1
  q.locator('#welcome .foot button').filter(has_text='Começar').click()
  q.locator('#tNome' if base=='teste' else '#pa-nome').fill('Ana Retorno')
  q.locator('#onboard .foot [data-go]').click();q.locator('#placement .foot [data-go]').click();q.locator('#turma .foot [data-go]').click()
  q.locator('#plan .foot [data-go]').click()
  q.locator('#pa-setup.on').wait_for();assert q.locator('#pa-finish').is_disabled()
  q.locator('#pa-liga').check();assert q.locator('#pa-finish').is_disabled()
  q.locator('#pa-logo').set_input_files(str(ROOT/'cartao-paulista/assets/logo-nexa.png'))
  q.locator('#pa-company').fill('Nexa Logística')
  q.locator('#pa-finish').click();q.locator('#practice.on').wait_for()
  saved=q.evaluate("JSON.parse(localStorage.getItem('spla_onboarded_v1'))");assert saved['completed'] and saved['liga'] and saved['plan']
  photo=q.evaluate("localStorage.getItem('cartaoPaulista')");assert 'data:image' in photo
  q.goto(url);q.locator('#practice.on').wait_for();q.locator('.cpi-practicebar').wait_for()
  q.goto(url+'#profile');q.frame_locator('#cpiProfileFrame').locator('.name').wait_for();q.locator('[data-cpi-profile="cp-edit"]').click();f=q.frame_locator('#cpiProfileFrame');f.locator('.field .val').first.fill('Ana Editada');f.locator('.right').click();q.frame_locator('#cpiProfileFrame').locator('.name').wait_for();assert 'data:image' in q.evaluate("localStorage.getItem('cartaoPaulista')"),'setup logo must survive existing editor save';photo=q.evaluate("localStorage.getItem('cartaoPaulista')")
  q.goto(url+'#welcome');q.locator('#practice.on').wait_for()
  q.goto(url+'#plan');q.reload();q.locator('#practice.on').wait_for()
  q.goto(url+'#profile');q.locator('#pa-review').wait_for();q.locator('#pa-review>summary').click();q.locator('#pa-revisit').click();q.locator('#welcome.on').wait_for()
  q.locator('#pa-back-study').click();q.locator('#practice.on').wait_for()
  q.goto(url+'?novo=1');q.locator('#welcome.on').wait_for()
  assert q.evaluate("JSON.parse(localStorage.getItem('spla_onboarded_v1')).completed")
  assert q.evaluate("localStorage.getItem('cartaoPaulista')")==photo
  q.goto(url+'#profile');q.locator('#pa-review>summary').click()
  q.on('dialog',lambda d:d.accept());q.locator('#pa-reset-intro').click();q.locator('#welcome.on').wait_for()
  assert not q.evaluate("localStorage.getItem('spla_onboarded_v1')")
  assert q.evaluate("localStorage.getItem('cartaoPaulista')")==photo
  assert not errs,errs
  print(base,'PASS signup → flag → return trail → replay → ?novo=1 → nondestructive reset',errs)
  c.close()
 b.close()
