# Dual Player — Portugal

Versão com servidor Node.js local para intermediar os pedidos ao catálogo e ao resolver GEIL.TO, evitando o bloqueio CORS nesses dois pedidos.

## Requisitos
- Node.js 18 ou superior (usa `fetch` nativo).

## Executar no Windows
1. Extrai a pasta do ZIP.
2. Abre PowerShell nessa pasta (a pasta que contém `index.html` e `server.js`).
3. Executa:

   ```powershell
   node server.js
   ```

4. Mantém a janela aberta e visita http://localhost:8000 no Chrome.

Não uses `npx` nem Python.

## Nota sobre reprodução
O proxy resolve os pedidos ao catálogo e ao endpoint `/live/resolve`. O vídeo é reproduzido diretamente a partir do URL devolvido pelo resolver. Se o servidor do stream também bloquear CORS, ou exigir cabeçalhos/cookies específicos, a reprodução poderá falhar mesmo que a lista de canais apareça. A compatibilidade depende igualmente do formato do stream e dos direitos/permissões de acesso.
