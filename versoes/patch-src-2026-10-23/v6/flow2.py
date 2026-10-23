import asyncio,sys,json,re,time,struct,math,os
from playwright.async_api import async_playwright
sys.path.insert(0,'patch')
from mockflow import CORR,REPLY
BASE=sys.argv[1].rstrip('/'); OUT=sys.argv[2]; os.makedirs(OUT,exist_ok=True)
def wav(sec,f=220):
    sr=24000;n=int(sec*sr);d=b''.join(struct.pack('<h',int(3000*math.sin(2*math.pi*f*i/sr))) for i in range(n))
    return b'RIFF'+struct.pack('<I',36+len(d))+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,1,sr,sr*2,2,16)+b'data'+struct.pack('<I',len(d))+d
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,permissions=['camera','microphone'],
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        await ctx.add_init_script("class FakeSR{start(){setTimeout(()=>this.onstart&&this.onstart(),10)}stop(){setTimeout(()=>this.onend&&this.onend(),10)}abort(){}};window.webkitSpeechRecognition=window.SpeechRecognition=FakeSR")
        now=int(time.time()*1000); D=864e5
        seed={"sophiaCfg":{"prov":"xai","key":"xai-MOCK-KEY-for-local-test","mode":"llm","azKey":"MOCK","azReg":"brazilsouth"},
          "sophiaCards":[{"id":"c1","target":"We're running a bit late on the rollout.","said":"we running late","pt":"Estamos um pouco atrasados no rollout.","created":now-2*D,"step":0,"due":[now-D,now+D,now+5*D],"next":now-D,"tag":"ouvido"}]}
        await ctx.add_init_script("if(!localStorage.getItem('sophiaCards')){"+"".join(f"localStorage.setItem('{k}',{json.dumps(json.dumps(v))});" for k,v in seed.items())+"}")
        async def az(route):
            body=route.request.post_data or ''
            await route.fulfill(status=200,content_type='audio/wav',body=wav(0.15+len(re.sub('<[^>]+>','',body).split())*0.12))
        await ctx.route('https://*.tts.speech.microsoft.com/**',az)
        async def xai(route):
            body=json.loads(route.request.post_data or '{}'); msgs=body.get('messages',[]); sysm=msgs[0]['content'] if msgs else ''
            if 'You check ONE spoken sentence' in sysm:
                said=re.search(r'Student said: "(.*?)"',msgs[-1]['content']).group(1)
                c=CORR.get(said,dict(said=said,corrected=None,isError=False,important=False,unclear=False,why_pt=None,meaning=False,category=None,corrected_pt=None))
                return await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':json.dumps(c)}}]}))
            last=msgs[-1]['content']; rep=REPLY.get(last,"Got it. So, are you running behind or on track this week?")
            meta=json.dumps({'heard':last,'isError':False,'corrected':None,'emph':None,'tip':None,'repeat':None,'pt':'(tradução)'})
            await asyncio.sleep(.3)
            await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':rep+'\n###\n'+meta}}]}))
        await ctx.route('https://api.x.ai/**',xai)
        pg=await ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.type+': '+m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERROR: '+str(e)))
        async def go(h,wait=500):
            await pg.evaluate(f"location.hash={json.dumps(h)}"); await pg.wait_for_timeout(wait)
        async def shot(n): await pg.screenshot(path=f'{OUT}/{n}.png')
        await pg.goto(BASE+'/v6/#home',wait_until='networkidle'); await pg.wait_for_timeout(700)
        print('versão:',await pg.evaluate("document.querySelector('meta[name=prototipo-version]').content"))
        await shot('01-hoje')
        # 1 Aquecimento (cartões reais)
        await pg.click('#home .today .btn.primary'); await pg.wait_for_timeout(400)
        await pg.click('#oWarmReal [data-go]'); await pg.wait_for_selector('#oAqIn')
        for i in range(await pg.evaluate("mergeTest.AQ.q.length")):
            await pg.fill('#oAqIn',"we're running a bit late on the rollout"); await pg.press('#oAqIn','Enter'); await pg.wait_for_selector('#oAqNext'); await pg.click('#oAqNext')
        await pg.click('#oCards [data-go="d-ouvir"]')
        # 2a Trilha · Ouvir com o Erick (podcast)
        await pg.wait_for_selector('#oEpD #oPP',timeout=20000)
        await pg.click('#oEpD #oPP'); await pg.wait_for_timeout(1500); await shot('02-etapa2a-podcast-tocando')
        print('2a player:',await pg.evaluate("[!!document.querySelector('#d-ouvir .o-cover'),!!document.querySelector('#d-ouvir #oF15'),document.querySelector('#d-ouvir .o-np').innerText.replace(/\\n/g,' | '),getComputedStyle(document.querySelector('#d-ouvir .o-ctl .pp')).backgroundColor]"))
        await pg.click('#oEpD #oF15'); await pg.wait_for_timeout(300); print('skip +15 →',await pg.evaluate("mergeTest.PL.audio.currentTime.toFixed(1)"))
        await pg.evaluate("mergeTest.PL.audio.currentTime=mergeTest.PL.dur-0.6")
        await pg.wait_for_function("mergeTest.EF.heardOnce",timeout=8000); await pg.click('#oToGist')
        for q in range(2):
            ok=await pg.evaluate(f"mergeTest.EF.ep.gist[{q}][2]"); await pg.click(f'#oEpD .o-opt[data-q="{q}"][data-o="{ok}"]')
        await shot('03-etapa2a-perguntas'); await pg.click('#oToTr')
        for i in range(await pg.evaluate("mergeTest.EF.ep.tr.length")):
            await pg.wait_for_selector('#oTrIn')
            tgt=await pg.evaluate(f"mergeTest.EF.ep.lines[mergeTest.EF.ep.tr[{i}][0]][1]")
            ck=await pg.evaluate(f"mergeTest.EF.ep.tr[{i}][2].map(c=>c[0])")
            h=tgt if i%2 else re.sub(re.escape(ck[0]),'',tgt,count=1,flags=re.I) if ck else tgt
            await pg.fill('#oTrIn',h); await pg.press('#oTrIn','Enter'); await pg.wait_for_selector('#oTrNext')
            if i==0: await shot('04-etapa2a-pegue-o-trecho')
            await pg.click('#oTrNext')
        await pg.wait_for_selector('#oFinish'); await pg.wait_for_timeout(1800); await shot('05-etapa2a-com-letra')
        await pg.click('#oFinish'); await pg.wait_for_timeout(300); await pg.click('#oEpD [data-go="d-trail"]'); await pg.wait_for_timeout(400)
        await shot('06-etapa2b-exercicios')
        # 3 Bate-papo = chamada de vídeo (o d-trail termina indo para #d-call)
        # a chamada da Sophia usa o SDK de voz por WebSocket (não dá para simular com chave falsa): sem chave Azure, ela usa a voz do navegador
        await pg.evaluate("(()=>{const c=JSON.parse(localStorage.sophiaCfg);delete c.azKey;localStorage.sophiaCfg=JSON.stringify(c)})()")
        await go('d-call',1500)
        info=await pg.evaluate("[location.hash,document.getElementById('sophia').classList.contains('on'),document.getElementById('d-call').classList.contains('on'),(document.querySelector('#oSFrame iframe')||{}).src,document.getElementById('oSbT').textContent,!!mergeTest.today().steps.trail]")
        print('etapa 3:',info)
        fr=None
        for _ in range(40):
            fr=next((f for f in pg.frames if 'sophia-ao-vivo' in f.url),None)
            if fr: break
            await pg.wait_for_timeout(250)
        await fr.wait_for_function("()=>typeof sophiaTest!=='undefined'",timeout=20000); await pg.wait_for_timeout(1200)
        print('sophia no iframe:',await fr.evaluate("()=>[document.body.className,document.querySelector('meta[name=sophia-version]').content,document.getElementById('callHint').textContent]"))
        await shot('07-etapa3-chamada-antes-de-ligar')
        async def idle(t=40000):
            await fr.wait_for_function("()=>sophiaTest.state()==='ATTENDING'||!document.getElementById('review').hidden",timeout=t); await pg.wait_for_timeout(300)
        async def say(txt):
            await fr.fill('#typeIn',txt); await fr.press('#typeIn','Enter'); await idle()
        await fr.click('#cbHang'); await idle()
        await fr.click('#cbMore'); await fr.click('#mmKbd')
        for t in ['I go on park in the weekend','Yesterday I go to the cinema with my wife','She like romantic movies']: await say(t)
        await fr.click('#cbMore'); await fr.click('#mmKbd'); await pg.wait_for_timeout(400)
        await fr.evaluate("()=>document.body.classList.add('kbd')"); await fr.fill('#typeIn','It was very good'); await fr.press('#typeIn','Enter'); await fr.evaluate("()=>document.body.classList.remove('kbd')")
        await fr.wait_for_function("()=>sophiaTest.state()==='SPEAKING'",timeout=20000); await pg.wait_for_timeout(1200)
        await shot('08-etapa3-chamada-legendas')
        await idle()
        await fr.click('#cbCam'); await fr.wait_for_selector('#selfView:not([hidden])',timeout=10000); await pg.wait_for_timeout(1000)
        bb=await pg.frame_locator('#oSFrame iframe').locator('#cbMic').bounding_box(); x,y=bb['x']+bb['width']/2,bb['y']+bb['height']/2
        await pg.mouse.move(x,y); await pg.mouse.down(); await pg.wait_for_timeout(250)
        await fr.evaluate("()=>{sophiaTest.say('We are running behind on the migration')}"); await pg.wait_for_timeout(1300)
        await shot('09-etapa3-microfone-e-camera')
        print('mic:',await fr.evaluate("()=>[sophiaTest.S.ptt,sophiaTest.state(),document.getElementById('callHint').textContent]"))
        await pg.mouse.up(); await idle()
        await fr.click('#cbCam'); await pg.wait_for_timeout(200)
        await fr.click('#cbHang')
        await fr.wait_for_function("()=>(sophiaTest.S.prac&&sophiaTest.state()==='ATTENDING')||!document.getElementById('review').hidden",timeout=60000); await pg.wait_for_timeout(300)
        if await fr.evaluate("()=>!!sophiaTest.S.prac"):
            n=await fr.evaluate("()=>sophiaTest.S.prac.list.length"); await fr.evaluate("()=>document.body.classList.add('kbd')")
            for i in range(n):
                t=await fr.evaluate("()=>sophiaTest.S.prac.list[sophiaTest.S.prac.i].target"); await say(t); await say(t)
        await fr.wait_for_selector('#review:not([hidden])',timeout=60000); await pg.wait_for_timeout(800)
        await shot('10-etapa3-revisao-pos-chamada')
        print('flag:',(await pg.evaluate("localStorage.getItem('sophiaRotinaCall')") or '')[:90],'| btn:',await pg.evaluate("[document.getElementById('oSbNext').className,document.getElementById('oSbNext').hidden]"),'| rvRotina:',await fr.evaluate("()=>[document.getElementById('rvRotina').hidden,document.getElementById('rvRotina').getAttribute('href'),document.getElementById('rvRotina').target]"))
        # volta pelo link da própria revisão da Sophia (troca a tela do app)
        await fr.click('#rvRotina'); await pg.wait_for_timeout(900)
        print('após voltar:',await pg.evaluate("[location.hash,!!document.querySelector('#oSFrame iframe'),JSON.stringify(mergeTest.today().steps.call).slice(0,80)]"))
        # 4 Fechamento
        await pg.click('#oSelf button[data-v="3"]'); await pg.wait_for_timeout(200); await shot('11-etapa4-fechamento-lili')
        await pg.click('#oClose'); await pg.wait_for_timeout(500)
        print('capital:',await pg.evaluate("JSON.stringify(mergeTest.capitalOf())"))
        await shot('12-hoje-concluida')
        # fallback texto
        await go('d-call~texto',800); print('modo texto:',await pg.evaluate("[document.getElementById('d-call').classList.contains('on'),document.querySelector('#d-call .o-callreal').getAttribute('href')]")); await shot('13-etapa3-modo-texto-fallback')
        # Praticar / missões / ciclo → chamada
        await go('practice',500); await pg.click('#practice [data-go="sophia~livre"]'); await pg.wait_for_timeout(1500)
        print('praticar livre:',await pg.evaluate("[location.hash,(document.querySelector('#oSFrame iframe')||{}).src,document.getElementById('oSbX').dataset.go]")); await shot('14-praticar-conversa-livre-chamada')
        await go('practice',400); await pg.click('#practice [data-go="sophia~smalltalk"]'); await pg.wait_for_timeout(1200)
        print('missão:',await pg.evaluate("[(document.querySelector('#oSFrame iframe')||{}).src,document.getElementById('oSbT').textContent]"))
        await go('m-talk',1200); print('ciclo m-talk:',await pg.evaluate("[document.getElementById('sophia').classList.contains('on'),document.getElementById('oSbT').textContent,document.getElementById('oSbNext').dataset.go]"))
        await go('chat',800); print('chat→',await pg.evaluate("document.getElementById('oSbT').textContent"))
        await go('chat~texto',600); print('chat texto:',await pg.evaluate("[document.getElementById('chat').classList.contains('on'),!!document.querySelector('#chat .o-vbanner'),!document.querySelector('#oSFrame iframe')]")); await shot('15-missao-modo-texto')
        await go('home',400); await pg.click('#home .stories [data-go="d-call"]'); await pg.wait_for_timeout(800); print('story Bate-papo →',await pg.evaluate("document.getElementById('sophia').classList.contains('on')"))
        # Erick: biblioteca e episódio
        await go('ouvir',700); await shot('16-ouvir-biblioteca-podcast')
        await pg.evaluate("document.querySelector('#ouvir .scroll').scrollTop=520"); await pg.wait_for_timeout(300); await shot('17-ouvir-lista-episodios')
        await go('ep~ep1',300); await pg.wait_for_selector('#oEp #oPP',timeout=20000); await pg.click('#oEp #oPP'); await pg.wait_for_timeout(1500); await shot('18-episodio-tocando-agora')
        await go('input',500); await shot('19-licao-ouca-a-historia')
        await go('community',400); await shot('20-comunidade'); await go('leagues',400); await shot('21-ligas-times'); await go('capital',400); await shot('22-capital'); await go('trilha',400); await shot('23-trilha')
        print('ERROS:',errs)
        await b.close()
asyncio.run(main())
