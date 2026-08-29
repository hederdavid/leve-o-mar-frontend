# Regras do Sistema & Padrões Globais (`system-rules.md`)

Este documento estabelece as diretrizes obrigatórias de arquitetura, qualidade de código, padrões de estilo, estética visual e proibições para o projeto **Leve o Mar Frontend**.

---

## 🚫 Proibições Estritas (Zero Tolerance)

1. **PROIBIDO `any` em TypeScript**:
   - Sempre defina interfaces, types ou generics apropriados.
   - Para dados dinâmicos ou desconhecidos, utilize `unknown` com type guards / validações.
2. **PROIBIDO Options API**:
   - Todo componente Vue DEVE utilizar **Composition API** com `<script setup lang="ts">`.
3. **PROIBIDO Design Genérico / "IA-Slop"**:
   - **NUNCA** utilize gradientes roxos/violetas genéricos típicos de IA.
   - **NUNCA** crie cards genéricos sem contexto marítimo ou afetivo.
   - O projeto possui identidade própria: sofisticação costeira, tons de areia quente, azul mar profundo, espuma marítima e efeito vidro fosco (*sea glass*).
4. **PROIBIDO Duplicação de Código (Violação DRY)**:
   - Se uma lógica de formatação de preço, data ou cálculo de frete se repetir, isole em `src/utils/`.
   - Se um botão, input, badge ou card possuir padrão visual recorrente, isole em `src/components/common/`.
5. **PROIBIDO mutação direta arbitrária de estado global**:
   - Mutações de estado compartilhado devem ocorrer via stores do **Pinia** através de actions tipadas.
6. **PROIBIDO `console.log` em código final de produção**:
   - Use logs apenas para debug e remova-os antes de finalizar tarefas.
7. **PROIBIDO Comentários Inúteis / Redundantes**:
   - **NÃO insira comentários triviais ou óbvios** no template, script ou CSS (ex: `<!-- Cabeçalho -->`, `<!-- Seção Hero -->`, `<!-- Botão de ação -->`, `// Executa a busca`, `<!-- Topo da rolha -->`).
   - O código deve ser autoexplicativo através de nomes semânticos e limpos.
   - Comentários só são tolerados quando explicam lógicas de negócio não triviais ou restrições complexas.
8. **PROIBIDO elementos não semânticos clicáveis sem acessibilidade**:
   - Sempre utilize tags semânticas (`<button>`, `<a>`, `<nav>`, `<header>`, `<main>`, `<section>`).

---

## 🌊 Padrões de Design & Experiência Imersiva (Anti-IA-Slop)

1. **Paleta Marítima Autêntica**:
   - **Primárias**: Deep Ocean (`#0A2647`), Marine (`#144272`), Coastal Wave (`#205295`).
   - **Acentos e Destaque**: Turquesa Coral (`#05BFDB`), Dourado Areia (`#F5EBE0`), Sal Marinho (`#F8FAFC`).
   - **Glassmorphism Costeiro**: Superfícies translúcidas com `backdrop-filter: blur(12px)` e bordas finas semi-transparentes simulando vidro marinho lapidado.
2. **Tipografia Editorial**:
   - Use fontes elegantes e com peso expressivo para títulos de destinos e histórias (`Playfair Display`, `Outfit`, `Cormorant Garamond`).
   - Use fontes limpas e com boa legibilidade para dados técnicos, notas olfativas e valores (`Inter`, `Plus Jakarta Sans`).
3. **Microinterações Sensoriais**:
   - Efeitos suaves de hover com elevação e iluminação sutil.
   - Feedbacks visuais imediatos ao adicionar ao carrinho via `vue-sonner`.
   - Celebração com `canvas-confetti` na finalização de compra.
   - Skeletons animados com brilho perolado para estados de carregamento.

---

## 📐 Padrões Arquiteturais e de Código

### 1. Componentes Vue 3
- Utilize exclusivamente `<script setup lang="ts">`.
- Ordem dos blocos no SFC:
  1. `<script setup lang="ts">`
  2. `<template>`
  3. `<style scoped>`
- Declare `props` e `emits` exclusivamente com tipos TypeScript puros:
  ```vue
  <script setup lang="ts">
  interface Props {
    title: string
    beachName: string
    price: number
    isLimitedEdition?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    isLimitedEdition: false
  })

  const emit = defineEmits<{
    (e: 'select', beachId: string): void
    (e: 'addToCart', productId: string): void
  }>()
  </script>
  ```

### 2. Dados Mockados e Serviços
- Dados mockados vivem exclusivamente em `src/mocks/` e devem ser ricos, com destinos reais, coordenadas geográficas exatas e fotos reais de alta definição.
- A camada de serviço em `src/services/` simula latência de rede realista (ex: `delay(350)`) para que a aplicação sempre exerça estados de `isLoading`, `error` e `success`.

### 3. Gerenciamento de Estado (Pinia)
- Utilize a sintaxe de **Setup Store** (`defineStore('nome', () => { ... })`).
- Persistência de carrinho e preferências utilizando `@vueuse/core` (`useLocalStorage`).

### 4. Testes e Qualidade
- Todo componente reutilizável deve possuir teste unitário em `__tests__/` com **Vitest** e **@vue/test-utils**.
- O código deve compilar 100% sem erros no `npm run type-check` (`vue-tsc`).
