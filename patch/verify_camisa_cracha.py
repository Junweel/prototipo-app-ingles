import os
from pathlib import Path
from playwright.sync_api import sync_playwright
O=os.getenv('VERIFY_ORIGIN','http://127.0.0.1:8765');OUT=Path('/workspace/cracha-paulista/capturas')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  for missing in ['company','logo','both']:
   c=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');prefix='teste_' if base=='teste' else ''
   import json
   setup={'company':'' if missing in ['company','both'] else 'Empresa Verde','logo':''}
   if missing=='company':setup['logo']='../cartao-paulista/assets/logo-nexa.png'
   c.add_init_script(f"if(window===window.top&&!sessionStorage.getItem('camisa-fixture')){{localStorage.setItem('{prefix}perfil',JSON.stringify({{nome:'Andréa',criado:'2026-11-07'}}));localStorage.setItem('{prefix}cartaoPaulista',JSON.stringify({json.dumps(setup)}));sessionStorage.setItem('camisa-fixture','1')}}")
   q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.goto(f'{O}/{base}/?camisa=1#home')
   chip=q.locator('.cpi-hero [data-company-edit]');assert chip.count()==1,'company chip must be a real action'
   assert chip.inner_text()=='Vista a camisa +','missing company or logo must not show a check'
   q.locator('.cpi-hero .cracha-lanyard').wait_for();assert 'Nexa' not in q.locator('.cpi-hero .cracha-lanyard').inner_text()
   if base=='v6' and missing=='both':q.screenshot(path=str(OUT/'camisa-off.png'))
   chip.focus();chip.press('Enter');q.locator('#profile.on').wait_for();f=q.frame_locator('#cpiProfileFrame');f.locator('.field .val').first.wait_for();f.locator('input').first.fill('Empresa Verde');f.locator('input[type=file]').nth(0).set_input_files('/workspace/cracha-paulista/logo-verde.png')
   q.wait_for_function("document.querySelector('#cpiProfileFrame').contentDocument.querySelector('.upload>img').src.startsWith('data:image/')")
   f.locator('.right').click();f.locator('.name').wait_for();assert f.locator('[data-company-edit]').inner_text()=='Vestindo a camisa ✓'
   f.locator('[data-company-edit]').click();f.locator('.field .val').first.wait_for();f.locator('.right').click();f.locator('.name').wait_for()
   q.evaluate('location.hash="home"');q.locator('#home.on').wait_for();chip=q.locator('.cpi-hero [data-company-edit]');assert chip.inner_text()=='Vestindo a camisa ✓'
   q.wait_for_function("document.querySelector('.cpi-hero').style.getPropertyValue('--cracha-company')==='rgb(24,192,96)'")
   assert q.locator('.cpi-hero .cracha-print-name').all_text_contents()==['Empresa Verde']*3
   if base=='v6' and missing=='both':q.screenshot(path=str(OUT/'camisa-on.png'))
   q.reload();q.locator('#home.on').wait_for();assert chip.inner_text()=='Vestindo a camisa ✓'
   chip.click();f.locator('.field .val').first.wait_for();assert f.locator('input').first.input_value()=='Empresa Verde'
   # Saving an unchanged existing logo must not erase it (no fresh upload this time).
   f.locator('.right').click();f.locator('.name').wait_for();assert f.locator('[data-company-edit]').inner_text()=='Vestindo a camisa ✓'
   q.evaluate('location.hash="community"');q.locator('#community.on').wait_for();peer=q.locator('.cpi-personbadge [data-company-edit]').first;assert peer.inner_text()=='Vestindo a camisa ✓';peer.click();f.locator('.field .val').first.wait_for();assert f.locator('input').first.input_value()=='Empresa Verde'
   # Clear both fields through the existing editor; no demo company/logo resurrection.
   f.locator('input').first.fill('');f.locator('.right').click();f.locator('.name').wait_for();assert f.locator('[data-company-edit]').inner_text()=='Vista a camisa +'
   q.evaluate('location.hash="home"');q.locator('#home.on').wait_for();assert q.locator('.cpi-hero [data-company-edit]').inner_text()=='Vista a camisa +'
   q.reload();q.locator('#home.on').wait_for();assert q.locator('.cpi-hero [data-company-edit]').inner_text()=='Vista a camisa +'
   q.evaluate('location.hash="transferencia-linguistica"');q.locator('#transferencia-linguistica.on').wait_for();q.locator('.tl-id .cracha-lanyard').wait_for();assert 'Sua empresa no cordão' in q.locator('.tl-id .cracha-lanyard').inner_text()
   assert q.evaluate('document.documentElement.scrollWidth<=390');assert not errors,errors
   print(base,missing,'PASS missing → real editor upload → lanyard on → edit → community → clear off');c.close()
 b.close()
