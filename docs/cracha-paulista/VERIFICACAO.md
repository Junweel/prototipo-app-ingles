# Crachá SPLA — publicação e preservação

## Commits e backups
- Protótipo funcional: `7dcaa57c8ca4963e13292500be663bff98ccc9ee`.
- Site: `4d51c483f4eb58c0a999e01342b7ce139bf851ca`.
- Tags remotas verificadas: `before-cracha-paulista-ccf38cb` e `before-cracha-paulista-401dd44`, apontando exatamente aos mains anteriores.
- Revisão final de contraste do cordão: cores corporativas preservadas; branco/navy/preto escolhidos por luminância linear sRGB e razão mínima de 4,5:1. O teste reproduziu letras brancas inadequadas em logo verde claro antes da correção e confirmou letras navy depois. Assets JS têm versão `20261108-2`.

## Publicado
- https://junweel.github.io/prototipo-app-ingles/v6/?cracha=7dcaa57#home
- https://junweel.github.io/prototipo-app-ingles/teste/?cracha=7dcaa57#practice
- https://splacademy.com.br/?cracha=4d51c48#cartao-paulista
- https://splacademy.com.br/en/?cracha=4d51c48#paulista-badge

## O que mudou
Identidade agora é Crachá SPLA; inglês SPLA Badge. Pequena fenda e cordão impresso com logo/nome repetidos e cores extraídas da empresa em Hoje, Praticar, Comunidade, participantes de desafios/salas, Perfil e identidade compacta da aula extra. O editor e o cadastro convidam a vestir a camisa da empresa, sem nova moldura de consentimento. O cordão acompanha mudanças reais de nome/logo; o teste de upload confirmou verde `rgb(24,192,96)` no lugar de um cordão fixo.

IDs, rotas, CSS e chaves de dados legados não foram migrados. Cartões didáticos continuam cartões. Preservados os cinco frames, botões/edição/status/uploads, onboarding, personalização, Sophia/Lili/calls, trilha, Capital, Transferência Linguística e notas científicas.

## Evidência executada nas URLs públicas
- Suíte completa em ambas as variantes: onboarding inicial/retorno/revisão/reset, isolamento, 55 telas diretas e abertura dos dois contextos de chamada, fluxo aquecimento → episódio → seis exercícios → iframe Sophia, preferências, empresa/reações, status e uploads reais, sem erro JS ou overflow mobile.
- Sete episódios e quatro conversas legadas; Ouvir/Perguntas/Pegue o trecho/Com legenda/velocidade e dicas `cúdja` preservados. Os 298 MP3 públicos conferem SHA-256 com o manifesto aprovado (8.871.032 bytes). Nenhum áudio regenerado/modificado.
- 37 notas de atividade por variante e 18 referências bibliográficas exatas preservadas, além da nota original Odlin e notas das chamadas.
- Site PT (home, como estudar, empresas) e EN: Chromium 390/1280px; interação anterior de revelação/carrossel também em 768/1440px; previews reais carregados, sem overflow/erros JS. Metodologia e referência bibliográfica Odlin mantidas; alegação de 48 pesquisadores não alterada.
- 42 arquivos publicados do site + CNAME conferidos byte a byte com build local; nenhuma exclusão e todas as imagens antigas conservadas. Novas 30 versões AVIF/WebP `cracha-*` substituem apenas as referências de apresentação. HTML/JS/CSS-chave do protótipo também conferidos byte a byte.
- Ambos os jobs Pages dos commits funcionais concluíram com sucesso.

## Capturas públicas (Chromium, 390px)
Diretório `/workspace/cracha-paulista/capturas/`:
- `v6-home.png`, `v6-practice.png`, `v6-community.png`;
- `teste-home.png`, `teste-practice.png`, `teste-community.png`;
- `site-pt-home-390.png`, `site-pt-home-badge-390.png`;
- `site-en-390.png`, `site-en-badge-390.png`.

Logs: `/workspace/cracha-paulista/verificacoes/`. Fontes locais e documentação de grokia-base/marketing/REQUISITOS atualizadas; delta reproduzível e manifesto em `/workspace/cracha-paulista/fontes-documentacao-atualizados.tar.gz` e `fontes-documentacao-manifesto.json`. O repositório remoto do site contém a saída estática; fontes/build/testes seguem em `/workspace/site-spla` e nesse arquivo, conforme sua organização anterior.

Limites: Chromium automatizado, não aparelho físico. Não foi iniciada chamada real de IA nem alegado teste de voz em iOS/Android. O cache foi contornado nas verificações e os includes alterados têm versões novas; os dados locais anteriores continuam nas mesmas chaves.


> Atualização de contagem (t352u, 08/11/2026): a comunicação vigente usa **300+ autores citados / 150+ publicações com DOI**. É o tamanho conservador da bibliografia (156 DOIs), não número de métodos, integrantes de banca ou estudos de validação SPLA. O antigo 48/80+ é histórico. Ver `docs/bonus-paulista/REFERENCIAS-E-CONTAGEM.md` (protótipo) e o adendo do dossiê 01. Nomes somente em referências bibliográficas, sem participação ou endosso.
