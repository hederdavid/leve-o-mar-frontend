# AGENTS.md — Leve o Mar Frontend

Bem-vindo ao repositório do **Leve o Mar - Frontend**. Este arquivo serve como ponto de entrada para o assistente de IA (Antigravity) e desenvolvedores.

---

## 🎯 Visão Geral do Projeto

O **Leve o Mar** é um e-commerce imersivo de garrafas temáticas afetivas que trazem a história, essência e identidade de praias brasileiras (com rótulos personalizados, mapa interativo, visualização 3D e catálogo colecionável).

Neste estágio, o projeto opera **100% no Frontend** com dados mockados ultra-realistas, tipados e com latência simulada.

---

## 📁 Estrutura de Governança e Regras (`.agy/`)

Toda a arquitetura de instruções, padrões e planejamento do projeto está centralizada no diretório [`.agy/`](file:///home/heder/leve-o-mar-frontend/.agy/):

| Arquivo | Descrição |
| :--- | :--- |
| [`.agy/system-rules.md`](file:///home/heder/leve-o-mar-frontend/.agy/system-rules.md) | **Regras globais de código**, proibições (sem `any`), boas práticas e diretrizes de **Design Anti-IA-Slop**. |
| [`.agy/tech-stack.md`](file:///home/heder/leve-o-mar-frontend/.agy/tech-stack.md) | **Stack tecnológica**, versões das libs, convenções de pastas e paleta de cores marítima. |
| [`.agy/skills/create-component.md`](file:///home/heder/leve-o-mar-frontend/.agy/skills/create-component.md) | Receita padrão para criação de componentes Vue 3 com TypeScript e testes Vitest. |
| [`.agy/skills/api-integration.md`](file:///home/heder/leve-o-mar-frontend/.agy/skills/api-integration.md) | Padrão de integração com APIs REST, serviços, composables e Pinia. |
| [`.agy/skills/mock-data-architecture.md`](file:///home/heder/leve-o-mar-frontend/.agy/skills/mock-data-architecture.md) | Arquitetura de dados mockados ricos (destinos reais, coordenadas, notas olfativas). |
| [`.agy/skills/interactive-map.md`](file:///home/heder/leve-o-mar-frontend/.agy/skills/interactive-map.md) | Diretrizes e componente de mapa de praias interativo com Leaflet. |
| [`.agy/skills/3d-bottle-viewer.md`](file:///home/heder/leve-o-mar-frontend/.agy/skills/3d-bottle-viewer.md) | Diretrizes para renderização 3D/interativa da garrafa e inspeção de rótulo. |
| [`.agy/skills/product-detail-view.md`](file:///home/heder/leve-o-mar-frontend/.agy/skills/product-detail-view.md) | Arquitetura da página de detalhes do produto, galeria com miniaturas e avaliações com filtros. |
| [`.agy/skills/figma-integration.md`](file:///home/heder/leve-o-mar-frontend/.agy/skills/figma-integration.md) | Fluxo de extração de tokens e assets via Figma MCP. |
| [`.agy/roadmap.md`](file:///home/heder/leve-o-mar-frontend/.agy/roadmap.md) | **Backlog estrito de tarefas atômicas** e status de execução. |

---

## 🤖 Instruções de Execução para o Agente

1. **Consulte as Regras**: Antes de implementar ou refatorar código, valide os requisitos em [`.agy/system-rules.md`](file:///home/heder/leve-o-mar-frontend/.agy/system-rules.md).
2. **Siga a Tech Stack**: Utilize as bibliotecas e convenções declaradas em [`.agy/tech-stack.md`](file:///home/heder/leve-o-mar-frontend/.agy/tech-stack.md).
3. **Execute Tarefas do Roadmap**: Trabalhe em tarefas atômicas seguindo a ordem de prioridade definida em [`.agy/roadmap.md`](file:///home/heder/leve-o-mar-frontend/.agy/roadmap.md).
4. **Use as Skills**: Sempre que for criar componentes, integrar mapas, renderizar 3D ou extrair dados do Figma, consulte as receitas em `.agy/skills/`.
5. **Código Limpo (Zero Comentários Inúteis)**: Não polua templates HTML, scripts ou estilos com comentários óbvios/triviais. O código deve ser limpo e autoexplicativo.
6. **Mantenha a Integridade dos Testes e Tipos**: Todo novo código deve passar no `vue-tsc` (type-check) e nos testes unitários (`vitest`).
