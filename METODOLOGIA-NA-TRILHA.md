# Como a trilha aplica o método

Base: Método v1.3 (10 princípios, P1–P10), Proposta do app v1.2 (§4) e Arquitetura curricular v0.1 (Pre-A1 → C1). As peças novas da Rotina (podcast do Erick, Pegue o trecho, chamada ao vivo, cartões reais) **entram nas vagas que o método já tinha**. Nada foi tirado.

## Sessão diária (≈ 26 min, 4 etapas, sempre nesta ordem)

| Etapa · quem | Atividade | Pilar do método | Evidência registrada | Origem |
|---|---|---|---|---|
| 1 Aquecimento · Erick | Cartões vencidos: lembrar antes de ver (escuta → ditado; PT → EN) | P1 evocação, P2 espaçamento (1/3/7 dias), P3 intercalação | acertos de cabeça; data da próxima revisão | original (cartões reais: **novo**) |
| 2a Trilha · Erick | Episódio da unidade: 1ª escuta sem texto → 2 perguntas de sentido → **Pegue o trecho** → ouvir com letra | P4 input ≈ 95% conhecido, P8 chunks, P9 percepção da fala encadeada | perguntas certas; % de palavras nos trechos; trechos perdidos viram cartões | vaga original “Ouça a história” (Proposta §4.1); episódio em formato podcast: **novo** |
| 2b Trilha · Erick | Exercícios de forma e pronúncia com os alvos do dia | P7 gramática explícita curta, P6 pista antes da resposta, P9 inteligibilidade | 1ª tentativa vs. depois da pista | original |
| 3 Bate-papo · Sophia | Tarefa com objetivo (mesmo tema e alvos); pista primeiro nos alvos, recast no resto, no máx. 3 correções ao vivo | P5 tarefas, P6 feedback | falas, minutos, erros → cartões | original; **chamada de vídeo com a Sophia (padrão): novo**; simulação em texto continua como “modo texto / sem microfone” |
| 4 Fechamento · Teacher Lili | O que deu certo, 3 pontos para revisar, autoavaliação do can-do (1–4), Capital, o que volta amanhã | P10 medir, motivação | autoavaliação; Capital do dia | original (resumo com dados reais: **novo**) |

## Semana

| Atividade | Pilar | Evidência | Origem |
|---|---|---|---|
| Fala relâmpago 4/3/2 (2–3 dias) | fluência (Nation, 4ª vertente) | tempo e hesitação | original |
| Checkpoint semanal · Teacher Lili (sexta, ~10 min, 3 tarefas) | P10 medir, retenção D+7 | dias com sessão, média de escuta, trechos que mais voltaram, +60 Capital | original (faixa da semana real: **novo**) |
| Episódios extras e treino focado do episódio | trilho extra de input (grátis, sem limite) | cartões de escuta | **novo** |
| Missão final da unidade | 3 evidências para subir de subnível | rubrica ≥ 2/3, retenção ≥ 80% D+7, checkpoint | original |

## Capital e times (regras do Capital, sem mudança)

- Sessão completa (4 etapas) **+80** · conversa com a Sophia **+20** · revisões no dia do vencimento **+20** · missão/can-do **+40** · checkpoint semanal **+60** · teto **200/dia**.
- Errar ou usar pista **nunca** tira Capital. Episódio extra não dá Capital (é input livre).
- O Capital real deste navegador entra na Liga do time pelas mesmas regras: média por membro ativo.

*Os limiares são hipóteses a calibrar no piloto. Os dados reais ficam só neste navegador (localStorage).*

## Rota até a Paulista (níveis explicados para o aluno)

O nível do aluno (CEFR, Pre-A1 → C1 em 11 subníveis) aparece como uma rota que sobe do centro histórico até a Paulista: esquina Ipiranga × São João, a de “Sampa” (Pre-A1) → Av. São João · Anhangabaú (A1) → Av. Nove de Julho (A2) → Rua da Consolação (B1) → **Av. Faria Lima (B2, “inglês de negócios”)**, voltando ao alto pela Rebouças → Rua Augusta (C1) → Avenida Paulista · MASP (C2, horizonte além do curso). Cada subnível é uma parada com um marco (Martinelli, Theatro Municipal, Praça Roosevelt, Conjunto Nacional…); o “+” (A2+, B1+, B2+) é o fim da avenida, perto da esquina com a seguinte.

Onde a rota conversa com o método:

| Peça do método | O que alimenta na rota |
|---|---|
| Entrevista de nivelamento com a Sophia | parada inicial (fala e escuta medidas em separado) |
| Autoavaliação 1–4 no Fechamento com a Teacher Lili | marca os “consigo” da próxima parada |
| Checkpoint semanal (revisão D+7, mini-chamada) | evidência de que o “consigo” se mantém |
| Missão final da unidade (rubrica) | sobe de subnível quando há 3 evidências |
| Capital | **não** mede nível; mede esforço e constância |

No app: card no topo do Perfil, tela `#rota` (mapa + ficha de cada avenida), link na Trilha e chip no Hoje (“A2+ · Nove de Julho”). Detalhes, can-dos, horas aproximadas e fontes: [ROTA-NIVEIS.md](ROTA-NIVEIS.md).

## Como os personagens falam (Humanizer, v7.4)

A Sophia fala como uma pessoa numa chamada, não como um chatbot: reage ao que o aluno disse, usa contrações e faz uma pergunta por vez. Ficam de fora elogio genérico de abertura ("Great question!"), ofertas ("Want me to...?"), travessões, listas, trios e palavras infladas. Essas regras nunca passam por cima do método: vocabulário do nível, recast em vez de correção explícita, uma pergunta por turno e nenhuma promessa de resultado. Custo zero extra: são regras no prompt, sem chamada adicional. Regras adaptadas de [blader/humanizer](https://github.com/blader/humanizer) (MIT, © 2025 Siqi Chen), a partir de [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing); notas para pt-BR em [.cursor/skills/humanizer/PT-BR-E-SPLA.md](.cursor/skills/humanizer/PT-BR-E-SPLA.md), com crédito a [mackswendhell/humanizer-pt-br](https://github.com/mackswendhell/humanizer-pt-br) (MIT).
