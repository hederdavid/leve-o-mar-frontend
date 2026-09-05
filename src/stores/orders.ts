import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Order } from '@/types/order'
import { mockOrders } from '@/mocks/orders'

export const useOrdersStore = defineStore('orders', () => {
  const orders = useLocalStorage<Order[]>('leve-o-mar:user-orders', mockOrders)

  const activeOrders = computed(() =>
    orders.value.filter((o) => o.status !== 'DELIVERED')
  )

  const completedOrders = computed(() =>
    orders.value.filter((o) => o.status === 'DELIVERED')
  )

  const allCertificates = computed(() =>
    orders.value.flatMap((o) => o.certificates || [])
  )

  const totalBottlesCount = computed(() =>
    orders.value.reduce((total, order) => {
      const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
      return total + itemsCount
    }, 0)
  )

  function addOrder(order: Order) {
    orders.value.unshift(order)
  }

  function getOrderById(id: string): Order | undefined {
    return orders.value.find((o) => o.id === id)
  }

  function getOrderByTracking(code: string): Order | undefined {
    const clean = code.trim().toUpperCase()
    return orders.value.find(
      (o) => o.trackingCode.toUpperCase() === clean || o.orderNumber.toUpperCase() === clean
    )
  }

  function getOrderByOrderNumber(orderNumber: string): Order | undefined {
    const clean = orderNumber.trim().toUpperCase()
    return orders.value.find((o) => o.orderNumber.toUpperCase() === clean)
  }

  return {
    orders,
    activeOrders,
    completedOrders,
    allCertificates,
    totalBottlesCount,
    addOrder,
    getOrderById,
    getOrderByTracking,
    getOrderByOrderNumber
  }
})
