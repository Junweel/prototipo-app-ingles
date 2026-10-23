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

