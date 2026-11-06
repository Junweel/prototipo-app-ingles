from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  q=b.new_page(viewport={'width':390,'height':844});q.set_default_timeout(10000);errors=[];missing=[]
  q.on('pageerror',lambda e:errors.append(str(e)));q.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  q.goto(f'http://127.0.0.1:8765/{base}/index.html#home')
  if base=='teste':q.evaluate("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-06'}))")
  over=[]
  for route in ['home','practice','community','profile']:
   q.goto(f'http://127.0.0.1:8765/{base}/index.html#{route}');q.wait_for_timeout(300)
   assert q.evaluate('document.documentElement.scrollWidth===innerWidth'),(base,route,'overflow root')
   over.extend(q.evaluate("()=>[...document.querySelectorAll('body *')].filter(e=>{let r=e.getBoundingClientRect();return r.width>0&&r.right>390.5&&!e.closest('.cpi-rankrow,.cpi-filters,.stories')}).map(e=>e.tagName+'.'+e.className).slice(0,10)"))
  assert not over,(base,over)
  q.locator('#profile>.scroll>.cpi-native>summary').click()
  if base=='teste':
   assert q.locator('#tReset').is_visible()
   q.on('dialog',lambda d:d.accept())
   send='sentinel';q.evaluate("v=>localStorage.setItem('checkpoint_sentinel',v)",send)
   q.locator('#tReset').click();q.wait_for_timeout(400)
   assert q.locator('#welcome.on').count()==1,(base,'restart onboarding')
   assert q.evaluate("localStorage.getItem('checkpoint_sentinel')") is None,(base,'reset scoped data')
   assert q.evaluate("localStorage.getItem('teste_checkpoint_sentinel')") is None,(base,'test key not exposed')
   q.evaluate("localStorage.setItem('teste_cartaoPaulista','{\"name\":\"Mantém só no teste\"}')")
   assert q.evaluate("localStorage.getItem('teste_cartaoPaulista')") is not None
  # Legacy five-artwork routes remain independently reachable.
  for card in ['cartao-paulista','cp-status-picker','cp-divisions','cp-liga','cp-edit']:
   q.goto(f'http://127.0.0.1:8765/{base}/index.html#{card}');q.wait_for_timeout(180)
   assert q.locator(f'#{card}.on').count()==1,(base,card)
   assert q.locator(f'#{card} iframe').count()==1,(base,card)
  print(base,'PASS 390px, overflow, Profile prefs, restart/isolation, 5 Cartão routes; errors=',errors,'missing=',missing)
  assert not errors,errors
  assert not missing,missing
  q.context.close()
 b.close()
