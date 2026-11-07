# Diálogos com duas vozes reais — correção definitiva do player

## Causa e rastreamento

A correção anterior só escolhia vozes do aparelho e variava pitch. Um aparelho com uma voz feminina continuava sem uma voz masculina real. Os testes com catálogos simulados não comprovavam o áudio ouvido por Joël.

Foi rastreada a rota publicada `/teste/index.html#d-ouvir`: `PL.mode = speech`, `PL.audio = null`, duração estimada **65,38 s (1:05)**, nenhuma requisição MP3/WAV e nenhum service worker registrado no contexto limpo. O repositório também não continha MP3 de diálogos nem registro de service worker. Não havia um MP3 oculto para simplesmente substituir. O outro caminho anterior era Azure por fala, dependente da configuração local. A sessão física de Joël não foi inspecionada; o rastreamento e a arquitetura demonstram por que a solução anterior não garantia duas vozes.

Evidência: `source-trace-before.json`. O novo player usa arquivos reais, independentes do catálogo de vozes, Azure ou configuração do telefone.

## Implementação

- Fonte aprovada preservada em `audio/dialogues/source.json`: sete episódios, falas/trechos e frases de treino, Room 512, chat do hotel, simulação diária, transcrição e role-play de Mark.
- Gravação neural real por fala com `edge-tts`; Erick/aluno demonstrativo = **en-US-AndrewNeural**, Ana = **en-US-JennyNeural**. Kate/Ava, Priya/Aria, Marcus/Brian, Laura/Emma, Tom/Eric, Sophia/Aria, Lili/Ava, Mark/Christopher. Todos en-US. Nenhuma modificação artificial de pitch.
- Conversão a PCM mono 24 kHz, corte apenas de silêncio nas bordas, concatenação com FFmpeg e pausas de 160 ms (mesmo personagem) ou 260 ms (troca), codificação MP3 64 kbps.
- `manifest.json` contém voz, texto, SHA-256, início e fim de **cada fala**, medidos em amostras PCM. O relógio da letra, seek e replay lento usam esses offsets reais, não estimativas de palavras.
- Ouvir/Perguntas/Pegue o trecho/Com letra compartilham a gravação do episódio. “Só o trecho”, modelos, treino focado e revisões roteirizadas usam clipes reais com o personagem correto. A explicação e a fala “Could you sounds like cúdja” não foram removidas nem reescritas.
- As saudações do áudio demonstrativo são neutras; o nome personalizado de Andréa/Joël continua no texto. Isso evita chamar outro aluno pelo nome de uma pessoa fictícia.
- Corrigido também o conflito entre controles de players ocultos: navegar da sessão diária para a biblioteca e voltar agora vincula apenas o player ativo.
- As conversas antigas também ganharam reprodução real: `#input`, `#chat~texto`, `#m-talk~texto` e exemplo em `#d-transcript`. As demonstrações são identificadas como gravações sintéticas, **não como voz gravada do aluno**. Chamadas reais com Sophia, microfone e todas as funções aprovadas foram preservados; não se pré-gravam respostas futuras da IA nem a voz real do usuário.
- Se o arquivo falhar, o player informa o erro e permite tentar novamente; não troca silenciosamente para a voz feminina do aparelho. Play não depende de o iOS permitir preload antes do toque.

## Cache e como abrir

Arquivos novos em `audio/dialogues/20261107-neural-v1/`, scripts com versão e marcador `data-recorded-version` no player. A interface exibe **“Áudio gravado · Erick: voz masculina · Ana: voz feminina”**.

O cache Azure antigo `erick-tts-v1` não participa mais dos episódios. Sua versão de fallback foi alterada para `erick-tts-v2-neural-assets`. Não foi inventado/adicionado um service worker apenas para “bump”: nenhum existia neste protótipo.

Reabra com `?audio=neural-v1#d-ouvir` para buscar uma página nova, ou recarregue a aba. **Não é necessário limpar localStorage, cadastro ou progresso.** Uma aba que já estava aberta precisa ser recarregada para executar o código novo.

## Evidências e reprodução

- `pitch-report.json` e `pitch-segments.csv`: F0 nas falas recortadas dos **MP3 finais concatenados**, por Praat/autocorrelação; frequência e duração não são mocks. F0 corrobora a separação, mas sozinho não identifica gênero/pessoa; as vozes e hashes de origem complementam a evidência.
- `ep0-sample-pitch.json`: conferência independente Praat/pYIN da amostra Andrew/Jenny.
- `audio-inventory.csv`: todos os MP3 emitidos, inclusive primeiros rascunhos mantidos para não perder trabalho, explicitamente marcados como **não referenciados**. Só o manifesto atual define o que o app toca.
- `tools/verify_audio_http.py`: verifica o manifesto e SHA-256 de todas as URLs ativas, não apenas o nome do arquivo.
- Testes novos usam o decodificador HTML Audio e arquivos reais. Nenhum WAV de tom sintético ou resposta de TTS simulada serve de prova desta correção. Os scripts de teste da solução anterior permanecem como histórico, mas suas expectativas de Web Speech foram superadas por estes testes de gravações.
- Ainda não se afirma escuta em um iPhone/Android físico. A compatibilidade usa MP3 com toque explícito no player; não depende da disponibilidade de vozes instaladas.

```bash
# Desenvolvimento: FFmpeg + ambiente com tools/requirements-dialogue-audio.txt
/workspace/.venv-dialogue-tts/bin/python tools/build_dialogue_audio.py
/workspace/.venv-dialogue-tts/bin/python tools/analyse_dialogue_pitch.py
python3 tools/inventory_dialogue_audio.py
VERIFY_ORIGIN=http://127.0.0.1:8765 python3 tools/verify_audio_http.py
# Trocar a origem pela URL pública para conferir o que foi realmente publicado.
```

Backup remoto anterior à alteração: **before-neural-dialogue-assets-c6deeab**. Branch de trabalho: `dialogos-audio-neural`.
