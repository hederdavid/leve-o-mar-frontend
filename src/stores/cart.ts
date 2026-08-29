import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { CartItem, CartCustomization } from '@/types/cart'
import type { Product } from '@/types/product'
import { toast } from 'vue-sonner'

export const useCartStore = defineStore('cart', () => {
  const items = useLocalStorage<CartItem[]>('leve-o-mar:cart-items', [])
  const isDrawerOpen = ref(false)

  const totalItemsCount = computed(() =>
    items.value.reduce((acc, item) => acc + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  )

  function openDrawer() {
    isDrawerOpen.value = true
  }

  function closeDrawer() {
    isDrawerOpen.value = false
  }

  function toggleDrawer() {
    isDrawerOpen.value = !isDrawerOpen.value
  }

  function addItem(product: Product, customization?: CartCustomization) {
    const existingIndex = items.value.findIndex((item) => item.product.id === product.id)

    if (existingIndex > -1 && items.value[existingIndex]) {
      items.value[existingIndex]!.quantity += 1
    } else {
      items.value.push({
        id: `cart-${product.id}-${Date.now()}`,
        product,
        quantity: 1,
        customization,
        addedAt: new Date().toISOString()
      })
    }

    toast.success(`"${product.name}" adicionada às suas aventuras!`, {
      description: `Destino ${product.beachName} · R$ ${product.price.toFixed(2).replace('.', ',')}`
    })

    openDrawer()
  }

  function removeItem(cartItemId: string) {
    const item = items.value.find((i) => i.id === cartItemId)
    items.value = items.value.filter((i) => i.id !== cartItemId)
    if (item) {
      toast.info(`"${item.product.name}" removida do carrinho.`)
    }
  }

  function updateQuantity(cartItemId: string, delta: number) {
    const item = items.value.find((i) => i.id === cartItemId)
    if (!item) return

    const newQty = item.quantity + delta
    if (newQty <= 0) {
      removeItem(cartItemId)
    } else {
      item.quantity = newQty
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    isDrawerOpen,
    totalItemsCount,
    subtotal,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})
