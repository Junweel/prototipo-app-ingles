/* ================= ROTA ATÉ A PAULISTA · níveis do CEFR explicados como avenidas que sobem até a Paulista =================
   Fonte das descrições: CEFR, escala global (Conselho da Europa, 2001) e Companion Volume (2020), parafraseadas em "consigo…".
   O mapa é esquemático (como o mapa do metrô), fora de escala. Ver ROTA-NIVEIS.md. */
const AV=[
 {k:'pre',lv:'Pre-A1',av:'Ipiranga × São João',sub:'a esquina de “Sampa”, no centro histórico; ponto de partida',c:'#7A8794',
  geo:'O cruzamento mais famoso do centro. Na própria esquina fica o Bar Brahma; o Edifício Copan e o Edifício Itália estão ali na Av. Ipiranga. Daqui a rota sobe até a Paulista.',
  cult:'Esquina cantada por Caetano Veloso em “Sampa” (1978): “alguma coisa acontece no meu coração”. É onde muita gente sente São Paulo pela primeira vez, como o inglês no Pre-A1.',
  can:['Consigo entender e usar palavras soltas e expressões muito simples sobre mim: nome, números, datas, preços.','Consigo responder a perguntas muito curtas e lentas, com gestos, apoio visual e repetição.'],
  work:['Dizer nome, cargo e empresa na recepção do escritório.','Ditar o e-mail e soletrar o nome no telefone.'],h:'0 → ~30–40 h (hipótese interna)'},
 {k:'a1',lv:'A1',av:'Av. São João · Anhangabaú',sub:'centro velho: Edifício Martinelli, Vale do Anhangabaú, Viaduto do Chá e Theatro Municipal',c:'#0B1119',
  geo:'A Av. São João desce da esquina com a Ipiranga até o Vale do Anhangabaú, passando pelo Edifício Martinelli. Do vale, o Viaduto do Chá leva ao Theatro Municipal.',
  cult:'O coração do centro velho: o Martinelli (1929, o primeiro arranha-céu da cidade), o Viaduto do Chá e o Theatro Municipal, palco da Semana de Arte Moderna de 1922. Na rota, é a parada das primeiras frases.',
  can:['Consigo entender e usar expressões do dia a dia e frases muito básicas para necessidades concretas.','Consigo me apresentar e fazer e responder perguntas simples sobre onde trabalho, pessoas que conheço e coisas que tenho.','Consigo conversar de forma simples se a outra pessoa falar devagar, com clareza, e me ajudar.'],
  work:['Apresentar-se ao time global em 2–3 frases ("I work in finance, on the SAP team").','Marcar um horário simples: "Can we meet on Tuesday at 3?"','Escrever um chat curto: "I\u2019m in room 4B."'],h:'~90–100 h acumuladas (Cambridge, aprox.)'},
 {k:'a2',lv:'A2',av:'Av. Nove de Julho',sub:'sai do Anhangabaú, com curvas e viadutos; passa por baixo da Paulista, num túnel perto do MASP',c:'#C8102E',
  geo:'Sai do Vale do Anhangabaú (Praça da Bandeira), atravessa a Bela Vista e passa sob a Paulista pelo túnel perto do MASP. Você já está perto do alto, mas ainda por baixo.',
  cult:'O nome lembra o 9 de julho de 1932, início da Revolução Constitucionalista. Foi uma das grandes avenidas que ligaram o centro aos Jardins, cruzando o espigão por baixo, no túnel.',
  can:['Consigo entender frases e expressões frequentes sobre assuntos imediatos: trabalho, rotina, compras, lugar onde moro.','Consigo me comunicar em tarefas simples e rotineiras, com troca direta de informação.','Consigo descrever com palavras simples minha formação, meu trabalho e o que preciso agora.'],
  plus:'A2+ (Companion Volume): participo de conversas curtas de rotina com mais iniciativa, se o outro ajudar um pouco; conto planos, hábitos e o que fiz de forma breve.',
  work:['Dar um update curto na daily: o que fiz, o que vou fazer, o que me bloqueia.','Avisar que está atrasado: "We\u2019re running behind on the migration."','Pedir para repetir uma sigla na call: "Sorry, what does BP stand for?"'],h:'~180–200 h acumuladas (Cambridge, aprox.)'},
 {k:'b1',lv:'B1',av:'Rua da Consolação',sub:'liga o centro à Paulista: Praça Roosevelt, Igreja da Consolação, Mackenzie',c:'#0B1119',
  geo:'Sai do centro, perto da Praça Roosevelt e da Igreja da Consolação, e sobe reta até o começo da Paulista. Do outro lado da Paulista ela continua como Av. Rebouças, que desce até a Faria Lima.',
  cult:'Um dos caminhos mais antigos entre o centro e o alto. Passa pela Praça Roosevelt (teatros), pelo Cemitério da Consolação e pela Rua Maria Antônia, onde estudantes do Mackenzie e da USP se enfrentaram em 1968.',
  can:['Consigo entender os pontos principais quando alguém fala claro sobre assuntos conhecidos de trabalho e do dia a dia.','Consigo me virar na maioria das situações de viagem e de trabalho previsíveis.','Consigo contar experiências, planos e problemas, e dar razões curtas para minhas opiniões.'],
  plus:'B1+ (Companion Volume): troco e confirmo informações com mais segurança, lido com o que não é rotina e explico por que algo é um problema.',
  work:['Dar um status update semanal (verde/amarelo/vermelho) e responder perguntas.','Explicar um bloqueio no SAP para a gerente de projeto e propor o próximo passo.','Escrever um follow-up por e-mail depois da call.'],h:'~350–400 h acumuladas (Cambridge, aprox.)'},
 {k:'b2',lv:'B2',av:'Av. Brigadeiro Faria Lima',sub:'centro financeiro e de tecnologia; de lá se sobe pela Rebouças até a Paulista',c:'#F5C518',star:'Faria Lima: inglês de negócios',
  geo:'Corre por Pinheiros e Itaim Bibi, com bancos, fintechs e escritórios de grandes empresas de tecnologia. Ela não chega à Paulista: cruza a Av. Rebouças, que sobe até o início da Paulista (lado da Consolação/Dr. Arnaldo). Por isso, no mapa, a Rebouças aparece como a subida tracejada.',
  cult:'Bancos, fundos, fintechs e escritórios de tecnologia: “a Faria Lima” virou apelido do mercado financeiro. Muita gente ali usa inglês de negócios todo dia.',
  can:['Consigo entender as ideias principais de textos e falas complexos, inclusive discussões técnicas da minha área.','Consigo conversar com fluência e espontaneidade suficientes para que falar com colegas proficientes não seja um esforço para nenhum dos lados.','Consigo explicar um ponto de vista, com vantagens e desvantagens de cada opção.'],
  plus:'B2+ (Companion Volume): argumento com eficácia, ligo minhas ideias às dos outros e conduzo a conversa, por exemplo numa reunião ou negociação.',
  work:['Negociar escopo e prazo com o cliente sem mudar o orçamento ("If we move the go-live, we can keep the scope.").','Defender um trade-off técnico (SAP S/4HANA, cloud, segurança) numa reunião com o time global.','Apresentar os números do fechamento do mês e responder perguntas do CFO.'],h:'~500–600 h acumuladas (Cambridge, aprox.)'},
 {k:'c1',lv:'C1',av:'Rua Augusta',sub:'sobe dos Jardins, entre cinemas e livrarias, e cruza a Paulista no Conjunto Nacional',c:'#C8102E',
  geo:'Do lado dos Jardins, a Augusta sobe até cruzar a Paulista na altura do Conjunto Nacional; do outro lado, desce rumo ao centro. Na rota, é a chegada final ao alto.',
  cult:'Rua de cinema de rua, livrarias, bares e música; deu nome à canção “Rua Augusta” (Hervé Cordovil, gravada por Ronnie Cord em 1963). Combina com o C1, em que nuance e tom contam muito.',
  can:['Consigo entender textos e falas longos e exigentes e perceber sentidos que não estão ditos.','Consigo me expressar com fluência e espontaneidade, sem procurar muito as palavras.','Consigo usar o inglês com flexibilidade no trabalho: escolher o tom, contestar com diplomacia e organizar ideias complexas com clareza.'],
  work:['Conduzir um steering committee: contestar um número, reformular a posição do outro e fechar uma decisão.','Dar más notícias a um diretor com o tom certo.','Mediar um conflito entre o time de TI e o de finanças.'],h:'~700–800 h acumuladas (Cambridge, aprox.)'},
 {k:'c2',lv:'C2',av:'Avenida Paulista · MASP',sub:'o ponto mais alto da rota, com o MASP e o vão livre; horizonte além do curso',c:'#0B1119',
  geo:'Fica no espigão, o alto da cidade. Nosso curso vai do Pre-A1 ao C1; a Paulista é o horizonte, não uma promessa.',
  cult:'Aberta em 1891, virou o símbolo da cidade. O MASP de Lina Bo Bardi (1968), suspenso sobre o vão livre, é o ponto de encontro de São Paulo.',
  can:['Consigo entender com facilidade praticamente tudo o que ouço ou leio.','Consigo resumir informações de várias fontes e reconstruir argumentos de forma coerente.','Consigo me expressar com precisão e espontaneidade, diferenciando nuances finas de sentido mesmo em situações complexas.'],
  work:['Negociar um contrato em inglês com todas as nuances jurídicas e comerciais.','Escrever um relatório para o board com precisão de especialista.'],h:'~1.000–1.200 h acumuladas (Cambridge, aprox.)',
  note:'C2 não é "falar como nativo". O próprio Companion Volume (2020) retirou o falante nativo como referência: C2 descreve um usuário muito proficiente, que pode ter sotaque.'}];
/* paradas = os 11 subníveis do currículo (ver #trilha) */
const STOPS=[
 {id:'Pre-A1',av:'pre',lbl:'esquina Ipiranga × São João (Bar Brahma; Copan e Edifício Itália ao lado)',ml:'Ipiranga × São João',x:44,y:810},
 {id:'A1.1',av:'a1',lbl:'Edifício Martinelli, na Av. São João',ml:'Ed. Martinelli',ic:'martinelli',x:118,y:740},
 {id:'A1.2',av:'a1',lbl:'Viaduto do Chá e Theatro Municipal',ml:'Theatro Municipal',ic:'theatro',x:250,y:740},
 {id:'A2.1',av:'a2',lbl:'saindo do Anhangabaú (Praça da Bandeira)',ml:'Pç. da Bandeira',ic:'viaduto',x:250,y:620},
 {id:'A2.2',plus:'A2+',av:'a2',lbl:'perto do túnel sob a Paulista (o MASP fica logo acima)',ml:'túnel sob a Paulista',ic:'tunel',x:118,y:620},
 {id:'B1.1',av:'b1',lbl:'Praça Roosevelt e Igreja da Consolação',ml:'Pç. Roosevelt',ic:'igreja',x:118,y:510},
 {id:'B1.2',plus:'B1+',av:'b1',lbl:'Mackenzie e Rua Maria Antônia',ml:'Mackenzie',ic:'mack',x:250,y:510},
 {id:'B2.1',av:'b2',lbl:'Pinheiros · Largo da Batata',ml:'Largo da Batata',ic:'largo',x:250,y:374},
 {id:'B2.2',plus:'B2+',av:'b2',lbl:'Itaim · centro financeiro',ml:'Itaim · bancos e tech',ic:'torre',x:118,y:374},
 {id:'C1.1',av:'c1',lbl:'Augusta, lado Jardins (cinemas e livrarias)',ml:'Jardins · cinemas',ic:'cinema',x:118,y:260},
 {id:'C1.2',av:'c1',lbl:'Augusta × Paulista · Conjunto Nacional',ml:'Conjunto Nacional',ic:'conjunto',x:250,y:260}];
/* ícones desenhados à mão (SVG simples, paleta SP; sem fotos) · caixa 26×26 com canto em (x,y) */
const K='#0B1119',RD='#C8102E',YL='#F5C518',CR='#FBF8F1';
const ICO={
 sampa:(x,y)=>`<g transform="translate(${x} ${y})"><path d="M8 26V4" stroke="${CR}" stroke-width="2"/><rect x="0" y="3" width="17" height="7" fill="${CR}"/><path d="M2 6.5h13" stroke="${K}" stroke-width="1"/><rect x="4" y="11" width="17" height="7" fill="${RD}"/><path d="M6 14.5h13" stroke="${CR}" stroke-width="1"/><text x="20" y="9" font-size="12" font-weight="800" fill="${YL}">♪</text></g>`,
 copan:(x,y)=>`<g transform="translate(${x} ${y})"><path d="M6 26 C 0 18, 12 10, 6 0 L 18 0 C 24 10, 12 18, 18 26 Z" fill="${CR}" stroke="${K}" stroke-width="1.8"/><path d="M5 6h15M4 11h13M6 16h12M5 21h14" stroke="${K}" stroke-width="1"/></g>`,
 italia:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="7" y="2" width="12" height="24" fill="${K}"/><rect x="5" y="0" width="16" height="3" fill="${RD}"/><path d="M10 6v18M13 6v18M16 6v18" stroke="${YL}" stroke-width=".9"/></g>`,
 martinelli:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="3" y="10" width="20" height="16" fill="${CR}" stroke="${K}" stroke-width="1.8"/><rect x="7" y="4" width="12" height="7" fill="${CR}" stroke="${K}" stroke-width="1.8"/><rect x="10" y="0" width="6" height="5" fill="${RD}"/><path d="M7 15h12M7 19h12M7 23h12" stroke="${K}" stroke-width="1"/></g>`,
 theatro:(x,y)=>`<g transform="translate(${x} ${y})"><path d="M5 12 Q13 1 21 12Z" fill="${YL}" stroke="${K}" stroke-width="1.6"/><path d="M13 1V-2" stroke="${K}" stroke-width="1.6"/><rect x="2" y="12" width="22" height="3" fill="${K}"/><path d="M5 15v9M10 15v9M16 15v9M21 15v9" stroke="${K}" stroke-width="2"/><rect x="1" y="24" width="24" height="2.5" fill="${K}"/></g>`,
 viaduto:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="0" y="8" width="26" height="3.5" fill="${K}"/><path d="M2 26 Q7 12 12 26M14 26 Q19 12 24 26" fill="none" stroke="${K}" stroke-width="2"/><path d="M0 26h26" stroke="${K}" stroke-width="1.5"/></g>`,
 tunel:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="0" y="0" width="26" height="6" fill="url(#oPvY)"/><path d="M1 26 V14 Q13 4 25 14 V26" fill="${CR}" stroke="${K}" stroke-width="2"/><path d="M6 26 V16 Q13 9 20 16 V26Z" fill="${K}"/><path d="M13 19v2M13 23v2" stroke="${YL}" stroke-width="1.5"/></g>`,
 igreja:(x,y)=>`<g transform="translate(${x} ${y})"><path d="M13 0v4M11 2h4" stroke="${K}" stroke-width="1.5"/><path d="M9 12 L13 4 L17 12Z" fill="${K}"/><rect x="9" y="12" width="8" height="14" fill="${CR}" stroke="${K}" stroke-width="1.6"/><rect x="2" y="17" width="22" height="9" fill="${CR}" stroke="${K}" stroke-width="1.6"/><path d="M13 22v4" stroke="${RD}" stroke-width="2"/></g>`,
 mack:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="3" y="8" width="20" height="18" fill="${CR}" stroke="${K}" stroke-width="1.8"/><path d="M1 9 L13 1 L25 9Z" fill="${RD}" stroke="${K}" stroke-width="1.2"/><circle cx="13" cy="14" r="3" fill="none" stroke="${K}" stroke-width="1.3"/><rect x="10" y="19" width="6" height="7" fill="${K}"/></g>`,
 largo:(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 26h26" stroke="${K}" stroke-width="2"/><rect x="3" y="12" width="7" height="14" fill="${K}"/><rect x="12" y="6" width="5" height="20" fill="${YL}" stroke="${K}" stroke-width="1.3"/><rect x="19" y="14" width="5" height="12" fill="${K}"/></g>`,
 torre:(x,y)=>`<g transform="translate(${x} ${y})"><path d="M7 26 V4 L19 0 V26Z" fill="${K}"/><path d="M9 8h8M9 12h8M9 16h8M9 20h8" stroke="${YL}" stroke-width="1.2"/><rect x="1" y="16" width="6" height="10" fill="${CR}" stroke="${K}" stroke-width="1.3"/><rect x="19" y="12" width="6" height="14" fill="${CR}" stroke="${K}" stroke-width="1.3"/></g>`,
 cinema:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="0" y="5" width="26" height="11" fill="${RD}" stroke="${K}" stroke-width="1.5"/><text x="13" y="14" text-anchor="middle" font-size="7.5" font-weight="800" fill="${CR}">CINE</text><path d="M2 3h2M8 3h2M14 3h2M20 3h2" stroke="${YL}" stroke-width="2"/><rect x="4" y="16" width="18" height="10" fill="${CR}" stroke="${K}" stroke-width="1.5"/><rect x="10" y="19" width="6" height="7" fill="${K}"/></g>`,
 conjunto:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="0" y="16" width="26" height="10" fill="${CR}" stroke="${K}" stroke-width="1.6"/><rect x="5" y="6" width="16" height="10" fill="${CR}" stroke="${K}" stroke-width="1.6"/><rect x="8" y="0" width="10" height="5" fill="${RD}"/><path d="M2 21h22M7 11h12" stroke="${K}" stroke-width="1"/></g>`};

const ME={stop:'A2.2',fala:'A2+',escuta:'B1'};
const NEXT={id:'B1.1',av:'b1',checks:[
 [true,'Entendo os pontos principais quando falam claro sobre trabalho (sua escuta já mede B1).'],
 [false,'Participo de uma reunião de rotina trocando informação e resolvendo problemas práticos.'],
 [false,'Dou um status update semanal e respondo perguntas sem travar.'],
 [false,'Escrevo um e-mail de follow-up factual depois da call.']]};
const avOf=k=>AV.find(a=>a.k===k);
const meStop=()=>STOPS.find(s=>s.id===ME.stop);
const meLabel=()=>{const s=meStop(),a=avOf(s.av);return `${s.plus||s.id} · ${a.av.replace('Av. ','')}`};

function rotaMap(){const W=360,H=890,me=ME.stop,mi=STOPS.findIndex(t=>t.id===me);
 const col=k=>avOf(k).c;
 /* caminho em zigue-zague (serpentina): cada avenida é um trecho; as subidas ficam nas pontas */
 const P=(pts,c,w,dash)=>`<polyline points="${pts.map(p=>p.join(' ')).join(',')}" fill="none" stroke="${c}" stroke-width="${w||11}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
 const trk=[
  P([[44,810],[44,740],[118,740]],col('a1')),P([[118,740],[320,740]],col('a1')),
  P([[320,740],[320,620],[250,620]],col('a2')),P([[250,620],[44,620]],col('a2')),
  P([[44,620],[44,510],[118,510]],col('b1')),P([[118,510],[320,510]],col('b1')),
  P([[320,510],[320,374],[250,374]],col('b2'),13),P([[250,374],[44,374]],col('b2'),13),
  P([[44,374],[44,260],[118,260]],col('c1')),P([[118,260],[320,260],[320,150]],col('c1'))].join('');
 const inner=`<polyline points="320,510 320,374 44,374" fill="none" stroke="#0B1119" stroke-width="2" stroke-dasharray="6 6" opacity=".55"/>`;
 /* a subida da Faria Lima de volta ao alto é a Rebouças (tracejada sobre a linha) */
 const reb=`<path d="M44 368 L44 266" stroke="#FBF8F1" stroke-width="3.5" stroke-dasharray="5 6"/><g class="o-avl" data-av="b2" role="button" tabindex="0"><rect x="8" y="276" width="18" height="86" rx="2" fill="#0B1119"/><text x="21" y="356" font-size="10.5" font-weight="800" fill="#F5C518" transform="rotate(-90 21 356)">Rebouças ↑</text></g>`;
 const icons=STOPS.filter(t=>t.ic&&ICO[t.ic]).map(t=>t.id===me?ICO[t.ic](t.x+20,t.y-40):ICO[t.ic](t.x-13,t.y-66)).join('');
 const chip=(k,x,y)=>{const a=avOf(k),w=a.av.length*6.3+14,y2=a.c==='#F5C518';return `<g class="o-avl" data-av="${k}" role="button" tabindex="0"><rect x="${x-w/2}" y="${y}" width="${w}" height="20" rx="2" fill="${a.c}"${y2?' stroke="#0B1119" stroke-width="1.5"':''}/><text x="${x}" y="${y+14}" text-anchor="middle" font-size="11" font-weight="800" fill="${y2?'#0B1119':'#FBF8F1'}">${esc(a.av)}</text><text x="${x+w/2+6}" y="${y+14}" font-size="11" font-weight="800" fill="#0B1119">${a.lv}</text></g>`};
 const dots=STOPS.map((s,i)=>{const mine=i===mi,done=i<mi;
  return `<g class="o-stop${mine?' me':''}" data-av="${s.av}" role="button" tabindex="0" aria-label="${s.id} ${esc(avOf(s.av).av)}"><circle cx="${s.x}" cy="${s.y}" r="${mine?12:9}" fill="${done||mine?'#0B1119':'#FBF8F1'}" stroke="${mine?'#C8102E':'#0B1119'}" stroke-width="3"/>${done?`<path d="M${s.x-4} ${s.y} l3 3 l5 -6" stroke="#FBF8F1" stroke-width="2.4" fill="none"/>`:''}
   ${mine?'':s.id==='Pre-A1'?`<text x="${s.x+18}" y="${s.y-2}" font-size="12.5" font-weight="800" fill="#0B1119">Pre-A1 <tspan font-size="10" font-weight="700">· ponto de partida</tspan></text><text x="${s.x+18}" y="${s.y+11}" font-size="10" font-weight="700" fill="#0B1119" opacity=".85">${esc(s.ml)}</text>`:`<text x="${s.x}" y="${s.y-26}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0B1119">${s.plus?s.plus+' ':s.id}${s.plus?`<tspan font-size="9.5" font-weight="600" opacity=".7">(${s.id})</tspan>`:''}</text><text x="${s.x}" y="${s.y-14}" text-anchor="middle" font-size="9.8" fill="#0B1119" opacity=".75">${esc(s.ml)}</text>`}</g>`}).join('');
 const pn=STOPS[mi];
 const pin=`<g class="o-pin"><path d="M${pn.x} ${pn.y-12} C ${pn.x-13} ${pn.y-26} ${pn.x-13} ${pn.y-46} ${pn.x} ${pn.y-50} C ${pn.x+13} ${pn.y-46} ${pn.x+13} ${pn.y-26} ${pn.x} ${pn.y-12}Z" fill="#C8102E" stroke="#0B1119" stroke-width="2"/><circle cx="${pn.x}" cy="${pn.y-37}" r="4.5" fill="#FBF8F1"/>
  <g transform="translate(24 ${pn.y+16})"><rect width="150" height="34" rx="2" fill="#0B1119"/><text x="8" y="14" font-size="11.5" font-weight="800" fill="#F5C518">📍 Você está aqui</text><text x="8" y="28" font-size="10" font-weight="700" fill="#FBF8F1">${ME.stop} ≈ A2+ · túnel sob a Paulista</text></g></g>`;
 return `<svg class="o-rmap" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa esquemático da rota até a Paulista. Você está em ${esc(meLabel())}.">
  <defs><pattern id="oPv" width="24" height="24" patternUnits="userSpaceOnUse" viewBox="0 0 40 40"><path d="M0 20 10 20 20 10 10 10 0 0 0 10ZM20 40 30 40 40 30 30 30 20 20 10 20 0 30 10 30ZM40 20 40 10 40 0 30 0 20 10 30 10Z" fill="#0B1119" fill-opacity=".06"/></pattern>
  <pattern id="oPvY" width="14" height="14" patternUnits="userSpaceOnUse" viewBox="0 0 40 40"><rect width="40" height="40" fill="#0B1119"/><path d="M0 20 10 20 20 10 10 10 0 0 0 10ZM20 40 30 40 40 30 30 30 20 20 10 20 0 30 10 30ZM40 20 40 10 40 0 30 0 20 10 30 10Z" fill="#F5C518"/></pattern></defs>
  <rect width="${W}" height="${H}" fill="#FBF8F1"/><rect width="${W}" height="${H}" fill="url(#oPv)"/>
  <text x="12" y="26" font-size="11" font-weight="800" fill="#0B1119">↑ quanto mais alto, mais nível</text><text x="${W-10}" y="26" text-anchor="end" font-size="10" fill="#0B1119" opacity=".6">esquemático, fora de escala</text>
  <g class="o-avl" data-av="c2" role="button" tabindex="0"><rect x="0" y="92" width="${W}" height="48" fill="url(#oPvY)"/><rect x="10" y="101" width="196" height="30" rx="2" fill="#0B1119"/><text x="20" y="121" font-size="14.5" font-weight="800" fill="#FBF8F1">Avenida Paulista · C2</text><rect x="${W-40}" y="92" width="40" height="22" fill="#C8102E"/></g>
  <g class="o-avl" data-av="c2" role="button" tabindex="0"><rect x="236" y="94" width="76" height="44" fill="#FBF8F1"/><rect x="246" y="104" width="56" height="14" fill="#0B1119"/><path d="M250 111h48" stroke="#FBF8F1" stroke-width="1"/><rect x="246" y="100" width="6" height="36" fill="#C8102E"/><rect x="296" y="100" width="6" height="36" fill="#C8102E"/><text x="274" y="132" text-anchor="middle" font-size="8.5" font-weight="800" fill="#0B1119">MASP</text></g>
  <text x="12" y="160" font-size="10.5" font-weight="700" fill="#0B1119" opacity=".75">o alto do espigão · horizonte além do curso (Pre-A1 → C1)</text>
  ${reb}${trk}${inner}
  ${chip('a1',176,756)}${chip('a2',262,636)}${chip('b1',180,526)}${chip('c1',180,276)}
  <g class="o-avl o-fl" data-av="b2" role="button" tabindex="0"><rect x="70" y="392" width="220" height="44" rx="3" fill="#F5C518" stroke="#0B1119" stroke-width="2.5"/><path d="M82 428 v-20 h9 v20 M94 428 v-27 h9 v27 M106 428 v-14 h8 v14" fill="#0B1119"/><text x="122" y="410" font-size="13" font-weight="800" fill="#0B1119">Av. Faria Lima · B2</text><text x="122" y="426" font-size="10.5" font-weight="700" fill="#0B1119">inglês de negócios</text><rect x="274" y="392" width="16" height="16" fill="#C8102E"/></g>
  ${ICO.copan(292,788)}${ICO.italia(324,788)}<text x="305" y="826" text-anchor="middle" font-size="7.5" font-weight="700" fill="#0B1119">Copan</text><text x="337" y="826" text-anchor="middle" font-size="7.5" font-weight="700" fill="#0B1119">Itália</text>
  <g class="o-avl o-sampa" data-av="pre" role="button" tabindex="0"><rect x="10" y="836" width="340" height="42" rx="3" fill="#0B1119"/>${ICO.sampa(18,844)}<text x="54" y="853" font-size="11" font-weight="800" fill="#F5C518">Começo: a esquina de “Sampa” (Caetano Veloso)</text><text x="54" y="869" font-size="10.5" font-style="italic" fill="#FBF8F1">“alguma coisa acontece no meu coração”</text><rect x="334" y="836" width="16" height="16" fill="#C8102E"/></g>
  ${icons}${dots}${pin}
 </svg>`}

function rotaHero(small){const s=meStop(),a=avOf(s.av),nx=avOf(NEXT.av);
 return `<div class="o-rhero${small?' sm':''}" data-go="rota" role="button" tabindex="0"><div class="rv"><span class="o-tag y">Rota até a Paulista</span><b>${s.plus} · ${esc(a.av)}</b><span>perto do túnel sob a Paulista · chegando na ${esc(nx.av.replace('Av. ',''))}</span>
  <span class="sk">fala ${ME.fala} · escuta ${ME.escuta} · próxima parada: ${NEXT.id}</span></div><span class="go">ver a rota ›</span></div>`}

function renderRota(){const el=$('oRota');if(!el)return;const s=meStop(),a=avOf(s.av),nx=avOf(NEXT.av),done=NEXT.checks.filter(c=>c[0]).length;
 el.innerHTML=`${rotaHero(false).replace('data-go="rota" role="button" tabindex="0"','')}
 <p class="o-sm o-mut" style="margin:8px 2px 4px">Os níveis do inglês (CEFR, a régua europeia usada no mundo todo) viram avenidas que sobem até a Paulista. Cada parada é um dos 11 subníveis da sua trilha. <b>Por que “A2+/B1”?</b> Sua fala está em A2+ e sua escuta já está em B1: o nível é por habilidade, não uma média.</p>
 <div class="o-rmapw">${rotaMap()}</div>
 <p class="o-sm o-mut" style="margin:6px 2px 12px"><b>O “+”</b> (A2+, B1+, B2+) é a parte de cima de um nível: você já faz quase tudo dele com folga e começa a fazer coisas do próximo. É o fim da avenida, perto da esquina com a seguinte.</p>
 <div class="o-card o-pv"><span class="o-tag k">Próxima parada · ${NEXT.id}</span><p class="o-big" style="margin-top:6px">${esc(nx.av)} · ${esc((STOPS.find(t=>t.id===NEXT.id)||{}).ml||'')}</p>
  <p class="o-sm o-mut">Faltam ${NEXT.checks.length-done} de ${NEXT.checks.length} “consigo” para chegar lá:</p>
  <ul class="o-chk">${NEXT.checks.map(c=>`<li class="${c[0]?'ok':''}"><i>${c[0]?'✓':''}</i>${esc(c[1])}</li>`).join('')}</ul></div>
 <div class="o-card"><h4>Como medimos o seu nível</h4><ul>
  <li><b>Entrevista de nivelamento com a Sophia</b> (fala e escuta, por habilidade).</li>
  <li><b>Autoavaliação 1–4</b> de cada “consigo” no fechamento com a Teacher Lili.</li>
  <li><b>Checkpoint semanal</b> (revisão D+7, mini-chamada, erros recorrentes).</li>
  <li><b>Missão final da unidade</b>, com rubrica; para subir de subnível são 3 evidências.</li></ul>
  <p class="o-sm" style="margin-top:8px;padding:8px 10px;background:var(--yellow-l);border-radius:3px"><b>Capital é esforço, não nível.</b> Ele mostra o quanto você praticou (e soma para o seu time). Quem diz em que avenida você está são as evidências acima.</p></div>
 <div class="o-lv">As avenidas da rota</div>
 ${AV.map(v=>`<button type="button" class="o-avc${v.star?' star':''}" data-av="${v.k}" style="--c:${v.c}"><span class="lv">${v.lv}</span><span class="tx"><b>${esc(v.av)}${v.star?` <em>${esc(v.star)}</em>`:''}</b><span>${esc(v.sub)}</span><small>${esc(v.h)}</small></span><span class="ar">›</span></button>`).join('')}
 <div class="o-card" style="margin-top:12px"><h4>Combinados honestos</h4><ul>
  <li>As descrições vêm do CEFR (escala global e Companion Volume 2020), em português simples.</li>
  <li>Horas são guias aproximados da Cambridge English (aulas + estudo guiado) e <b>variam por pessoa</b>. Não prometemos prazo.</li>
  <li>A rota começa na esquina de “Sampa” e sobe do centro histórico até a Paulista; o mapa é esquemático, não geográfico.</li>
  <li>Nosso curso vai do Pre-A1 ao C1. C2 (Paulista) é o horizonte, e C2 não é “falar como nativo”.</li>
  <li>Para afirmar um nível oficialmente, recomendamos um teste externo.</li></ul>
  <button class="o-btn ink wide" style="margin-top:10px" id="oRotaDoc">Ler a tabela completa (fontes) →</button></div>`;
 el.querySelectorAll('[data-av]').forEach(n=>{n.onclick=()=>openAv(n.dataset.av);n.onkeydown=e=>{if(e.key==='Enter')openAv(n.dataset.av)}});
 $('oRotaDoc').onclick=()=>openDoc('../ROTA-NIVEIS.md','Rota até a Paulista');
 const lb=$('oRotaLili');if(lb)lb.onclick=liliRota;
 if(!localStorage.getItem('rotaLiliVista'))setTimeout(liliRota,350)}

function sheet(html,label){const sh=$('oSheet');sh.hidden=false;sh.innerHTML=`<div class="in" role="dialog" aria-label="${esc(label)}">${html}<button type="button" class="o-btn ink wide" id="oShX" style="margin-top:12px">Fechar</button></div>`;
 $('oShX').onclick=()=>sh.hidden=true;sh.onclick=e=>{if(e.target===sh)sh.hidden=true};return sh}
function openAv(k){const v=avOf(k);if(!v)return;const st=STOPS.filter(s=>s.av===k);
 sheet(`<div class="o-avd${v.star?' star':''}" style="--c:${v.c}"><span class="o-tag ${v.star?'y':'k'}">${v.lv}${v.star?' · '+esc(v.star):''}</span><h2>${esc(v.av)}</h2><p class="o-sm o-mut">${esc(v.sub)}</p></div>
  <h3>Neste nível, eu consigo…</h3><ul>${v.can.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>
  ${v.plus?`<p class="o-sm" style="background:var(--cream2);padding:8px 10px;border-radius:3px"><b>${esc(v.plus.split(' (')[0])}:</b> ${esc(v.plus.split('): ')[1]||v.plus)}</p>`:''}
  <h3>No seu trabalho</h3><ul>${v.work.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>
  ${st.length?`<h3>Paradas (subníveis da sua trilha)</h3><ul>${st.map(s=>`<li><b>${s.id}${s.plus?' ≈ '+s.plus:''}</b> · ${esc(s.lbl)}${s.id===ME.stop?' · <b style="color:var(--red)">você está aqui</b>':''}</li>`).join('')}</ul>`:''}
  ${v.cult?`<h3>Por que este lugar (história e cultura)</h3><p class="o-sm">${esc(v.cult)}</p>`:''}
  <h3>Onde fica</h3><p class="o-sm">${esc(v.geo)}</p>
  <p class="o-sm o-mut">Horas guiadas: ${esc(v.h)}. Aproximado, varia por pessoa.</p>
  ${v.note?`<p class="o-sm" style="border-left:4px solid var(--red);padding-left:8px">${esc(v.note)}</p>`:''}`,v.av)}
async function openDoc(path,label){const sh=sheet('<p>Carregando…</p>',label);let t='';
 try{const r=await fetch(path+'?v='+MV);if(!r.ok)throw 0;t=await r.text()}catch(_){t='# '+label+'\nNão foi possível carregar agora.'}
 sh.querySelector('.in').firstChild.outerHTML=`<div class="md">${md(t)}</div>`}
function liliRota(){localStorage.setItem('rotaLiliVista','1');
 sheet(`<div class="o-lili">${typeof charSVG==='function'?charSVG('lili',64):''}<div><b>Teacher Lili</b><p>Oi, Joël! Pense nos níveis do inglês como avenidas que sobem até a Paulista. A rota começa na esquina de “Sampa”, Ipiranga com São João, e sobe pelo centro histórico. Você está na Nove de Julho, perto do túnel sob a Paulista: é o A2+. A próxima esquina é a Rua da Consolação (B1), na Praça Roosevelt. Cada parada tem uma lista de “consigo”; quando você mostra 3 evidências, eu marco que você subiu. O Capital conta o seu esforço, não o nível.</p></div></div>`,'Teacher Lili explica a rota')}
/* celebração "subiu de avenida" (demonstração no fechamento) */
function celebrate(){const nx=avOf(NEXT.av);let el=$('oCeleb');if(!el){el=document.createElement('div');el.id='oCeleb';document.body.appendChild(el)}
 el.hidden=false;el.innerHTML=`<div class="cf">${Array.from({length:26},(_,i)=>`<i style="left:${(i*37)%100}%;animation-delay:${(i%7)*.12}s;background:${['#F5C518','#C8102E','#0B1119','#FBF8F1'][i%4]}"></i>`).join('')}</div>
 <div class="bx" role="dialog" aria-label="Você subiu de avenida"><span class="o-tag y">demonstração</span><div class="pv"></div><p class="up">Você subiu de avenida!</p><h2>${esc(nx.av)}</h2><p class="st">${NEXT.id} · ${esc((STOPS.find(t=>t.id===NEXT.id)||{}).lbl||'')}, a caminho da Paulista</p>
  <div class="o-lili">${typeof charSVG==='function'?charSVG('lili',52):''}<p>3 evidências confirmadas: missão final, checkpoint e autoavaliação. Parabéns, Joël! Agora a meta é o status update sem travar.</p></div>
  <div class="o-btns"><button type="button" class="o-btn" id="oCelX">Fechar</button><button type="button" class="o-btn pri" id="oCelGo">Ver na rota →</button></div></div>`;
 $('oCelX').onclick=()=>el.hidden=true;$('oCelGo').onclick=()=>{el.hidden=true;go('rota')}}
function rotaChips(){const h=document.querySelector('#home .o-rchip');if(h)h.textContent='📍 '+meLabel();
 const p=$('oRotaHero');if(p&&!p.firstChild)p.innerHTML=rotaHero(true)}
