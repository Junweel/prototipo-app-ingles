import asyncio,sys,json,re
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else ""; OUT=sys.argv[2] if len(sys.argv)>2 else ""
CORR={
 'I go on park in the weekend':dict(said='I go on park in the weekend',corrected='I went to the park on the weekend',isError=True,important=True,unclear=False,why_pt='Passado: went; “to the park”; on the weekend.',meaning=True,category='past tense',corrected_pt='Eu fui ao parque no fim de semana'),
 'Yesterday I go to the cinema with my wife':dict(said='Yesterday I go to the cinema with my wife',corrected='Yesterday I went to the cinema with my wife',isError=True,important=True,unclear=False,why_pt='“Yesterday” pede passado: went.',meaning=True,category='past tense',corrected_pt='Ontem eu fui ao cinema com a minha esposa'),
 'She like romantic movies':dict(said='She like romantic movies',corrected='She likes romantic movies',isError=True,important=True,unclear=False,why_pt='He/she → verbo com -s: likes.',meaning=False,category='he/she -s',corrected_pt='Ela gosta de filmes românticos'),
 'It was very good':dict(said='It was very good',corrected=None,isError=False,important=False,unclear=False,why_pt=None,meaning=False,category=None,corrected_pt=None),
}
REPLY={
 'I go on park in the weekend':"Oh, how cool! I went to the park this weekend too. It's great for decompressing after a full week of work. What did you do there?",
 'Yesterday I go to the cinema with my wife':"Nice, so you went to the cinema yesterday! I love a good movie night. What did you two watch?",
 'She like romantic movies':"Aww, so she likes romantic movies! I'm a sucker for those too. Was it a good one?",
 'It was very good':"That's awesome! Nothing beats a great movie with someone you love. Do you go to the cinema often?",
}
SYSLOG=[]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx=await b.new_context(viewport={'width':412,'height':915},device_scale_factor=2,is_mobile=True,has_touch=True,
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        await ctx.add_init_script("if(!localStorage.getItem('sophiaCfg'))localStorage.setItem('sophiaCfg',JSON.stringify({prov:'xai',key:'xai-MOCK-KEY-for-local-test',mode:'llm',bg:'auto'}));localStorage.setItem('sophiaBgN','0')")
        async def handle(route):
            req=route.request; body=json.loads(req.post_data or '{}'); msgs=body.get('messages',[])
            sysm=msgs[0]['content'] if msgs else ''
            if 'You check ONE spoken sentence' in sysm:
                said=re.search(r'Student said: "(.*?)"',msgs[-1]['content']).group(1)
                c=CORR.get(said,dict(said=said,corrected=None,isError=False,important=False,unclear=False,why_pt=None,meaning=False,category=None,corrected_pt=None))
                await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':json.dumps(c)}}]}));return
            SYSLOG.append(sysm); last=msgs[-1]['content']
            rep=REPLY.get(last,"Bye! It was so nice talking to you.")
            meta=json.dumps({'heard':last,'isError':False,'corrected':None,'emph':None,'tip':None,'repeat':None,'pt':'(tradução)'})
            await asyncio.sleep(.4)
            await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':rep+'\n###\n'+meta}}]}))
        await ctx.route('https://api.x.ai/**',handle)
        pg=await ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(f'{m.type}: {m.text}') if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERROR: '+str(e)))
        await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(1000)
        async def idle(t=40000):
            await pg.wait_for_function("()=>window.sophiaTest&&(sophiaTest.state()==='ATTENDING'||!document.getElementById('review').hidden)",timeout=t)
            await pg.wait_for_timeout(300)
        async def say(txt):
            await pg.fill('#typeIn',txt); await pg.press('#typeIn','Enter'); await idle()
        await pg.click('#btnStart'); await idle(); await pg.click('#btnKbd')
        for t in ['I go on park in the weekend','Yesterday I go to the cinema with my wife','She like romantic movies','It was very good']:
            await say(t)
        await pg.click('#btnKbd'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f'{OUT}/10-conversa-legendas-IA.png')
        print('conversa prompt ok:', 'NEVER ask them to repeat' in SYSLOG[0], 'recast' in SYSLOG[0])
        await pg.click('#btnKbd')
        await pg.fill('#typeIn','Ok, I have to go now, bye!'); await pg.press('#typeIn','Enter')
        await pg.wait_for_function("()=>sophiaTest.S.prac&&sophiaTest.state()==='ATTENDING'",timeout=60000); await pg.wait_for_timeout(300)
        await pg.click('#btnKbd'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{OUT}/11-revisao-A-repita-comigo-IA.png'); await pg.click('#btnKbd')
        n=await pg.evaluate("()=>sophiaTest.S.prac.list.length"); print('picks',await pg.evaluate("()=>sophiaTest.S.prac.list.map(p=>[p.target,p.cat,p.n,p.pt])"))
        for i in range(n):
            t=await pg.evaluate("()=>sophiaTest.S.prac.list[sophiaTest.S.prac.i].target")
            await say(t)
            if i==0:
                await pg.click('#btnKbd'); await pg.wait_for_timeout(200)
                await pg.screenshot(path=f'{OUT}/12-revisao-B-de-memoria-IA.png'); await pg.click('#btnKbd')
                await say('Yesterday I go to the park')
                await pg.click('#btnKbd'); await pg.wait_for_timeout(200)
                await pg.screenshot(path=f'{OUT}/13-revisao-B-tente-de-novo-IA.png'); await pg.click('#btnKbd')
            await say(t)
        await pg.wait_for_selector('#review:not([hidden])',timeout=60000); await pg.wait_for_timeout(600)
        await pg.screenshot(path=f'{OUT}/14-aba-revisao-conversa-IA.png')
        await pg.click('.rvtabs button[data-t=er]'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/15-aba-revisao-erros-IA.png')
        await pg.click('.rvtabs button[data-t=cd]'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/16-aba-revisao-cartoes-IA.png')
        errs_logged=await pg.evaluate("()=>sophiaTest.CV.turns.filter(t=>t.isError&&!t.practice).map(t=>[t.text,t.corrected,t.cat])")
        print('logged errors:',errs_logged)
        # próxima sessão: cartões vencidos entram no prompt
        await pg.evaluate("()=>sophiaTest.dueAll()")
        n0=len(SYSLOG)
        await pg.click('#rvNew'); await idle()
        await pg.fill('#typeIn','It was very good'); await pg.press('#typeIn','Enter'); await idle()
        sp=SYSLOG[n0] if len(SYSLOG)>n0 else ''
        print('next-session prompt has cards:', 'I went to the park on the weekend' in sp, '| excerpt:', sp[sp.find('From earlier'):sp.find('From earlier')+300].replace('\n',' / '))
        print('bg this session:',await pg.evaluate("()=>document.getElementById('bgHost').dataset.bg"))
        await pg.screenshot(path=f'{OUT}/17-segunda-sessao.png')
        print('errors/warnings:',errs)
        await b.close()
if __name__=="__main__": asyncio.run(main())
