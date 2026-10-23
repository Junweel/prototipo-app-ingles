/* ============ Modo Conversa · Sophia de CORPO INTEIRO ============
   Base: a frontal aprovada (sophia-frontal-camadas.svg, cabeça + pescoço + cabelo intactos, com visemas).
   O Drive só tem braços soltos (maos/arms.svg, poses wave/clap) e nenhuma perna: tronco, braços e pernas abaixo são desenhados
   à mão no mesmo recorte geométrico (planos chapados navy/creme/amarelo/vermelho). Braços têm pivô no ombro e no cotovelo. */
const FB_W=360,FB_TOP=6,FB_H=944;
function fbArm(){ // braço ESQUERDO da tela; o direito é o mesmo espelhado (matrix(-1 0 0 1 362 0)) → mesmo ângulo = gesto simétrico
 return `<path fill="#121F38" d="M70 290C70 278 84 272 96 280L100 300L96 470L60 472L62 330Z"/><path fill="#1B2B4A" d="M84 278C90 276 94 278 96 280L100 300L97 420L90 420Z" opacity=".7"/>`+
 `<g class="fbFore"><path fill="#121F38" d="M60 466L96 464L92 588L64 590Z"/><path fill="#F3ECDE" d="M62 578L93 576L94 596L62 598Z"/>`+
 `<path fill="#C46203" d="M65 596H91C95 612 93 626 86 636C80 644 70 642 66 632C62 620 62 608 65 596Z"/><path fill="#A85203" d="M88 602C98 606 100 616 93 623L88 616Z"/>`+
 `<path d="M73 622V634M79 623V638" stroke="#793800" stroke-width="1.3" stroke-linecap="round" opacity=".6"/></g>`}
function makeFullBody(svg){
 const q=s=>svg.querySelector(s);
 svg.setAttribute('viewBox',`0 ${FB_TOP} ${FB_W} ${FB_H}`);svg.setAttribute('preserveAspectRatio','xMidYMax meet');
 // tronco novo (ombros menores que o recorte de busto, cintura, blazer aberto): o paletó, a blusa e as lapelas do busto são trocados
 q('#jacket').innerHTML='';
 q('#shirt').innerHTML=`<path fill="#F2A005" d="M132.5 243C144.7 256.6 160.8 263.6 177.3 263.6H185.5C201.3 261.4 214.6 255.9 224.8 246.3L222 505H140Z"/>`+
  `<path fill="#D98900" d="M181 420L198 470L196 505H181Z" opacity=".5"/>`+
  `<path fill="#03091A" d="M134.1 215.7L114.2 229.8C99 238 86 248 79 262L70 292L78 336L118 505L111 570H170L164 470L146 340L134 250Z"/>`+
  `<path fill="#03091A" d="M226.6 215.7L248.4 230.2C263 238 276 248 283 262L292 292L284 336L244 505L251 570H192L198 470L216 340L228 250Z"/>`+
  `<path fill="#0D1A30" d="M206 420L244 505L251 570H200L203 470Z"/>`+
  `<path d="M120 522H150M212 522H242" stroke="#24345A" stroke-width="3" stroke-linecap="round"/>`+
  `<path fill="#F5C518" d="M220 352L248 346L244 358L224 362Z"/>`;
 q('#collar_L').innerHTML=`<path fill="#F3ECDE" d="M134.1 215.7L114.2 229.8L92 282L110 292L97 306L156 420L160 440C150 380 140 320 134 260Z"/><path fill="#E8DEC6" d="M110 292L126 284L122 320Z"/>`;
 q('#collar_R').innerHTML=`<path fill="#F3ECDE" d="M226.6 215.7L248.4 230.2L270 282L252 292L265 306L206 420L202 440C212 380 222 320 228 260Z"/>`;
 // cabelo de trás: o busto terminava num corte reto em y=360 → pontas recortadas
 const ns='http://www.w3.org/2000/svg',defs=q('defs');
 const cp=document.createElementNS(ns,'clipPath');cp.id='fbHairClip';cp.setAttribute('clipPathUnits','userSpaceOnUse');
 cp.innerHTML='<path d="M-20 -20H380V318L352 352L340 330L326 364L312 338L298 372H64L50 338L36 364L22 330L10 352L-20 318Z"/>';defs.appendChild(cp);
 q('#hair_back').setAttribute('clip-path','url(#fbHairClip)');
 const body=q('#oBody');body.style.transformOrigin='181px 540px';q('#oTorso').style.transformOrigin='181px 505px';q('#oHairBack').style.transformOrigin='180px 366px';
 // saia + pernas + sapatos (fixos no chão, fora do corpo que inclina)
 const legs=document.createElementNS(ns,'g');legs.id='fbLegs';
 legs.innerHTML=`<ellipse cx="181" cy="941" rx="78" ry="7" fill="#0B1119" opacity=".16"/>`+
  `<path fill="#C46203" d="M142 720H172L168 800C166 830 166 860 162 924H148C146 870 142 830 142 800Z"/><path fill="#9C4C02" d="M160 720H172L168 800C166 830 166 860 162 924H157C158 860 160 830 161 800Z"/>`+
  `<path fill="#C46203" d="M190 720H220L220 800C220 830 216 870 214 924H200C196 860 196 830 194 800Z"/><path fill="#9C4C02" d="M190 720H200L201 800C202 830 203 860 205 924H200C196 860 196 830 194 800Z"/>`+
  `<path fill="#03091A" d="M146 916H166L170 934C160 942 142 942 130 940C130 929 137 920 146 916Z"/><path fill="#03091A" d="M216 916H196L192 934C202 942 220 942 232 940C232 929 225 920 216 916Z"/>`+
  `<path d="M131 940H170M192 940H231" stroke="#F3ECDE" stroke-width="2" opacity=".8"/>`+
  `<path fill="#C8102E" d="M128 498H234L274 736H88Z"/><path fill="#A10D25" d="M181 498H234L274 736H200Z"/><path fill="#E0213F" d="M128 498H150L118 736H88Z" opacity=".55"/>`;
 svg.insertBefore(legs,body);
 // braços (depois do tronco, antes da cabeça: as mechas da frente caem por cima dos ombros)
 const arms=document.createElementNS(ns,'g');arms.id='fbArms';
 arms.innerHTML=`<g id="fbArmL">${fbArm()}</g><g transform="matrix(-1 0 0 1 362 0)"><g id="fbArmR">${fbArm()}</g></g>`;
 q('#oTorso').after(arms);
 return {armL:q('#fbArmL'),armR:q('#fbArmR'),foreL:q('#fbArmL .fbFore'),foreR:q('#fbArmR .fbFore'),arms}}
/* gestos: molas por articulação (ombro u, cotovelo f; negativo = mão vai para o centro do corpo) */
const ARM={L:{u:{x:3,v:0},f:{x:-6,v:0}},R:{u:{x:3,v:0},f:{x:-6,v:0}},next:0,gL:0,gR:0,beat:0};
function armSpring(s,t,dt,k,z){const a=k*(t-s.x)-2*z*Math.sqrt(k)*s.v;s.v+=a*dt;s.x+=s.v*dt}
function renderArms(now,dt,breath){
 const st=S.state,talking=st==='SPEAKING'&&!S.hmmOnly;
 if(talking){ if(now>ARM.next){const r=Math.random();ARM.gL=r<.3?1:r<.42?2:0;ARM.gR=r>.7?1:r>.58&&r<=.7?2:0;if(r>.42&&r<=.58){ARM.gL=1;ARM.gR=1}ARM.next=now+rnd(1.5,3.2)} }
 else {ARM.gL=ARM.gR=0;ARM.next=0}
 const pose=(g,sd)=>{
  if(S.prac&&st!=='SPEAKING')return[4,-40];
  if(st==='LISTENING')return[4,-45];          // mãos juntas na frente, atenta
  if(st==='ATTENDING')return[4,-36];
  if(st==='THINKING')return sd==='R'?[12,-80]:[3,-8]; // uma mão no queixo/peito: “deixa eu pensar”
  if(g===1)return[15,-70]; if(g===2)return[19,-98]; return[4,-9]};
 if(talking&&MO.lastBeat!==ARM.beat){ARM.beat=MO.lastBeat;const sd=ARM.gR?'R':ARM.gL?'L':(Math.random()<.5?'L':'R');ARM[sd].f.v-=55;ARM[sd].u.v+=12}
 for(const sd of['L','R']){const a=ARM[sd],[tu,tf]=pose(sd==='L'?ARM.gL:ARM.gR,sd),n=fbm(now*.35+(sd==='L'?3:7),sd==='L'?11:13);
  armSpring(a.u,tu+n*1.6,dt,20,.9);armSpring(a.f,tf+n*3.5,dt,24,.85);
  const u=clamp(a.u.x,-4,26),f=clamp(a.f.x,-115,8);
  R['arm'+sd].setAttribute('transform',`translate(0 ${(-breath*2.2).toFixed(2)}) rotate(${u.toFixed(2)} 82 292)`);
  R['fore'+sd].setAttribute('transform',`rotate(${f.toFixed(2)} 78 468)`)}
}

/* ============ Fundos: marcos de São Paulo desenhados à mão (SVG vetorial, mesma paleta, levemente apagados) ============
   viewBox 600×1000, recorte "xMidYMax slice": no celular aparece o miolo (≈500 de largura); o topo dos marcos fica acima da cabeça dela. */
const BG_LIST=[['masp','MASP · Avenida Paulista'],['banespa','Edifício Altino Arantes (Banespa)'],['theatro','Theatro Municipal'],['copan','Edifício Copan']];
function bgCalcada(y){ // calçada paulistana de Mirthes Bernardes: o contorno do estado de SP em ladrilhos preto e branco (estilizado)
 return `<defs><pattern id="mbSP" width="44" height="34" patternUnits="userSpaceOnUse"><rect width="44" height="34" fill="#EDE3D2"/>`+
 `<path d="M2 18L8 9L17 7L22 2L30 5L38 4L42 11L35 17L37 24L28 26L22 32L12 30L9 24Z" fill="#2A3240" opacity=".55"/></pattern></defs>`+
 `<rect x="0" y="${y}" width="600" height="${1000-y}" fill="url(#mbSP)"/><rect x="0" y="${y}" width="600" height="6" fill="#D9CBB2"/>`}
function bgSky(){return `<rect width="600" height="1000" fill="#F3EBDD"/><circle cx="470" cy="160" r="52" fill="#F5C518" opacity=".55"/>`+
 `<path d="M60 210H190L172 226H44ZM360 120H470L456 132H344Z" fill="#E9DDC7"/>`}
function bgCity(y0,seed){let s='',x=-10,i=seed;const r=()=>{i=(i*9301+49297)%233280;return i/233280};
 while(x<610){const w=34+r()*46,h=110+r()*220;s+=`<rect x="${x.toFixed(0)}" y="${(y0-h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+2).toFixed(0)}" fill="${r()<.5?'#E2D4BC':'#D9C9AE'}"/>`;x+=w+2}
 return s}
function bgAvenue(y){ // pista da Paulista com faixas
 let s=`<rect x="0" y="${y}" width="600" height="44" fill="#4A5262"/>`;for(let x=10;x<600;x+=60)s+=`<rect x="${x}" y="${y+20}" width="30" height="4" fill="#F5C518" opacity=".8"/>`;return s}
function bgMASP(){let g=bgSky()+bgCity(700,7);
 // árvores do Trianon atrás, à esquerda
 g+=`<path d="M0 700V610L30 580L60 610L80 570L110 620L130 600V700Z" fill="#5C6B5E" opacity=".5"/>`;
 // caixa de vidro suspensa entre as vigas
 g+=`<rect x="58" y="372" width="484" height="190" fill="#3A4456"/>`;
 for(let x=70;x<540;x+=18)g+=`<rect x="${x}" y="376" width="2.5" height="182" fill="#252D3B"/>`;
 g+=`<rect x="58" y="462" width="484" height="5" fill="#252D3B"/><path d="M120 376L210 376L130 558H58V510Z" fill="#6A7790" opacity=".35"/><path d="M330 376H380L300 558H250Z" fill="#6A7790" opacity=".25"/>`;
 g+=`<rect x="54" y="560" width="492" height="12" fill="#CDBFA6"/>`;
 // vigas e pilares vermelhos (o vão livre fica aberto embaixo)
 g+=`<rect x="34" y="326" width="532" height="48" fill="#C8102E"/><rect x="34" y="348" width="532" height="4" fill="#9E0C22"/>`;
 g+=`<rect x="34" y="326" width="40" height="540" fill="#C8102E"/><rect x="526" y="326" width="40" height="540" fill="#C8102E"/>`;
 g+=`<rect x="60" y="374" width="14" height="492" fill="#9E0C22"/><rect x="552" y="374" width="14" height="492" fill="#9E0C22"/>`;
 // gente no vão livre + avenida + calçada
 g+=`<path d="M120 866V840L126 826L132 840V866ZM470 866V842L476 830L482 842V866Z" fill="#2A3240" opacity=".5"/>`;
 return g+bgAvenue(866)+bgCalcada(910)}
function bgBanespa(){let g=bgSky()+bgCity(760,3);
 // Martinelli à esquerda (bloco com coroamento)
 g+=`<rect x="20" y="430" width="150" height="340" fill="#E3C9AE"/><rect x="40" y="400" width="110" height="34" fill="#D8B898"/><rect x="62" y="372" width="66" height="30" fill="#C8102E" opacity=".75"/>`;
 for(let y=450;y<760;y+=26)g+=`<rect x="32" y="${y}" width="126" height="7" fill="#CDAE8E"/>`;
 // Altino Arantes: degraus art déco, torre, mastro
 const T=[[220,380,560,860],[238,362,420,560],[256,344,300,420],[272,328,222,300],[286,314,176,222]];
 T.forEach(([a,b,y1,y2])=>{g+=`<rect x="${a}" y="${y1}" width="${b-a}" height="${y2-y1}" fill="#DCC6A0"/><rect x="${(a+b)/2}" y="${y1}" width="${(b-a)/2}" height="${y2-y1}" fill="#C7AE84"/>`;
  for(let x=a+10;x<b-6;x+=12)g+=`<rect x="${x}" y="${y1+8}" width="3" height="${y2-y1-14}" fill="#A88F66" opacity=".6"/>`});
 g+=`<rect x="297" y="96" width="6" height="82" fill="#0B1119"/><circle cx="300" cy="96" r="6" fill="#C8102E"/>`+
  `<path d="M303 104H335V118H303Z" fill="#F3ECDE"/><rect x="303" y="104" width="12" height="7" fill="#C8102E"/><path d="M303 112H335V114H303Z" fill="#0B1119"/>`;
 // prédios à direita
 g+=`<rect x="420" y="520" width="90" height="250" fill="#D6C5A8"/><rect x="500" y="460" width="100" height="310" fill="#E0D2B9"/>`;
 for(let y=480;y<760;y+=22)g+=`<rect x="512" y="${y}" width="76" height="6" fill="#C8B796"/>`;
 return g+bgAvenue(860)+bgCalcada(904)}
function bgTheatro(){let g=bgSky()+bgCity(640,11);
 // corpo do teatro
 g+=`<rect x="60" y="520" width="480" height="330" fill="#DDC6A2"/><rect x="300" y="520" width="240" height="330" fill="#CFB78F"/>`;
 g+=`<rect x="200" y="420" width="200" height="110" fill="#E4CFAB"/><path d="M200 420H400L380 400H220Z" fill="#C8102E" opacity=".7"/>`;
 // cúpula central (pátina → navy) e lanterna
 g+=`<path d="M232 402C232 330 368 330 368 402Z" fill="#2E4258"/><path d="M300 336C330 340 360 360 368 402H300Z" fill="#243548"/>`+
  `<rect x="290" y="300" width="20" height="40" fill="#E4CFAB"/><path d="M286 300C286 280 314 280 314 300Z" fill="#2E4258"/><rect x="298" y="246" width="4" height="40" fill="#0B1119"/>`;
 // torres laterais com cúpulas
 for(const x of[90,450]){g+=`<rect x="${x}" y="440" width="60" height="90" fill="#E4CFAB"/><path d="M${x-4} 444C${x-4} 400 ${x+64} 400 ${x+64} 444Z" fill="#2E4258"/><rect x="${x+28}" y="380" width="4" height="30" fill="#0B1119"/>`;
  g+=`<path d="M${x+14} 520V478C${x+14} 462 ${x+46} 462 ${x+46} 478V520Z" fill="#F5C518" opacity=".7"/>`}
 // janelão em arco + colunas
 g+=`<path d="M246 530V470C246 432 354 432 354 470V530Z" fill="#F5C518" opacity=".75"/><path d="M300 432V530M273 440V530M327 440V530M246 486H354" stroke="#B89A6C" stroke-width="3"/>`;
 for(let x=78;x<540;x+=36){if(x>190&&x<410)continue;g+=`<rect x="${x}" y="560" width="12" height="270" fill="#F0E4CC"/>`}
 for(let x=215;x<400;x+=40)g+=`<rect x="${x}" y="560" width="14" height="270" fill="#F0E4CC"/><path d="M${x+20} 640V600C${x+20} 586 ${x+34} 586 ${x+34} 600V640Z" fill="#F5C518" opacity=".55"/>`;
 g+=`<rect x="56" y="548" width="488" height="12" fill="#C8102E" opacity=".65"/>`;
 g+=`<rect x="40" y="846" width="520" height="10" fill="#CDBFA6"/><rect x="24" y="856" width="552" height="10" fill="#C2B398"/>`;
 return g+bgCalcada(866)}
function bgCopan(){let g=bgSky()+bgCity(820,5);
 // fachada sinuosa: topo em S, brises horizontais, planos claros/escuros seguindo a curva
 const top=x=>250+38*Math.sin((x-20)/560*Math.PI*2.1), bot=840;let d='M20 '+bot;
 for(let x=20;x<=580;x+=20)d+=`L${x} ${top(x).toFixed(1)}`;d+=`L580 ${bot}Z`;
 g+=`<defs><clipPath id="cpCopan"><path d="${d}"/></clipPath></defs><g clip-path="url(#cpCopan)"><rect x="0" y="180" width="600" height="700" fill="#E8DCC5"/>`;
 for(let x=20;x<580;x+=20){const k=Math.cos((x-20)/560*Math.PI*2.1);if(k<0)g+=`<rect x="${x}" y="180" width="21" height="700" fill="#BFAE90" opacity="${(-k*.7).toFixed(2)}"/>`}
 for(let y=200;y<bot;y+=13)g+=`<rect x="0" y="${y}" width="600" height="4" fill="#9E8D70" opacity=".55"/>`;
 g+=`</g><path d="${d}" fill="none" stroke="#9E8D70" stroke-width="2"/>`;
 g+=`<rect x="0" y="830" width="600" height="30" fill="#C8102E" opacity=".55"/>`;
 return g+bgAvenue(860)+bgCalcada(904)}
function bgSVG(id){const f={masp:bgMASP,banespa:bgBanespa,theatro:bgTheatro,copan:bgCopan}[id]||bgMASP;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${f()}</svg>`}
