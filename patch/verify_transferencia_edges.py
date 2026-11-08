import os,json
from playwright.sync_api import sync_playwright
O=os.getenv('VERIFY_ORIGIN','http://127.0.0.1:8765')
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  prefix='teste_' if base=='teste' else '';key=prefix+'spla_transfer_v1'
  c=b.new_context(viewport={'width':390,'height':844});c.add_init_script("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Andréa',criado:'2026-11-07'}));if(!localStorage.getItem("+json.dumps(key)+"))localStorage.setItem("+json.dumps(key)+",JSON.stringify({version:1,step:1,complete:false,answers:{'1':'corrupt'}}))")
  q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.goto(f'{O}/{base}/#transferencia-linguistica');q.locator('#tl-answer').wait_for();q.locator('#tl-answer').fill('I need information.');q.locator('#tl-submit').click()
  assert not errors,errors
  assert q.evaluate('(k)=>typeof JSON.parse(localStorage.getItem(k)).answers[1]',key)=='object'
  q.reload();q.locator('#tl-model').wait_for();q.locator('#tl-next').click();q.locator('#tl-answer').fill('<img src=x onerror=alert(1)>');q.reload();assert q.locator('#tl-answer').input_value()=='<img src=x onerror=alert(1)>';assert q.locator('#tl-lesson img').count()==0
  q.locator('#tl-submit').click();q.locator('#tl-next').click();assert not errors,errors;c.close()
  c=b.new_context(viewport={'width':390,'height':844});c.add_init_script("localStorage.setItem('teste_perfil',JSON.stringify({nome:'Andréa',criado:'2026-11-07'}));const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.endsWith('spla_transfer_v1'))throw new DOMException('Quota','QuotaExceededError');return set.call(this,k,v)}")
  q=c.new_page();q.goto(f'{O}/{base}/#transferencia-linguistica');q.locator('#tl-start').click();q.locator('#tl-storage').wait_for(state='visible');q.locator('#tl-submit').click();assert 'Escreva uma tentativa' in q.locator('#tl-error').inner_text();assert q.locator('#tl-model').count()==0;c.close()
  print(base,'PASS corrupted item recovery, safe text rendering, resume/drafts, model disclosure, quota feedback')
 b.close()
