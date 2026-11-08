import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright
O=os.getenv('VERIFY_ORIGIN','http://127.0.0.1:8765')
OUT=Path('/workspace/fontes-aulas-evidencias/capturas');OUT.mkdir(parents=True,exist_ok=True)
IDS='placement review input grammar pron chat feedback self summary practice progress d-warm d-trail d-call d-transcript d-close m-cycle m-warm m-pron m-talk m-report m-loop m-phrases m-accents m-meeting m-material m-checkpoint m-real trilha d-ouvir ouvir ep foco cartoes rota c-challenge c-rooms'.split()
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.set_default_timeout(8000)
  q.goto(f'{O}/{base}/#grammar')
  for id in IDS:
   route=id+'~texto' if id in ['chat','d-call','m-talk'] else id+'~ep0' if id in ['ep','foco'] else id
   q.evaluate('(h)=>location.hash=h',route);q.locator(f'#{id}.on').wait_for(state='visible')
   n=q.locator(f'#{id} [data-lesson-source]');n.wait_for(state='attached');assert n.count()==1,(base,id,'duplicate')
   assert n.locator('summary').text_content()=='De onde vem esta aula?',(base,id,n.locator('summary').text_content())
   assert not n.get_attribute('open')
   assert n.locator('a[href^="https://doi.org/"]').count()>0,(base,id)
   assert 'não significa endosso' in n.text_content(),(base,id)
   if q.locator('#oShX').is_visible():q.locator('#oShX').click()
   n.locator('summary').click();assert n.get_attribute('open') is not None,(base,id,'cannot open')
   n.locator('summary').focus();q.keyboard.press('Enter');assert n.get_attribute('open') is None,(base,id,'keyboard')
   assert q.evaluate('document.documentElement.scrollWidth<=390'),(base,id,'overflow')
  q.goto(f'{O}/{base}/?fontes-qa=1#ep~ep0')
  for ep in range(7):
   q.evaluate('(h)=>location.hash=h',f'ep~ep{ep}');q.locator('#ep.on').wait_for();n=q.locator('#ep [data-lesson-source]');n.wait_for(state='attached')
   n.evaluate('(e)=>e.open=false');n.locator('summary').click();assert n.get_attribute('open') is not None
   assert 'van Zeeland' in n.inner_text();assert q.evaluate('document.documentElement.scrollWidth<=390')
   if ep==0:
    n.locator('summary').evaluate('(e)=>e.scrollIntoView({block:"start"})');q.screenshot(path=str(OUT/f'{base}-episodio-fontes.png'))
   n.locator('summary').click();q.locator('#oToGist').click();assert n.count()==1
   for qi in range(2):q.locator(f'[data-q="{qi}"][data-o="0"]').click()
   q.locator('#oToTr').click();assert n.count()==1
   count=q.evaluate('mergeTest.EF.ep.tr.length')
   for ti in range(count):
    q.locator('#oTrSkip').click();assert n.count()==1;q.locator('#oTrNext').click()
   q.locator('#oLyr').wait_for();assert n.count()==1;q.locator('#oFinish').click();assert n.count()==1
   q.evaluate("document.querySelector('#ep [data-lesson-source]').remove()")
   n.wait_for(state='attached');assert n.count()==1
  for id in ['grammar','pron']:
   q.evaluate('(h)=>location.hash=h',id);n=q.locator(f'#{id} [data-lesson-source]');n.wait_for();n.locator('summary').click();n.locator('summary').evaluate('(e)=>e.scrollIntoView({block:"start"})');q.screenshot(path=str(OUT/f'{base}-{id}-fontes.png'))
  q.goto(f'{O}/{base}/#transferencia-linguistica');q.locator('.tl-source').wait_for(state='attached');assert q.locator('.tl-source').count()==1;assert q.locator('#transferencia-linguistica [data-lesson-source]').count()==0
  assert not errors,errors
  print(base,'PASS',len(IDS),'activity notes, 7 episode identities, rerender recovery, original Odlin note and mobile layout')
  c.close()
 for path in ['sophia-ao-vivo/','teste/sophia-ao-vivo/']:
  c=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(O+'/'+path);n=q.locator('#bottom [data-lesson-source]');n.wait_for();assert n.count()==1;n.locator('summary').click();assert 'Lyster' in n.inner_text();assert q.evaluate('document.documentElement.scrollWidth<=390');assert q.locator('#cbHang').is_visible();assert not errors,errors
  for host in ['rvBody','ear']:
   q.evaluate('(id)=>document.getElementById(id).innerHTML="<p>Render de atividade</p>"',host);q.locator(f'#{host} [data-lesson-source]').wait_for(state='attached');assert q.locator(f'#{host} [data-lesson-source]').count()==1
  print(path,'PASS real live-call note, review/ear overlay reconstruction, no call started');c.close()
 b.close()
