# Stack Tecnológica & Padrões Visuais (`tech-stack.md`)

Este documento detalha o ecossistema tecnológico, bibliotecas, ferramentas de desenvolvimento, estrutura de diretórios e padrões visuais do projeto **Leve o Mar Frontend**.

---

## 🛠️ Tecnologias & Versões Instaladas

| Categoria | Tecnologia | Versão / Lib | Finalidade |
| :--- | :--- | :--- | :--- |
| **Core Framework** | **Vue.js 3** | `^3.5.40` | Framework reativo com Composition API e `<script setup lang="ts">` |
| **Build & Bundler** | **Vite** | `^8.1.5` | Ferramenta de build ultrarrápida com HMR |
| **Linguagem** | **TypeScript** | `~6.0.0` | Tipagem estática estrita (zero `any`) |
| **State Management**| **Pinia** | `^4.0.2` | Gerenciamento de estado global modular e tipado |
| **Roteamento** | **Vue Router** | `^5.2.0` | Navegação SPA moderna com suporte a lazy-loading |
| **Ícones & UI Icons**| **Lucide Vue** | `lucide-vue-next` | Conjunto leve e consistente de ícones vetoriais |
| **Utilitários Reativos**| **VueUse** | `@vueuse/core` | Composables reativos essenciais (storage, mouse, window, etc.) |
| **Animações & Motion**| **VueUse Motion** | `@vueuse/motion` | Animações declarativas e transições suaves de entrada |
| **Mapas Interativos** | **Leaflet** | `leaflet` + `@types/leaflet` | Mapas leves e customizados dos destinos praianos |
| **Notificações / Toast**| **Vue Sonner** | `vue-sonner` | Toasts elegantes e não intrusivos para feedback de ações |
| **Efeitos Visuais** | **Canvas Confetti** | `canvas-confetti` | Efeito de celebração sensorial na finalização de pedidos |
| **Visualizador 3D** | **Model Viewer** | `@google/model-viewer` | Renderização 3D interativa de garrafas e rótulos |
| **Testes Unitários**| **Vitest** | `^4.1.10` + `@vue/test-utils` | Testes rápidos de componentes e lógica |
| **Testes E2E** | **Playwright** | `^1.61.1` | Testes automatizados de ponta a ponta |
| **Linter & Formatter**| **Oxlint**, **ESLint**, **Prettier** | `^1.0.0`, `^10.7.0` | Padronização e qualidade estática de código |

---

## 🎨 Padrões Visuais & Identidade Marítima Afetiva (Design Anti-IA-Slop)

O design do **Leve o Mar** rejeita o visual genérico de templates com gradientes roxos neon e cards sem personalidade. A estética transmite **frescor, calmaria, sofisticação e afeto artesanal**:

### 1. Paleta de Cores Marítima & Mineral
- **Mar Profundo (Navy Anchor)**: `#0A2647` (Títulos principais, contraste nobre, backgrounds escuros elegantes)
- **Azul Oceano (Ocean Deep)**: `#144272` (Botões primários, headers, acentos de destaque)
- **Espuma Costeira (Coastal Wave)**: `#205295` / `#2C74B3` (Ações secundárias, badges, links)
- **Turquesa / Água Viva (Aqua Mist)**: `#05BFDB` / `#088395` (Destaques sutis, estados ativos, detalhes do mapa)
- **Areia Dourada Quente (Warm Sand)**: `#F5EBE0` / `#E8D5C4` (Superfícies aconchegantes, cards artesanais)
- **Sal Marinho & Brisa (Sea Salt White)**: `#F8FAFC` / `#FFFFFF` (Fundo geral e áreas limpas)
- **Vidro Fosco (Sea Glass Glassmorphism)**: `rgba(255, 255, 255, 0.75)` com `backdrop-filter: blur(12px)` e borda sutil `rgba(255, 255, 255, 0.4)`

### 2. Tipografia Editorial & Contemporânea
- **Títulos Editoriais & Destaques de Marca**: `Playfair Display`, `Cormorant Garamond` ou `Outfit` com peso refinado para transmitir sensação de revista de viagem e luxo acessível.
- **Corpo & Interface (UI)**: `Inter`, `Plus Jakarta Sans`, `-apple-system`, `sans-serif` para leitura confortável e números tabulares no checkout.

### 3. Atmosfera & Microinterações
- Sombras suaves com tom azulado (`box-shadow: 0 10px 30px -10px rgba(10, 38, 71, 0.08)`).
- Bordas arredondadas orgânicas (`12px` a `20px` para cards, `9999px` para pills e tags).
- Transições fluidas com curvas de Bézier naturais (`transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 📂 Estrutura de Pastas do Projeto

```text
leve-o-mar-frontend/
├── .agy/                     # Governança & inteligência do projeto
│   ├── system-rules.md       # Regras globais de código e proibições
│   ├── tech-stack.md         # Stack tecnológica e padrões visuais
│   ├── skills/               # Receitas especializadas
│   │   ├── create-component.md
│   │   ├── api-integration.md
│   │   ├── mock-data-architecture.md
│   │   ├── interactive-map.md
│   │   ├── 3d-bottle-viewer.md
│   │   └── figma-integration.md
│   └── roadmap.md             # Backlog estrito de tarefas atômicas
├── AGENTS.md                 # Ponto de entrada do agente
├── AGY.md                    # Atalho de entrada
├── public/                   # Modelos 3D (.glb), texturas e favicons
├── src/
│   ├── assets/               # CSS global, temas e tokens visuais
│   ├── components/           # Componentes reutilizáveis
│   │   ├── common/           # Botões, Inputs, Modais, Badges, Skeletons
│   │   ├── layout/           # Header, Footer, CartDrawer, MobileNav
│   │   ├── home/             # HeroSensorial, DestinationGrid, Testimonials
│   │   ├── map/              # BeachMapLeaflet, MapControls, BeachPopup
│   │   ├── catalog/          # ProductCard, FilterSidebar, ActiveFilters
│   │   └── product/          # BottleViewer3D, SensoryNotes, OriginStory
│   ├── composables/          # Hooks reativos (useCart, useBeaches, useProducts)
│   ├── mocks/                # Banco de dados mockado rico e ultra-realista
│   │   ├── beaches.ts        # Destinos (Espelho, Noronha, Rosa, etc.)
│   │   └── products.ts       # Garrafas colecionáveis, lotes e detalhes
│   ├── router/               # Rotas da aplicação (Home, Catalog, Product, Cart)
│   ├── services/             # Camada de serviços mockados com latência simulada
│   ├── stores/               # Stores Pinia (cart.ts, filter.ts, bookmark.ts)
│   ├── types/                # Interfaces TypeScript estritas
│   ├── utils/                # Formatadores (moeda BRL, datas, cálculos de frete)
│   ├── views/                # Telas (HomeView, CatalogView, ProductDetailView, etc.)
│   ├── App.vue               # Componente raiz com Toaster da Vue Sonner
│   └── main.ts               # Inicialização de plugins e estilos
```
