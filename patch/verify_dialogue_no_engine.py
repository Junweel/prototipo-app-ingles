"""Unsupported/disabled browser TTS must not throw or claim playable voices."""
import os
from playwright.sync_api import sync_playwright
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context();c.add_init_script("Object.defineProperty(window,'speechSynthesis',{value:undefined});if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-07'}))")
  q=c.new_page();errs=[];q.on('pageerror',lambda e:errs.append(str(e)));q.goto(f'{O}/{base}/index.html#d-ouvir');q.locator('#oPP').wait_for();q.locator('#oPP').click();q.wait_for_timeout(700)
  assert not errs,errs
  assert 'não oferece síntese de voz' in q.locator('.dv-status').text_content()
  c.close();print(base,'PASS unsupported speech engine: explicit limitation, no JavaScript error')
 b.close()
