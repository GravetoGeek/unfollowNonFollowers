# AI_INSTRUCTIONS.md

## Manifesto de Engenharia Assistida por IA — unfollowNonFollowers

Este arquivo é o ponto de entrada para agentes e para o Copilot neste repositório.

## 1. Identidade do Produto

Aplicação web para comparar `seguindo` vs `seguidores` no GitHub e executar ações de `follow/unfollow` com segurança e feedback claro ao usuário.

## 2. Stack Técnica Canônica

- Next.js 15 (App Router)
- React 19
- TypeScript estrito (`strict: true`)
- ESLint com regras Next.js (`next/core-web-vitals`, `next/typescript`)

## 3. Princípios Inegociáveis

1. Correção antes de velocidade.
2. Mudanças mínimas, coesas e reversíveis.
3. Segurança de credenciais por padrão (nunca expor token).
4. UX simples e previsível (sem features não solicitadas).
5. Evitar duplicação e reduzir confusão estrutural.

## 4. Ordem de Leitura Obrigatória

1. `.context/system_prompt.md`
2. `.context/domain_rules/`
3. `.context/requirements/`
4. `.context/sops/`
5. `.context/lessons.md`

## 5. Guardrails de Implementação

- Priorizar fontes ativas em `src/app/*`.
- Não gerar novas features em arquivos placeholder vazios de `src/components/*` e `src/lib/*` sem tarefa explícita de migração.
- Não vazar `apiKey` em UI, logs, erros ou documentação.
- Não quebrar internacionalização existente (`translations`).
- Preservar nomenclatura, estilo e contratos públicos já usados.

## 6. Definição de Pronto (DoD)

Uma mudança está pronta quando:

- atende ao comportamento pedido;
- passa em validação local pertinente (`npm run lint` e/ou `npm run build` quando aplicável);
- não introduz regressão visual/funcional óbvia;
- mantém segurança de token e clareza de mensagens de erro.
