import asyncio,sys,json,re,time,struct,math,os
from playwright.async_api import async_playwright
BASE=sys.argv[1].rstrip('/'); OUT=sys.argv[2]; os.makedirs(OUT,exist_ok=True)
def wav(sec,f=220):
    sr=24000;n=int(sec*sr);d=b''.join(struct.pack('<h',int(3000*math.sin(2*math.pi*f*i/sr))) for i in range(n))
    return b'RIFF'+struct.pack('<I',36+len(d))+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,1,sr,sr*2,2,16)+b'data'+struct.pack('<I',len(d))+d
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--autoplay-policy=no-user-gesture-required'])
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        now=int(time.time()*1000); D=864e5
        seed={"sophiaCfg":{"azKey":"MOCK","azReg":"brazilsouth"},
          "sophiaCards":[{"id":"c1","target":"We're running a bit late on the rollout.","said":"we running late","pt":"Estamos um pouco atrasados no rollout.","created":now-2*D,"step":0,"due":[now-D,now+D,now+5*D],"next":now-D,"tag":"ouvido"},
                         {"id":"c2","target":"I need to close the month by Friday.","said":"I need close the month","pt":"Preciso fechar o mês até sexta.","why":"need TO + verbo","created":now-2*D,"step":0,"due":[now-D,now+D,now+5*D],"next":now-D}]}
        await ctx.add_init_script("if(!localStorage.getItem('sophiaCards')){"+"".join(f"localStorage.setItem('{k}',{json.dumps(json.dumps(v))});" for k,v in seed.items())+"}")
        tts={'n':0}
        async def az(route):
            body=route.request.post_data or '';tts['n']+=1
            await route.fulfill(status=200,content_type='audio/wav',body=wav(0.15+len(re.sub('<[^>]+>','',body).split())*0.12))
        await ctx.route('https://*.tts.speech.microsoft.com/**',az)
        pg=await ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.type+': '+m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERROR: '+str(e)))
        async def go(h,wait=500):
            await pg.evaluate(f"location.hash={json.dumps(h)}"); await pg.wait_for_timeout(wait)
        async def shot(n,full=False): await pg.screenshot(path=f'{OUT}/{n}.png',full_page=full)
        await pg.goto(BASE+'/v6/#home',wait_until='networkidle'); await pg.wait_for_timeout(700)
        print('versão:',await pg.evaluate("document.querySelector('meta[name=prototipo-version]').content"))
        await shot('01-hoje')
        await pg.click('#home .today .btn.primary'); await pg.wait_for_timeout(500)
        print('após começar:',await pg.evaluate("location.hash"),'| banner:',(await pg.inner_text('#oWarmReal'))[:80].replace('\n',' '))
        await pg.click('#oWarmReal [data-go]'); await pg.wait_for_selector('#oAqIn')
        ans=["were running a bit late on the roll out","I need close the month by friday"]
        for i in range(await pg.evaluate("mergeTest.AQ.q.length")):
            await pg.fill('#oAqIn',ans[i] if i<2 else 'x'); await pg.press('#oAqIn','Enter'); await pg.wait_for_selector('#oAqNext'); await pg.click('#oAqNext')
        print('aquec:',(await pg.inner_text('#oCards'))[:90].replace('\n',' '),'| step:',await pg.evaluate("JSON.stringify(mergeTest.today().steps.aquec)"))
        await pg.click('#oCards [data-go="d-ouvir"]'); await pg.wait_for_selector('#oEpD #oPP',timeout=20000)
        print('ep sessão:',await pg.evaluate("[mergeTest.EF.ep.id,mergeTest.PL.mode,mergeTest.PL.dur.toFixed(1)]"),'tts:',tts['n'])
        await pg.click('#oEpD #oPP'); await pg.wait_for_timeout(1200); await shot('02-sessao-trilha-ouvir')
        await pg.evaluate("mergeTest.PL.audio.currentTime=mergeTest.PL.dur-0.6")
        await pg.wait_for_function("mergeTest.EF.heardOnce",timeout=8000); await pg.click('#oToGist')
        for q in range(2): await pg.click(f'#oEpD .o-opt[data-q="{q}"][data-o="0"]')
        await pg.click('#oToTr')
        n=await pg.evaluate("mergeTest.EF.ep.tr.length")
        for i in range(n):
            await pg.wait_for_selector('#oTrIn')
            tgt=await pg.evaluate(f"mergeTest.EF.ep.lines[mergeTest.EF.ep.tr[{i}][0]][1]")
            ck=await pg.evaluate(f"mergeTest.EF.ep.tr[{i}][2].map(c=>c[0])")
            h=tgt if i%2 else re.sub(re.escape(ck[0]),'',tgt,count=1,flags=re.I) if ck else tgt
            await pg.fill('#oTrIn',h); await pg.press('#oTrIn','Enter'); await pg.wait_for_selector('#oTrNext')
            if i==0: await shot('03-sessao-pegue-o-trecho')
            await pg.click('#oTrNext')
        await pg.wait_for_selector('#oFinish'); await pg.wait_for_timeout(1500); await shot('04-sessao-letra')
        await pg.click('#oFinish'); await pg.wait_for_timeout(300)
        print('ep step:',(await pg.evaluate("JSON.stringify(mergeTest.today().steps.ep)"))[:160])
        await pg.click('#oEpD [data-go="d-trail"]'); await pg.wait_for_timeout(500)
        print('hash:',await pg.evaluate("location.hash"),'| trilha blk:',await pg.inner_text('#d-trail .blk'))
        await shot('05-sessao-exercicios')
        await go('d-call',800)
        print('trail done:',await pg.evaluate("!!mergeTest.today().steps.trail"),'| link real:',await pg.get_attribute('#d-call .o-callreal','href'))
        await shot('06-bate-papo-simulado')
        # volta da chamada ao vivo (o sophia-ao-vivo grava isto ao desligar com from=rotina)
        await pg.evaluate("localStorage.setItem('sophiaRotinaCall',JSON.stringify({sid:12345,at:Date.now(),tema:'weekly status',turns:4,secs:150,errs:[{said:'we are late with the migration',corrected:\"We're running behind on the migration.\"}]}))")
        await go('d-transcript'); await go('d-close',800)
        print('call:',(await pg.evaluate("JSON.stringify(mergeTest.today().steps.call)"))[:120])
        await pg.click('#oSelf button[data-v="3"]'); await pg.wait_for_timeout(200)
        await shot('07-fechamento-lili')
        await pg.click('#oClose'); await pg.wait_for_timeout(600)
        print('capital hoje:',await pg.evaluate("JSON.stringify(mergeTest.capitalOf())"),'| toast:',await pg.inner_text('#toast'))
        print('home btn:',await pg.inner_text('#home .today .btn.primary'))
        await shot('08-hoje-concluida')
        await go('m-checkpoint',600); await pg.click('#oWeekDone'); await pg.wait_for_timeout(300); await shot('09-checkpoint-semanal')
        print('capital pós-checkpoint:',await pg.evaluate("mergeTest.capitalOf().total"),'semana:',await pg.evaluate("mergeTest.capitalWeek()"))
        await go('leagues',600); await shot('10-comunidade-ligas-times'); print('liga real:',(await pg.inner_text('#leagues .o-realcap'))[:120])
        await go('community',500); await shot('11-comunidade')
        await go('capital',500); await shot('12-capital')
        await go('trilha',500); await shot('13-trilha'); await pg.click('#oHow'); await pg.wait_for_timeout(800); await shot('14-metodologia-na-trilha')
        print('sheet:',(await pg.inner_text('#oSheet'))[:120].replace('\n',' | '))
        await go('ouvir',600); await shot('15-ouvir-com-o-erick')
        await go('ep~ep1',300); await pg.wait_for_selector('#oEp #oPP',timeout=20000); await pg.click('#oEp #oPP'); await pg.wait_for_timeout(1500); await shot('16-player-podcast')
        await go('foco~ep1',500); await shot('17-treino-focado')
        await go('practice',500); await shot('18-praticar')
        print('ERROS:',errs)
        await b.close()
asyncio.run(main())
