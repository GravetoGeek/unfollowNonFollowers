# unfollowNonFollowers

Aplicação Next.js para comparar seguidores/seguidos do GitHub, com ações de seguir/deixar de seguir em lote e estatísticas locais.

## Arquitetura atual

- Trilha ativa: `src/app/*`
- Pastas de transição legada: `src/components/*`, `src/lib/*`, `src/services/*`, `src/types/*`
- Não mover código da trilha ativa para a trilha em transição sem decisão explícita.

## Requisitos

- Node.js 20+
- npm 10+

## Configuração

```bash
npm install
```

## Executar

```bash
npm run dev
```

Aplicação disponível em `http://localhost:3000`.

## Qualidade e testes

```bash
npm run lint
npm run test:unit
npm run test:e2e
npm run test:e2e:playwright
npm run build
```

- A suíte unitária está com gate de cobertura 100% para os módulos ativos em `vitest.config.ts`.

## Segurança do token

- O token GitHub **não é persistido automaticamente**.
- Para salvar no dispositivo atual, marque a opção de lembrar token na UI.
- Nunca exponha token em logs, screenshots ou mensagens de erro.

## Funcionalidades principais

- Buscar usuários que você segue e não te seguem de volta.
- Buscar usuários que te seguem e você não segue.
- Seguir/deixar de seguir individualmente ou em lote.
- Exibir estatísticas de uso via rota `/api/stats`.

## Runbook (erros comuns)

### 1) Erro de `@vercel/kv` ausente

```bash
npm install
```

Se persistir, remova lockfiles conflitantes e reinstale dependências.

### 2) Warning de lockfile raiz/Turbopack

Causa comum: lockfile em diretório pai sendo detectado como root de workspace.

Ações:
- manter apenas o lockfile do projeto quando possível;
- ou definir raiz adequada do workspace para execução local/CI.

### 3) Problemas de objetos Git corrompidos

Exemplo de recuperação (com cuidado):

```bash
git fsck --full
git fetch --all --prune
```

Se houver objetos vazios/corrompidos, remover somente os objetos inválidos e refazer `fetch`.

### 4) Playwright falhando por dependências de sistema

```bash
npx playwright install
npx playwright install-deps
```

## Observações

- Internacionalização centralizada em `src/app/constants/translations.ts`.
- Contrato de `stats` centralizado em `src/app/utils/statsContract.ts`.
