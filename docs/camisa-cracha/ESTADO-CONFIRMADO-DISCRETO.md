# Estado confirmado discreto — pt349u

Ajuste solicitado/aprovado: apenas `Vestindo a camisa ✓` fica menor, regular e neutro, sem borda aparente e com menos padding. Hoje: 11px, peso 400. Comunidade mantém a fonte compacta existente (8px), agora com peso regular e área de toque ≥24px. Perfil preserva a escala do mockup 1080px: fonte de 22→20px nas coordenadas internas, peso 650→400, sem ampliar o selo já pequeno na tela do app. Foco de teclado e ação de editar permanecem.

O estado recebe `data-company-state="on"`; as regras CSS são exclusivas desse valor. `Vista a camisa +` não muda. O teste compara os estilos computados de Hoje e Perfil, em ambas as variantes, contra `plus-style-baseline.json`, capturado antes de qualquer alteração. Teste inicial falhou com fonte de 16px no Hoje; depois do ajuste confirmou 11px, demais contextos e ação de editar.

Backup anterior: `before-camisa-discreta-c377071`. Não há alteração de atividades, áudio, armazenamento, rotas ou conteúdo. Includes modificados são versionados para evitar cache antigo.

Teste: `VERIFY_ORIGIN=http://127.0.0.1:8765 /workspace/.venv-pw/bin/python3 patch/verify_camisa_discreta.py`. Reexecutar com a origem pública após Pages; captura solicitada em `/workspace/cracha-paulista/capturas/camisa-on-discreto.png`.
