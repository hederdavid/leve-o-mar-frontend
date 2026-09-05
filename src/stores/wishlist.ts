import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { WishlistItem } from '@/types/wishlist'
import type { Product } from '@/types/product'
import { toast } from 'vue-sonner'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = useLocalStorage<WishlistItem[]>('leve-o-mar:wishlist-items', [])

  const count = computed(() => items.value.length)

  function isInWishlist(productId: string): boolean {
    return items.value.some((item) => item.productId === productId)
  }

  function toggleWishlist(product: Product) {
    const exists = isInWishlist(product.id)

    if (exists) {
      items.value = items.value.filter((item) => item.productId !== product.id)
      toast.info(`"${product.name}" removida das praias desejadas.`)
    } else {
      items.value.push({
        productId: product.id,
        productSlug: product.slug,
        beachName: product.beachName,
        state: product.state,
        region: product.region,
        price: product.price,
        imageUrl: product.bottleImage || product.images?.primary || '',
        waterTone: product.waterType || 'Águas Cristalinas',
        addedAt: new Date().toISOString()
      })
      toast.success(`"${product.name}" salva nas suas praias desejadas!`)
    }
  }

  function removeFromWishlist(productId: string) {
    items.value = items.value.filter((item) => item.productId !== productId)
    toast.info('Item removido da lista de desejos.')
  }

  return {
    items,
    count,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist
  }
})
