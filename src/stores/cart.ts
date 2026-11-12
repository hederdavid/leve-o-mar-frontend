import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { CartItem, CartCustomization, ShippingOption } from '@/types/cart'
import type { Product } from '@/types/product'
import { toast } from 'vue-sonner'
import { analytics } from '@/services/analytics'

export const useCartStore = defineStore('cart', () => {
  const items = useLocalStorage<CartItem[]>('leve-o-mar:cart-items', [])
  const isDrawerOpen = ref(false)
  const lastAddedItem = ref<CartItem | null>(null)
  const shippingCep = useLocalStorage<string>('leve-o-mar:shipping-cep', '40140-130')
  const selectedShipping = useLocalStorage<ShippingOption | null>('leve-o-mar:selected-shipping', null)
  const couponCode = useLocalStorage<string>('leve-o-mar:coupon-code', '')

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

  function setShipping(cep: string, option: ShippingOption | null) {
    shippingCep.value = cep
    selectedShipping.value = option
  }

  function addItem(product: Product, customization?: CartCustomization) {
    const existingIndex = items.value.findIndex((item) => item.product.id === product.id)

    let targetItem: CartItem
    if (existingIndex > -1 && items.value[existingIndex]) {
      items.value[existingIndex]!.quantity += 1
      if (customization) {
        items.value[existingIndex]!.customization = {
          ...items.value[existingIndex]!.customization,
          ...customization
        }
      }
      targetItem = items.value[existingIndex]!
    } else {
      targetItem = {
        id: `cart-${product.id}-${Date.now()}`,
        product,
        quantity: 1,
        customization,
        addedAt: new Date().toISOString()
      }
      items.value.push(targetItem)
    }

    lastAddedItem.value = targetItem

    analytics.track('add_to_cart', {
      id: product.id,
      name: product.name,
      beach: product.beachName,
      price: product.price,
      hasCustomization: !!customization
    })

    toast.success(`"${product.name}" adicionada às suas aventuras!`, {
      description: `Destino ${product.beachName} · R$ ${product.price.toFixed(2).replace('.', ',')}`
    })

    openDrawer()
  }

  function removeItem(cartItemId: string) {
    const item = items.value.find((i) => i.id === cartItemId)
    items.value = items.value.filter((i) => i.id !== cartItemId)
    if (lastAddedItem.value?.id === cartItemId) {
      lastAddedItem.value = items.value[0] || null
    }
    if (item) {
      analytics.track('remove_from_cart', {
        id: item.product.id,
        name: item.product.name
      })
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
    lastAddedItem.value = null
  }

  return {
    items,
    isDrawerOpen,
    lastAddedItem,
    shippingCep,
    selectedShipping,
    couponCode,
    totalItemsCount,
    subtotal,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setShipping,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})
