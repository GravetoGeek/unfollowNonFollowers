# SOP 01 — Feature Change Loop (Frontend)

## Fluxo padrão

1. Entender requisito e localizar fonte de verdade (`src/app/*`).
2. Implementar mudança mínima na camada correta (UI, hook ou service).
3. Validar tipagem/compilação/lint aplicáveis.
4. Revisar se houve impacto em i18n, loading states e segurança de token.
5. Documentar lição recorrente em `.context/lessons.md` quando útil.

## Escalonamento de validação

- Nível 1: checagem do módulo alterado.
- Nível 2: `npm run lint`.
- Nível 3: `npm run build` para mudanças com risco estrutural.

## Gate de aprovação

- Sem regressão visível no fluxo principal.
- Sem exposição de segredo.
- Sem duplicação de fonte de verdade.
- Sem criação de complexidade fora do escopo.
