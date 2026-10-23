import asyncio,sys,json,re,time
from playwright.async_api import async_playwright
URL=sys.argv[1]; OUT=sys.argv[2]
GEN={"sentences":[{"text":"I'm gonna update the purchase order before lunch.","translation_pt":"Vou atualizar o pedido de compra antes do almoço.","chunks":[{"text":"I'm gonna","sound":"“áimâna”","tip_pt":"I'm going to → I'm gonna"},{"text":"purchase order","sound":"“pârtchâ-sórdâr”","tip_pt":"o s liga no o"}]},
                  {"text":"Did you get a chance to check the invoice?","translation_pt":"Você teve chance de ver a nota?","chunks":[{"text":"Did you","sound":"“dídja”","tip_pt":"did you → didja"},{"text":"get a chance","sound":"“guérâ tchéns”","tip_pt":"get a → “guera”"}]}]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,permissions=['microphone'],
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        await ctx.add_init_script("class FakeSR{start(){setTimeout(()=>this.onstart&&this.onstart(),10)}stop(){setTimeout(()=>this.onend&&this.onend(),10)}abort(){}};window.webkitSpeechRecognition=window.SpeechRecognition=FakeSR")
        now=int(time.time()*1000); D=864e5
        hist=[{"at":now-(6-k)*D,"pct":p_,"n":8,"whole":w} for k,(p_,w) in enumerate([(48,1),(55,2),(61,2),(58,3),(66,3)])]
        seed={"sophiaCfg":{"prov":"xai","key":"xai-MOCK-KEY-for-local-test","mode":"llm"},
              "sophiaCards":[{"id":"x1","target":"I need to close the month and pay the invoice","said":"I need close the month","created":now-2*D,"step":0,"due":[now-D,now+D,now+5*D],"next":now-D}],
              "sophiaOuvido":{"hist":hist}}
        await ctx.add_init_script("if(!localStorage.getItem('sophiaCfg')){"+"".join(f"localStorage.setItem('{k}',{json.dumps(json.dumps(v))});" for k,v in seed.items())+"}")
        calls={'gen':0}
        async def handle(route):
            body=json.loads(route.request.post_data or '{}'); sysm=body.get('messages',[{}])[0].get('content','')
            if 'listening-drill' in sysm:
                calls['gen']+=1; calls['fmt']=body.get('response_format',{}).get('type')
                return await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':json.dumps(GEN)}}]}))
            await route.fulfill(status=500,body='{}')
        await ctx.route('https://api.x.ai/**',handle)
        pg=await ctx.new_page(); errs=[]; warns=[]
        pg.on('console',lambda m: (errs if m.type=='error' else warns).append(m.text) if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERROR: '+str(e)))
        await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(1000)
        print('versão:',await pg.evaluate("document.querySelector('meta[name=sophia-version]').content"))
        print('pontuação:',await pg.evaluate("""()=>{const t=sophiaTest.earScore;return [
          ['What are you gonna do this weekend?','what are you going to do this weekend'],
          ['Do you want to grab a coffee after the call?','do you wanna grab coffee after the call'],
          ["I've gotta go, I have a meeting at ten.",'I have got to go I have a meeting at 10'],
          ["I don't know if we can close the month on Friday.","I dunno if we can close the month Friday"],
          ["We're running a bit late on the SAP rollout.","were running a bit late on the s.a.p. roll out"],
          ['Did you eat yet?','did you eat']].map(([a,h])=>{const r=t(a,h);return Math.round(r.pct*100)+'% '+r.words.filter(o=>!o.ok).map(o=>o.w).join('|')})}"""))
        await pg.screenshot(path=f'{OUT}/00-inicio-com-opcao.png')
        await pg.click('#earGo')
        await pg.wait_for_function("()=>sophiaTest.EAR.view==='play'&&document.body.classList.contains('spk')",timeout=15000); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'{OUT}/01-ouvindo.png')
        print('na tela enquanto ouve (não pode ter a frase):',await pg.evaluate("()=>{const it=sophiaTest.EAR.list[0];return [it.s, document.getElementById('ear').innerText.includes(it.s), document.getElementById('caps').innerText.length]}"))
        await pg.wait_for_function("()=>sophiaTest.EAR.view==='answer'",timeout=30000)
        await pg.wait_for_timeout(1500) # geração da IA chega
        lst=await pg.evaluate("()=>sophiaTest.EAR.list.map(x=>(x.card?'[cartão] ':x.gen?'[IA] ':x.mine?'[suas] ':'')+x.s)"); print('frases:',json.dumps(lst,ensure_ascii=False,indent=0),'geração:',calls)
        for i in range(8):
            await pg.wait_for_function(f"()=>sophiaTest.EAR.i==={i}&&sophiaTest.EAR.view==='answer'",timeout=30000)
            if i==0: await pg.screenshot(path=f'{OUT}/02-responder.png')
            s=await pg.evaluate("()=>sophiaTest.EAR.list[sophiaTest.EAR.i]")
            if i==5: await pg.click("#ear button[data-a=skip]")
            else:
                h=s['s']
                if i%2==0 and s.get('c'):  # erra o primeiro trecho reduzido
                    h=re.sub(re.escape(s['c'][0][0]),'',h,count=1,flags=re.I)
                    if i==2: h=h.replace('the','a',1)
                await pg.fill('#earIn',h); await pg.press('#earIn','Enter')
            await pg.wait_for_function("()=>sophiaTest.EAR.view==='reveal'",timeout=10000)
            if i==0:
                await pg.click("#ear button[data-a=slow]"); await pg.wait_for_timeout(300)
                print('mais devagar: S.slow/S.slowR=',await pg.evaluate("()=>[sophiaTest.S.slow,sophiaTest.S.slowR]"))
                await pg.wait_for_function("()=>sophiaTest.state()!=='SPEAKING'",timeout=20000)
                await pg.click("#ear button[data-a=chunk]"); await pg.wait_for_timeout(250)
                print('só o trecho fala:',await pg.evaluate("()=>[sophiaTest.S.sayingTxt,sophiaTest.S.slow]"))
                await pg.wait_for_function("()=>sophiaTest.state()!=='SPEAKING'",timeout=20000); await pg.wait_for_timeout(300)
                await pg.screenshot(path=f'{OUT}/03-revelacao-verde-vermelho-trechos.png')
                print('revelação:',await pg.evaluate("()=>{const e=document.getElementById('ear');return [e.querySelectorAll('.w.ok').length,e.querySelectorAll('.w.miss').length,e.querySelectorAll('.ck').length,e.querySelectorAll('.earTips li').length]}"))
            if i==2: await pg.screenshot(path=f'{OUT}/04-revelacao-2.png')
            await pg.click("#ear button[data-a=next]")
        await pg.wait_for_function("()=>sophiaTest.EAR.view==='summary'",timeout=20000); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'{OUT}/05-resumo.png')
        print('resumo:',await pg.evaluate("()=>{const m=sophiaTest.EAR.sum;return {pct:m.pct,n:m.n,inteiras:m.whole,cartoes:m.cards,trechos:m.chunks.map(c=>c.t),hist:m.hist.length}}"))
        print('cartões ouvido:',await pg.evaluate("()=>sophiaTest.cards().filter(c=>c.tag==='ouvido').map(c=>[c.target,c.step,Math.round((c.next-Date.now())/864e5)])"))
        print('cartões p/ conversa (sem ouvido):',await pg.evaluate("()=>sophiaTest.cards().filter(c=>c.tag!=='ouvido').length"))
        print('chamada parada:',await pg.evaluate("()=>[sophiaTest.S.running,document.getElementById('callTime').textContent]"))
        # entrada pelo menu "…" e encerrar pelo botão vermelho no meio
        await pg.click("#ear button[data-a=close]"); await pg.wait_for_timeout(300)
        await pg.click('#cbMore'); await pg.click('#mmEar')
        await pg.wait_for_function("()=>sophiaTest.EAR.view==='answer'",timeout=30000)
        await pg.fill('#earIn','hello there'); await pg.press('#earIn','Enter'); await pg.wait_for_timeout(300)
        await pg.click('#cbHang'); await pg.wait_for_timeout(500)
        print('menu + desligar no meio:',await pg.evaluate("()=>[sophiaTest.EAR.view,sophiaTest.EAR.sum&&sophiaTest.EAR.sum.n,JSON.parse(localStorage.sophiaOuvido).hist.length]"))
        await pg.click("#ear button[data-a=close]"); await pg.wait_for_timeout(300)
        # conversa normal continua funcionando depois
        await pg.click('#cbHang'); await pg.wait_for_function("()=>sophiaTest.state()==='SPEAKING'||sophiaTest.state()==='ATTENDING'",timeout=20000); await pg.wait_for_timeout(1500)
        print('conversa depois do treino:',await pg.evaluate("()=>[sophiaTest.S.running,document.body.className,document.getElementById('caps').innerText.slice(0,40)]"))
        await pg.screenshot(path=f'{OUT}/06-chamada-normal-depois.png')
        print('errors:',errs); print('warnings:',warns)
        await b.close()
asyncio.run(main())
