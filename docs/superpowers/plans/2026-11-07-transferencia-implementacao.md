# Transferência Linguística — Implementation Plan

Goal: implementar os dois desenhos aprovados, sem substituir qualquer recurso anterior.
Architecture: nova screen estática reconhecida pelo router, módulo JS/CSS isolado, ramo opcional dentro da Trilha 2b; site estático recebe seções aditivas PT/EN. Nenhum diálogo novo ou alteração de áudio.
Tech: HTML/CSS/JS, localStorage independente v6/teste, Python/Playwright, build.py e GitHub Git Data API para o site sem clone.

## Global Constraints
Preservar onboarding, Crachá, sessão, rotas, Capital, áudio neural e Com legenda. Odlin apenas referência bibliográfica; manter 48 e 80+. Backups remotos já existem. Não enviar o e-mail.

## Tasks
- [x] 1. Escrever e executar testes vermelhos para screen/ramo e seção de site ausentes.
- [x] 2. Adicionar transferencia-linguistica.js/.css e screen nas duas variantes; testes de produção/pista/modelo, drills/retorno, retomada, isolamento e conclusão.
- [x] 3. Executar preservação completa e áudio; commit do protótipo em passo pequeno.
- [x] 4. Acrescentar seção a src/pages/pt-BR/metodologia.html e seção EN a src/pages/en/home.html, preservando o placeholder existente; gerar prévia/produção preservando CNAME; publicar somente as duas páginas geradas alteradas, após comparar bases remotas.
- [x] 5. Atualizar status dos documentos de proposta para implementado apenas após testes; publicar main, verificar versões públicas e site, capturar 390px e salvar hashes/evidências.

## Verification commands
`VERIFY_ORIGIN=http://127.0.0.1:8765 /workspace/.venv-pw/bin/python3 patch/verify_transferencia.py`
`python3 /workspace/site-spla/tests/test_transferencia.py`
Preservação: scripts patch/verify_primeiro_acesso*.py, verify_identity*.py, verify_context_identity.py, verify_native_graphical_route.py, verify_legacy_navigation.py, verify_practice_flow.py, verify_recorded_dialogue_flow.py.
Publicar protótipo antes de ativar o CTA do site; comparar SHA dos HTML públicos e usar teste Playwright com VERIFY_ORIGIN público.
