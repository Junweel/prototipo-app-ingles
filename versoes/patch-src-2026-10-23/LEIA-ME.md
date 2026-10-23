# Cópia das fontes de build (`patch/`), 23/10/2026

Cópia de segurança da pasta `patch/` (que não é versionada), depois do Humanizer (v7.4), atualizada com a etapa da voz (2026.10.23-voz). Sem chaves: só a chave falsa `xai-MOCK-KEY-for-local-test` dos testes.

- App v6/v7: `git show 438dcba:v6/index.html > v6/index.html && python3 patch/v6/apply.py`. O resultado é idêntico ao `v6/index.html` atual (versão 2026.10.23-voz).
- Sophia ao vivo, última etapa: `git show 170d041:sophia-ao-vivo/index.html > sophia-ao-vivo/index.html && python3 patch/sophia-humano.py`. O resultado é idêntico ao do 8831cb4.
- Cadeia antiga da Sophia: `apply.py`, `apply2..5.py`, `sophia-sp.py`, `sophia-embed.py`, até 2026.10.20-sessao. As versões `-anim` e `-anim2` foram editadas direto no `index.html`. A fonte da verdade é o arquivo commitado. `conv.js`, `apply.py` e `apply5.py` já trazem os textos humanizados.
- Sophia ao vivo, etapa da voz (2026.10.23-voz): `git show 5c1d14b:sophia-ao-vivo/index.html > sophia-ao-vivo/index.html && python3 patch/sophia-voz.py`. Traz o streaming do áudio (Azure e Grok), a opção de voz do Grok (`ara`), o "Hmm" só depois de 700 ms, a reação curta no começo da resposta, o pré-aquecimento das conexões e o aviso de região sem HD. O resultado é idêntico ao arquivo commitado.
- `callflow.py` e `mockflow.py` agora respondem 404 aos pedidos que não são de chat (aquecimento e TTS do Grok). O `mockflow.py` ainda espera o botão antigo `#btnStart` e não roda no modo chamada; use o `callflow.py`.
