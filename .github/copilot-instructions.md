# Copilot Instructions — unfollowNonFollowers

## Contexto de arquitetura

- Este projeto está em transição arquitetural.
- A implementação ativa e funcional está em `src/app/*`.
- Existem pastas legadas de transição em `src/components/*`, `src/lib/*`, `src/services/*` e `src/types/*`.

## Regras de geração de código

1. Para funcionalidades atuais, priorize `src/app/*`.
2. Não mova/refatore para `src/components/*` ou `src/lib/*` sem solicitação explícita.
3. Faça mudanças pequenas e focadas; evite reescritas grandes.
4. Preserve TypeScript estrito e imports consistentes com alias `@/*`.
5. Não introduza bibliotecas novas sem necessidade clara.

## Segurança

- Nunca exiba `apiKey` em logs, mensagens de erro ou UI.
- Evite exemplos com token hardcoded.

## UX e comportamento

- Mantenha fluxo existente: busca, follow/unfollow, ações em lote, modais de erro/confirmação.
- Respeite internacionalização em `src/app/constants/translations.ts`.
- Não adicionar novas páginas, temas ou componentes fora do escopo pedido.

## Validação sugerida

- Rodar `npm run lint` após mudanças.
- Rodar `npm run test:unit` para validar o gate de cobertura.
- Rodar `npm run build` quando houver mudança estrutural.
