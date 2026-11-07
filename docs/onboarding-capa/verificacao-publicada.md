# Verificação da publicação

Origem: https://junweel.github.io/prototipo-app-ingles/
Código validado: `0f74108` — GitHub Pages run 42396170900, concluído com sucesso.

Ambientes: `/v6/` e `/teste/`, Chromium, 390 × 844, contextos de armazenamento isolados. Executados **na origem publicada**, com `VERIFY_ORIGIN=https://junweel.github.io/prototipo-app-ingles`, todos com saída 0:

- `patch/verify_primeiro_acesso.py`: cadastro via UI, nome/objetivos/teste/turma/plano; logo e liga; concluir; retorno pela URL normal e link antigo; revisão no Perfil; ?novo=1; reset só da introdução; logo do cadastro sobrevive a editar/salvar no Cartão aprovado.
- `patch/verify_primeiro_acesso_edges.py`: histórico anterior de Andréa abre trilha, sem fabricar cadastro concluído; progresso, nome, foto e links explícitos preservados.
- `patch/verify_primeiro_acesso_quality.py`: apresentação anterior e imagens preservadas; zero erro JS/console/assets; 390px sem overflow horizontal de página; arquivo inválido rejeitado; redução de movimento; config Sophia preservada; flags isoladas em v6/teste na mesma origem.
- Suíte anterior: `verify_identity_smoke.py`, `verify_identity_interactions.py`, `verify_identity_final_layout.py`, `verify_native_graphical_route.py`, `verify_context_identity.py`, `verify_legacy_navigation.py`, `verify_practice_flow.py`.
- 54 rotas legadas por variante, cinco telas Cartão, fluxo real do aquecimento/episódio/seis exercícios e abertura/fechamento do iframe original da Sophia. Não alegado teste de conversa de voz/IA ponta a ponta.
- HTTP 200 em `/v6/`, `/teste/`, `?novo=1` nas duas versões e nos três assets `primeiro-acesso*`.

## Capturas

`docs/onboarding-capa/screenshots/`, prefixos `v6-` e `teste-`:

- `capa.png`: visitante novo, hero sem personagens, necessidade/oportunidade + IA.
- `capa-metodologia.png`: ciclo, repertório de pesquisa com limites honestos e benefícios.
- `configuracao.png`: plano pedagógico + adesão demonstrativa + upload de logo.
- `retorno-trilha.png`: retorno pela URL sem hash, depois de cadastro e aquecimento feitos pela UI original. Check verde conquistado no contexto de teste, etapa atual e próximos atenuados. Nenhuma etapa “feita” foi injetada.
- `perfil-rever.png`: área específica de apresentação/etapas, configuração e reset da introdução.

`origem.json` registra origem/viewport e captura em America/Sao_Paulo (UTC−3). Imagens de demonstração não são dados reais de alunos.

## Limites e preservação

A persistência é local a este navegador/dispositivo e origem; limpar dados remove a lembrança. “Já tenho conta” retoma o perfil local; não representa autenticação remota. Sem perfil local, informa a limitação e aponta Começar. Liga de cadastro é adesão demonstrativa local, não envio a uma empresa. Só os includes foram adicionados aos HTMLs; apresentação original, Andréa, motor de estudo, Cartão e Sophia não foram removidos. As imagens/copy anteriores ficam em “Ver a apresentação anterior”. Os números 80+/48 vêm do briefing do projeto e são qualificados como repertório de referências, sem nomes/endosso/acreditação nem promessa de resultado; inventário auditável é necessário para uso comercial fora do protótipo.

Backup anterior a qualquer alteração: `cartao-approved-before-onboarding-88ab4eb`, apontando a `88ab4eb`. Branch: `onboarding-trilha-capa`. Os arquivos não relacionados em `patch/` foram deixados intactos e não entraram nestes commits.
