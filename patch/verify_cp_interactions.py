from playwright.sync_api import sync_playwright
from pathlib import Path
import json
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 for base in ['v6','teste']:
  page=b.new_page(viewport={'width':390,'height':844});errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  if base=='teste':
   page.goto('http://127.0.0.1:8765/teste/index.html#welcome')
  def boot(hash):
   page.goto(f'http://127.0.0.1:8765/{base}/index.html#{hash}');page.wait_for_timeout(500)
  if base=='teste':page.evaluate('localStorage.clear();localStorage.setItem("teste_perfil",JSON.stringify({nome:"Ana Teste",criado:"2026-11-06"}))')
  getstate=lambda name:page.evaluate("({name})=>JSON.parse(localStorage.getItem((location.pathname.includes('/teste/')?'teste_':'')+name))",{'name':name})
  boot('cartao-paulista');f=page.frame_locator('#cartao-paulista iframe');f.locator('.status-sticker').click();page.wait_for_timeout(100)
  assert page.locator('#cp-status-picker.on').count()==1
  f=page.frame_locator('#cp-status-picker iframe');f.locator('.st').nth(1).click();f.locator('.btn').click();page.wait_for_timeout(100)
  saved=getstate('cartaoPaulista');assert 'Em Stretch' in saved['status'],saved
  f=page.frame_locator('#cartao-paulista iframe');assert page.locator('#cartao-paulista.on').count()==1;page.wait_for_timeout(500);'Em Stretch' in f.locator('.status-sticker').inner_text();f.locator('.right').click();page.wait_for_timeout(100)
  assert page.locator('#cp-edit.on').count()==1
  f=page.frame_locator('#cp-edit iframe');f.locator('.field .val').first.fill('Marina Teste');f.locator('input').first.fill('Empresa Teste');
  f.locator('input[type=file]').nth(0).set_input_files('/workspace/proto-conversa/cartao-paulista/assets/logo-nexa.png');page.wait_for_timeout(80)
  f.locator('input[type=file]').nth(1).set_input_files('/workspace/proto-conversa/cartao-paulista/assets/sophia.png');page.wait_for_timeout(120)
  f.locator('.right').click();page.wait_for_timeout(100)
  saved=getstate('cartaoPaulista');assert saved['name']=='Marina Teste' and saved['company']=='Empresa Teste' and saved['photo'].startswith('data:image/png'),saved
  f=page.frame_locator('#cartao-paulista iframe');page.wait_for_timeout(500);assert f.locator('.name').inner_text()=='Marina Teste';assert f.locator('.company .co').inner_text()=='Empresa Teste';assert f.locator('.frame img').get_attribute('src').startswith('data:image/png')
  if base=='teste':
   assert page.evaluate("!localStorage.hasOwnProperty('cartaoPaulista')"), page.evaluate('Object.keys(localStorage)')
   assert page.evaluate("localStorage.getItem('teste_cartaoPaulista')") is not None
   assert page.evaluate("localStorage.getItem('teste_perfil')") is not None
  f.locator('.divisao').click();page.wait_for_timeout(100);assert page.locator('#cp-divisions.on').count()==1
  f=page.frame_locator('#cp-divisions iframe');f.locator('.right').click();page.wait_for_timeout(100);assert page.locator('#cp-liga.on').count()==1
  f=page.frame_locator('#cp-liga iframe');f.locator('.back').click();page.wait_for_timeout(200);assert page.locator('#profile.on').count()==1,page.url
  page.evaluate("localStorage.setItem('cpPhoto','x')") if False else None
  print(base,'PASS Cartão status/edit/upload/navigation/state isolation')
  assert not errors,errors
  page.close()
 b.close()
