# Skill: Criação de Componentes Vue 3 (`create-component.md`)

Esta skill define a receita e os passos necessários para criar componentes Vue 3 consistentes, tipados com TypeScript e testados com Vitest.

---

## 📋 Checklist de Criação de Componente

1. **Localização**:
   - Componentes genéricos de UI: `src/components/common/`
   - Componentes de layout: `src/components/layout/`
   - Componentes específicos de funcionalidade/domínio: `src/components/<dominio>/`
2. **Nome do Arquivo**: `PascalCase.vue` (ex: `BaseButton.vue`, `ProductCard.vue`).
3. **Estrutura do SFC**:
   - `<script setup lang="ts">` no topo.
   - `<template>` com HTML semântico no meio.
   - `<style scoped>` no final.
4. **Tipagem Estrita**:
   - Interface explícita para `Props`.
   - `withDefaults` para valores padrão.
   - `defineEmits` com tipagem de eventos.
5. **Teste Unitário**:
   - Criar arquivo correspondente em `src/components/**/__tests__/[NomeDoComponente].spec.ts`.
6. **Código Limpo (Zero Comentários Inúteis)**:
   - Não adicione comentários óbvios no HTML/template ou no script (como `<!-- Cabeçalho -->`, `<!-- Botão -->`, `<!-- Grid -->`, `// Função de clique`). O código e a semântica do Vue devem falar por si próprios.

---

## 🧩 Modelo Padrão de Componente (`src/components/common/BaseButton.vue`)

```vue
<script setup lang="ts">
import { computed } from 'vue'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  type: 'button'
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  { 'base-button--loading': props.loading }
])

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true"></span>
    <span class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Tamanhos */
.base-button--small {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.base-button--medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.base-button--large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

/* Variantes */
.base-button--primary {
  background-color: var(--color-primary, #0A4D68);
  color: #ffffff;
}

.base-button--primary:hover:not(:disabled) {
  background-color: #088395;
}

.base-button--secondary {
  background-color: #EBF4F6;
  color: #0A4D68;
}

.base-button--outline {
  background-color: transparent;
  border-color: #0A4D68;
  color: #0A4D68;
}
</style>
```

---

## 🧪 Modelo Padrão de Teste Unitário (`src/components/common/__tests__/BaseButton.spec.ts`)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton.vue', () => {
  it('renderiza o slot de conteúdo corretamente', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Salvar Registro'
      }
    })
    expect(wrapper.text()).toContain('Salvar Registro')
  })

  it('emite evento de click quando acionado', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('não emite click quando desabilitado', async () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('aplica classes corretas para variante e tamanho', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'secondary', size: 'large' }
    })
    expect(wrapper.classes()).toContain('base-button--secondary')
    expect(wrapper.classes()).toContain('base-button--large')
  })
})
```
