# 02 — Segurança e Dados Sensíveis

## 1. Token GitHub

- Nunca imprimir token em `console.log`, erros serializados ou UI.
- Nunca incluir token em mensagens de modal/toast.
- Sempre tratar token como segredo transitório.

## 2. Persistência local

- O projeto hoje usa `localStorage` para username e token.
- Alterações nesse comportamento devem ser explícitas e backward-compatible.
- Se houver falha de leitura/escrita no storage, degradar sem quebrar a tela.

## 3. Chamadas à API

- Tratar respostas de erro da API sem vazar headers/payload sensível.
- Priorizar mensagens de erro amigáveis ao usuário final.
- Respeitar limites/rate limit do GitHub quando implementar operações em lote.

## 4. Segurança de colaboração

- Sem secrets em código-fonte, commits, docs ou arquivos de exemplo.
- Sanitizar qualquer texto de erro antes de exibir para usuário.
