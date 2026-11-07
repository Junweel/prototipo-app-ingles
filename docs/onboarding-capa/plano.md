# Primeira visita e retorno direto à trilha

Backup: `cartao-approved-before-onboarding-88ab4eb` (88ab4eb). Camada aditiva sobre Andréa + Cartão Paulista; nenhuma atividade ou rota removida.

## Desenho e critérios
- Visitante: necessidade concreta (ter espaço para falar na próxima reunião), depois método humano → voz com IA → progresso → identidade/coletivo. Sem personagem no hero; a utilidade é protagonista. Os personagens permanecem no onboarding e no ensino. Sem promessa de fluência, prazo, endosso ou acreditação. Números 80+/48 contextualizados como referência do projeto, não prova de eficácia da plataforma.
- Primeiro cadastro: onboarding/teste/turma/plano existentes → configuração com plano confirmado, ingresso voluntário na liga demonstrativa e upload local do logo → concluir e ir à trilha. Dados gravados no escopo v6/teste. Flag só nasce após concluir requisitos; não inferir conclusão só porque há nome salvo.
- Retorno: flag concluída + abertura sem rota ou na capa → Praticar. Deep links explícitos continuam funcionando. `?novo=1` mostra primeira visita sem apagar nem substituir a conta. Rever em Perfil tem atalhos para todas as etapas, apresentação anterior e opção de reiniciar apenas a introdução, preservando Capital, atividades e Cartão. Reset completo Andréa continua no local original.
- Falha de armazenamento: informar que retorno automático depende deste navegador; não dizer concluído sem persistência.
- Migração: perfis anteriores sem flag não serão apagados nem considerados novos; `Já tenho conta` abre trilha quando há perfil/dados de estudo e oferece finalizar configuração no Perfil. Não inventar que upload/adesão já ocorreram.

## Plano de verificação
Teste antes da implementação deve falhar por ausência da nova capa/flag. Validar primeiro cadastro real (nome, plano, ingresso, arquivo, concluir), recarga, retorno teste/v6, deep links, ?novo=1 sem perda de dados, revisão pelo Perfil e reset não destrutivo. Suíte anterior de identidade, fluxo real de prática, edição e Sophia preservada. Capturas 390×844: capa, retorno na trilha e revisão no Perfil em ambos ambientes. Publicar main e verificar Pages/HTTP/browser nos URLs reais.
