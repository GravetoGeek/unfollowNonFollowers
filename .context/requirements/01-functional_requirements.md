# Requisitos Funcionais (RF)

## RF01 — Comparação de listas GitHub

O sistema deve listar usuários que você segue e não seguem de volta, e também quem segue você sem reciprocidade.

## RF02 — Ações individuais e em lote

O sistema deve permitir `follow/unfollow` individual e em lote, com confirmação explícita para ações massivas.

## RF03 — Estados de execução

O sistema deve sinalizar claramente estados de busca e execução (`isSearching`, `isUnfollowingAny`, etc.).

## RF04 — Internacionalização

A interface deve suportar múltiplos idiomas via `translations` sem fallback quebrado.

## RF05 — Tratamento de erro

Falhas de rede/API devem gerar mensagens compreensíveis em modal, sem dados sensíveis.

## RF06 — Persistência local de conveniência

Username e token podem ser persistidos localmente para conveniência, com opção de limpeza explícita na UI.

## RNF01 — Simplicidade operacional

Mudanças devem preservar experiência simples: `npm run dev`, `npm run lint`, `npm run build`.
