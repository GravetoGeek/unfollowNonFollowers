# Lessons Learned — unfollowNonFollowers

Este arquivo captura padrões de erro recorrentes para evitar repetição.

## Formato padrão

- **Sintoma**
- **Causa-raiz**
- **Ação corretiva**
- **Prevenção**

## L1 — Duplicação arquitetural gera manutenção confusa

- Sintoma: mudanças aplicadas em pasta errada sem efeito na UI real.
- Causa-raiz: coexistência de `src/app/*` ativo e `src/components|lib/*` vazio.
- Ação corretiva: definir `src/app/*` como trilha oficial para features atuais.
- Prevenção: explicitar fonte de verdade nos arquivos de contexto e no Copilot.

## L2 — Tratamento de erro pode vazar detalhe indevido

- Sintoma: mensagens de erro com detalhe técnico excessivo ao usuário.
- Causa-raiz: repasse direto de erro bruto da camada de serviço para UI.
- Ação corretiva: padronizar mensagens amigáveis e sanitizadas na interface.
- Prevenção: validar payload de erro antes de renderizar em modal/toast.
