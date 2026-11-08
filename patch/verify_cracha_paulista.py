import os,re
from pathlib import Path
from playwright.sync_api import sync_playwright
O=os.getenv('VERIFY_ORIGIN','http://127.0.0.1:8765');OUT=Path('/workspace/cracha-paulista/capturas');OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');c.add_init_script("if(location.pathname.includes('/teste/'))localStorage.setItem('teste_perfil',JSON.stringify({nome:'Andréa',criado:'2026-11-07'}))")
  q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.set_default_timeout(8000)
  q.goto(f'{O}/{base}/?cracha=20261108#home');q.locator('.cpi-hero').wait_for();assert 'crachá paulista' in q.locator('.cpi-hero').inner_text().lower(),'identity name still old'
  for route,host in [('home','.cpi-hero'),('practice','.cpi-practicebar'),('community','.cpi-personbadge')]:
   q.evaluate('(h)=>location.hash=h',route);q.locator(f'#{route}.on').wait_for();h=q.locator(host).first;h.locator('.cracha-lanyard').wait_for();assert h.locator('.cracha-lanyard img').count()>=2;assert h.locator('.cracha-slot').count()==1
   assert not re.search(r'cart[aã]o paulista|cart[oõ]es paulistas',q.locator(f'#{route}').inner_text(),re.I)
   assert q.evaluate('document.documentElement.scrollWidth<=390')
   if route=='community':h.evaluate('(e)=>e.scrollIntoView({block:"start"})')
   q.screenshot(path=str(OUT/f'{base}-{route}.png'))
  q.evaluate('location.hash="profile"');q.locator('#profile.on').wait_for();f=q.frame_locator('#cpiProfileFrame');f.get_by_role('heading',name='Crachá Paulista').wait_for();assert 'cartao-paulista' in q.locator('#cpiProfileFrame').get_attribute('src')
  f.locator('.right').click();f.locator('.field .val').first.wait_for();f.locator('input').first.fill('Empresa Verde')
  f.locator('input[type=file]').nth(0).set_input_files('/workspace/cracha-paulista/logo-verde.png')
  q.wait_for_function("document.querySelector('#cpiProfileFrame').contentDocument.querySelector('.upload>img').src.startsWith('data:image/')")
  f.locator('.right').click();f.locator('.name').wait_for();q.evaluate('location.hash="home"');q.locator('#home.on').wait_for()
  q.wait_for_function("document.querySelector('.cpi-hero').style.getPropertyValue('--cracha-company')==='rgb(24,192,96)'")
  assert q.locator('.cpi-hero .cracha-print-name').all_text_contents()==['Empresa Verde']*3
  assert q.evaluate("JSON.parse(localStorage.getItem((location.pathname.includes('/teste/')?'teste_':'')+'cartaoPaulista')).company")=='Empresa Verde'
  q.evaluate('location.hash="cartoes"');q.locator('#cartoes.on').wait_for();assert 'Seus cartões' in q.locator('#cartoes').inner_text()
  assert not errors,errors;print(base,'PASS badge naming, straps/slots, legacy frame route, learning cards and 390px');c.close()
 b.close()
