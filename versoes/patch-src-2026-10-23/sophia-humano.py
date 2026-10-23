# Sophia ao vivo 2026.10.21-anim2 -> 2026.10.23-humano (Humanizer, v7.4)
# Aplica sobre: git show 170d041:sophia-ao-vivo/index.html > sophia-ao-vivo/index.html && python3 patch/sophia-humano.py
# Gerado do diff do commit 8831cb4; cada trecho precisa existir uma vez só.
# Obs.: a cadeia antiga (apply.py -> apply2..5 -> sophia-sp -> sophia-embed) termina em 2026.10.20-sessao;
# as versões seguintes até 2026.10.21-anim2 foram editadas direto no index.html (fonte da verdade = o arquivo commitado).
import sys
P=sys.argv[1] if len(sys.argv)>1 else 'sophia-ao-vivo/index.html'
s=open(P).read()
PAIRS=[
[
"<meta http-equiv=\"Cache-Control\" content=\"no-cache\"><meta name=\"sophia-version\" content=\"2026.10.21-anim2\">\n",
"<meta http-equiv=\"Cache-Control\" content=\"no-cache\"><meta name=\"sophia-version\" content=\"2026.10.23-humano\">\n"
],
[
"body.call #review::before{content:\"\";position:absolute;inset:-40px;z-index:-1;background:url(\"img/sophia-call.webp?v=2026.10.21-anim2\") 52% 30%/cover;filter:blur(22px) brightness(.42) saturate(1.1)}\n",
"body.call #review::before{content:\"\";position:absolute;inset:-40px;z-index:-1;background:url(\"img/sophia-call.webp?v=2026.10.23-humano\") 52% 30%/cover;filter:blur(22px) brightness(.42) saturate(1.1)}\n"
],
[
"body.call.ear #ear::before{content:\"\";position:absolute;inset:-40px;z-index:-1;background:#0f1117 url(\"img/sophia-call.webp?v=2026.10.21-anim2\") 52% 30%/cover;filter:blur(18px) brightness(.4) saturate(1.1)}\n",
"body.call.ear #ear::before{content:\"\";position:absolute;inset:-40px;z-index:-1;background:#0f1117 url(\"img/sophia-call.webp?v=2026.10.23-humano\") 52% 30%/cover;filter:blur(18px) brightness(.4) saturate(1.1)}\n"
],
[
" <div id=\"stage\"><div id=\"bgHost\" aria-hidden=\"true\"></div><div id=\"svgHost\"></div><div id=\"practice\" hidden aria-live=\"polite\"><span id=\"prLbl\"></span><div id=\"prTxt\"></div><div id=\"prHint\"></div></div><div id=\"caps\" aria-live=\"polite\"></div><div id=\"callImg\"><img src=\"anim/poster.webp?v=2026.10.21-anim2\" alt=\"Sophia na chamada de vídeo\" decoding=\"async\" draggable=\"false\"><video class=\"sav\" id=\"sav0\" muted playsinline preload=\"auto\" disablepictureinpicture disableremoteplayback aria-hidden=\"true\" tabindex=\"-1\"></video><video class=\"sav\" id=\"sav1\" muted playsinline preload=\"auto\" disablepictureinpicture disableremoteplayback aria-hidden=\"true\" tabindex=\"-1\"></video><div id=\"callGlow\"></div></div><div id=\"spkRing\"></div><div id=\"callTop\"><svg class=\"spla\" viewBox=\"0 0 80 80\" aria-hidden=\"true\"><path d=\"M20 10 10 10 0 0 0 10 0 20 10 20ZM40 20 50 20 60 10 50 10 40 0 30 0 20 10 30 10ZM0 30 10 30 20 40 30 40 40 30 30 30 20 20 10 20ZM10 60 20 50 10 50 0 40 0 50 0 60ZM20 50 30 50 40 60 50 60 60 50 50 50 40 40 30 40ZM20 80 30 80 40 70 30 70 20 60 10 60 0 70 10 70ZM40 30 50 30 60 40 70 40 80 30 70 30 60 20 50 20ZM60 80 70 80 80 70 70 70 60 60 50 60 40 70 50 70ZM80 10 80 0 70 0 60 10 70 10 80 20ZM80 60 80 50 80 40 70 40 60 50 70 50Z\"/></svg><span class=\"rec\"></span><span class=\"tt\">Sophia · São Paulo Languages Academy</span><span id=\"callTime\">00:00</span></div><div id=\"selfView\" hidden><video id=\"selfVid\" playsinline muted autoplay></video><small>Você</small></div><div id=\"toast\" hidden role=\"status\"></div><div id=\"moreMenu\" hidden><button type=\"button\" id=\"mmKbd\">⌨️ Digitar em vez de falar</button><button type=\"button\" id=\"mmCfg\">⚙︎ Ajustes</button><button type=\"button\" id=\"mmRev\" hidden>📋 Revisão da última chamada</button><button type=\"button\" id=\"mmEar\">🎧 Treino de ouvido (5 min)</button><a id=\"mmErick\" href=\"../v6/#ouvir\">🎙️ Também no app: Ouvir com o Erick</a><a id=\"mmRotina\" href=\"../v6/#d-close\" hidden>↩ Voltar ao fechamento com a Teacher Lili</a></div><div id=\"ear\" aria-live=\"polite\"></div><div id=\"pill\"><i></i><span id=\"pillTxt\">Pronta</span></div><div id=\"hmm\">Hmm…</div><button type=\"button\" id=\"btnAvatar\" aria-expanded=\"true\" title=\"Recolher/expandir a Sophia\">▴ Recolher</button><div id=\"meter\"><div></div></div></div>\n",
" <div id=\"stage\"><div id=\"bgHost\" aria-hidden=\"true\"></div><div id=\"svgHost\"></div><div id=\"practice\" hidden aria-live=\"polite\"><span id=\"prLbl\"></span><div id=\"prTxt\"></div><div id=\"prHint\"></div></div><div id=\"caps\" aria-live=\"polite\"></div><div id=\"callImg\"><img src=\"anim/poster.webp?v=2026.10.23-humano\" alt=\"Sophia na chamada de vídeo\" decoding=\"async\" draggable=\"false\"><video class=\"sav\" id=\"sav0\" muted playsinline preload=\"auto\" disablepictureinpicture disableremoteplayback aria-hidden=\"true\" tabindex=\"-1\"></video><video class=\"sav\" id=\"sav1\" muted playsinline preload=\"auto\" disablepictureinpicture disableremoteplayback aria-hidden=\"true\" tabindex=\"-1\"></video><div id=\"callGlow\"></div></div><div id=\"spkRing\"></div><div id=\"callTop\"><svg class=\"spla\" viewBox=\"0 0 80 80\" aria-hidden=\"true\"><path d=\"M20 10 10 10 0 0 0 10 0 20 10 20ZM40 20 50 20 60 10 50 10 40 0 30 0 20 10 30 10ZM0 30 10 30 20 40 30 40 40 30 30 30 20 20 10 20ZM10 60 20 50 10 50 0 40 0 50 0 60ZM20 50 30 50 40 60 50 60 60 50 50 50 40 40 30 40ZM20 80 30 80 40 70 30 70 20 60 10 60 0 70 10 70ZM40 30 50 30 60 40 70 40 80 30 70 30 60 20 50 20ZM60 80 70 80 80 70 70 70 60 60 50 60 40 70 50 70ZM80 10 80 0 70 0 60 10 70 10 80 20ZM80 60 80 50 80 40 70 40 60 50 70 50Z\"/></svg><span class=\"rec\"></span><span class=\"tt\">Sophia · São Paulo Languages Academy</span><span id=\"callTime\">00:00</span></div><div id=\"selfView\" hidden><video id=\"selfVid\" playsinline muted autoplay></video><small>Você</small></div><div id=\"toast\" hidden role=\"status\"></div><div id=\"moreMenu\" hidden><button type=\"button\" id=\"mmKbd\">⌨️ Digitar em vez de falar</button><button type=\"button\" id=\"mmCfg\">⚙︎ Ajustes</button><button type=\"button\" id=\"mmRev\" hidden>📋 Revisão da última chamada</button><button type=\"button\" id=\"mmEar\">🎧 Treino de ouvido (5 min)</button><a id=\"mmErick\" href=\"../v6/#ouvir\">🎙️ Também no app: Ouvir com o Erick</a><a id=\"mmRotina\" href=\"../v6/#d-close\" hidden>↩ Voltar ao fechamento com a Teacher Lili</a></div><div id=\"ear\" aria-live=\"polite\"></div><div id=\"pill\"><i></i><span id=\"pillTxt\">Pronta</span></div><div id=\"hmm\">Hmm…</div><button type=\"button\" id=\"btnAvatar\" aria-expanded=\"true\" title=\"Recolher/expandir a Sophia\">▴ Recolher</button><div id=\"meter\"><div></div></div></div>\n"
],
[
"<script src=\"https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.wasm.min.js?v=2026.10.21-anim2\" defer></script>\n<script src=\"https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.24/dist/bundle.min.js?v=2026.10.21-anim2\" defer></script>\n",
"<script src=\"https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.wasm.min.js?v=2026.10.23-humano\" defer></script>\n<script src=\"https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.24/dist/bundle.min.js?v=2026.10.23-humano\" defer></script>\n"
],
[
"const APP_V='2026.10.21-anim2'; // muda a cada versão publicada; aparece em Ajustes\n",
"const APP_V='2026.10.23-humano'; // muda a cada versão publicada; aparece em Ajustes\n"
],
[
"   reply=`${rc}${j?`A ${j}? That's so cool!`:'Oh, interesting!'} Do you use English at work?`;pt='Você usa inglês no trabalho?';break}\n",
"   reply=`${rc}${j?`Oh, ${/^[aeiou]/.test(j)?'an':'a'} ${j}!`:'Oh, interesting!'} Do you use English at work?`;pt='Você usa inglês no trabalho?';break}\n"
],
[
"   reply=`${rc}${sp?'Totally normal. Speaking gets easier with practice, like right now!':un?'Yeah, native speakers talk fast! We can work on that.':'That makes sense.'} So, what did you do last weekend?`;pt='O que você fez no último fim de semana?';break}\n",
"   reply=`${rc}${sp?'Totally normal. Speaking gets easier with practice, like right now!':un?'Yeah, they talk so fast! A little practice every day helps.':'That makes sense.'} So, what did you do last weekend?`;pt='O que você fez no último fim de semana?';break}\n"
],
[
"  default:{reply=`${rc}Love it${D.name?', '+D.name:''}! You did great today. Want to keep chatting? Tell me about your favorite food!`;pt='Você foi ótimo hoje! Quer continuar? Me fale da sua comida favorita.';D.step=4;break}\n",
"  default:{const MORE=[[\"What's your favorite food?\",'Qual é a sua comida favorita?'],['Do you like to cook?','Você gosta de cozinhar?'],[\"What's a good place to eat near you?\",'Qual é um bom lugar para comer perto de você?'],['Do you have any plans for your next vacation?','Você tem planos para as próximas férias?']];\n   D.more=(D.more||0)+1;const q=MORE[(D.more-1)%MORE.length];const re=['Ha, nice','Oh, cool','Hmm, I like that','Really? Nice'][(D.more-1)%4];\n   reply=`${rc}${re}${D.name&&D.more===1?', '+D.name:''}! ${D.more===1?\"Let's keep going. \":''}${q[0]}`;pt=(D.more===1?'Vamos continuar. ':'')+q[1];D.step=4;D.pastFix=null;break}\n"
],
[
" else if(D.pastFix&&D.step===4){repeat=`Last weekend I ${D.pastFix}`}\n D.step++;D.last=reply.replace(/^(Oh|Ah|Got it)[^!.]*[!.]\\s*/,'');D.pastFix=D.step===5?D.pastFix:null;\n",
" else if(D.pastFix&&D.step===4&&!D.more){repeat=`Last weekend I ${D.pastFix}`}\n D.step++;D.last=reply.replace(/^(Oh|Ah|Got it|Ha|Hmm|Really\\?)[^!.]*[!.]\\s*/,'');D.pastFix=D.step===5?D.pastFix:null;\n"
],
[
"const SYS=`You're Sophia, a friendly, casual English conversation buddy for a Brazilian adult (level {LVL}). Talk like a real person texting out loud: contractions, short natural reactions (\"Oh nice!\", \"No way!\", \"Haha, same\"), react to WHAT they said, then ask ONE simple question. 1-2 short sentences, max 25 words. No lectures, no lists.\nTheir text is en-US speech recognition of a Brazilian accent: guess the intended meaning from context. If it's too garbled to understand, don't guess: casually ask them to say it again or check what they meant (\"Sorry, did you say ...?\").\n",
"const SYS=`You're Sophia, a friendly, casual English conversation buddy for a Brazilian adult (level {LVL}). Talk like a real person texting out loud: contractions, short natural reactions (\"Oh nice!\", \"No way!\", \"Haha, same\"), react to WHAT they said, then ask ONE simple question. 1-2 short sentences, max 25 words. No lectures, no lists.\nSOUND HUMAN (spoken, adapted from the MIT \"humanizer\" skill by Siqi Chen, github.com/blader/humanizer):\n- Talk like a friend on a call, not a chatbot. Contractions always. Mix very short and normal sentences.\n- Never open with praise or a wrapper: no \"Great question!\", \"Certainly!\", \"Absolutely!\", \"I'd love to help\", \"Let's dive in\", \"Here's the thing\", \"Honestly?\". Start with your reaction to what they said.\n- Vary reactions; don't repeat the same one twice in a call (\"Oh nice\", \"Really?\", \"Ha, same\", \"Hmm\", \"Wait, seriously?\"). Praise only something specific they said or did.\n- No dashes, no lists, no lines of three (\"fun, relaxing, and rewarding\"), no \"It's not just X, it's Y\", no wise closing lines (\"That's what really matters\").\n- No fancy words: avoid delve, crucial, vibrant, journey, enhance, showcase, incredible, amazing. Use the plain everyday word.\n- Fillers sparingly: at most one \"oh\", \"hmm\", \"well\" or \"yeah\" per turn; never \"um\", \"uh\" or \"like\" as filler (they confuse learners and the voice engine).\n- Don't offer things (\"Want me to...?\", \"Would you like...?\", \"Let me know\"). Just ask your ONE real question about their life.\n- Keep everything learner-friendly: these rules never override level {LVL} vocabulary, short turns, recasting, and the ONE-question rule. Prefer a common word over a natural-but-rare idiom. Never promise results (\"you'll be fluent in no time\").\nTheir text is en-US speech recognition of a Brazilian accent: guess the intended meaning from context. If it's too garbled to understand, don't guess: casually ask them to say it again or check what they meant (\"Sorry, did you say ...?\").\n"
],
[
" const sys=isConv()?SYS_CONV.replace('{LVL}',CFG.lvl).replace('{ELICIT}',elicitText()+temaText()):SYS.replace('{LVL}',CFG.lvl);\n",
" const sys=isConv()?SYS_CONV.replace(/\\{LVL\\}/g,CFG.lvl).replace('{ELICIT}',elicitText()+temaText()):SYS.replace(/\\{LVL\\}/g,CFG.lvl);\n"
],
[
" D.step=0;HIST.length=0;S.state='IDLE';if(isConv())convSessionStart();\n const hello=TEMA?(CFG.mode==='llm'&&CFG.key?(FROM_ROTINA?`Hi! I'm Sophia. Erick told me you just listened to his episode about ${TEMA}. What did you think?`:`Hi! I'm Sophia. Today let's talk about ${TEMA}. Have you ever dealt with that at work?`)\n",
" D.step=0;D.more=0;HIST.length=0;S.state='IDLE';if(isConv())convSessionStart();\n const hello=TEMA?(CFG.mode==='llm'&&CFG.key?(FROM_ROTINA?`Hi, I'm Sophia! Erick said you just heard his episode about ${TEMA}. Did you like it?`:`Hi! I'm Sophia. Today let's talk about ${TEMA}. Have you ever dealt with that at work?`)\n"
],
[
"  :CFG.mode==='llm'&&CFG.key?\"Hi! I'm Sophia, your English buddy. What's your name, and how's your day going?\":\"Hi! I'm Sophia, your English buddy. What's your name?\";\n",
"  :CFG.mode==='llm'&&CFG.key?\"Hi, I'm Sophia! What's your name?\":\"Hi, I'm Sophia! What's your name?\";\n"
],
[
"Example. Student: \"I go on park in the weekend\". You: \"Oh, how cool! I went to the park this weekend too. It's great for decompressing after a full week of work. What did you do there?\"\n",
"Example. Student: \"I go on park in the weekend\". You: \"Oh, I went to the park this weekend too! It's nice after a long week. What did you do there?\"\n"
],
[
"Their text is en-US speech recognition of a Brazilian accent: guess the intended meaning from context. Only if you genuinely can't understand what they mean, ask one short, friendly clarification question (\"Sorry, did you mean ...?\").{ELICIT}\nFORMAT (always, every turn): your spoken reply as plain text, then a line ###, then one line of JSON:\n",
"Their text is en-US speech recognition of a Brazilian accent: guess the intended meaning from context. Only if you genuinely can't understand what they mean, ask one short, friendly clarification question (\"Sorry, did you mean ...?\").{ELICIT}\nSOUND HUMAN (spoken, adapted from the MIT \"humanizer\" skill by Siqi Chen, github.com/blader/humanizer):\n- Talk like a friend on a call, not a chatbot. Contractions always. Mix very short and normal sentences.\n- Never open with praise or a wrapper: no \"Great question!\", \"Certainly!\", \"Absolutely!\", \"I'd love to help\", \"Let's dive in\", \"Here's the thing\", \"Honestly?\". Start with your reaction to what they said.\n- Vary reactions; don't repeat the same one twice in a call (\"Oh nice\", \"Really?\", \"Ha, same\", \"Hmm\", \"Wait, seriously?\"). Praise only something specific they said or did.\n- No dashes, no lists, no lines of three (\"fun, relaxing, and rewarding\"), no \"It's not just X, it's Y\", no wise closing lines (\"That's what really matters\").\n- No fancy words: avoid delve, crucial, vibrant, journey, enhance, showcase, incredible, amazing. Use the plain everyday word.\n- Fillers sparingly: at most one \"oh\", \"hmm\", \"well\" or \"yeah\" per turn; never \"um\", \"uh\" or \"like\" as filler (they confuse learners and the voice engine).\n- Don't offer things (\"Want me to...?\", \"Would you like...?\", \"Let me know\"). Just ask your ONE real question about their life.\n- Keep everything learner-friendly: these rules never override level {LVL} vocabulary, short turns, recasting, and the ONE-question rule. Prefer a common word over a natural-but-rare idiom. Never promise results (\"you'll be fluent in no time\").\nFORMAT (always, every turn): your spoken reply as plain text, then a line ###, then one line of JSON:\n"
],
[
"  if(sc>=.8){S.praise=T()+1.5;nod(1.2);await sayLine(pick(['Great, very clear!','Perfect!','Nice, that sounded great!']))}\n",
"  if(sc>=.8){S.praise=T()+1.5;nod(1.2);await sayLine(pick(['Clear. I got every word.','Yes! Easy to understand.','Nice, that sounded natural.']))}\n"
],
[
"  await sayLine(pick([\"That's it for today. You did great! See you next time.\",\"All done! Great job today. See you soon!\"]),'Por hoje é isso. Mandou muito bem! Até a próxima.')}\n",
"  await sayLine(pick([\"That's it for today. Nice work on those sentences. See you next time!\",\"All done for today. Nice work on those sentences. See you soon!\"]),'Por hoje é isso. Mandou bem nessas frases. Até a próxima!')}\n"
]
]
for a,b in PAIRS:
    assert s.count(a)==1,('trecho não encontrado/único',a[:100])
    s=s.replace(a,b)
open(P,'w').write(s);print('ok',len(PAIRS),'trechos')
