# 01 — Arquitetura Frontend (Next.js + TS)

## 1. Fonte de verdade atual

- Fluxo principal está em `src/app/page.tsx` e módulos em `src/app/*`.
- Existem arquivos vazios em `src/components/*` e `src/lib/*` que representam refatoração incompleta.

## 2. Regra de evolução

- Se a tarefa não mencionar migração arquitetural, alterar apenas a trilha ativa (`src/app/*`).
- Não duplicar lógica em dois lugares.
- Se necessário tocar arquivo vazio, justificar no PR/task e manter compatível com comportamento atual.

## 3. Contratos funcionais atuais

- `useGitHubOperations` coordena busca/follow/unfollow e estados de carregamento.
- `GitHubService` concentra chamadas à API do GitHub.
- `translations` define textos multi-idioma e deve permanecer sincronizado com UI.

## 4. Qualidade mínima

- Tipagem explícita em parâmetros e retornos públicos.
- Evitar `any` sem necessidade real.
- Preservar UX existente: modal de erro, confirmação e ações em lote.
