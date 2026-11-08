# Primeira visita e retorno direto à trilha

Backup: `cartao-approved-before-onboarding-88ab4eb` (88ab4eb). Camada aditiva sobre Andréa + Crachá Paulista; nenhuma atividade ou rota removida.

## Desenho e critérios
- Visitante: necessidade concreta (ter espaço para falar na próxima reunião), depois método humano → voz com IA → progresso → identidade/coletivo. Sem personagem no hero; a utilidade é protagonista. Os personagens permanecem no onboarding e no ensino. Sem promessa de fluência, prazo, endosso ou acreditação. Números 80+/48 contextualizados como referência do projeto, não prova de eficácia da plataforma.
- Primeiro cadastro: onboarding/teste/turma/plano existentes → configuração com plano confirmado, ingresso voluntário na liga demonstrativa e upload local do logo → concluir e ir à trilha. Dados gravados no escopo v6/teste. Flag só nasce após concluir requisitos; não inferir conclusão só porque há nome salvo.
- Retorno: flag concluída + abertura sem rota ou na capa → Praticar. Deep links explícitos continuam funcionando. `?novo=1` mostra primeira visita sem apagar nem substituir a conta. Rever em Perfil tem atalhos para todas as etapas, apresentação anterior e opção de reiniciar apenas a introdução, preservando Capital, atividades e Crachá. Reset completo Andréa continua no local original.
- Falha de armazenamento: informar que retorno automático depende deste navegador; não dizer concluído sem persistência.
- Migração: alunos com etapas/atividade já registradas na versão anterior abrem direto em Praticar, inclusive Andréa; isso não fabrica a flag de cadastro nem considera adesão/upload feitos. Perfis só com nome também podem usar “Já tenho conta” para retomar. Configuração faltante é indicada no Perfil. Nada é apagado.

## Plano de verificação
Teste antes da implementação deve falhar por ausência da nova capa/flag. Validar primeiro cadastro real (nome, plano, ingresso, arquivo, concluir), recarga, retorno teste/v6, deep links, ?novo=1 sem perda de dados, revisão pelo Perfil e reset não destrutivo. Suíte anterior de identidade, fluxo real de prática, edição e Sophia preservada. Capturas 390×844: capa, retorno na trilha e revisão no Perfil em ambos ambientes. Publicar main e verificar Pages/HTTP/browser nos URLs reais.

## Decisão criativa / personagens
Foram consideradas: (A) abrir com turma/mascotes; (B) abrir com uma situação real de trabalho e demonstração de voz; (C) abrir com placar/competição. Foi adotada B: necessidade antes do produto (Lasker), razão concreta para estudar e prova de funcionamento, sem apresentar status fictício como evidência de aprendizagem. A/C competiriam com essa mensagem e já estão presentes nas etapas próprias do app. A capa não usa personagens; a turma original continua inteira em “Conheça a turma” e na apresentação anterior, acessível pelo Perfil. Isso é hipótese de clareza/conversão, não resultado medido. Validar por entendimento da proposta e início/conclusão voluntária do cadastro, não só cliques.

## Preservação e detalhes de implementação
- Apenas dois includes são acrescentados a cada HTML: resolução de entrada antes do roteador e camada visual depois do Crachá. Onboarding/teste/turma/plano continuam nos mesmos IDs e mantêm componentes/handlers originais. Capa original com imagens preservada dentro de `#pa-original`, disclosure da nova apresentação.
- `spla_onboarded_v1` registra `completed`, versão, plano e liga só depois de confirmar e salvar plano+adesão+logo. Os dados usam namespace já aplicado por Andréa em `/teste/`; não há login de servidor ou compra.
- O logo é salvo em `cartaoPaulista.logo` e no buffer `cpLogo` usado pelo editor aprovado. Teste específico prova que o logo do cadastro sobrevive a editar/salvar nome pelo Crachá.
- `?novo=1` e “Rever apresentação” não limpam nem substituem dados automaticamente. O reset da introdução remove somente a flag. Reset total Andréa mantém seu fluxo e isolamento originais.
- Todos os recursos de Hoje, Praticar, Comunidade, Perfil, método, Lili, Sophia, calls e cinco telas Crachá permanecem. O novo painel de configuração é local; não envia adesão para serviço externo.
- 80+ métodos e 48 pesquisadores são apresentados como repertório/referências do projeto informado no briefing, sem nomes, endosso, acreditação ou eficácia validada da plataforma. Não foi criada uma certificação, promessa de resultado ou prazo. Exigir inventário auditável antes de reutilizar os números numa campanha comercial fora do protótipo.

## Verificação local
- Teste novo falhou antes da implementação (capa inexistente); fluxos de cadastro/retorno passaram nas duas variantes após a camada aditiva.
- Teste de migração falhou antes de reconhecer histórico; teste adicional detectou perda de logo na edição aprovada e passou após compatibilizar `cpLogo`.
- Novos testes: `patch/verify_primeiro_acesso.py`, `verify_primeiro_acesso_edges.py`, `verify_primeiro_acesso_quality.py`. Exercitam cadastro real na UI, arquivo, retorno sem hash, replay, reset não destrutivo, conta legada, deep links, storage compartilhado/isolado, arquivo inválido, reduzido movimento, assets/console e 390px.
- Suíte Andréa/Crachá: smoke, edição/uploads, reset, 54 rotas por variante, cinco Crachás, navegação Sophia, contexto comunidade e fluxo real do aquecimento/episódio/seis exercícios até o iframe Sophia. Não declarado teste de conversa ao vivo com áudio e IA concluído.
- `patch/capture_primeiro_acesso.py` gera capturas 390×844 após concluir cadastro e aquecimento na UI original, em navegador isolado. Não injeta etapas “feitas”; screenshot de retorno usa URL sem hash. Evidências em `docs/onboarding-capa/screenshots/`.
