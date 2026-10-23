# aplica sobre o sophia-ao-vivo de 0d454b3 (2026.10.20-sp)
P='sophia-ao-vivo/index.html';s=open(P).read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,('COUNT',c,a[:90]);s=s.replace(a,b)
c=s.count('2026.10.20-sp');s=s.replace('2026.10.20-sp','2026.10.20-sessao');print('ver',c)
# recarregar versão nova sem perder ?tema/alvos/from (antes caía no ?v= puro)
rep("location.replace(location.pathname+'?v='+encodeURIComponent(m[1]))",
    "{const q=new URLSearchParams(location.search);q.set('v',m[1]);location.replace(location.pathname+'?'+q.toString()+location.hash)}")
# from=sessao (etapa 3 da sessão do protótipo) vale como from=rotina; from=pratica = conversa avulsa do app
rep("FROM_ROTINA=QS.get('from')==='rotina',","FROM=QS.get('from')||'',FROM_ROTINA=FROM==='rotina'||FROM==='sessao',FROM_APP=FROM_ROTINA||FROM==='pratica',EMBED=(()=>{try{return window.top!==window}catch(_){return true}})(),")
# avisa o protótipo (quando embutido) que a chamada terminou e foi registrada
rep("errs:me.filter(t=>t.isError&&t.corrected).map(t=>({said:t.heard||t.text,corrected:t.corrected,why:t.why||null})).slice(0,6)}))}catch(_){}}",
    "errs:me.filter(t=>t.isError&&t.corrected).map(t=>({said:t.heard||t.text,corrected:t.corrected,why:t.why||null})).slice(0,6)}));\n  if(EMBED)try{parent.postMessage({type:'sophia-call-end',turns:me.length},location.origin)}catch(_){}}catch(_){}}")
rep("if(FROM_ROTINA){$('mmRotina').hidden=false;$('rvRotina').hidden=false}",
    """if(FROM_ROTINA){$('mmRotina').hidden=false;$('rvRotina').hidden=false}
if(FROM==='pratica'){for(const id of ['mmRotina','rvRotina']){const a=$(id);a.hidden=false;a.href='../v6/#practice';a.textContent='↩ Voltar para Praticar'}}
if(FROM==='sessao'){const a=$('rvRotina');a.textContent='↩ Fechamento';a.title='Voltar ao fechamento da sessão com a Teacher Lili'}
if(EMBED){document.documentElement.classList.add('embed');
 /* dentro do protótipo: links para o app trocam a tela do app (pai), não a do iframe */
 document.querySelectorAll('a[href^="../v6/"]').forEach(a=>a.target='_top');
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="../v6/"]');if(!a)return;try{const h=a.getAttribute('href').split('#')[1]||'home';window.top.location.hash=h;e.preventDefault()}catch(_){}},true)}""")
open(P,'w').write(s);print('ok')
