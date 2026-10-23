/* ============ TREINO DE OUVIDO (escuta de fala encadeada) ============
   Por quê: no nível intermediário o gargalo da escuta é reconhecer palavras que você JÁ conhece na fala rápida e encadeada (Field 2008),
   não vocabulário. Loop: a Sophia diz uma frase em velocidade nativa (sem texto) → o aluno diz/digita o que ouviu → revelação palavra
   por palavra (verde = pegou, vermelho = perdeu) com os trechos reduzidos destacados e dica em pt-BR → ouvir de novo / mais devagar /
   só o trecho / próxima. Frases perdidas viram cartões (1, 3 e 7 dias, etiqueta "ouvido"). Custo ~zero: TTS que já existe (Azure ou navegador)
   e, opcional, 2 frases personalizadas pela IA (json_schema) quando há chave. */
var EAR={on:false,view:null,list:[],i:0,res:[],tok:0,chunkI:0};
const EAR_N=8;
// [id, frase (escrita para o TTS já produzir as reduções), tradução, nível, tema, [[trecho, como soa, dica]]]
const EAR_SET=[
['e01',"What are you gonna do this weekend?","O que você vai fazer neste fim de semana?",'A2','small talk',[["What are you","“uára-iâ” — /ˈwʌɾərjə/","what are you se junta: o t vira um r rápido e o are quase some"],["gonna","“gâna” — /ˈɡʌnə/","going to → gonna"]]],
['e02',"Did you eat yet?","Você já comeu?",'A2','small talk',[["Did you","“dídja” — /ˈdɪdʒə/","did + you: o d e o y viram “dj”"],["eat yet","“ii-iét”","o t de eat fica preso e quase não sai"]]],
['e03',"I've gotta go, I have a meeting at ten.","Tenho que ir, tenho uma reunião às dez.",'A2','reuniões',[["I've gotta","“aiv gára” — /aɪv ˈɡɑɾə/","have got to → I've gotta; o t vira r rápido"],["meeting at","“míirin-ét”","t entre vogais vira r rápido e liga no at"]]],
['e04',"Can you send me the report by the end of the day?","Você pode me mandar o relatório até o fim do dia?",'A2','trabalho',[["Can you","“kên-iâ” — /kən jə/","can fica fraco na pergunta"],["send me the","“sén-mi-dâ”","o d de send cai antes do m"],["end of the","“én-dâv-dâ”","of vira só “âv”"]]],
['e05',"Let me check and get back to you.","Deixa eu verificar e te dou um retorno.",'A2','trabalho',[["Let me","“lémi” — /ˈlɛmi/","let me → lemme: o t some"],["get back to you","“gué-bék-tâ-iâ”","get perde o t; to you fica “tâ-iâ”"]]],
['e06',"We're running a bit late on the SAP rollout.","Estamos um pouco atrasados na implantação do SAP.",'B1','SAP',[["We're","“uír” — /wɪr/","we are encolhe para uma sílaba"],["a bit late","“â bi-lêi”","os t do fim ficam presos"],["SAP rollout","“és-ei-pí rôlaut”","SAP é soletrado: S-A-P"]]],
['e07',"Do you want to grab a coffee after the call?","Quer tomar um café depois da call?",'A2','small talk',[["Do you want to","“dja uána” — /djə ˈwɑnə/","do you → “dja”; want to → wanna"],["grab a","“grébâ”","o b liga direto no a"]]],
['e08',"I don't know if we can close the month on Friday.","Não sei se a gente consegue fechar o mês na sexta.",'B1','finanças',[["I don't know","“ai-dâ-nôu” — /aɪ dəˈnoʊ/","don't know → dunno"],["we can","“ui-k’n”","can afirmativo é fraco /kən/; can't é forte /kænt/"]]],
['e09',"What do you think about the new dashboard?","O que você acha do novo dashboard?",'A2','reuniões',[["What do you","“uáda-iâ” — /ˈwʌdəjə/","what do you → whaddaya"],["think about","“thin-kâ-báut”","o k liga no a de about"]]],
['e10',"Could you share your screen for a sec?","Você pode compartilhar a tela um segundo?",'A2','reuniões',[["Could you","“cúdja” — /ˈkʊdʒə/","could + you: d + y viram “dj”"],["for a sec","“fâra-sék”","for a vira “fâra”; sec = second"]]],
['e11',"Sorry, you're breaking up. Can you say that again?","Desculpa, você está cortando. Pode repetir?",'A2','reuniões',[["you're breaking up","“iâr brêikin-gâp”","you're vira “iâr”; breaking up se juntam"],["say that again","“sei dé-râ-guén”","o t de that vira r rápido antes da vogal"]]],
['e12',"I'm gonna need the invoice number first.","Vou precisar do número da nota fiscal primeiro.",'B1','finanças',[["I'm gonna","“áimâna” — /ˈaɪmənə/","I'm going to → I'm gonna (às vezes “I'mma”)"],["need the","“níi-dâ”","o d some antes do the"]]],
['e13',"Have you heard back from the client yet?","Você já teve retorno do cliente?",'B1','trabalho',[["Have you","“hév-iâ”","have fica fraco no começo da pergunta"],["heard back from","“hârd-bék-frâm”","from fica fraco: “frâm”"]]],
['e14',"It's not a big deal, we'll fix it tomorrow.","Não é nada demais, a gente arruma amanhã.",'A2','trabalho',[["It's not a","“its nára” — /ɪts ˈnɑɾə/","not a → “nára”: t vira r"],["we'll fix it","“uil fíksit”","fix it se juntam numa palavra só"]]],
['e15',"Where did you put the purchase order?","Onde você colocou o pedido de compra?",'B1','SAP',[["Where did you","“uérdja” — /ˈwɛrdʒə/","did you → “dja”"],["put the","“pú-dâ”","o t fica preso antes do the"]]],
['e16',"I was gonna call you, but I got stuck in traffic.","Eu ia te ligar, mas fiquei preso no trânsito.",'B1','small talk',[["I was gonna","“ai-uâz-gâna”","was fica fraco: “wəz”"],["got stuck in","“gó-stâ-kin”","stuck in se juntam"]]],
['e17',"Let's touch base next week.","Vamos nos falar semana que vem.",'B1','reuniões',[["Let's touch base","“léts tâtch bêis”","expressão: alinhar rapidinho"],["next week","“néks-uík”","o t de next cai"]]],
['e18',"How's it going with the budget?","Como está indo o orçamento?",'A2','finanças',[["How's it going","“háuzit gôuin”","-ing vira “-in”"],["with the","“uí-dâ”","os dois th se fundem"]]],
['e19',"I didn't get what you meant.","Não entendi o que você quis dizer.",'A2','reuniões',[["didn't get","“dídn-gué”","o t de didn't some"],["what you","“uátcha” — /ˈwʌtʃə/","t + you viram “tch”"]]],
['e20',"We need to cut costs by about ten percent.","Precisamos cortar custos em uns dez por cento.",'B1','finanças',[["need to","“níi-râ”","d + to quase vira “nira”"],["cut costs","“câ-kósts”","o t de cut fica preso"],["about ten percent","“â-báu-tén pâr-sént”","about perde o t"]]],
['e21',"Are you gonna be at the all-hands tomorrow?","Você vai estar na reunião geral amanhã?",'B1','reuniões',[["Are you gonna","“âr-iâ gâna”","are you fica “âria”"],["at the","“â-dâ”","at fica fraco: “ət”"]]],
['e22',"I'll send you the link in a minute.","Vou te mandar o link num minuto.",'A2','trabalho',[["I'll send you","“ail séndja”","send + you: d + y viram “dj”"],["in a minute","“ina mínit”","in a se juntam"]]],
['e23',"What time works for you?","Que horário fica bom pra você?",'A2','reuniões',[["What time","“uá-táim”","o t de what some antes de outro t"],["works for you","“uârks fâr-iâ”","for fica fraco"]]],
['e24',"I kinda forgot to update the spreadsheet.","Eu meio que esqueci de atualizar a planilha.",'B1','trabalho',[["kinda","“káinda”","kind of → kinda"],["forgot to","“fâr-gá-râ”","t + to viram um r rápido"]]],
['e25',"Can I ask you something real quick?","Posso te perguntar uma coisa rapidinho?",'A2','small talk',[["Can I ask you","“kê-nai éskia”","can I se juntam; ask you liga"],["real quick","“ríil kuík”","coloquial: rapidinho"]]],
['e26',"There's a problem with the payment run.","Tem um problema com o pagamento em lote.",'B1','SAP',[["There's a","“dérza”","there is a → there's a, tudo junto"],["payment run","“pêiment rân”","SAP/finanças: o lote de pagamentos"]]],
['e27',"We should've tested it before going live.","Deveríamos ter testado antes de entrar em produção.",'B2','SAP',[["should've","“shúrâ” — /ˈʃʊɾə/","should have → shoulda"],["tested it","“téstidit”","tested it se juntam"],["going live","“gôuin láiv”","entrar em produção"]]],
['e28',"I'm not sure I got your point.","Não sei se entendi seu ponto.",'B1','reuniões',[["I'm not sure","“aim ná-shur”","o t de not some antes do sure"],["got your","“gótchâr” — /ˈɡɑtʃər/","t + your viram “tch”"]]],
['e29',"Do you wanna jump on a quick call?","Quer entrar numa call rápida?",'A2','reuniões',[["Do you wanna","“dja uána”","want to → wanna"],["jump on a","“djâm-pá-nâ”","on a se juntam"]]],
['e30',"How was your weekend? Did you do anything fun?","Como foi seu fim de semana? Fez algo legal?",'A2','small talk',[["How was your","“háu-uâz-iâr”","was e your ficam fracos"],["Did you do","“dídja du”","did you → didja"]]],
['e31',"The server went down last night, so we lost some data.","O servidor caiu ontem à noite, e perdemos alguns dados.",'B1','TI',[["went down","“uén-dáun”","o t de went cai"],["last night","“lés-náit”","o t de last cai"],["lost some","“lós-sâm”","o t de lost cai; some fica fraco"]]],
['e32',"I'll get it done by Monday, I promise.","Termino até segunda, prometo.",'A2','trabalho',[["get it done","“guérit dân”","get it → “guerit”: t vira r"],["by Monday","“bai mândei”","Monday soa “mândei”"]]],
['e33',"Who's in charge of the cost center?","Quem é responsável pelo centro de custo?",'B1','SAP',[["Who's in charge of","“húzin tchárdjâv”","charge of se juntam"],["cost center","“kós sénâr”","o t de cost cai; em center o t some depois do n"]]],
['e34',"Give me a minute to find the file.","Me dá um minuto pra achar o arquivo.",'A2','trabalho',[["Give me a","“guímia”","give me → gimme"],["find the","“fáin-dâ”","o d some antes do the"]]],
['e35',"We're supposed to get approval first.","Era pra gente ter aprovação primeiro.",'B1','trabalho',[["supposed to","“sâ-pôus-tâ”","o d some: supposed to → “supposta”"],["get approval","“gué-râ-prúvâl”","t vira r antes da vogal"]]],
['e36',"I've been working on it all morning.","Estou trabalhando nisso a manhã toda.",'A2','trabalho',[["I've been","“aiv bin”","been fica curto: “bin”"],["working on it","“uârkin-ánit”","on it se juntam"]]],
['e37',"Not bad, just a little tired.","Nada mal, só um pouco cansado.",'A2','small talk',[["Not bad","“ná-béd”","o t de not fica preso"],["just a little","“djâsta lírâl”","o t de little vira r rápido"]]],
['e38',"Let's wrap this up, we're out of time.","Vamos encerrar, estamos sem tempo.",'B1','reuniões',[["wrap this up","“rép dí-sâp”","this up se juntam"],["out of time","“áura táim”","out of → outta: t vira r"]]],
['e39',"Do you have a minute to go over the numbers?","Você tem um minuto pra revisar os números?",'B1','finanças',[["Do you have a","“dja hévâ”","do you → “dja”; have a se juntam"],["go over the","“gôu-ôuvâr-dâ”","go over = revisar"]]],
['e40',"Sounds good to me. See you then!","Pra mim está ótimo. Até lá!",'A2','small talk',[["Sounds good to me","“sáunz gúd-tâ-mi”","o d de sounds some; to vira “tâ”"],["See you then","“sí-iâ dén”","you fica fraco: “ya”"]]],
['e41',"What did you guys decide about the budget?","O que vocês decidiram sobre o orçamento?",'B1','finanças',[["What did you","“uá-dídja”","did you → didja"],["you guys","“iâ gáiz”","you guys = vocês (informal)"]]],
['e42',"I'm gonna be out of office next week.","Vou estar fora do escritório semana que vem.",'A2','trabalho',[["I'm gonna be","“áimâna bi”","I'm going to → I'm gonna"],["out of office","“áura ófis”","out of → outta"]]]
].map(([id,s,pt,lv,tp,c])=>({id,s,pt,lv,tp,c}));
const earStore=()=>{try{return JSON.parse(localStorage.getItem('sophiaOuvido')||'{}')}catch(_){return{}}};
const earSave=o=>{try{localStorage.setItem('sophiaOuvido',JSON.stringify(o))}catch(_){}};

/* ---- normalização tolerante + alinhamento ---- */
const EAR_EXP={gonna:'going to',wanna:'want to',gotta:'got to',hafta:'have to',hasta:'has to',lemme:'let me',gimme:'give me',kinda:'kind of',sorta:'sort of',outta:'out of',
 lotta:'lot of',dunno:'do not know',ya:'you',yeah:'yes',yep:'yes',yup:'yes',nope:'no',cuz:'because',cause:'because',cos:'because',ok:'okay',didja:'did you',whatcha:'what are you',
 gotcha:'got you',wouldja:'would you',couldja:'could you',shoulda:'should have',coulda:'could have',woulda:'would have',musta:'must have',oughta:'ought to',tryna:'trying to',
 whaddaya:'what do you',were:'we are',your:'you are',their:'there',imma:'i am going to',cannot:'can not',its:'it is',too:'to',two:'to',four:'for',sap:'s a p',email:'e mail',
 '0':'zero','1':'one','2':'to','3':'three','4':'for','5':'five','6':'six','7':'seven','8':'eight','9':'nine','10':'ten','11':'eleven','12':'twelve','15':'fifteen','20':'twenty','30':'thirty'};
function earTok(str){
 let x=' '+String(str||'').toLowerCase().replace(/[’‘`´]/g,"'").replace(/%/g,' percent ').replace(/[^a-z0-9' ]+/g,' ')+' ';
 x=x.replace(/\bcan't\b/g,'can not').replace(/\bwon't\b/g,'will not').replace(/\bain't\b/g,'is not').replace(/\blet's\b/g,'let us').replace(/\by'all\b/g,'you all').replace(/\bi'mma\b/g,'i am going to')
  .replace(/n't\b/g,' not').replace(/'re\b/g,' are').replace(/'m\b/g,' am').replace(/'ve\b/g,' have').replace(/'ll\b/g,' will').replace(/'d\b/g,' would').replace(/'s\b/g,' is').replace(/'/g,'');
 const out=[];for(const w of x.split(/\s+/)){if(!w)continue;out.push(...(EAR_EXP[w]||w).split(' '))}return out}
function earLev(a,b){if(Math.abs(a.length-b.length)>1)return 2;const d=[...Array(b.length+1).keys()];
 for(let i=1;i<=a.length;i++){let p=d[0];d[0]=i;for(let j=1;j<=b.length;j++){const t=d[j];d[j]=Math.min(d[j]+1,d[j-1]+1,p+(a[i-1]===b[j-1]?0:1));p=t}}return d[b.length]}
const earEq=(a,b)=>a===b||(a.length>=5&&b.length>=5&&earLev(a,b)<=1); // erro de digitação em palavra longa não conta
function earScore(target,heard){
 const words=String(target).split(/\s+/).filter(Boolean).map(w=>({w,toks:earTok(w),hit:0,ok:false,ck:-1}));
 const TT=[],own=[];words.forEach((o,k)=>o.toks.forEach(t=>{TT.push(t);own.push(k)}));
 const ts=new Set(TT),H=[];for(const w of earTok(heard)){const p=H[H.length-1];if(p&&ts.has(p+w)&&!ts.has(w))H[H.length-1]=p+w;else H.push(w)} // "roll out" = "rollout"
 const n=TT.length,m=H.length,L=Array.from({length:n+1},()=>new Int16Array(m+1));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=earEq(TT[i],H[j])?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 let i=0,j=0,got=0;while(i<n&&j<m){if(earEq(TT[i],H[j])){words[own[i]].hit++;got++;i++;j++}else if(L[i+1][j]>=L[i][j+1])i++;else j++}
 words.forEach(o=>{o.ok=o.toks.length?o.hit/o.toks.length>=.5:true});
 return {words,got,total:n,pct:n?got/n:1}}
function earChunks(it,words){ // marca as palavras de cada trecho reduzido
 const bare=w=>w.toLowerCase().replace(/[^a-z0-9']/g,'');const wb=words.map(o=>bare(o.w));
 (it.c||[]).forEach((c,k)=>{const cw=String(c[0]).split(/\s+/).map(bare);
  for(let s=0;s+cw.length<=wb.length;s++){if(cw.every((x,q)=>wb[s+q]===x)&&words.slice(s,s+cw.length).every(o=>o.ck<0)){for(let q=0;q<cw.length;q++)words[s+q].ck=k;break}}});
 return (it.c||[]).map((c,k)=>({k,t:c[0],snd:c[1],tip:c[2],miss:words.some(o=>o.ck===k&&!o.ok),found:words.some(o=>o.ck===k)}))}

/* ---- escolha das frases: cartões "ouvido" vencidos → frases com palavras do próprio aluno → resto (evitando as da última sessão) ---- */
const EAR_STOP=new Set('about after again also because been before being could did does doing done from going have here into just know like made make more much need only other over really said should some still than that their them then there these they thing think this those very want were what when where which while will with would your yours yeah okay sure thanks thank please sorry hello'.split(' '));
function earVocab(){const f=new Map(),add=t=>String(t||'').toLowerCase().replace(/[^a-z' ]/g,' ').split(/\s+/).forEach(w=>{w=w.replace(/'.*$/,'');if(w.length>=4&&!EAR_STOP.has(w))f.set(w,(f.get(w)||0)+1)});
 cardsGet().filter(c=>c.tag!=='ouvido').forEach(c=>{add(c.target);add(c.said)});
 try{JSON.parse(localStorage.getItem('sophiaReview')||'[]').forEach(r=>add(r.t))}catch(_){}
 (CV.turns||[]).forEach(t=>{if(t.who==='me')add(t.corrected||t.text)});
 return [...f.entries()].sort((a,b)=>b[1]-a[1]).map(e=>e[0])}
function earPick(){const st=earStore(),recent=new Set(st.recent||[]),now=Date.now(),gen=st.gen||[],list=[];
 const all=EAR_SET.concat(gen),byText=t=>all.find(e=>norm(e.s)===norm(t));
 cardsGet().filter(c=>c.tag==='ouvido'&&c.step<SR_DAYS.length&&c.next<=now).sort((a,b)=>a.next-b.next).slice(0,3).forEach(c=>{
  const b=byText(c.target);list.push(Object.assign({},b||{id:'c'+c.id,s:c.target,pt:c.pt,c:[]},{card:c.id}))});
 const voc=new Set(earVocab().slice(0,40)),ov=e=>earTok(e.s).filter(w=>voc.has(w)).length;
 const pool=EAR_SET.filter(e=>!list.some(x=>x.id===e.id)).map(e=>({e,v:ov(e),r:Math.random()-(recent.has(e.id)?1.5:0)}));
 pool.filter(p=>p.v>0).sort((a,b)=>b.v-a.v||b.r-a.r).slice(0,3).forEach(p=>{list.push(Object.assign({mine:true},p.e));p.used=1});
 pool.filter(p=>!p.used).sort((a,b)=>b.r-a.r).forEach(p=>{if(list.length<EAR_N)list.push(p.e)});
 return list.slice(0,EAR_N)}

/* ---- opcional: 2 frases personalizadas pela IA (json_schema), com queda para o conjunto curado ---- */
const EAR_SCHEMA={type:'object',additionalProperties:false,required:['sentences'],properties:{sentences:{type:'array',items:{type:'object',additionalProperties:false,required:['text','translation_pt','chunks'],
 properties:{text:{type:'string'},translation_pt:{type:'string'},chunks:{type:'array',items:{type:'object',additionalProperties:false,required:['text','sound','tip_pt'],properties:{text:{type:'string'},sound:{type:'string'},tip_pt:{type:'string'}}}}}}}}};
const EAR_SYS=`You write sentences for a LISTENING drill (listening-drill) for a Brazilian adult learner of English, level {LVL}, who works in a corporate/IT job (meetings, SAP, finance, small talk with colleagues).
Write natural spoken American English, 6 to 14 words each, full of the connected-speech reductions a text-to-speech voice produces at native speed (gonna, wanna, gotta, did you, what are you, let me, out of, kind of, linking like "pick it up").
When natural, use some of these words from the learner's own conversations: {WORDS}.
For each sentence give: text; translation_pt (Brazilian Portuguese); chunks: 1 to 3 items, each an EXACT substring of text that gets reduced or linked, how it sounds (simple respelling, optionally IPA), and a very short tip in Brazilian Portuguese.
Answer only with the JSON object.`;
async function earGen(words){
 const messages=[{role:'system',content:EAR_SYS.replace('{LVL}',CFG.lvl||'B1').replace('{WORDS}',words.slice(0,15).join(', ')||'(none yet)')},{role:'user',content:'Write 2 sentences.'}];
 for(const rf of [{type:'json_schema',json_schema:{name:'listening_drill',strict:true,schema:EAR_SCHEMA}},{type:'json_object'}]){
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),12000);
  try{const res=await fetch(llmBase()+'/chat/completions',{method:'POST',signal:ctl.signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+CFG.key},
    body:JSON.stringify({model:llmModel(),messages,stream:false,temperature:.8,response_format:rf})});clearTimeout(to);
   if(!res.ok){if(res.status===400)continue;return[]}
   const j=await res.json();let c=(j.choices&&j.choices[0].message&&j.choices[0].message.content)||'';c=c.slice(c.indexOf('{'),c.lastIndexOf('}')+1);
   const o=JSON.parse(c);return (o.sentences||[]).map(x=>{const s=String(x.text||'').trim(),n=s.split(/\s+/).length;
     const ch=(x.chunks||[]).filter(k=>k&&k.text&&s.toLowerCase().includes(String(k.text).toLowerCase())).slice(0,3).map(k=>[String(k.text),String(k.sound||''),String(k.tip_pt||'')]);
     return n>=4&&n<=18&&ch.length?{id:'g'+Math.abs([...s].reduce((h,ch)=>(h*31+ch.charCodeAt(0))|0,7)).toString(36),s,pt:String(x.translation_pt||''),c:ch,gen:true}:null}).filter(Boolean).slice(0,2)}
  catch(e){clearTimeout(to);console.warn('treino de ouvido: geração',e.name);return[]}}
 return[]}

/* ---- fluxo ---- */
const earIt=()=>EAR.list[EAR.i];
function earTitle(on){const t=$('callTop').querySelector('.tt');if(t)t.textContent=on?'Sophia · Treino de ouvido':'Sophia · São Paulo Languages Academy'}
function earOpen(){$('moreMenu').hidden=true;if(EAR.on)return;
 if(S.running)stop(); // conversa em andamento fica guardada para a revisão (📋 no menu)
 $('review').hidden=true;$('caps').innerHTML='';
 Object.assign(EAR,{on:true,view:'play',list:earPick(),i:0,res:[],chunkI:0,heard:'',sc:null,startAt:Date.now()});
 document.body.classList.add('ear');earTitle(true);earRender();
 start();talkUI(); // dentro do toque: destrava o áudio; startAsync chama earBegin()
}
function earBegin(){if(!EAR.on)return;setState('ATTENDING');
 if(CFG.mode==='llm'&&CFG.key){const voc=earVocab();earGen(voc).then(g=>{if(!EAR.on||!g.length)return;
   const st=earStore();st.gen=(st.gen||[]).filter(x=>!g.some(y=>y.id===x.id)).concat(g).slice(-30);earSave(st);
   // entram no lugar das últimas frases ainda não tocadas
   let pos=EAR.list.length-1;for(const x of g){while(pos>EAR.i&&EAR.list[pos].card)pos--;if(pos<=EAR.i)break;EAR.list[pos--]=x}
   earRender()})}
 earPlay()}
function earStopAudio(){speakToken++;try{speechSynthesis.cancel()}catch(_){} if(S.cancelAz)S.cancelAz();S.cancelSpeak&&S.cancelSpeak();S.visQ=[];if(S.state==='SPEAKING')setState('ATTENDING')}
async function earSay(text,slow){if(!EAR.on)return;if(S.state==='SPEAKING')earStopAudio();const tok=++EAR.tok;
 S.slowR=slow?.75:0;const o=await speak(text,{slow:!!slow});S.slowR=0;
 if(EAR.on&&tok===EAR.tok&&S.state==='SPEAKING')setState('ATTENDING');callUI();return o}
async function earPlay(){if(!EAR.on)return;EAR.view='play';EAR.heard='';EAR.sc=null;earRender();callUI();
 await new Promise(r=>setTimeout(r,500));if(!EAR.on||EAR.view!=='play')return;
 await earSay(earIt().s);if(EAR.on&&EAR.view==='play'){EAR.view='answer';earRender();callUI()}}
function earAnswer(txt){if(!EAR.on||!(EAR.view==='answer'||EAR.view==='play'))return;
 if(S.state==='SPEAKING')earStopAudio();EAR.tok++;
 const it=earIt(),sc=earScore(it.s,txt),ck=earChunks(it,sc.words),missed=sc.words.some(o=>!o.ok);
 EAR.heard=txt;EAR.sc={...sc,ck};EAR.view='reveal';EAR.chunkI=0;
 EAR.res[EAR.i]={id:it.id,s:it.s,heard:txt,got:sc.got,total:sc.total,whole:!missed,miss:ck.filter(c=>c.miss)};
 if(missed){const tips=ck.filter(c=>c.miss).map(c=>c.t+' → '+c.snd).join(' · ')||null;
  cardsSave([{target:it.s,said:txt||'(nada)',why:tips,pt:it.pt||null,cat:'ouvido',tag:'ouvido'}]);EAR.res[EAR.i].card=true}
 else if(it.card){const L=cardsGet(),c=L.find(x=>x.id===it.card);if(c){c.step++;c.next=c.step<SR_DAYS.length?Math.max(c.due[c.step],Date.now()+DAY):Date.now()+3650*DAY;cardsSet(L)}}
 setState('ATTENDING');earRender();callUI()}
function earNext(){if(!EAR.on)return;earStopAudio();EAR.i++;if(EAR.i>=EAR.list.length)return earFinish();earPlay()}
function earFinish(){if(!EAR.on)return;const R=EAR.res.filter(Boolean);EAR.on=false;EAR.tok++;earStopAudio();stop();earTitle(false);
 if(!R.length){earClose();toast('Treino encerrado.',1800);return}
 const got=R.reduce((a,r)=>a+r.got,0),tot=R.reduce((a,r)=>a+r.total,0),pct=Math.round(got/Math.max(1,tot)*100);
 const seen=new Set(),chunks=[];R.forEach(r=>r.miss.forEach(c=>{const k=c.t.toLowerCase();if(!seen.has(k)){seen.add(k);chunks.push(c)}}));
 const st=earStore();st.hist=(st.hist||[]).concat([{at:Date.now(),pct,n:R.length,whole:R.filter(r=>r.whole).length}]).slice(-30);
 st.recent=R.map(r=>r.id);earSave(st);
 EAR.sum={pct,n:R.length,whole:R.filter(r=>r.whole).length,cards:R.filter(r=>r.card).length,chunks:chunks.slice(0,6),hist:st.hist.slice(-10)};
 EAR.view='summary';earRender();callUI()}
function earClose(){EAR.view=null;EAR.sum=null;document.body.classList.remove('ear');$('ear').innerHTML='';earTitle(false);callUI()}
const EAR_NUMS='①②③④⑤⑥';
function earChart(h){if(!h.length)return '';const W=300,H=96,bw=Math.min(26,Math.floor((W-10)/h.length)-6);
 return `<svg class="earChart" viewBox="0 0 ${W} ${H+20}" role="img" aria-label="Porcentagem de palavras captadas nas últimas sessões">`+
  `<line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="#ffffff33"/>`+
  h.map((x,k)=>{const bh=Math.max(3,x.pct/100*(H-18)),xx=6+k*(bw+6),last=k===h.length-1,d=new Date(x.at);
   return `<rect x="${xx}" y="${H-bh}" width="${bw}" height="${bh}" rx="4" fill="${last?'#7B83EB':'#ffffff4d'}"/>`+
    `<text x="${xx+bw/2}" y="${H-bh-4}" font-size="10" fill="#fff" text-anchor="middle">${x.pct}</text>`+
    `<text x="${xx+bw/2}" y="${H+13}" font-size="9" fill="#ffffffaa" text-anchor="middle">${d.getDate()}/${d.getMonth()+1}</text>`}).join('')+`</svg>`}
function earRender(){const e=$('ear');if(!e)return;if(!EAR.view){e.innerHTML='';return}
 const n=EAR.list.length,head=EAR.view==='summary'?`<div class="earHead"><b>🎧 Treino de ouvido</b><span>resumo</span></div>`:
  `<div class="earHead"><b>🎧 Treino de ouvido</b><span>frase ${Math.min(EAR.i+1,n)} de ${n}</span></div><div class="earProg"><i style="width:${(EAR.i+(EAR.view==='reveal'?1:0))/n*100}%"></i></div>`;
 const it=earIt()||{};const tag=it.card?'<span class="earTag">🔁 revisão</span>':it.gen?'<span class="earTag">✨ feita pra você</span>':it.mine?'<span class="earTag">💬 palavras suas</span>':'';
 let body='';
 if(EAR.view==='play')body=`<div class="earCard earCenter">${tag}<div class="earWave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><p class="earBig">Ouça a Sophia…</p><p class="earSub">Velocidade normal, sem texto na tela.</p></div>`;
 else if(EAR.view==='answer')body=`<div class="earCard">${tag}<p class="earBig">O que você ouviu?</p><p class="earSub">Segure 🎙 lá embaixo e repita do jeito que entendeu — ou digite:</p>
  <p id="earLive" class="earLive"></p><form class="earIn" id="earForm"><input id="earIn" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" placeholder="Digite o que ouviu…"><button type="submit">Enviar</button></form>
  <div class="earBtns two"><button type="button" data-a="again">🔁 Ouvir de novo</button><button type="button" data-a="skip">🤷 Não peguei</button></div></div>`;
 else if(EAR.view==='reveal'){const sc=EAR.sc,ws=sc.words;let h='',k=0;
  while(k<ws.length){const o=ws[k];
   if(o.ck>=0){let g='';const ck=o.ck,cm=sc.ck[ck];while(k<ws.length&&ws[k].ck===ck){g+=`<span class="w ${ws[k].ok?'ok':'miss'}">${esc(ws[k].w)}</span> `;k++}
    h+=`<span class="ck${cm.miss?' ckm':''}">${g.trim()}<sup>${EAR_NUMS[ck]||''}</sup></span> `}
   else{h+=`<span class="w ${o.ok?'ok':'miss'}">${esc(o.w)}</span> `;k++}}
  const pct=Math.round(sc.pct*100),hasCk=sc.ck.some(c=>c.found);
  body=`<div class="earCard earScroll">${tag}<div class="earScore"><b>${pct}%</b> <span>${sc.got} de ${sc.total} palavras</span></div>
   <p class="earSent">${h.trim()}</p>
   <p class="earYou">Você: “${esc(EAR.heard||'—')}”</p>${it.pt?`<p class="earPt">${esc(it.pt)}</p>`:''}
   ${sc.ck.length?`<ul class="earTips">${sc.ck.map(c=>`<li class="${c.miss?'m':''}"><b>${EAR_NUMS[c.k]||'•'} ${esc(c.t)}</b> → ${esc(c.snd)}${c.tip?`<br><span>${esc(c.tip)}</span>`:''}</li>`).join('')}</ul>`:''}
   ${EAR.res[EAR.i]&&EAR.res[EAR.i].card?'<p class="earNote">📌 Virou cartão de revisão (amanhã, em 3 e em 7 dias).</p>':''}</div>
   <div class="earBtns"><button type="button" data-a="again">🔁 Ouvir de novo</button><button type="button" data-a="slow">🐢 Mais devagar</button>
   ${hasCk?'<button type="button" data-a="chunk">🎯 Só o trecho</button>':''}<button type="button" class="pri" data-a="next">${EAR.i+1>=n?'Ver resumo ✓':'Próxima →'}</button></div>`}
 else if(EAR.view==='summary'){const m=EAR.sum;
  body=`<div class="earCard earScroll"><div class="earScore big"><b>${m.pct}%</b><span>das palavras captadas</span></div>
   <p class="earSub">${m.whole} de ${m.n} frases inteiras${m.cards?` · ${m.cards} ${m.cards>1?'viraram cartões':'virou cartão'} de revisão (1, 3 e 7 dias)`:''}</p>
   ${m.chunks.length?`<h4>Trechos para praticar</h4><ul class="earTips">${m.chunks.map(c=>`<li class="m"><b>${esc(c.t)}</b> → ${esc(c.snd)}${c.tip?`<br><span>${esc(c.tip)}</span>`:''}</li>`).join('')}</ul>`:'<p class="earSub">Nenhum trecho perdido — mandou bem! 🎉</p>'}
   <h4>Seu progresso</h4>${earChart(m.hist)}<p class="earSub small">% de palavras captadas nas últimas ${m.hist.length} ${m.hist.length>1?'sessões':'sessão'}</p></div>
   <div class="earBtns two"><button type="button" class="pri" data-a="again-all">🎧 Treinar de novo</button><button type="button" data-a="close">Fechar</button></div>`}
 e.innerHTML=head+body;
 const f=$('earForm');if(f)f.onsubmit=ev=>{ev.preventDefault();const v=$('earIn').value.trim();if(v)earAnswer(v)}}
$('ear').addEventListener('click',ev=>{const b=ev.target.closest('button[data-a]');if(!b)return;const a=b.dataset.a,it=earIt();
 if(a==='again')earSay(it.s);else if(a==='slow')earSay(it.s,true);
 else if(a==='chunk'){const ck=EAR.sc.ck.filter(c=>c.found),ms=ck.filter(c=>c.miss),L=ms.length?ms:ck;if(L.length)earSay(L[EAR.chunkI++%L.length].t)}
 else if(a==='skip')earAnswer('');else if(a==='next')earNext();
 else if(a==='close')earClose();else if(a==='again-all'){earClose();earOpen()}});
function earHint(){if(!(EAR&&EAR.on))return;$('callHint').textContent=EAR.view==='play'?'ouça com atenção — sem texto na tela':EAR.view==='answer'?(S.ptt?'ouvindo… solte para enviar':'segure 🎙 e repita o que ouviu, ou digite')
 :'veja o que você pegou · Próxima quando quiser';const g=$('cbHang');g.setAttribute('aria-label','Encerrar treino e ver o resumo');g.title='Encerrar treino e ver o resumo'}
function earNoEcho(){return !!EAR&&EAR.on&&(S.ptt||(S.state!=='SPEAKING'&&T()-(S.saidEnd||-9)>.8))} // repetir a frase dela é o objetivo: não é eco
$('mmEar').onclick=()=>earOpen();$('earGo').onclick=()=>earOpen();
