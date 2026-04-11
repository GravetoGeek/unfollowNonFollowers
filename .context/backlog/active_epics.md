# Active Epics — unfollowNonFollowers

Backlog consolidado a partir da análise profunda de arquitetura, qualidade, segurança e operação.

## Escala usada

- **Prioridade:** P0 (crítico) → P1 (alto) → P2 (médio) → P3 (baixo)
- **Complexidade:** Baixa | Média | Alta
- **Dependência:** itens que precisam ser concluídos antes

---

## P0 — Estabilidade e Segurança Imediata

### EPIC P0.1 — Blindagem do fluxo de `stats` (evitar crash em runtime)

**Problema-raiz:** a UI assume shape fixo em `stats` e pode receber payload de erro da API, causando quebra (`toLocaleString` em valor indefinido).

#### Item P0.1.1 — Validar shape da resposta de `/api/stats` antes de `setStats`
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** Nenhuma
- **Benefício:** elimina crash de renderização e erro intermitente no cliente.
- **Risco/Trade-off:** pequeno aumento de código defensivo na camada de UI.

#### Item P0.1.2 — Padronizar contrato de resposta da API (`success/error` + payload consistente)
- **Status:** ✅ Concluído
- **Complexidade:** Média
- **Dependência:** P0.1.1
- **Benefício:** reduz acoplamento frágil entre frontend e backend.
- **Risco/Trade-off:** pode exigir ajustes em consumo atual da rota e testes manuais.

#### Item P0.1.3 — Evitar resposta ambígua em falha (sempre retornar shape seguro para UI)
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** P0.1.2
- **Benefício:** comportamento previsível, mesmo com erro em KV/arquivo.
- **Risco/Trade-off:** perda de detalhe técnico no payload bruto (compensar com logs internos).

---

### EPIC P0.2 — Hardening de credencial (token GitHub)

**Problema-raiz:** token sensível persiste em `localStorage`, elevando risco de exfiltração por XSS/extensões.

#### Item P0.2.1 — Remover persistência automática do token em `localStorage`
- **Status:** ✅ Concluído
- **Complexidade:** Média
- **Dependência:** Nenhuma
- **Benefício:** reduz superfície de ataque imediata.
- **Risco/Trade-off:** piora de conveniência para usuário recorrente.

#### Item P0.2.2 — Adicionar opção explícita “lembrar token” (opt-in)
- **Status:** ✅ Concluído
- **Complexidade:** Média
- **Dependência:** P0.2.1
- **Benefício:** equilíbrio entre segurança e UX.
- **Risco/Trade-off:** exige comunicação clara para evitar confusão.

#### Item P0.2.3 — Revisar logs para não incluir dados sensíveis/contexto excessivo
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** Nenhuma
- **Benefício:** menor risco de vazamento em console/observabilidade.
- **Risco/Trade-off:** menor diagnóstico imediato em ambiente local.

---

## P1 — Confiabilidade de Tooling e Manutenibilidade

### EPIC P1.1 — Alinhamento de stack e lint

**Problema-raiz:** inconsistência entre versões e comando de lint quebrando fluxo de qualidade.

#### Item P1.1.1 — Alinhar `next` e `eslint-config-next` para a mesma major
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** Nenhuma
- **Benefício:** elimina incompatibilidades de lint/build futuras.
- **Risco/Trade-off:** possíveis novos warnings após upgrade/alinhamento.

#### Item P1.1.2 — Corrigir script de lint para padrão suportado no setup atual
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** P1.1.1
- **Benefício:** restaura gate de qualidade em CI/local.
- **Risco/Trade-off:** pode requerer migração de regras legadas.

#### Item P1.1.3 — Ajustar root do Turbopack ou remover lockfile externo conflitante
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** Nenhuma
- **Benefício:** previsibilidade de resolução de workspace e menos warning.
- **Risco/Trade-off:** mudança de configuração pode impactar monorepo futuro.

---

### EPIC P1.2 — Quebra de arquivo monolítico e acoplamento em `page.tsx`

**Problema-raiz:** `page.tsx` concentra UI, estado, side-effects e integração de API em arquivo único grande.

#### Item P1.2.1 — Extrair bloco de controles superiores (tema/idioma/variante)
- **Status:** ✅ Concluído
- **Complexidade:** Média
- **Dependência:** Nenhuma
- **Benefício:** melhora legibilidade e testabilidade.
- **Risco/Trade-off:** risco de regressão visual se extração não for incremental.

#### Item P1.2.2 — Extrair bloco de credenciais e ações de busca
- **Status:** ✅ Concluído
- **Complexidade:** Média
- **Dependência:** P1.2.1
- **Benefício:** separa responsabilidades de formulário e listagem.
- **Risco/Trade-off:** aumento inicial de arquivos/componentes.

#### Item P1.2.3 — Extrair `footer stats` para componente dedicado com fallback defensivo
- **Status:** ⏳ Pendente
- **Complexidade:** Baixa
- **Dependência:** P0.1
- **Benefício:** isola a área mais sujeita a crash de shape.
- **Risco/Trade-off:** pequeno overhead de props.

---

## P2 — Arquitetura, Performance e Qualidade de Código

### EPIC P2.1 — Resolver arquitetura duplicada e placeholders vazios

**Problema-raiz:** coexistência de trilha ativa (`src/app`) com múltiplos arquivos vazios (`src/components`, `src/lib`, etc.) gera confusão.

#### Item P2.1.1 — Marcar formalmente trilha ativa e trilha em transição no README
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** Nenhuma
- **Benefício:** reduz erro de contribuição em pasta errada.
- **Risco/Trade-off:** documentação pode ficar desatualizada se não mantida.

#### Item P2.1.2 — Remover placeholders sem uso ou convertê-los em TODOs explícitos
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** P2.1.1
- **Benefício:** limpa ruído arquitetural e melhora navegação.
- **Risco/Trade-off:** perda de “esqueleto” para migração futura, se não planejado.

#### Item P2.1.3 — Definir plano de migração único (ou consolida em `src/app`, ou completa nova camada)
- **Status:** ⏳ Pendente
- **Complexidade:** Alta
- **Dependência:** P2.1.2
- **Benefício:** elimina dívida estrutural de longo prazo.
- **Risco/Trade-off:** esforço maior e possibilidade de conflito durante transição.

---

### EPIC P2.2 — Otimização de comparação de listas GitHub

**Problema-raiz:** uso de `includes` em arrays para diffs de seguidores tende a custo maior em contas grandes.

#### Item P2.2.1 — Trocar `includes` por `Set` para membership check
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** Nenhuma
- **Benefício:** melhora desempenho com datasets maiores.
- **Risco/Trade-off:** exige cuidado para manter semântica idêntica.

#### Item P2.2.2 — Revisar limites de paginação e mensagens de truncamento
- **Status:** ⏳ Pendente
- **Complexidade:** Baixa
- **Dependência:** Nenhuma
- **Benefício:** transparência para usuário sobre resultados parciais.
- **Risco/Trade-off:** mais regras de UX para internacionalizar.

---

### EPIC P2.3 — Segurança de renderização de mensagens

**Problema-raiz:** parsing de HTML em mensagem (`html-react-parser`) com conteúdo textual multilíngue amplia superfície de injeção e complexidade.

#### Item P2.3.1 — Substituir mensagens HTML por estrutura segura baseada em dados
- **Status:** ✅ Concluído
- **Complexidade:** Média
- **Dependência:** Nenhuma
- **Benefício:** reduz risco de XSS e simplifica i18n.
- **Risco/Trade-off:** refactor em traduções e modal.

#### Item P2.3.2 — Encapsular links como metadado (não como HTML embutido)
- **Status:** ⏳ Pendente
- **Complexidade:** Média
- **Dependência:** P2.3.1
- **Benefício:** renderização segura e controle total de acessibilidade.
- **Risco/Trade-off:** migração de todas as línguas.

---

## P3 — Testes, Observabilidade e Produto

### EPIC P3.1 — Base mínima de testes

**Problema-raiz:** ausência de testes automatizados aumenta risco de regressão em fluxo crítico.

#### Item P3.1.1 — Testes unitários de `GitHubService` (casos 200/401/403/404/500)
- **Status:** ✅ Concluído
- **Complexidade:** Média
- **Dependência:** Nenhuma
- **Benefício:** protege regras de integração e tratamento de erro.
- **Risco/Trade-off:** setup inicial de framework de teste.

#### Item P3.1.2 — Testes de contrato para `/api/stats` (GET/POST, erro e fallback)
- **Status:** ✅ Concluído
- **Complexidade:** Média
- **Dependência:** P0.1
- **Benefício:** reduz risco de regressão no ponto que já apresentou falha.
- **Risco/Trade-off:** mock de KV/FS pode exigir utilitários extras.

#### Item P3.1.3 — Smoke test de fluxo principal (buscar + follow/unfollow)
- **Status:** 🟡 Parcial (smoke de carregamento existe; falta fluxo principal completo)
- **Complexidade:** Alta
- **Dependência:** P3.1.1, P3.1.2
- **Benefício:** confiança de release e validação do fluxo de ponta a ponta.
- **Risco/Trade-off:** tempo de execução e manutenção de testes E2E.

---

### EPIC P3.2 — Documentação operacional real

**Problema-raiz:** README está genérico de template e não representa o produto atual.

#### Item P3.2.1 — Atualizar README com arquitetura real, segurança de token e troubleshooting
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** Nenhuma
- **Benefício:** onboarding mais rápido e menos erro operacional.
- **Risco/Trade-off:** precisa ser mantido atualizado a cada mudança relevante.

#### Item P3.2.2 — Adicionar seção de runbook para erros comuns (`@vercel/kv`, lockfile, Git objects)
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** P3.2.1
- **Benefício:** reduz MTTR em problemas recorrentes.
- **Risco/Trade-off:** documentação extensa sem curadoria perde utilidade.

---

### EPIC P3.3 — Cobertura 100% (Unit + E2E + E2E Playwright)

**Objetivo:** atingir cobertura de testes **100%** no escopo ativo do projeto, com gate obrigatório no pipeline.

#### Item P3.3.1 — Definir escopo oficial da cobertura 100%
- **Status:** ✅ Concluído
- **Complexidade:** Baixa
- **Dependência:** Nenhuma
- **Benefício:** evita métrica artificial e garante foco no código que realmente executa.
- **Risco/Trade-off:** se incluir placeholders vazios/transição, custo sobe sem ganho funcional.

#### Item P3.3.2 — Implantar framework de testes unitários com relatório de coverage
- **Status:** ✅ Concluído
- **Complexidade:** Média
- **Dependência:** P3.3.1
- **Benefício:** baseline automatizada para regras de negócio e serviços.
- **Risco/Trade-off:** setup inicial e manutenção de mocks.

#### Item P3.3.3 — Cobrir 100% das branches/funções/linhas dos módulos ativos
- **Status:** ✅ Concluído
- **Complexidade:** Alta
- **Dependência:** P3.3.2
- **Benefício:** alta confiança em refactor e regressão.
- **Risco/Trade-off:** testes mais sensíveis a mudanças internas (maior custo de manutenção).

#### Item P3.3.4 — Criar suíte E2E funcional (fluxo principal) com mocks determinísticos
- **Status:** ⏳ Pendente
- **Complexidade:** Alta
- **Dependência:** P3.3.1
- **Benefício:** valida jornada real do usuário ponta a ponta.
- **Risco/Trade-off:** tempo de execução maior; precisa isolamento de ambiente.

#### Item P3.3.5 — Criar suíte E2E Playwright para UI crítica e estados de erro
- **Status:** 🟡 Parcial (smoke básico implementado; faltam estados de erro críticos)
- **Complexidade:** Alta
- **Dependência:** P3.3.4
- **Benefício:** valida renderização, acessibilidade e interações reais no browser.
- **Risco/Trade-off:** flakes se não houver controle de rede/tempo.

#### Item P3.3.6 — Ativar gate obrigatório de cobertura 100% em CI
- **Status:** 🟡 Parcial (gate local ativo no Vitest; falta integração CI)
- **Complexidade:** Média
- **Dependência:** P3.3.3, P3.3.4, P3.3.5
- **Benefício:** impede regressão de qualidade antes do merge.
- **Risco/Trade-off:** pipeline mais rígido pode bloquear entregas rápidas quando a suíte estiver instável.

#### Item P3.3.7 — Estratégia anti-flake e observabilidade de testes
- **Status:** ⏳ Pendente
- **Complexidade:** Média
- **Dependência:** P3.3.4, P3.3.5
- **Benefício:** estabilidade contínua do gate 100%.
- **Risco/Trade-off:** investimento extra em infraestrutura de teste (retry controlado, traces, vídeos, artifacts).

---

## Ordem sugerida de execução (dependências críticas)

1. **P0.1** (stats contract + crash prevention)
2. **P0.2** (token hardening)
3. **P1.1** (tooling/lint/version alignment)
4. **P1.2** (fatiamento de `page.tsx`)
5. **P2.1** (limpeza arquitetural de placeholders)
6. **P2.2 + P2.3** (performance e segurança de render)
7. **P3.1 + P3.2** (testes e documentação operacional)
8. **P3.3** (cobertura 100% + gates obrigatórios)

---

## Definition of Done (mínimo por item)

- [ ] Critério funcional atendido com evidência (build/lint/teste aplicável)
- [ ] Dependências do item respeitadas
- [ ] Risco residual explicitado (se houver)
- [ ] Sem vazamento de token/segredo em logs/UI
- [ ] Documentação atualizada quando houver mudança de comportamento

