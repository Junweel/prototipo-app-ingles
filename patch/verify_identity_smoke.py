from playwright.sync_api import sync_playwright
out='/workspace/shots/identidade'
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 for base in ['v6','teste']:
  cxt=b.new_context(viewport={'width':390,'height':844});page=cxt.new_page()
  page.set_default_timeout(6000);events=[]
  page.on('pageerror',lambda e:events.append('ERROR '+str(e)))
  page.on('console',lambda m:events.append('CONSOLE '+m.text) if m.type=='error' else None)
  page.on('response',lambda r:events.append(f'HTTP {r.status} {r.url}') if r.status>=400 else None)
  if base=='teste':
   page.goto(f'http://127.0.0.1:8765/{base}/index.html#welcome')
   page.evaluate("localStorage.clear();localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-06'}))")
  page.goto(f'http://127.0.0.1:8765/{base}/index.html#home');page.wait_for_timeout(350)
  assert page.locator('#home.on').count()==1
  assert page.locator('#cpi-home').is_visible()
  assert page.locator('.cpi-company-name').first.inner_text()=='Nexa Logística'
  assert page.locator('#cpi-home .cpi-primary').count()==1
  page.screenshot(path=f'{out}/{base}-home-clean.png',full_page=True)
  for screen in ['practice','community','profile']:
   page.goto(f'http://127.0.0.1:8765/{base}/index.html#{screen}');page.wait_for_timeout(450)
   assert page.locator('#'+screen+'.on').count()==1,(base,screen,'active')
   assert page.locator('#'+screen+' .cpi').first.is_visible(),(base,screen,'visual')
   if screen=='profile':
    assert page.locator('#cpiProfileFrame').count()==1
    f=page.frame_locator('#cpiProfileFrame');f.locator('.name').wait_for()
    print('FRAME ID',base, f.locator('.name').inner_text(),f.locator('.company .co').inner_text())
    assert f.locator('.name').inner_text()==('Ana Teste' if base=='teste' else 'Joël')
    assert f.locator('.company .co').inner_text()=='Nexa Logística'
   if screen=='practice':assert page.locator('.cpi-nodeitem').count()==5
   if screen=='community':assert page.locator('#community .cpi-personbadge').count()==3
   page.screenshot(path=f'{out}/{base}-{screen}-clean.png',full_page=True)
  print(base,'ALL CORE OK',events)
  assert not events,events
  page.close();cxt.close()
 b.close()
