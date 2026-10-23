import asyncio,sys,json,re,random
from playwright.async_api import async_playwright
sys.path.insert(0,'patch')
from mockflow import CORR,REPLY
URL=sys.argv[1]; W=int(sys.argv[2]) if len(sys.argv)>2 else 412; H=int(sys.argv[3]) if len(sys.argv)>3 else 915
INSTR=r"""
window.__ev=[];window.__fr=[];
document.addEventListener('DOMContentLoaded',()=>{
 const m=document.getElementById('cbMic');
 ['pointerdown','pointerup','pointercancel','lostpointercapture','contextmenu','touchstart','touchend','touchcancel','selectstart'].forEach(t=>m.addEventListener(t,e=>__ev.push([t,Math.round(performance.now())]),{capture:true}));
 new MutationObserver(r=>r.forEach(x=>__ev.push(['class:'+x.target.id+':'+x.target.className,Math.round(performance.now())]))).observe(m,{attributes:true,attributeFilter:['class']});
 new MutationObserver(r=>r.forEach(x=>__ev.push(['body:'+document.body.className,Math.round(performance.now())]))).observe(document.body,{attributes:true,attributeFilter:['class']});
});
window.__rec=on=>{window.__recOn=on;if(!on)return;const im=document.querySelector('#callImg img'),ci=document.getElementById('callImg');
 const tag=()=>ci.getAnimations().concat(im.getAnimations()).map(a=>{a.__id=a.__id||Math.random().toString(36).slice(2,7);return a.__id+':'+a.animationName+':'+Math.round(a.currentTime)}).join(',');
 const f=()=>{if(!__recOn)return;const r=im.getBoundingClientRect(),s=document.getElementById('stage').getBoundingClientRect();
  __fr.push({t:Math.round(performance.now()),anim:tag(),imT:getComputedStyle(im).transform,imF:getComputedStyle(im).filter,ring:getComputedStyle(document.getElementById('spkRing')).opacity,
   r:[r.x,r.y,r.width,r.height].map(v=>+v.toFixed(2)).join(','),st:[s.width,s.height].join(','),ih:innerHeight,sy:scrollY,ptt:sophiaTest.S.ptt,state:sophiaTest.state(),hint:document.getElementById('callHint').textContent});requestAnimationFrame(f)};f()};
"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
        ctx=await b.new_context(viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=True,has_touch=True,permissions=['camera','microphone'],
            user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36')
        await ctx.add_init_script("class FakeSR{start(){window.__srStarts=(window.__srStarts||0)+1;window.__srGesture=navigator.userActivation?navigator.userActivation.isActive:null;setTimeout(()=>this.onstart&&this.onstart(),10)}stop(){setTimeout(()=>this.onend&&this.onend(),10)}abort(){}};window.webkitSpeechRecognition=window.SpeechRecognition=FakeSR")
        await ctx.add_init_script("if(!localStorage.getItem('sophiaCfg'))localStorage.setItem('sophiaCfg',JSON.stringify({prov:'xai',key:'xai-MOCK-KEY-for-local-test',mode:'llm'}))")
        await ctx.add_init_script(INSTR)
        async def handle(route):
            body=json.loads(route.request.post_data or '{}'); msgs=body.get('messages',[]); sysm=msgs[0]['content'] if msgs else ''
            if 'You check ONE spoken sentence' in sysm:
                said=re.search(r'Student said: "(.*?)"',msgs[-1]['content']).group(1)
                c=CORR.get(said,dict(said=said,corrected=None,isError=False,important=False,unclear=False,why_pt=None,meaning=False,category=None,corrected_pt=None))
                return await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':json.dumps(c)}}]}))
            last=msgs[-1]['content']; rep=REPLY.get(last,"Oh nice, tell me more! What else do you like to do on the weekend with your friends?")
            meta=json.dumps({'heard':last,'isError':False,'corrected':None,'emph':None,'tip':None,'repeat':None,'pt':'(tradução)'})
            await asyncio.sleep(.3)
            await route.fulfill(status=200,content_type='application/json',body=json.dumps({'choices':[{'message':{'content':rep+'\n###\n'+meta}}]}))
        await ctx.route('https://api.x.ai/**',handle)
        pg=await ctx.new_page(); errs=[]; warns=[]
        pg.on('console',lambda m: (errs if m.type=='error' else warns).append(m.text) if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERROR: '+str(e)))
        await pg.goto(URL,wait_until='networkidle'); await pg.wait_for_timeout(1000)
        cdp=await ctx.new_cdp_session(pg)
        bb=await pg.locator('#cbMic').bounding_box(); x,y=bb['x']+bb['width']/2,bb['y']+bb['height']/2
        async def tap(px,py):
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':px,'y':py}]}); await pg.wait_for_timeout(60)
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
        hb=await pg.locator('#cbHang').bounding_box(); await tap(hb['x']+30,hb['y']+28)
        await pg.wait_for_function("()=>sophiaTest.state()==='ATTENDING'",timeout=30000); await pg.wait_for_timeout(300)
        # 1ª frase: segura enquanto ela NÃO fala; 2ª: segura interrompendo ela (barge-in)
        res={}
        for label,interrupt in [('hold',False),('barge',True)]:
            if interrupt:
                await pg.evaluate("()=>{document.body.classList.add('kbd')}"); await pg.fill('#typeIn','I like music'); await pg.press('#typeIn','Enter')
                await pg.evaluate("()=>document.body.classList.remove('kbd')")
                await pg.wait_for_function("()=>sophiaTest.state()==='SPEAKING'",timeout=20000); await pg.wait_for_timeout(700)
            await pg.evaluate("()=>{__ev.length=0;__fr.length=0;window.__srStarts=0;__rec(true)}")
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'radiusX':8,'radiusY':8,'force':.6}]})
            await pg.wait_for_timeout(300)
            await pg.evaluate("()=>{sophiaTest.say('I went to the beach with my friends')}")
            for i in range(60): # 3 s de dedo tremendo (±4 px)
                await cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+random.uniform(-4,4),'y':y+random.uniform(-4,4),'radiusX':8,'radiusY':8,'force':.6}]})
                await pg.wait_for_timeout(50)
                if i==30 and label=='hold': await pg.screenshot(path='/workspace/sophia-capturas/chamada2/05-segurando-microfone-toque.png')
            held=await pg.evaluate("()=>[sophiaTest.S.ptt,document.getElementById('cbMic').className,window.__srStarts,window.__srGesture]")
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
            await pg.wait_for_timeout(200)
            out=await pg.evaluate("()=>{__rec(false);return {ev:__ev.slice(),fr:__fr.slice()}}")
            fr=out['fr']; held_fr=[f for f in fr if f['ptt']]
            anims=set(); [anims.update(a.split(':')[0] for a in f['anim'].split(',')) for f in fr]
            # continuidade do Ken Burns: currentTime deve crescer monotonicamente
            kb=[int(f['anim'].split(',')[0].split(':')[2]) for f in fr if f['anim']]
            jumps=[kb[i+1]-kb[i] for i in range(len(kb)-1) if kb[i+1]<kb[i] or kb[i+1]-kb[i]>200]
            rects=set(f['st'] for f in fr); ih=set(f['ih'] for f in fr); sy=set(f['sy'] for f in fr)
            imT=set(f['imT'] for f in held_fr); imF=set(f['imF'] for f in held_fr); ring=set(f['ring'] for f in held_fr)
            evs=[e[0] for e in out['ev']]
            res[label]=dict(frames=len(fr),held_frames=len(held_fr),held_at_end=held,anim_ids=sorted(anims),kb_jumps=jumps,stage_sizes=sorted(rects),innerH=sorted(ih),scrollY=sorted(sy),
              img_transform_while_held=sorted(imT)[:4],n_img_transform=len(imT),img_filter=sorted(imF)[:3],ring_opacity_while_held=sorted(ring)[:4],
              events=[e for e in evs if not e.startswith('touch')][:30],cancel=evs.count('pointercancel'),downs=evs.count('pointerdown'),ups=evs.count('pointerup'))
            await pg.wait_for_function("()=>sophiaTest.state()==='ATTENDING'",timeout=30000); await pg.wait_for_timeout(300)
        print(json.dumps(res,indent=1,ensure_ascii=False))
        print('errors:',errs); print('warnings:',warns)
        await b.close()
asyncio.run(main())
