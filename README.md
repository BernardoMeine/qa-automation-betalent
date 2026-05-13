# QA Automation Suite - BeTalent

![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)

Suíte completa de testes automatizados cobrindo **UI Testing** (Sauce Demo) e **API Testing** (Restful-Booker), desenvolvida com TypeScript e Playwright.

---

## Objetivo

Demonstrar competência em automação de testes end-to-end abrangendo:
- Testes funcionais de interface (E2E)
- Testes de API RESTful (CRUD completo)
- Testes de acessibilidade (WCAG 2.1 AA)
- Testes responsivos (mobile, tablet, desktop)
- Testes de segurança (SQLi, XSS, auth bypass)
- Testes de performance (k6 load testing)

---

## Stack Tecnológica

| Tecnologia | Função | Justificativa |
|-----------|--------|---------------|
| TypeScript | Linguagem | Tipagem estática, autocompletar, manutenibilidade |
| Playwright Test | UI E2E + API | Multi-browser, auto-wait, API nativo, traces |
| @axe-core/playwright | Acessibilidade | Padrão da indústria para WCAG |
| Ajv | JSON Schema | Validação rigorosa de contratos API |
| @faker-js/faker | Dados de teste | Dados realistas e únicos |
| k6 | Performance | Scripting flexível, métricas detalhadas |
| ESLint + Prettier | Qualidade | Consistência de código |
| GitHub Actions | CI/CD | Automação de pipeline |

---

## Pré-requisitos

- **Node.js** 20+ ([download](https://nodejs.org/))
- **npm** 9+ (incluído com Node.js)
- **k6** (opcional, para performance) — [instalação](https://k6.io/docs/get-started/installation/)

---

## Instalação

```bash
# Clonar o repositório
git clone <repo-url>
cd qa-automation-betalent

# Instalar dependências
npm install

# Instalar navegadores do Playwright
npx playwright install

# Copiar variáveis de ambiente
cp .env.example .env
```

---

## Como Executar

### Testes UI
```bash
# Todos os testes UI (Chromium)
npm run test:ui

# Com interface visível
npm run test:ui:headed

# Cross-browser (Chromium + Firefox + WebKit)
npm run test:cross-browser
```

### Testes API
```bash
npm run test:api
```

### Testes de Acessibilidade
```bash
npm run test:a11y
```

### Testes Responsivos
```bash
npm run test:responsive
```

### Testes de Segurança (API)
```bash
npm run test:security
```

### Testes de Performance (k6)
```bash
# Requer k6 instalado
npm run test:perf
```

### Relatório HTML
```bash
npm run report
```

### Todos os Testes
```bash
npm test
```

---

## Estrutura de Pastas

```
qa-automation-betalent/
├── .github/workflows/ci.yml      # Pipeline CI/CD
├── docs/
│   ├── ui/                        # Documentação UI
│   │   ├── test-plan.md           # Plano de testes
│   │   ├── test-cases.md          # Casos de teste detalhados
│   │   ├── bug-analysis.md        # Bugs encontrados
│   │   ├── improvements.md        # Sugestões de melhoria
│   │   └── risk-analysis.md       # Matriz de riscos
│   ├── api/                       # Documentação API
│   │   ├── scenarios.md           # Cenários de teste
│   │   ├── results.md             # Resultados consolidados
│   │   ├── bug-analysis.md        # Bugs da API
│   │   └── environment-variables.md
│   └── evidences/                 # Screenshots e logs
├── tests/
│   ├── ui/                        # Testes de interface
│   │   ├── auth/                  # Login e logout
│   │   ├── products/              # Ordenação e filtros
│   │   ├── cart/                  # Gerenciamento do carrinho
│   │   ├── checkout/              # Fluxo de compra
│   │   ├── navigation/            # Navegação e menus
│   │   ├── accessibility/         # WCAG 2.1 AA
│   │   └── responsive/            # Mobile, tablet, desktop
│   └── api/                       # Testes de API
│       ├── auth/                  # Autenticação
│       ├── booking/               # CRUD de reservas
│       ├── security/              # SQLi, XSS, auth bypass
│       └── performance/           # k6 load test
├── src/
│   ├── pages/                     # Page Object Model
│   ├── api/clients/               # API client abstraction
│   ├── api/schemas/               # JSON Schema (Ajv)
│   ├── fixtures/                  # Dados de teste
│   └── utils/                     # Logger, data generator
├── postman/                       # Collection Postman
├── playwright.config.ts           # Configuração Playwright
├── tsconfig.json                  # TypeScript strict mode
├── .eslintrc.json                 # Regras de lint
└── .env.example                   # Template de variáveis
```

---

## Premissas

1. As aplicações sob teste (Sauce Demo e Restful-Booker) estão disponíveis e estáveis
2. Sauce Demo é uma aplicação de demonstração com bugs intencionais (problem_user, etc.)
3. Restful-Booker é uma API pública de treino com validação fraca (by design)
4. Os testes não devem depender de estado de execuções anteriores
5. Cada teste é independente e pode rodar em qualquer ordem
6. Credenciais usadas são públicas e documentadas pelas aplicações

---

## Limitações e Pontos de Atenção

1. **Restful-Booker instabilidade**: API hospedada em Heroku free tier, pode ter cold starts
2. **Sem validação server-side**: Restful-Booker aceita dados inválidos (documentado como bug)
3. **Sauce Demo é estática**: Não há backend real; comportamentos anômalos são hardcoded
4. **Performance k6**: Resultados variam conforme horário e carga do servidor
5. **Acessibilidade**: Sauce Demo tem violações WCAG conhecidas que não serão corrigidas
6. **Visual regression**: Não implementado (requeriria baseline screenshots)
7. **Rate limiting**: Restful-Booker não implementa rate limiting

---

## CI/CD

O workflow do GitHub Actions executa automaticamente:
- Lint e formatação
- Testes UI em 3 browsers (paralelo)
- Testes API
- Testes de acessibilidade
- Testes responsivos

Artefatos (relatórios HTML, screenshots, vídeos) são salvos por 30 dias.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm test` | Executa todos os testes |
| `npm run test:ui` | Testes UI (Chromium) |
| `npm run test:ui:headed` | Testes UI com browser visível |
| `npm run test:api` | Testes API |
| `npm run test:a11y` | Testes de acessibilidade |
| `npm run test:responsive` | Testes responsivos |
| `npm run test:security` | Testes de segurança (SQLi, XSS, auth bypass) |
| `npm run test:cross-browser` | Todos os browsers |
| `npm run test:perf` | Load test (k6) |
| `npm run report` | Abrir relatório HTML |
| `npm run lint` | Verificar lint |
| `npm run format` | Formatar código |

---

## Licença

ISC
