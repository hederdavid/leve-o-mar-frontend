# Roadmap & Backlog de Tarefas Atômicas (`roadmap.md`)

Este documento gerencia o backlog de tarefas atômicas para o desenvolvimento do e-commerce imersivo **Leve o Mar**.

---

## 📊 Legenda de Status
- `[x]` Concluído
- `[-]` Em Progresso
- `[ ]` Pendente

---

## 🚀 Fase 1: Setup, Tipagem, Tailwind & Governança

- [x] **TASK-001**: Estruturar governança em `.agy/`, `AGENTS.md` e criar skills especializadas
- [x] **TASK-002**: Instalar dependências (`lucide-vue-next`, `@vueuse/core`, `@vueuse/motion`, `leaflet`, `vue-sonner`, `canvas-confetti`, `@google/model-viewer`, `tailwindcss`, `@tailwindcss/vite`)
- [x] **TASK-003**: Criar interfaces estritas TypeScript em `src/types/`
- [x] **TASK-004**: Criar banco de dados mockado em `src/mocks/` (`beaches.ts` e `products.ts`) com foco na garrafa e água do mar
- [x] **TASK-005**: Configurar Tailwind com a paleta de cores padronizada (`Warm Sand`, `Dark Navy`, `Coral`, `Golden`)

---

## 🧭 Fase 2: Landing Page & Seções do Protótipo

- [x] **TASK-020**: Criar `NavbarHeader.vue` com logo central, links editoriais, busca e carrinho
- [x] **TASK-021**: Criar `FooterNavigation.vue` com manifesto, newsletter e selos
- [x] **TASK-022**: Implementar store Pinia `useCartStore` com persistência em `localStorage`
- [x] **TASK-023**: Criar componente `CartDrawer.vue` (gaveta deslizante do carrinho)
- [x] **TASK-024**: Criar `SearchModal.vue` com busca ao vivo por destinos e atalho `ESC`
- [x] **TASK-030**: Criar `HeroSection.vue` com trio de garrafas e métricas
- [x] **TASK-031**: Criar `SeasonCollection.vue` com grid de 8 produtos reais
- [x] **TASK-032**: Criar `DestinationsMapSection.vue` com mapa estilizado e pontos reativos
- [x] **TASK-033**: Criar `SensoryUnboxingSection.vue` e banner de frete
- [x] **TASK-034**: Criar `SocialGallerySection.vue` e `TestimonialsSection.vue`
- [x] **TASK-035**: Integrar tudo na `HomeView.vue`

---

## 🍾 Fase 3: Detalhes da Garrafa & Avaliações (Módulo 2)

- [x] **TASK-101**: Criar tipos e mocks de avaliações em `src/types/review.ts` e `src/mocks/reviews.ts`
- [x] **TASK-201**: Criar `ProductGallery.vue` com foto principal e miniaturas laterais verticais
- [x] **TASK-202**: Criar `ProductSummary.vue` com tom da água, preço BRL, parcelamento, personalização de dedicatória e compra
- [x] **TASK-203**: Criar `ProductTabs.vue` com abas de A Água & o Mar, História da Praia, A Garrafa & Vedação e Envio Seguro
- [x] **TASK-204**: Criar `ProductReviews.vue` com média, barras de distribuição, filtro reativo por estrelas e formulário interativo de nova avaliação
- [x] **TASK-205**: Criar tela `ProductDetailView.vue` e rota `/produto/:slug`

---

## 🛒 Fase 4: Catálogo Completo com Filtros Avançados (Módulo 3)

- [x] **TASK-301**: Criar `FilterSidebar.vue` com filtros por Região, Tom da Água, Tipo de Mar e Faixa de Preço
- [x] **TASK-302**: Criar tela `CatalogView.vue` com grid responsivo, contagem de garrafas e ordenação

---

## 💳 Fase 5: Checkout Completo & Interativo (Módulo 4)

- [x] **TASK-401**: Identificação do Colecionador (Login / Cadastro / Convidado com preenchimento rápido de conta demo)
- [x] **TASK-402**: Endereço & Frete (Consulta de CEP simulada com cálculo de frete para vidro seguro)
- [x] **TASK-403**: Pagamento Interativo:
  - [x] Cartão de Crédito 3D interativo com rotação (flip), detecção de bandeira e preenchimento live
  - [x] Pix com QR Code animado, contador regressivo e botão de cópia
  - [x] Boleto Bancário com código de barras
- [x] **TASK-404**: Resumo do Pedido com cálculo de cupom de desconto
- [x] **TASK-405**: Tela de Confirmação com número do pedido (`LOM-XXXXXX`), resumo e chuva de confetti (`canvas-confetti`)

---

## 🏛️ Fase 6: Página Sobre & Roteamento SPA (Módulo 5)

- [x] **TASK-501**: Criar tela `AboutView.vue` com manifesto da marca e FAQ
- [x] **TASK-502**: Configurar Vue Router com todas as rotas ativas e navegação fluida
- [x] **TASK-503**: Validação final de testes unitários e type-check (100% aprovado)

---

## 🎨 Fase 7: Personalizador Visual de Rótulo & Garrafa (Módulo 7)

- [x] **TASK-701**: Componente `LiveBottlePreview.vue` (Visual da garrafa com água do destino, rolha selada e rótulo caligrafado em tempo real)
- [x] **TASK-702**: Componente `CustomizerSidebar.vue` (Seleção de destino, tipo de vidro, texto da dedicatória, fonte e selo)
- [x] **TASK-703**: Página `CustomizerView.vue` com split view e adição direta ao carrinho
- [x] **TASK-704**: Registro da rota `/personalizar` e links na navegação

---

## 🗺️ Fase 8: Mapa Interativo do Litoral Brasileiro com Leaflet (Módulo 8)

- [x] **TASK-801**: Componente `BeachMapLeaflet.vue` (Leaflet, tiles CartoDB Voyager, pinos náuticos com anéis de luz e popups de compra)
- [x] **TASK-802**: Botões de expedição por região com animação cinematográfica `flyTo`
- [x] **TASK-803**: Página dedicada `MapView.vue` (`/mapa`) com gaveta de diário de bordo e fotos
- [x] **TASK-804**: Atualizar `DestinationsMapSection.vue` na Home para usar o mapa Leaflet
- [x] **TASK-805**: Registrar rota `/mapa` no router e links na Navbar e Footer

---

## 🛍️ Fase 9: Redesign E-commerce Hero & Navbar de Alta Conversão (Módulo 9)

- [x] **TASK-901**: Componente `TopAnnouncementBar.vue` (Carrossel rotativo de texto com frete grátis a partir de R$ 79,90 e controles)
- [x] **TASK-902**: `NavbarHeader.vue` estilo e-commerce premium com logo central, busca integrada e barra horizontal de categorias
- [x] **TASK-903**: Componente `EcommerceHeroSlider.vue` (Carrossel de banners promocionais em tela cheia com CTAs)
- [x] **TASK-904**: Componente `TrustBar.vue` (Barra de benefícios de 4 pilares abaixo do Hero)
