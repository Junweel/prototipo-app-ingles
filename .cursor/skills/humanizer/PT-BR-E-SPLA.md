# Humanizer no SPLA: notas locais

`SKILL.md` e `LICENSE` nesta pasta são cópias sem alteração de
[blader/humanizer](https://github.com/blader/humanizer) (v3.1.0, commit 8c307f3),
licença MIT, Copyright (c) 2025 Siqi Chen. A lista de padrões vem da página
[Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (WikiProject AI Cleanup).

## Português do Brasil

Para texto em português, consultamos também
[mackswendhell/humanizer-pt-br](https://github.com/mackswendhell/humanizer-pt-br)
(MIT, Copyright (c) 2026 mackswendhell), uma adaptação para o pt-BR. Não copiamos o arquivo;
usamos como referência, com cuidado:

- Úteis: palavras de alerta em português ("cabe ressaltar", "nesse sentido", "no que tange a",
  "crucial", "vibrante"), gerúndio no fim da frase ("destacando…", "garantindo…"),
  paralelismo negativo ("não é só X, é Y"), conclusões genéricas e otimistas.
- Não seguimos: os conselhos de "permitir alguma desordem" e "honestamente…" como abertura
  (o próprio blader v3 marca isso como sinal de IA); a lista trata palavras comuns
  ("essencial", "complexo", "fundamental") como sinal em qualquer uso, o que é exagero.

## Regras da casa (SPLA)

1. Mesmo sentido, nada inventado. Nenhum número, data ou fato novo.
2. Tom honesto, sem promessa de milagre. Um "não é X, é Y" fica quando corrige uma crença real
   do aluno (ex.: "C2 não é falar como nativo"; "a Paulista é o horizonte, não uma promessa").
3. Inglês falado para A2–B1: o nível manda. Palavra comum vale mais que expressão rara.
   Contrações sim; "um/uh/like" como muleta não (confunde o aluno e a voz).
4. Travessões em notas de pronúncia ("cúdja" — /ˈkʊdʒə/) e assinaturas ("— Teacher Lili") ficam.
5. O bloco "SOUND HUMAN" nos prompts da Sophia (`sophia-ao-vivo/index.html`, SYS e SYS_CONV)
   é a versão falada destas regras. Custo: ~300 tokens de entrada por turno, nenhuma chamada extra.
