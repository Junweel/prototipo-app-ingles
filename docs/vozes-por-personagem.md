> Histórico: a seleção de vozes descrita abaixo foi superada pelos MP3 neurais reais. Veja [a correção definitiva](vozes-neurais/README.md).

# Vozes distintas por personagem

## Diagnóstico e mudança

O episódio não usa um MP3 único pré-gravado. Há dois caminhos existentes:

1. **Azure TTS**, quando já configurado no aparelho: sintetiza cada fala, guarda o MP3 em cache por região + voz + texto e monta um WAV com as durações decodificadas. Erick usa Andrew (alternativas Andrew/Guy); Ana, Emma; Kate, Jenny; Priya, Aria; Marcus, Davis; Laura, Sara; Tom, Tony. Esses timbres e o sotaque en-US foram preservados. Não houve necessidade de regenerar arquivos estáticos.
2. **Web Speech do aparelho**, quando Azure não está configurado/disponível: era possível usar a voz feminina padrão para Erick, e todo convidado recebia a seleção feminina — inclusive Marcus/Tom. A seleção também não aguardava a lista de vozes carregar.

`dialogue-voices.js` centraliza a política usada em `/v6/` e `/teste/`:

- seleção por personagem/gênero informado no episódio, nunca pela posição da fala;
- preferência por uma voz identificável adequada, depois en-US; convidados masculinos usam outra voz masculina quando disponível;
- aguarda o catálogo inicialmente vazio até 900 ms, com `voiceschanged` e consulta periódica compatível com Safari antigo; cada fala consulta o catálogo atual;
- deduplica as entradas do sistema; aceita localidades com hífen ou sublinhado;
- vozes identificáveis distintas mantêm o tom natural; catálogo insuficiente recebe contraste de tom e aviso explícito;
- Sophia e Lili têm políticas femininas; os botões antigos “Modelo da Sophia” e replay do chat foram explicitamente associados à Sophia, sem mexer no motor da chamada ao vivo;
- opção **Vozes do diálogo**, recolhida abaixo dos controles: ouvir cada personagem e selecionar uma voz instalada quando o nome do sistema não permite identificação automática. A escolha fica salva por personagem; os dados de `/teste/` continuam isolados.

O contexto do episódio agora acompanha a reprodução inteira, a repetição de uma linha, a repetição lenta e o replay de um trecho. Mantidos todos os diálogos, exercícios, controles, etapas, letras e dicas — inclusive “Could you sounds like cúdja” e a explicação de d + y → “dj”.

## Limitações reais dos aparelhos

Web Speech **não fornece gênero padronizado**; os nomes conhecidos ajudam, mas não garantem o timbre. Alguns Android expõem somente uma voz genérica por idioma; iOS depende das vozes instaladas. Alterar pitch **não cria uma voz masculina real** e alguns motores podem ignorar essa propriedade. Nessas condições, usar a escolha manual, instalar vozes em inglês no sistema ou o Azure já configurado permite melhorar a separação. Não foi adicionada chave, assinatura ou dependência paga.

Sem API de síntese, o app informa a indisponibilidade, preserva texto/atividades e não lança erro JavaScript. Não é prometido áudio onde o navegador não o suporta.

O sincronismo existente permanece por fala: duração real no WAV Azure e relógio estimado/coordenado com fim de fala no navegador. Não foi introduzida promessa de sincronismo palavra por palavra.

## Verificação reproduzível

```bash
VERIFY_ORIGIN=http://127.0.0.1:8765 /workspace/.venv-pw/bin/python3 patch/verify_dialogue_voices.py
VERIFY_ORIGIN=http://127.0.0.1:8765 /workspace/.venv-pw/bin/python3 patch/verify_dialogue_player_edges.py
VERIFY_ORIGIN=http://127.0.0.1:8765 /workspace/.venv-pw/bin/python3 patch/verify_dialogue_no_engine.py
# Trocar VERIFY_ORIGIN por https://junweel.github.io/prototipo-app-ingles para repetir na publicação.
```

- Regressão vermelha antes da implementação: Marcus recebeu `Samantha`, embora o episódio declare convidado masculino. Outro teste vermelho encontrou erro ao usar uma API desativada; ambos passaram após a correção.
- Seis episódios com dois falantes + episódio solo, catálogo assíncrono, somente uma voz, catálogo vazio, ausência de API, pausa, letra destacada ao buscar uma fala, velocidade 1.25×, replay/seleção manual e persistência.
- Teste Azure intercepta requisições com **chave fictícia e WAV de tom sintético**: verifica SSML por personagem, decodificação, montagem/reprodução do WAV, relógio de áudio, busca da letra e preservação de pitch. Não acessa credenciais, não chama o provedor real e não demonstra a qualidade da voz neural.
- A verificação de vozes do sistema usa catálogo e eventos simulados no Chromium: testa a decisão e a sequência do app, **não é uma escuta em iPhone/Android físicos**. Esses aparelhos ainda precisam de conferência audível.
- Suíte anterior preservada: onboarding/retorno/replay, Crachá SPLA, comunidade, 54 rotas legadas e fluxo aquecimento → episódio → seis exercícios → Sophia ao vivo, nas duas versões.
- As duas páginas `sophia-ao-vivo/index.html` permanecem byte a byte iguais às aprovadas. Nenhum conteúdo de Andréa, Crachá SPLA, capa ou onboarding foi removido.

## Backup e evidências

Backup remoto anterior às mudanças: `onboarding-approved-before-dialogue-35df138` (main `35df138`). Branch: `dialogos-vozes-personagens`.

Capturas mobile 390 px em `docs/evidencias/vozes-dialogo/`:

- `{v6,teste}-letra-vozes.png`: letra e player;
- `{v6,teste}-vozes-config.png`: seleção de voz por personagem;
- `{v6,teste}-azure-player.png`: interface no caminho Azure interceptado (fixture, não voz real).

As capturas da suíte não são prova de qualidade sonora. O restante da interface foi mantido onde estava.
