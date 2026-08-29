# Skill: Integração com APIs (`api-integration.md`)

Esta skill orienta o desenvolvimento da camada de comunicação HTTP, definição de tipos de payload/resposta e consumo reativo em composables e stores Pinia.

---

## 🏗️ Arquitetura da Camada de API

A comunicação externa segue o fluxo em 4 camadas:
1. **Tipagem (`src/types/`)**: Interfaces de requisição, resposta e modelos de domínio.
2. **Cliente HTTP / Serviços (`src/services/`)**: Funções isoladas que executam `fetch` ou o cliente HTTP configurado.
3. **Composables (`src/composables/`)**: Hooks reativos para controle de `isLoading`, `error`, `data` e métodos de execução.
4. **Stores / Componentes (`src/stores/` e `src/views/`)**: Consumidores finais do estado.

---

## 1. Definição de Tipos (`src/types/product.ts`)

```typescript
export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
}

export interface ProductFilterParams {
  category?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}
```

---

## 2. Camada de Serviço (`src/services/productService.ts`)

```typescript
import type { Product, ProductFilterParams, PaginatedResponse } from '@/types/product'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const productService = {
  async getAll(params?: ProductFilterParams): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    const response = await fetch(`${API_BASE_URL}/products?${query}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Falha ao buscar produtos: ${response.statusText}`)
    }

    return response.json()
  },

  async getById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) {
      throw new Error(`Produto não encontrado: ${id}`)
    }
    return response.json()
  }
}
```

---

## 3. Composable Reativo (`src/composables/useProducts.ts`)

```typescript
import { ref } from 'vue'
import type { Product, ProductFilterParams } from '@/types/product'
import { productService } from '@/services/productService'

export function useProducts() {
  const products = ref<Product[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const total = ref<number>(0)

  async function fetchProducts(params?: ProductFilterParams) {
    isLoading.value = true
    error.value = null
    try {
      const data = await productService.getAll(params)
      products.value = data.items
      total.value = data.total
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro inesperado ao buscar produtos'
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    isLoading,
    error,
    total,
    fetchProducts
  }
}
```

---

## 4. Integração com Pinia Store (`src/stores/products.ts`)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductFilterParams } from '@/types/product'
import { productService } from '@/services/productService'

export const useProductStore = defineStore('products', () => {
  const items = ref<Product[]>([])
  const selectedProduct = ref<Product | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const productCount = computed(() => items.value.length)

  async function loadProducts(params?: ProductFilterParams) {
    isLoading.value = true
    error.value = null
    try {
      const data = await productService.getAll(params)
      items.value = data.items
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar produtos'
    } finally {
      isLoading.value = false
    }
  }

  function selectProduct(product: Product) {
    selectedProduct.value = product
  }

  return {
    items,
    selectedProduct,
    isLoading,
    error,
    productCount,
    loadProducts,
    selectProduct
  }
})
```
