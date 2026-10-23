# Cópia das fontes de build (`patch/`), 23/10/2026

Cópia de segurança da pasta `patch/` (que não é versionada), depois do Humanizer (v7.4). Sem chaves: só a chave falsa `xai-MOCK-KEY-for-local-test` dos testes.

- App v6/v7: `git show 438dcba:v6/index.html > v6/index.html && python3 patch/v6/apply.py`. O resultado é idêntico ao `v6/index.html` do commit 8831cb4.
- Sophia ao vivo, última etapa: `git show 170d041:sophia-ao-vivo/index.html > sophia-ao-vivo/index.html && python3 patch/sophia-humano.py`. O resultado é idêntico ao do 8831cb4.
- Cadeia antiga da Sophia: `apply.py`, `apply2..5.py`, `sophia-sp.py`, `sophia-embed.py`, até 2026.10.20-sessao. As versões `-anim` e `-anim2` foram editadas direto no `index.html`. A fonte da verdade é o arquivo commitado. `conv.js`, `apply.py` e `apply5.py` já trazem os textos humanizados.
