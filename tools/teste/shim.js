/* Versão de teste: todo o armazenamento local deste app usa o prefixo "teste_".
   Nunca lê nem grava as chaves do protótipo principal (v6 / sophia-ao-vivo). */
(function(){var P='teste_',S=Storage.prototype,g=S.getItem,s=S.setItem,r=S.removeItem,k=S.key;
 var q=function(n){n=String(n);return n.indexOf(P)===0?n:P+n};
 S.getItem=function(n){return g.call(this,q(n))};
 S.setItem=function(n,v){return s.call(this,q(n),v)};
 S.removeItem=function(n){return r.call(this,q(n))};
 window.TESTE_NS=P;
 /* apaga só as chaves teste_* (opcionalmente mantém as configurações/chaves da Sophia deste teste) */
 window.testeReset=function(keepCfg){[window.localStorage,window.sessionStorage].forEach(function(st){var a=[];
   for(var i=0;i<st.length;i++){var n=k.call(st,i);if(n&&n.indexOf(P)===0)a.push(n)}
   a.forEach(function(n){if(keepCfg&&n===P+'sophiaCfg')return;r.call(st,n)})})};
})();
