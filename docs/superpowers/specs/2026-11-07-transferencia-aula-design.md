# Proposta de desenho — aula Transferência Linguística

**Estado: rascunho para revisão e aprovação antes de implementar.** A inclusão do tema foi aprovada; esta proposta define a nova experiência. Ainda não há nova rota publicada. Fontes: [pesquisa Odlin](../../transferencia-linguistica/ODLIN-EVIDENCIAS.md).

## Alternativas e recomendação
1. **Ramo adicional da trilha (recomendado):** aula autônoma junto ao foco na forma (Trilha 2b), também alcançável nas atividades extras. Preserva a sessão diária e sua sequência, sem bloquear quem já avançou.
2. Inserir uma nova etapa obrigatória na sessão: maior exposição, mas muda duração, progresso e critérios de conclusão; não recomendado sem validação.
3. Só artigo na biblioteca: menor risco, mas não atende bem ao pedido de uma aula visível na trilha.

## Experiência proposta

Nova rota planejada `#transferencia-linguistica`, reusando o shell de aula, tipografia, cartões, navy/creme/amarelo/vermelho e piso paulista. Cartão Paulista compacto acima da atividade; navegação de volta à trilha. Nada de novo mascote ou personagem na abertura.

Quatro partes com um CTA principal por vez e divulgação progressiva:
1. **Pontes:** famílias -ção/-tion, -dade/-ty, -mente/-ly; exemplos e uma exceção sempre juntos. Tentar produzir uma palavra/frase antes de mostrar o modelo. Ver os exemplos completos no dossiê.
2. **Armadilhas:** quatro intenções de uso: corrigir a data da reunião (actually), anunciar um plano (plan/intend versus pretend), orientar na porta (push/pull), pedir livro emprestado (library/bookstore). Entrada textual com rótulo acessível; “Ver pista” secundário. Registrar primeira tentativa, tentativa com pista e modelo separadamente. Não aceitar reconhecimento por clique como evidência de produção.
3. **Som também transfere:** explicação da possível vogal extra no final, contraste ship/sheep e -ed; links para os drills existentes, com retorno à aula. Não inventar uma nova avaliação de pronúncia nem apresentar duas vozes neurais como HVPT de cinco falantes.
4. **Use em uma situação nova:** duas frases curtas para explicar situação atual e plano de trabalho; comparação com modelos e autoavaliação. Não fingir correção por IA quando houver somente checagem local. Fechamento mostra prática concluída, não “nível conquistado”.

Pistas e modelos vêm de banco revisado. O sistema não deve fingir avaliar semanticamente frases abertas com mera igualdade de strings: respostas-modelo servem para comparação orientada; avaliação automática limitada precisa ser explicitamente rotulada. A conclusão indica ter realizado as atividades, não comprovação de domínio.

## Trilha e dados

Adicionar um nó/ramo sem remover os atuais. Atual = brilho, feito = estilo aprovado com check verde, futuro = esmaecido; respeitar movimento reduzido. Reentrada retoma a parte atual; conclusão fica visível e reabrível. Não alterar o critério atual de liberação das demais atividades.

Persistência exclusiva da nova aula: chaves com prefixos independentes para v6/teste, versão do conteúdo, parte atual, tentativas e conclusão. Corrupção deve reiniciar apenas a aula, não o perfil, fotos, logo, plano ou progresso anterior. Não modificar Capital, streak, critérios CEFR ou contagem da liga. Nenhum dado enviado a serviço externo novo.

## Áudio e atribuição

A proposta mínima não cria diálogo: explica e leva aos drills já existentes. Se a revisão pedir um diálogo, ele só pode ser publicado com MP3 reais por fala — Erick AndrewNeural/Ana JennyNeural — offsets reais, manifest/hashes e URLs versionadas, mantendo o player aprovado. Não usar fallback de voz única do telefone.

Fonte em acordeão bibliográfico: “Odlin, Terence. (1989). Language Transfer: Cross-linguistic Influence in Language Learning. Cambridge University Press.” Link do livro/DOI, sem foto, selo de parceria ou participação na banca. Exemplos são aplicações pedagógicas da SPLA. Não copiar Transfer English.

## Arquitetura e preservação

Módulo isolado de conteúdo/comportamento e folha de estilo escopada; integração mínima nas duas variantes, seguindo o roteamento e o componente de identidade existentes. Não refatorar o monólito por oportunidade. Antes de implementar, conferir backup `before-transferencia-odlin-9afd282` e ausência de mudanças concorrentes.

## Critérios de aceite verificáveis

- Falha inicial de teste: nova aula ainda não existe; depois fica acessível por clique da trilha, extras e deep link em ambas as variantes.
- 390 px sem overflow; teclado/labels e foco utilizáveis; fonte bibliográfica identificada; sem erros JS ou 404.
- Produção, pista, modelo, retorno dos drills, retomada e conclusão testados; isolamento v6/teste e perfil/progresso anterior preservados.
- Suíte de 54 rotas, onboarding, identidade, chamadas e áudio real continua passando.
- Áudio aprovado byte-a-byte intacto se não houver novo diálogo; “Com legenda” permanece.
- Publicar o protótipo primeiro; verificar a nova rota live e capturar as duas variantes antes de ativar CTA no site.

**Próximo checkpoint:** revisão do desenho pelo usuário. Não implementar antes desse checkpoint.
