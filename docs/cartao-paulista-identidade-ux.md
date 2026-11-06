# Cartão Paulista: identidade do aluno no app inteiro

**Implementação:** `cartao-identidade.css` e `cartao-identidade.js`, compartilhados por `/v6/` e `/teste/`.
**Backup anterior:** tag anotada `andrea-approved-cartao-9bad624`, apontando ao commit original `9bad624`.

## Direção

O Cartão deixa de ser uma configuração escondida e passa a responder “quem sou eu”, “onde estou”, “o que fiz” e “qual é o meu próximo passo”.

| Área | Nova hierarquia | O que foi movido, não removido |
|---|---|---|
| **Hoje** | Cartão com avatar 3D, foguinho, status, nível, divisão e camiseta da empresa → uma ação principal → Onde estou / O que fiz → Forecast → secundários recolhidos. | Personagens e atalhos ficam em “Atalhos e visão do método”, incluindo o acesso ao material original do método; o lembrete e a home original permanecem acessíveis; os character chips continuam na home original. Liga, selos e Capital em “Minha liga, conquistas e selos”. Personalização e lembrete original em “Conteúdo original e personalização”. Rota, Capital, progresso e comunidade continuam navegáveis. |
| **Praticar** | Mini-Cartão fixo e trilha serpenteada: concluído em verde dessaturado; atual destacado; próximos atenuados. | Missões, Sophia livre, Erick, podcast, cards, gramática e ferramentas em “Atividades extras…”. Os nós abrem as rotas originais `d-warm`, `d-ouvir`, `d-trail`, `d-call` e `d-close`. |
| **Comunidade** | Identidade compacta também em participantes (inclusive Lucas A.) de Desafio/Salas. Liga fictícia com logos, duelo e squad; cada pessoa traz foto 3D, foguinho, nível, função, status e camiseta. Filtros Nexa/Órbitas/Atlasul. | Posts de Marina, Rafael e Patrícia, textos, `(exemplo)` e reações permanecem abertos. Sophia aparece primeiro, sinalizada como IA, sem inventar empresa humana. Ofensiva e nota de exemplo ficam em “Ofensiva da equipe e informações”. Grupos, ligas, desafios e regras ficam em “Explorar comunidade”. Não há DMs/comentários. |
| **Perfil** | Cartão aprovado no alto, scrollável; Editar, Status, Divisões e Liga funcionam dentro do próprio Perfil. | Sophia, memória, Lili, ofensiva, privacidade, dados, plano, marca e contato abaixo. A entrada antiga ainda leva ao Cartão. Nenhuma rota foi removida. |

Marina Costa nos mockups, os participantes e a empresa Nexa Logística são dados fictícios de demonstração, não dados reais. `/v6/` mantém Joël; `/teste/` usa o nome salvo no onboarding. A edição e a foto escolhida no Cartão persistem e se propagam para Hoje/Praticar. Empresas e placares são explicitamente fictícios.

## Princípios de UX

### Divulgação progressiva, sem excluir recursos

O Home mostra identidade e próxima ação antes de informações secundárias. Liga, selos, atalhos e método ficam em `<details>` explícitos. A Lili dá voz ao CTA, sem criar ação concorrente. Onde o aluno precisa decidir, o botão dominante é único; opções avançadas reaparecem sob demanda.

### Estado inacabado e retomada simples

A trilha mostra atividades concluídas e o próximo passo usando `mergeTest.today().steps` — o estado real do motor original, sem expor funções internas da closure. “Continuar sessão” retoma a etapa atual. Bloqueios orientam; não falsificam certificação. Pode-se rever qualquer etapa e seguir para atividades extras.

O briefing cita Zeigarnik. A literatura recente não confirma universalmente a memória favorecida por tarefas inacabadas, mas encontra tendência de retomá-las. Por isso, a implementação usa **estado visível de retomada**, não “Zeigarnik garante engajamento”.

### Goal-gradient com métricas honestas

A barra 0–4, checks, Capital e ofensiva vêm dos estados já salvos pelo app (`capitalOf()`/`streakInfo()`), não de ilusões de porcentagem. Forecast é objetivo do protótipo, nunca promessa de tempo ou nível; competições, divisões e company chips externos são rotulados exemplos.

### Hierarquia visual e identidade consistente

Navy, creme, amarelo, verde, moldura de divisão, logos, Space Grotesk e avatares 3D refletem os mockups aprovados. Estados usam cor **e** texto/ícone (`✓`, “sua vez”, 🔒). Apenas o nó atual pulsa suavemente; `prefers-reduced-motion` o desativa. A versão em miniatura preserva identidade em Praticar sem competir com a atividade.

## Arquitetura e preservação

- Uma reorganização estrutural inicial preserva os nós e handlers originais, agrupando os acessos em disclosures; não exclui atividades. A camada não substitui `ST`, roteador, Capital, método em ciclo, Sophia ao vivo, Podcast ou Lili.
- As cinco telas de `cartao-paulista/` continuam sendo a fonte dos layouts aprovados, reutilizadas por iframe escalado no Perfil.
- `/teste/` usa prefixo `teste_` nos dados novos. `teste_perfil`, `teste_rotinaState` e `teste/sophia-ao-vivo/` não são reescritos.
- Ações “Perfil” dentro do iframe retornam ao Cartão embutido, em vez de saltar para o Profile antigo.
- Extras, revisões, pause e voltar continuam seguindo o roteador original.

## Referências consultadas

1. Nielsen Norman Group, [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): controles importantes primeiro; complexidade opcional posterior com boa “information scent”.
2. NN/g, [Hick’s Law: Designing Long Menu Lists](https://www.nngroup.com/videos/hicks-law-long-menus/) e [Simplicity Wins over Abundance of Choice](https://www.nngroup.com/articles/simplicity-vs-choice/): as escolhas aumentam esforço; agrupar opções e limitar concorrência.
3. [_Interruption, recall and resumption: a meta-analysis of the Zeigarnik and Ovsiankina effects_](https://www.nature.com/articles/s41599-025-05000-w), 2025: retomada mais consistente que o suposto efeito universal de memória Zeigarnik.
4. Cheema & Bagchi, [_The Effect of Goal Visualization on Goal Pursuit_](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1732748): objetivo próximo visualizável pode apoiar esforço/comprometimento.
5. Conrad et al., [_The impact of progress indicators on task completion_](https://pmc.ncbi.nlm.nih.gov/articles/PMC2910434/) e [meta-análise de 32 experimentos](https://dl.acm.org/doi/10.1177/0894439313497468): barras não garantem conclusão. Dai et al., [_Resting on Laurels_](https://people.duke.edu/~dandan/webfiles/PapersOther/Resting%20on%20Laurels.pdf): submetas podem gerar complacência. Não artificialmente inflamos o progresso.

## Verificação executada

- Chromium, viewport **390 × 844px**, em `/v6/` e `/teste/`, por contextos isolados de armazenamento.
- **54 telas legadas diretas em cada variante**, mais as duas entradas de Sophia (`d-call` e `m-talk`). O teste abre o iframe aprovado; não simula nem declara uma conversa de IA com áudio concluída.
- Fluxo real de prática: três cartões do aquecimento, duas perguntas e cinco prompts do episódio, seis exercícios da trilha e entrada na Sophia, nos dois ambientes. O estado visual acompanha `mergeTest.today().steps`.
- Comunidade: feed aberto, primeira identidade humana no viewport inicial, três Cartões fictícios, filtros e reação original clicada; sem overflow horizontal.
- Perfil: Status, Editar, nome/empresa, fotos/logos, persistência, propagação para Hoje e controles acessíveis dentro dos iframes escalados; preferências originais permanecem acessíveis.
- Reinício `/teste/` volta ao onboarding e apaga os dados prefixados dessa versão. Sem overflow horizontal da página; carrosséis internos mantêm scroll explícito.
- Console sem erros e sem respostas HTTP de erro nas rotas verificadas. O rig ao vivo permanece isolado nas rotas originais; não foi alterado.
- Capturas em `docs/evidencias-cartao-identidade/`, incluindo trilha composta explicitamente para demonstrar concluído/atual/bloqueado. Esse estado de captura não substitui os testes do fluxo original.

## Escopo das capturas

390px em ambos `/v6/` e `/teste/`; evidências das quatro abas, da trilha completa e do antes/depois da Home. Dados das empresas, disputas, divisões, selos e avatares são explicitamente ilustrativos. As estatísticas locais (Capital, On Track e foguinho) são atualizadas no Cartão; os demais números de conquistas são rotulados “exemplo”.

## Como repetir

Com `python3 -m http.server 8765 --bind 127.0.0.1` na raiz, execute em Playwright Python `patch/verify_identity_smoke.py`, `verify_identity_interactions.py`, `verify_practice_flow.py`, `verify_legacy_navigation.py`, `verify_identity_final_layout.py`, `verify_native_graphical_route.py`, `verify_context_identity.py` e `capture_identity.py`. `VERIFY_ORIGIN` permite apontar para produção. Todos usam armazenamento isolado no navegador de automação; dados do usuário não são alterados.
