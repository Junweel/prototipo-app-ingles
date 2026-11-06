from playwright.sync_api import sync_playwright
from pathlib import Path
OUT=Path('/workspace/shots/identidade/final');OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});q=c.new_page();q.set_default_timeout(7000)
  q.on('pageerror',lambda e:print('ERROR',e))
  def go(route):q.goto(f'http://127.0.0.1:8765/{base}/index.html#{route}');q.wait_for_timeout(500)
  if base=='teste':go('welcome');q.evaluate("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-06'}))")
  else:q.evaluate("window.localStorage") if q.url.startswith('http') else go('welcome')
  go('home');q.screenshot(path=f'{OUT}/{base}-hoje.png')
  # Demo screenshot state explicitly separate from the genuine activity-flow tests.
  q.evaluate('''()=>mergeTest.ST.days[Object.keys(mergeTest.ST.days).at(-1)]={steps:{aquec:{done:true,n:3},ep:{done:true},trail:{done:false}}}''')
  go('practice');q.wait_for_timeout(250)
  assert q.locator('.is-done').count()==2 and q.locator('.is-current[data-step="trail"]').count()==1
  assert q.locator('.is-locked').count()==2
  q.screenshot(path=f'{OUT}/{base}-praticar.png');q.locator('#practice>.scroll').screenshot(path=f'{OUT}/{base}-praticar-trilha-completa.png')
  go('community');assert q.locator('.cpi-personbadge').count()==3
  q.wait_for_function("document.querySelector('#community .cpi-personbadge')?.getBoundingClientRect().width>250 && document.documentElement.scrollWidth===390");q.screenshot(path=f'{OUT}/{base}-comunidade.png');q.locator('#community>.scroll').screenshot(path=f'{OUT}/{base}-comunidade-completa.png')
  go('profile');q.frame_locator('#cpiProfileFrame').locator('.name').wait_for();q.wait_for_function("document.querySelector('#cpiProfileFrameWrap').getBoundingClientRect().width===354 && document.querySelector('#cpiProfileFrameWrap').getBoundingClientRect().height>700");q.screenshot(path=f'{OUT}/{base}-perfil.png');q.locator('#profile>.scroll').screenshot(path=f'{OUT}/{base}-perfil-completa.png')
  print(base,'captured')
  c.close()
 b.close()
