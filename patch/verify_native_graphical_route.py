from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  q=b.new_page(viewport={'width':390,'height':844});errs=[]
  q.on('pageerror',lambda e:errs.append(str(e)))
  q.goto(f'http://127.0.0.1:8765/{base}/index.html#home')
  if base=='teste':q.evaluate("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-06'}))")
  for route in ['d-call','m-talk']:
   q.goto(f'http://127.0.0.1:8765/{base}/index.html#{route}');q.wait_for_timeout(200);q.locator('#oSFrame iframe').wait_for()
   assert q.locator('#oSFrame iframe').is_visible()
   expected=q.evaluate("document.querySelector('#oSbX').dataset.go");q.locator('#oSbX').click()
   q.wait_for_timeout(150);assert q.locator('#oSFrame iframe').count()==0,(base,route,'close')
   assert q.evaluate('location.hash')=='#'+expected,(base,route,'close destination')
   q.goto(f'http://127.0.0.1:8765/{base}/index.html#practice')
   summary=q.locator('.cpi-native[data-cpi-legacy="practice"]>summary');summary.wait_for(state='visible')
   if summary.evaluate('e=>!e.parentElement.open'): summary.click()
   target=q.locator('#practice>.scroll>.cpi-native [data-go="sophia~livre"]');target.wait_for(state='visible')
   assert target.count()==1,(base,'own original extra entry')
  print(base,'PASS direct click to live Sophia, close, Practice legacy extras; errors=',errs)
  assert not errs,errs
  q.context.close()
 b.close()
