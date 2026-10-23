import asyncio,sys,json,re
from playwright.async_api import async_playwright
sys.path.insert(0,'patch')
from mockflow import CORR,REPLY
URL=sys.argv[1]; OUT=sys.argv[2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,permissions=['camera','microphone'],
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        await ctx.add_init_script("if(location.search.indexOf('realstt')<0){class FakeSR{start(){setTimeout(()=>this.onstart&&this.onstart(),10)}stop(){setTimeout(()=>this.onend&&this.onend(),10)}abort(){}};window.webkitSpeechRecognition=window.SpeechRecognition=FakeSR}")
        await ctx.add_init_script("if(!localStorage.getItem('sophiaCfg'))localStorage.setItem('sophiaCfg',JSON.stringify({prov:'xai',key:'xai-MOCK-KEY-for-local-test',mode:'llm',ui:'conversa'}))")
        async def handle(route):
            if '/chat/completions' not in route.request.url: return await route.fulfill(status=404,body='')
            body=json.loads(route.request.post_data or '{}'); msgs=body.get('messages',[]); sysm=msgs[0]['content'] if msgs else ''
            if 'You check ONE spoken sentence' in sysm:
                said=re.search(r'Student said: "(.*?)"',msgs[-1]['content']).group(1)
                c=CORR.get(said,dict(said=said,corrected=None,isError=False,important=False,unclear=False,why_pt=None,meaning=False,category=None,corrected_pt=None))
                return await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':json.dumps(c)}}]}))
            last=msgs[-1]['content']; rep=REPLY.get(last,"Oh nice, tell me more! What else do you like to do?")
            meta=json.dumps({'heard':last,'isError':False,'corrected':None,'emph':None,'tip':None,'repeat':None,'pt':'(tradução)'})
            await asyncio.sleep(.3)
            await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':rep+'\n###\n'+meta}}]}))
        await ctx.route('https://api.x.ai/**',handle)
        pg=await ctx.new_page(); errs=[]; warns=[]
        pg.on('console',lambda m: (errs if m.type=='error' else warns).append(m.text) if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERROR: '+str(e)))
        await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(1200)
        print('ui:',await pg.evaluate("()=>[sophiaTest&&document.body.className, document.getElementById('appV').textContent||'', document.querySelector('meta[name=sophia-version]').content]"))
        print('load errors:',errs,'warnings:',warns)
        await pg.screenshot(path=f'{OUT}/00-antes-de-ligar.png')
        async def idle(t=40000):
            await pg.wait_for_function("()=>sophiaTest.state()==='ATTENDING'||!document.getElementById('review').hidden",timeout=t); await pg.wait_for_timeout(300)
        async def say(txt):
            await pg.fill('#typeIn',txt); await pg.press('#typeIn','Enter'); await idle()
        await pg.click('#cbHang'); await idle()
        await pg.click('#cbMore'); await pg.click('#mmKbd')
        for t in ['I go on park in the weekend','Yesterday I go to the cinema with my wife','She like romantic movies']: await say(t)
        await pg.click('#cbMore'); await pg.click('#mmKbd'); await pg.wait_for_timeout(500)
        # pega um quadro com ela falando (anel ativo)
        await pg.fill('#typeIn','It was very good') if False else None
        await pg.evaluate("()=>{document.body.classList.add('kbd')}"); await pg.fill('#typeIn','It was very good'); await pg.press('#typeIn','Enter')
        await pg.evaluate("()=>document.body.classList.remove('kbd')")
        await pg.wait_for_function("()=>sophiaTest.state()==='SPEAKING'",timeout=20000); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'{OUT}/01-chamada-com-legendas.png')
        print('speaking ring:',await pg.evaluate("()=>[document.body.classList.contains('spk'),getComputedStyle(document.getElementById('spkRing')).opacity,document.getElementById('stage').dataset.amp]"))
        await idle()
        await pg.click('#cbChat'); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{OUT}/02-legendas-desligadas.png')
        print('capsOff saved:',await pg.evaluate("()=>JSON.parse(localStorage.sophiaCfg).capsOff"))
        await pg.click('#cbChat'); await pg.wait_for_timeout(2000)
        await pg.click('#cbCam'); await pg.wait_for_selector('#selfView:not([hidden])',timeout=10000); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'{OUT}/03-camera-ligada.png')
        print('camera tracks:',await pg.evaluate("()=>{const s=document.getElementById('selfVid').srcObject;return s?s.getTracks().map(t=>t.kind+':'+t.readyState):null}"))
        # microfone pressionado com a câmera ligada (fala simulada chega como parciais do STT)
        bb=await pg.locator('#cbMic').bounding_box(); x,y=bb['x']+bb['width']/2,bb['y']+bb['height']/2
        await pg.mouse.move(x,y); await pg.mouse.down(); await pg.wait_for_timeout(250)
        await pg.evaluate("()=>{sophiaTest.say('I like to travel with my family')}"); await pg.wait_for_timeout(1300)
        await pg.screenshot(path=f'{OUT}/04-microfone-pressionado.png')
        print('mic held:',await pg.evaluate("()=>[sophiaTest.S.ptt,sophiaTest.state(),document.getElementById('callHint').textContent]"))
        await pg.mouse.up(); await idle()
        await pg.click('#cbCam'); await pg.wait_for_timeout(300)
        print('camera off, tracks:',await pg.evaluate("()=>document.getElementById('selfVid').srcObject"))
        # desligar → revisão
        await pg.click('#cbHang')
        await pg.wait_for_function("()=>sophiaTest.S.prac&&sophiaTest.state()==='ATTENDING'",timeout=60000); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/05-revisao-A-repita-comigo.png')
        n=await pg.evaluate("()=>sophiaTest.S.prac.list.length")
        await pg.evaluate("()=>document.body.classList.add('kbd')")
        for i in range(n):
            t=await pg.evaluate("()=>sophiaTest.S.prac.list[sophiaTest.S.prac.i].target")
            await say(t)
            if i==0:
                await pg.evaluate("()=>document.body.classList.remove('kbd')"); await pg.wait_for_timeout(200)
                await pg.screenshot(path=f'{OUT}/06-revisao-B-de-memoria.png'); await pg.evaluate("()=>document.body.classList.add('kbd')")
            await say(t)
        await pg.wait_for_selector('#review:not([hidden])',timeout=60000); await pg.wait_for_timeout(600)
        await pg.screenshot(path=f'{OUT}/07-revisao-aba-conversa.png')
        await pg.click('.rvtabs button[data-t=er]'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/08-revisao-aba-erros.png')
        await pg.click('.rvtabs button[data-t=cd]'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/09-revisao-aba-cartoes.png')
        print('timer:',await pg.evaluate("()=>document.getElementById('callTime').textContent"))
        print('errors:',errs); print('warnings:',warns)
        await b.close()
asyncio.run(main())
