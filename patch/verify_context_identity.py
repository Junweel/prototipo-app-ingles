from pathlib import Path
import os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=p.chromium.launch()
 for base in ('v6','teste'):
  context=browser.new_context(viewport={'width':390,'height':844});page=context.new_page();errors=[]
  page.on('pageerror',lambda err:errors.append(str(err)))
  origin=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
  for route,names in [('c-rooms',['Marina C.','Lucas A.']),('c-challenge',['Marina C.','Rafael T.'])]:
   page.goto(f'{origin}/{base}/index.html#{route}')
   for name in names:
    assert page.locator(f'#{route} .cpi-contextbadge').filter(has_text=name).count()==1,(base,route,name)
   assert page.evaluate('document.documentElement.scrollWidth===document.documentElement.clientWidth')
  assert not errors,errors
  print(base,'PASS: Cartão compacto em participantes dos desafios/salas, sem overflow ou erro JS')
  context.close()
 browser.close()
