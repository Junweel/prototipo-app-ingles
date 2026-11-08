# Verificação pública — 07/11/2026 22:52 (America/Sao_Paulo)

Implementação publicada em main: `d9059e4a07b4677cf9a84ce554b9ee0c18e381ca`. Deploy Pages concluído com sucesso: https://github.com/Junweel/prototipo-app-ingles/actions/runs/42435928939 . Backup remoto anterior: `before-fontes-aulas-20261107-3c1b5cf`.

Links de exemplo:
- https://junweel.github.io/prototipo-app-ingles/v6/?fontes=20261107-2#grammar
- https://junweel.github.io/prototipo-app-ingles/teste/?fontes=20261107-2#pron
- https://junweel.github.io/prototipo-app-ingles/v6/?fontes=20261107-2#ep~ep0

## Resultado

Todos os testes abaixo passaram contra as URLs públicas, com saída zero:
- 37 telas por variante (incluindo desafio escrito e salas de estudo da comunidade): nota única, inicialmente fechada, fontes específicas, abertura por toque e teclado e ausência de overflow em 390px.
- Sete episódios por variante: passagem real pela interface Ouvir → Perguntas → Pegue o trecho → Com legenda → conclusão, com nota presente após cada reconstrução e sem duplicação.
- Página real Sophia ao vivo nas duas variantes: nota acessível, controles preservados, nenhum início de chamada ou solicitação de microfone no teste. Recuperação da nota nos painéis de revisão e treino de ouvido reconstruídos.
- 18 entradas bibliográficas idênticas ao dossiê; catálogo e módulo consistentes. Apenas includes aditivos nos quatro HTMLs: conteúdo anterior idêntico byte a byte ao backup depois de removê-los.
- Onboarding/retorno à trilha, personalização, identidade/Cartão Paulista, comunidade, preferências, todas as 55 telas e duas integrações de chamada por variante, sequência da sessão e Transferência Linguística preservados.
- Reprodução dos sete episódios gravados, trechos, velocidade, legenda, dica “cúdja” e quatro conversações legadas: sem erro JS.
- **298 MP3 públicos com SHA-256 idêntico** aos aprovados, 8.871.032 bytes. Nenhum áudio foi regenerado ou alterado.
- Seis HTML/JS/CSS públicos comparados byte a byte com a implementação local; includes novos versionados. Não limpar localStorage, cadastro ou progresso.

## Capturas públicas (390px)

No box:
- `/workspace/fontes-aulas-evidencias/capturas/v6-grammar-fontes.png`
- `/workspace/fontes-aulas-evidencias/capturas/teste-pron-fontes.png`
- `/workspace/fontes-aulas-evidencias/capturas/v6-episodio-fontes.png`

Logs completos: `/workspace/fontes-aulas-evidencias/verificacao-publica.txt`. Hashes servidos: `arquivos-publicos.json` no mesmo diretório. O navegador automatizado foi Chromium; não se afirma teste em aparelho físico.

Nenhuma funcionalidade foi movida, nenhum autor foi apresentado como participante da banca, e a contagem de 48 pesquisadores permaneceu inalterada. [Cobertura completa](AUDITORIA.md).
