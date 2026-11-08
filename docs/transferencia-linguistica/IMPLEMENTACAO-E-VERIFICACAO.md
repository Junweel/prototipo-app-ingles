# Transferência Linguística — implementação e verificação

Implementação do desenho aprovado em 07/11/2026 (America/Sao_Paulo), aditiva à base Andréa e ao Cartão Paulista.

## Onde está
- Praticar → nó “Praticar na trilha” → ramo opcional “Transferência Linguística”.
- Praticar → Extras, revisão, missões e caixa de ferramentas → aula extra.
- https://junweel.github.io/prototipo-app-ingles/v6/?transfer=20261107#transferencia-linguistica
- https://junweel.github.io/prototipo-app-ingles/teste/?transfer=20261107#transferencia-linguistica
- https://splacademy.com.br/metodologia/?transfer=20261107#transferencia-linguistica
- https://splacademy.com.br/en/?transfer=20261107#transferencia-linguistica

## O que foi entregue

Módulo escopado `transferencia-linguistica.js/.css`; screen reconhecida pelo roteador existente em ambas as variantes. Cartão compacto com avatar/divisão, fogo, nome, empresa/logo, status, nível e Capital reais do motor local. Quatro partes: Pontes (três famílias e exceções), Armadilhas (quatro falsos amigos), Som (explicações e drills existentes) e Use (produção em situação nova). Pista opcional, tentativa antes do modelo, comparação orientada explicitamente **não** apresentada como correção automática. Conclusão marca realização da prática, não domínio.

Estado `spla_transfer_v1` / `teste_spla_transfer_v1`: parte, rascunhos, tentativas, uso de pista e conclusão. Retomada após recarregar, revisão sem apagar tentativas, isolamento entre variantes, recuperação de registros malformados e aviso de quota. Não altera dados anteriores ou cria recompensa nova.

O ramo opcional fica dentro do nó de Trilha 2b; os cinco nós originais e a sequência de quatro etapas da sessão permanecem. A indicação do ramo fica verde com check ao concluir. Nada foi movido ou retirado. Há retorno explícito à aula nos drills existentes de bed/bad e -ed (delayed); ship/sheep é explicado sem alegar que já exista um drill completo dessa dupla. Treinos demonstrativos continuam rotulados como exemplo.

Não há novo diálogo nesta aula: **nenhum arquivo de áudio aprovado foi alterado**. Os sete episódios, exercícios, “Com legenda”, sincronização e vozes Andrew/Jenny continuam no motor já aprovado.

## Site

Fontes: `/workspace/site-spla/src/pages/pt-BR/metodologia.html` e `src/pages/en/home.html`. Como o site inglês anterior só tinha uma home “coming soon”, a seção EN foi acrescentada nela sem apagar o placeholder aprovado. Gerador e assets inalterados; prévia e produção geradas nos modos existentes. CNAME preservado byte a byte.

Publicação do site: `401dd449749af627a286ce1ecde55d30ec81de4b` em `Junweel/splacademy-site`; apenas `metodologia/index.html` e `en/index.html` mudaram no Git tree. O CTA foi publicado depois da aula já ter passado no teste público. O conteúdo anterior das duas fontes foi integralmente preservado. Demais arquivos de produção idênticos ao backup.

Odlin apenas na bibliografia com autor, título, editora, ano e DOI. Sem foto, membro, parceria ou endosso. Claim mantido em **48 pesquisadores / mais de 80 métodos**. Nenhum e-mail enviado; o rascunho anterior continua apenas no box.

## Testes executados

- `patch/verify_transferencia.py`: ramo, produção/pistas/modelos, retorno de drill, conclusão, reentrada, isolamento e layout 390px, nas duas variantes.
- `patch/verify_transferencia_edges.py`: registro corrompido, texto escapado, rascunho/reload, divulgação do modelo só após tentativa e erro de armazenamento.
- Preservação completa de onboarding, retorno direto à trilha, identidade, edição/upload, comunidade, chamadas e prática.
- Rotas: lista congelada dos **54 IDs originais** em `patch/legacy-route-ids.json` + uma nova aula; todas navegáveis, com duas integrações de chamadas por variante.
- Sete episódios e quatro áreas legadas de conversação com MP3 real; trechos, perguntas, reprodução lenta, legenda e dica “cúdja”.
- **298 URLs de MP3** públicas verificadas por SHA-256, todas correspondentes aos arquivos aprovados.
- Site: 390px/1280px em PT/EN, sem overflow, erros JS ou assets faltantes; CTA aberto até a aula efetiva; HTML servido no domínio oficial comparado byte a byte ao build.
- Sem afirmar teste em telefone físico ou validação de eficácia da nova aula.

## Evidências

Capturas e logs no box: `/workspace/transferencia-odlin/capturas/` e `live-preservacao.txt`. Incluem abertura e conclusão da aula, falso amigo, ramo concluído e seção/referência do site em mobile/desktop. `site-publicacao.json` registra o commit do site.

Backups remotos anteriores: `before-transferencia-odlin-9afd282` (protótipo) e `before-transferencia-odlin-d69c69b` (site). Arquivos locais anteriores e checkpoint documental em `/workspace/transferencia-odlin/backups/`.

É suficiente reabrir o link com query nova ou recarregar a aba para receber o módulo versionado. **Não limpar localStorage/cadastro/progresso.**
