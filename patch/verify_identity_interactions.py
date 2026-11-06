from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  q=b.new_page(viewport={'width':390,'height':844});q.set_default_timeout(7000);errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)));q.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  def route(x):
   q.goto(f'http://127.0.0.1:8765/{base}/index.html#{x}');q.wait_for_timeout(250)
  if base=='teste':
   route('welcome');q.evaluate("localStorage.clear();localStorage.setItem('teste_perfil',JSON.stringify({nome:'Ana Teste',criado:'2026-11-06'}))")
  route('community')
  for person,company in [('Marina C.','Nexa Logística'),('Rafael T.','Órbitas Tech'),('Patrícia L.','Atlasul Bank')]:
   assert person in q.locator('#community').inner_text(), (base,person,'person')
   assert company in q.locator('#community').inner_text(), (base,company,'company')
  assert q.locator('#community .cpi-personbadge').count()==3
  assert q.locator('#community .post:visible').count()==4
  sc=q.locator('#community>.scroll'); assert sc.evaluate('s=>s.scrollHeight>s.clientHeight'),(base,'feed scroll')
  assert q.locator('#community>.scroll>.cpi-native').get_attribute('open') is not None,(base,'feed disclosure')
  for rx in q.locator('#community .rx').all(): assert rx.is_visible(),(base,'reaction not reachable')
  assert 'Explicar um atraso no fechamento mensal' in q.locator('#community .cpi-personbadge').first.locator('xpath=..').inner_text()
  for co,expected in [('Nexa Logística',1),('Órbitas Tech',1),('Atlasul Bank',1),('all',4)]:
   q.locator(f'[data-cpi-filter="{co}"]').click()
   assert q.locator('#community .post:visible').count()==expected,(base,co,'filter')
  q.locator('[data-cpi-filter="Nexa Logística"]').click()
  rx=q.locator('#community .post:visible .rx').first;before=rx.inner_text();rx.click();after=rx.inner_text()
  print(base,'FILTER & original clicks',before,'->',after)
  route('profile');f=q.frame_locator('#cpiProfileFrame');f.locator('.name').wait_for()
  f.locator('.status-sticker').click();q.wait_for_timeout(250);assert 'cp-status-picker.html' in q.locator('#cpiProfileFrame').get_attribute('src')
  f=q.frame_locator('#cpiProfileFrame');f.locator('.st').nth(4).wait_for();f.locator('.st').nth(4).click();f.locator('.btn').click();q.frame_locator('#cpiProfileFrame').locator('.name').wait_for()
  assert 'cartao-paulista.html' in q.locator('#cpiProfileFrame').get_attribute('src'),q.locator('#cpiProfileFrame').get_attribute('src')
  f=q.frame_locator('#cpiProfileFrame');f.locator('.right').click();q.frame_locator('#cpiProfileFrame').locator('.field .val').first.wait_for();assert 'cp-edit.html' in q.locator('#cpiProfileFrame').get_attribute('src')
  f=q.frame_locator('#cpiProfileFrame');f.locator('.field .val').first.fill('Ana Estudante');f.locator('input').first.fill('Calhau Indústria')
  f.locator('input[type=file]').nth(0).set_input_files('/workspace/proto-conversa/cartao-paulista/assets/logo-calhau.png')
  f.locator('input[type=file]').nth(1).set_input_files('/workspace/proto-conversa/cartao-paulista/assets/sophia.png');q.wait_for_timeout(150)
  f.locator('.right').click();q.frame_locator('#cpiProfileFrame').locator('.name').wait_for();q.wait_for_timeout(200)
  f=q.frame_locator('#cpiProfileFrame');assert f.locator('.name').inner_text()=='Ana Estudante';assert f.locator('.company .co').inner_text()=='Calhau Indústria'
  saved=q.evaluate("JSON.parse(localStorage.getItem((location.pathname.includes('/teste/')?'teste_':'')+'cartaoPaulista'))")
  assert saved['name']=='Ana Estudante' and saved['logo'].startswith('data:image/'),saved
  route('home');assert q.locator('#cpi-home .cpi-company-name').inner_text()=='Calhau Indústria';assert 'focus' in q.locator('#cpi-home').inner_text().lower()
  assert q.locator('#cpi-home .cpi-photo').get_attribute('src').startswith('data:image/')
  route('profile');q.locator('#profile>.scroll>.cpi-native>summary').click()
  assert q.locator('#profile>.scroll>.cpi-native').get_attribute('open') is not None
  assert q.locator('#profile [data-go="d-memory"]').is_visible()
  print(base,'PASS Community, Cartão status/edit/uploads/isolation and Profile preferences')
  assert not errors,errors
  cxt=q.context;cxt.close()
 b.close()
