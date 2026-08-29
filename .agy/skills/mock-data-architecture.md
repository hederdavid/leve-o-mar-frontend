# Skill: Arquitetura de Dados Mockados (`mock-data-architecture.md`)

Esta skill orienta a modelagem, estrutura e consumo de dados mockados ricos, ultra-realistas e estritamente tipados para a aplicação **Leve o Mar**.

---

## 🎯 Princípios dos Dados Mockados

1. **Realismo e Riqueza de Conteúdo com Foco na Garrafa e na Água do Mar**:
   - O produto central é a **garrafa artesanal que captura a água e a essência de praias brasileiras** reais (ex: *Praia do Espelho/BA*, *Baía dos Porcos/PE*, *Praia do Rosa/SC*, *Maragogi/AL*).
   - Destaque para a **tonalidade e pureza da água do mar** (turquesa, esmeralda, azul profundo), tipo de mar, coordenadas geográficas exatas gravadas no rótulo, tipo de vidro, rolha selada e história da praia.

2. **Tipagem Centralizada**:
   - Todas as entidades de domínio possuem interfaces em `src/types/` (`beach.ts`, `product.ts`, `order.ts`).

3. **Simulação de Latência Realista**:
   - As funções de serviço em `src/services/` devem simular latência de rede entre 200ms e 400ms para validar skeletons, loaders e estados assíncronos.

---

## 📂 Estrutura de Arquivos Mock

```text
src/
├── types/
│   ├── beach.ts          # Interface de Praia / Destino
│   ├── product.ts        # Interface de Produto / Garrafa Colecionável
│   ├── review.ts         # Interface de Avaliações e Opiniões de Clientes
│   ├── cart.ts           # Interface de Item e Resumo do Carrinho
│   └── filter.ts         # Parâmetros de Filtros e Busca
├── mocks/
│   ├── beaches.ts        # Array de praias com dados completos e coordenadas
│   ├── products.ts       # Garrafas colecionáveis associadas aos destinos
│   └── reviews.ts        # Banco mockado de avaliações por produto
└── services/
    ├── delay.ts          # Utilitário de atraso assíncrono simulado
    ├── beachService.ts   # Consulta de praias com busca por texto e região
    ├── productService.ts # Catálogo com paginação e filtros
    ├── reviewService.ts  # Consulta e criação de avaliações com filtro por estrelas
    └── orderService.ts   # Simulação de checkout e cálculo de frete
```

---

## 💻 Exemplo de Serviço com Latência Simulada (`src/services/productService.ts`)

```typescript
import { mockProducts } from '@/mocks/products'
import type { Product, ProductFilterParams } from '@/types/product'
import { delay } from '@/services/delay'

export const productService = {
  async getAll(params?: ProductFilterParams): Promise<Product[]> {
    await delay(300)
    let filtered = [...mockProducts]

    if (params?.region) {
      filtered = filtered.filter((p) => p.region === params.region)
    }

    if (params?.isLimitedEdition !== undefined) {
      filtered = filtered.filter((p) => p.isLimitedEdition === params.isLimitedEdition)
    }

    if (params?.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.beachName.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q)
      )
    }

    return filtered
  },

  async getById(id: string): Promise<Product> {
    await delay(250)
    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      throw new Error(`Produto não encontrado para o ID: ${id}`)
    }
    return product
  }
}
```
