# Camisa no Crachá Paulista — pt348u

Desenho solicitado/aprovado: preservar crachá e cordão no alto; dar significado ao chip da empresa. `Vestindo a camisa ✓` significa que nome da empresa e logo estão no cordão; é botão de edição. Na falta de um deles, `Vista a camisa +` abre o mesmo editor existente em Perfil. Salvar atualiza marca, cordão e estado sem novo cadastro ou tela concorrente. Teclado e toque usam botões nativos.

Estado explícito vazio não pode ressuscitar a Nexa por fallback. O exemplo inicial já aprovado continua com Nexa e sua logo; limpar/iniciar dados de empresa vazios produz o estado ausente. Comunidade mantém empresas fictícias e o marcador `(exemplo)`; seus chips indicam a marca do perfil, mas o botão abre **a edição do meu crachá**, nunca altera dados de outra pessoa. Tooltip deixa esse escopo explícito.

Arquitetura: `cartao-identidade.js` resolve estado e abre o editor existente; `frame.js`/helper preservam logo existente no salvamento sem novo upload; `cracha-paulista.js` mantém cordão neutro quando incompleto e repete marca quando completo. Mesmas chaves de storage, prefixo Andréa, rotas e atividades.

- [x] Backup local antes de código: `before-camisa-cracha-e557668`.
- [x] Teste antes do código: falhou porque o chip não era ação real.
- [x] Implementar estados e editor real; testar ausência de nome, de logo e de ambos em `/v6/` e `/teste/`.
- [x] Upload real → salvar → cordão atualizado; novo salvar sem upload não apaga logo; limpar empresa desliga o chip; exemplos da comunidade não sofrem mutação.
Publicação: executar a suíte de preservação também nas URLs reais, revisar as capturas de 390px e conferir o job Pages do commit enviado. Registrar os resultados e o hash no relatório da entrega.

Verificação: `VERIFY_ORIGIN=http://127.0.0.1:8765 /workspace/.venv-pw/bin/python3 patch/verify_camisa_cracha.py`. Capturas solicitadas: `/workspace/cracha-paulista/capturas/camisa-on.png` e `camisa-off.png`. Nenhum áudio, atividade, fonte metodológica ou documento do site será alterado.
