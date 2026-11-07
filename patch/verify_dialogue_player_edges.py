"""Real UI/player tests with simulated OS voice inventory and intercepted Azure TTS.
Azure fixture is a tone WAV, NOT real provider synthesis or a voice-quality test.
"""
import os,io,wave,math,struct,re,json
from pathlib import Path
from playwright.sync_api import sync_playwright
from dialogue_speech_fixture import VOICES,stub
O=os.environ.get('VERIFY_ORIGIN','http://127.0.0.1:8765')
OUT=Path(os.environ.get('VOICE_EVIDENCE_DIR','/workspace/proto-conversa/docs/evidencias/vozes-dialogo'));OUT.mkdir(parents=True,exist_ok=True)
def fixture():
 b=io.BytesIO()
 with wave.open(b,'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(24000);w.writeframes(b''.join(struct.pack('<h',int(1500*math.sin(2*math.pi*220*i/24000))) for i in range(12000)))
 return b.getvalue()
def advance(q):
 q.locator('#oToGist').click()
 for i in range(2):q.locator(f'[data-q="{i}"][data-o="0"]').click()
 q.locator('#oToTr').click()
 for i in range(5):
  q.locator('#oTrSkip').click()
  if i==3:assert 'cúdja' in q.locator('.o-pl').inner_text()
  q.locator('#oTrNext').click()
 q.locator('#oLyr').wait_for()
with sync_playwright() as p:
 b=p.chromium.launch()
 for base in ['v6','teste']:
  c=b.new_context(viewport={'width':390,'height':844});c.add_init_script(stub(VOICES));q=c.new_page();errs=[];q.on('pageerror',lambda e:errs.append(str(e)))
  q.goto(f'{O}/{base}/index.html#d-ouvir');q.locator('#oPP').wait_for();advance(q)
  q.locator('#oLyr p').nth(1).click();q.wait_for_function('voiceCalls.some(c=>c.text.startsWith("Hi Erick"))');q.wait_for_timeout(80)
  assert q.locator('#oLyr p.on').get_attribute('data-i')=='1';assert q.evaluate('voiceCalls.at(-1).voice') in ['Samantha','Karen']
  q.locator('#oPP').click();q.locator('#oSpd').click();q.locator('#oLyr p').nth(0).click();q.wait_for_function('voiceCalls.at(-1).rate===1.25');assert q.evaluate('voiceCalls.at(-1).voice') in ['Daniel','Alex']
  q.locator('#oPP').click();q.locator('.dv-settings > summary').click();sel=q.locator('[data-dv-speaker="G"]');sel.select_option(label='Karen · en-US');q.wait_for_function('voiceCalls.at(-1).voice==="Karen"');assert 'Ana' in q.evaluate('voiceCalls.at(-1).text')
  assert q.evaluate("JSON.parse(localStorage.getItem('dialogue_voices_v1'))['guest-ana']")
  q.screenshot(path=str(OUT/f'{base}-letra-vozes.png'),full_page=True)
  q.locator('[data-dv-preview=G]').scroll_into_view_if_needed();q.screenshot(path=str(OUT/f'{base}-vozes-config.png'),full_page=True)
  q.reload();q.locator('#oPP').wait_for();q.locator('.dv-settings > summary').click();assert 'Karen' in q.locator('[data-dv-speaker="G"]').input_value()
  # The solo episode keeps Erick, not the last guest. Helpers also cover Sophia/Lili.
  q.close();q=c.new_page();q.on('pageerror',lambda e:errs.append(str(e)));q.goto(f'{O}/{base}/index.html#ep~ep6');q.locator('#oPP').wait_for();q.locator('#oPP').click();q.wait_for_function('voiceCalls.length>=1');assert q.evaluate('voiceCalls[0].voice') in ['Daniel','Alex']
  for char in ['S','L']:
   assert q.evaluate('(s)=>SplaDialogueVoices.select(null,s).identified',char)
  assert not errs,errs;c.close();print(base,'PASS lyric highlight, pronunciation tips, 1.25×, explicit voice preview/persistence, solo Erick, Sophia/Lili policy')
  # Azure is intercepted: no key read, no real request/charge. Test actual decode+stitch+Audio clock.
  c=b.new_context(viewport={'width':390,'height':844});c.add_init_script(stub(VOICES));c.add_init_script("localStorage.setItem((location.pathname.includes('/teste/')?'teste_':'')+'sophiaCfg',JSON.stringify({azKey:'fixture-only-not-a-credential',azReg:'brazilsouth'}))")
  requests=[]
  def az(route):
   body=route.request.post_data;requests.append(body);route.fulfill(status=200,content_type='audio/wav',body=fixture())
  c.route(re.compile(r'https://[^/]+\.tts\.speech\.microsoft\.com/.*'),az);q=c.new_page();q.goto(f'{O}/{base}/index.html#d-ouvir');q.locator('#oPP').wait_for();assert q.evaluate('mergeTest.PL.mode')=='audio'
  assert any('en-US-Andrew' in x for x in requests);assert any('en-US-EmmaNeural' in x for x in requests)
  assert len(requests)==q.evaluate('mergeTest.EPS[0].lines.length')
  q.locator('#oPP').click();q.wait_for_function('mergeTest.PL.audio.currentTime>0.5');q.locator('#oPP').click();assert q.evaluate('mergeTest.PL.audio.preservesPitch')
  advance(q);q.locator('#oLyr p').nth(1).click();q.wait_for_timeout(100);assert q.locator('#oLyr p.on').get_attribute('data-i')=='1';q.locator('#oPP').click()
  q.screenshot(path=str(OUT/f'{base}-azure-player.png'),full_page=True);c.close();print(base,'PASS intercepted Azure: per-character SSML, decoded durations, stitched WAV plays, synchronized lyric seek, preserve pitch')
 b.close()
print('Evidence:',OUT)
