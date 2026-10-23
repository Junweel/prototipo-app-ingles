import asyncio,sys,json,re,time,io,struct,math,os
from playwright.async_api import async_playwright
BASE=sys.argv[1].rstrip('/'); OUT=sys.argv[2]; os.makedirs(OUT,exist_ok=True)
def wav(sec,f=220):
    sr=24000;n=int(sec*sr);d=b''.join(struct.pack('<h',int(3000*math.sin(2*math.pi*f*i/sr))) for i in range(n))
    return b'RIFF'+struct.pack('<I',36+len(d))+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,1,sr,sr*2,2,16)+b'data'+struct.pack('<I',len(d))+d
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,permissions=['microphone'],
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        await ctx.add_init_script("class FakeSR{start(){setTimeout(()=>this.onstart&&this.onstart(),10)}stop(){setTimeout(()=>this.onend&&this.onend(),10)}abort(){}};window.webkitSpeechRecognition=window.SpeechRecognition=FakeSR")
        now=int(time.time()*1000); D=864e5
        y=time.strftime('%Y-%m-%d',time.localtime(time.time()-86400)); y2=time.strftime('%Y-%m-%d',time.localtime(time.time()-2*86400))
        seed={"sophiaCfg":{"azKey":"MOCK","azReg":"brazilsouth","mode":"llm"},
          "sophiaCards":[{"id":"c1","target":"We're running a bit late on the rollout.","said":"we running late","pt":"Estamos um pouco atrasados no rollout.","created":now-2*D,"step":0,"due":[now-D,now+D,now+5*D],"next":now-D,"tag":"ouvido"},
                         {"id":"c2","target":"I need to close the month by Friday.","said":"I need close the month","pt":"Preciso fechar o mês até sexta.","why":"need TO + verbo","created":now-2*D,"step":0,"due":[now-D,now+D,now+5*D],"next":now-D}],
          "rotinaState":{"days":{y:{"steps":{"aquec":{"done":True},"ep":{"done":True,"pct":71,"gist":2,"miss":[{"t":"gonna","snd":"“gâna”"}]},"call":{"done":True}},"phr":[{"en":"Let me finish this email first.","pt":"Deixa eu terminar este e-mail primeiro."},{"en":"Do you wanna grab a coffee?","pt":"Quer tomar um café?"}]},
                                 y2:{"steps":{"aquec":{"done":True},"ep":{"done":True,"pct":62},"foco":{"done":True}}}},"eps":{}}}
        await ctx.add_init_script("if(!localStorage.getItem('rotinaState')){"+"".join(f"localStorage.setItem('{k}',{json.dumps(json.dumps(v))});" for k,v in seed.items())+"}")
        tts={'n':0,'voices':set()}
        async def az(route):
            body=route.request.post_data or ''; txt=re.sub('<[^>]+>','',body); tts['n']+=1
            m=re.search(r'voice name="([^"]+)"',body); tts['voices'].add(m.group(1) if m else '?')
            await route.fulfill(status=200,content_type='audio/wav',body=wav(0.15+len(txt.split())*0.12, 180 if 'Andrew' in body else 300))
        await ctx.route('https://*.tts.speech.microsoft.com/**',az)
        pg=await ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.type+': '+m.text) if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERROR: '+str(e)))
        await pg.goto(BASE+'/rotina/',wait_until='networkidle'); await pg.wait_for_timeout(600)
        print('versão:',await pg.evaluate("document.querySelector('meta[name=rotina-version]').content"),'| streak:',await pg.inner_text('.streak'))
        await pg.screenshot(path=f'{OUT}/01-hoje.png')
        print('links passos:',await pg.evaluate("[...document.querySelectorAll('a.step')].map(a=>a.dataset.step+' '+a.getAttribute('href'))"))
        # Aquecimento
        await pg.click('a[data-step=aquec]'); await pg.wait_for_selector('#aqIn')
        print('aquec fila:',await pg.evaluate("rotinaTest.AQ.q.map(x=>x.kind+':'+x.en)"))
        answers=["were running a bit late on the roll out","I need close the month by friday","Do you want to grab a coffee"]
        for i in range(await pg.evaluate("rotinaTest.AQ.q.length")):
            await pg.fill('#aqIn',answers[i] if i<len(answers) else 'x'); await pg.press('#aqIn','Enter'); await pg.wait_for_selector('#aqNext')
            if i==1: await pg.screenshot(path=f'{OUT}/02-aquecimento-revelado.png')
            await pg.click('#aqNext')
        print('aquec resultado:',await pg.inner_text('.card'))
        print('cartões após aquec:',await pg.evaluate("rotinaTest.cardsGet().map(c=>c.id+' step'+c.step)"))
        # Lista de episódios
        await pg.goto(BASE+'/rotina/#ouvir'); await pg.wait_for_timeout(500); await pg.screenshot(path=f'{OUT}/03-episodios.png')
        await pg.screenshot(path=f'{OUT}/03b-episodios-lista.png',full_page=True)
        # Episódio
        await pg.click('.playday .pbtn'); await pg.wait_for_selector('#pp',timeout=20000)
        print('ep:',await pg.evaluate("[rotinaTest.EF.ep.id,rotinaTest.PL.mode,rotinaTest.PL.dur.toFixed(1)]"),'tts chamadas:',tts['n'],sorted(tts['voices']))
        print('letra travada:',await pg.evaluate("document.getElementById('lt').disabled"))
        await pg.click('#pp'); await pg.wait_for_timeout(1500)
        print('tocando:',await pg.evaluate("[rotinaTest.PL.playing,rotinaTest.PL.audio.currentTime.toFixed(2)]"))
        await pg.click('#spd'); print('vel:',await pg.evaluate("rotinaTest.PL.audio.playbackRate"))
        await pg.click('#b15'); await pg.screenshot(path=f'{OUT}/04-player-1a-escuta.png')
        await pg.evaluate("rotinaTest.PL.audio.currentTime=rotinaTest.PL.dur-0.8")
        await pg.wait_for_function("rotinaTest.EF.heardOnce",timeout=8000); await pg.click('#toGist')
        for q in range(2):
            await pg.click(f'.opt[data-q="{q}"][data-o="{1 if q==0 else 0}"]')
        await pg.screenshot(path=f'{OUT}/05-perguntas.png')
        await pg.click('#toTr')
        n=await pg.evaluate("rotinaTest.EF.ep.tr.length")
        for i in range(n):
            await pg.wait_for_selector('#trIn')
            tgt=await pg.evaluate(f"rotinaTest.EF.ep.lines[rotinaTest.EF.ep.tr[{i}][0]][1]")
            ck=await pg.evaluate(f"rotinaTest.EF.ep.tr[{i}][2].map(c=>c[0])")
            h=tgt if i==1 else re.sub(re.escape(ck[0]),'',tgt,count=1,flags=re.I) if ck else tgt
            if i==3: await pg.click('#trSkip')
            else: await pg.fill('#trIn',h); await pg.press('#trIn','Enter')
            await pg.wait_for_selector('#trNext')
            if i==0:
                await pg.click('#trSlow'); await pg.wait_for_timeout(200); print('trecho lento rate:',await pg.evaluate("rotinaTest.PL.audio.playbackRate"))
                await pg.screenshot(path=f'{OUT}/06-pegue-o-trecho-revelado.png')
                print('revelado:',(await pg.inner_text('.pcard'))[:300].replace('\n',' / '))
            await pg.click('#trNext')
        await pg.wait_for_selector('#lyr'); await pg.wait_for_timeout(2500)
        print('letra on, linha atual:',await pg.evaluate("[...document.querySelectorAll('#lyr p')].findIndex(p=>p.classList.contains('on'))"))
        await pg.screenshot(path=f'{OUT}/07-player-letra.png')
        await pg.click('#lyr p[data-i="6"]'); await pg.wait_for_timeout(700)
        print('clique na linha 6 → atual:',await pg.evaluate("[...document.querySelectorAll('#lyr p')].findIndex(p=>p.classList.contains('on'))"))
        await pg.click('#finish'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/08-episodio-concluido.png')
        print('cartões ouvido:',await pg.evaluate("rotinaTest.cardsGet().filter(c=>c.tag==='ouvido').length"))
        # Treino focado
        await pg.click('a[href^="#foco/"]'); await pg.wait_for_selector('#tiles')
        await pg.screenshot(path=f'{OUT}/09-treino-focado.png')
        for i in range(4):
            en=await pg.evaluate(f"rotinaTest.FO.ep.foco.items[{i}].en")
            if await pg.query_selector('#tiles'):
                if i==1:  # erra primeiro (só o primeiro bloco) → dica
                    await pg.click('#tiles button:not([disabled])'); await pg.click('#foChk'); await pg.wait_for_selector('.fb.hint')
                    await pg.screenshot(path=f'{OUT}/10-treino-dica.png')
                for w in re.sub(r'[.,?!]','',en).split():
                    await pg.evaluate("w=>{const b=[...document.querySelectorAll('#tiles button:not([disabled])')].find(x=>x.textContent===w);b.click()}",w)
                await pg.click('#foChk')
            else:
                if i==3:
                    await pg.fill('#foIn','I go to call'); await pg.press('#foIn','Enter'); await pg.wait_for_selector('.fb.hint')
                    await pg.fill('#foIn','I will call'); await pg.press('#foIn','Enter'); await pg.wait_for_selector('.fb.ans')
                else: await pg.fill('#foIn',en); await pg.press('#foIn','Enter')
            await pg.wait_for_selector('#foNext'); await pg.click('#foNext')
        print('foco fim:',(await pg.inner_text('#app'))[-200:].replace('\n',' / '))
        # Volta da chamada (flag do sophia-ao-vivo)
        await pg.goto(BASE+'/rotina/#hoje'); await pg.wait_for_timeout(300)
        await pg.evaluate("localStorage.setItem('sophiaRotinaCall',JSON.stringify({sid:12345,at:Date.now(),tema:'weekend plans and the week ahead at work',turns:5,secs:340,errs:[{said:'I go to the beach yesterday',corrected:'I went to the beach yesterday',why:'passado'}]}));document.dispatchEvent(new Event('visibilitychange'));")
        await pg.wait_for_timeout(400)
        print('call marcado:',await pg.evaluate("!!(rotinaTest.today().steps.call&&rotinaTest.today().steps.call.done)"))
        await pg.screenshot(path=f'{OUT}/11-hoje-quase.png')
        await pg.click('a[data-step=lili]'); await pg.wait_for_selector('#liliDone'); await pg.wait_for_timeout(2800)
        await pg.screenshot(path=f'{OUT}/12-fechamento-lili.png'); await pg.screenshot(path=f'{OUT}/12b-fechamento-lili-inteiro.png',full_page=True)
        print('lili:',(await pg.inner_text('#app')).replace('\n',' / ')[:900])
        await pg.click('#liliDone'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'{OUT}/13-hoje-completo.png'); print('hoje:',await pg.inner_text('.hero'),'| streak',await pg.inner_text('.streak'))
        await pg.goto(BASE+'/rotina/#checkpoint'); await pg.wait_for_selector('.wk'); await pg.screenshot(path=f'{OUT}/14-checkpoint.png',full_page=True)
        await pg.goto(BASE+'/rotina/#hoje'); await pg.wait_for_timeout(300); await pg.click('#howBtn'); await pg.wait_for_selector('#sheet .md h2'); await pg.screenshot(path=f'{OUT}/15-como-funciona.png')
        # Fallback sem chave Azure: voz do navegador
        await pg.evaluate("localStorage.setItem('sophiaCfg','{}')"); await pg.goto(BASE+'/rotina/#ep/ep3'); await pg.reload(); await pg.wait_for_selector('#pp',timeout=10000)
        await pg.click('#pp'); await pg.wait_for_timeout(2500); print('fallback:',await pg.evaluate("[rotinaTest.PL.mode,rotinaTest.PL.t.toFixed(2),rotinaTest.PL.playing]"))
        await pg.click('#pp')
        print('ERROS/AVISOS:',errs)
        await b.close()
asyncio.run(main())
