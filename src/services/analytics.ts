import { ref } from 'vue'
import posthog from 'posthog-js'

export type AnalyticsEventType =
  | '$pageview'
  | 'view_product'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'search_query'
  | 'checkout_step'
  | 'complete_purchase'
  | 'bundle_created'
  | 'customizer_used'
  | 'shipping_calculated'
  | 'wishlist_toggle'
  | 'core_web_vitals'

export interface AnalyticsEvent {
  id: string
  name: AnalyticsEventType
  properties: Record<string, unknown>
  timestamp: string
}

export interface WebVitalsMetrics {
  lcp?: number
  cls?: number
  fcp?: number
  ttfb?: number
}

class AnalyticsService {
  private isPosthogInitialized = false
  public readonly events = ref<AnalyticsEvent[]>([])
  public readonly webVitals = ref<WebVitalsMetrics>({})
  public readonly isLive = ref(false)

  constructor() {
    this.loadPersistedEvents()
    this.initPostHog()
    this.initWebVitalsObserver()
  }

  private loadPersistedEvents() {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem('leve-o-mar:analytics-events')
      if (stored) {
        this.events.value = JSON.parse(stored)
      }
    } catch {
      // Ignora erro de parse local
    }
  }

  private persistEvents() {
    if (typeof window === 'undefined') return
    try {
      // Mantém os últimos 50 eventos no buffer local para inspeção
      const recent = this.events.value.slice(-50)
      localStorage.setItem('leve-o-mar:analytics-events', JSON.stringify(recent))
    } catch {
      // Ignora restrição de quota
    }
  }

  private initPostHog() {
    if (typeof window === 'undefined') return
    const key = import.meta.env.VITE_POSTHOG_KEY
    const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

    if (key) {
      try {
        posthog.init(key, {
          api_host: host,
          autocapture: false,
          capture_pageview: false,
          disable_session_recording: true
        })
        this.isPosthogInitialized = true
        this.isLive.value = true
      } catch {
        this.isPosthogInitialized = false
      }
    }
  }

  private initWebVitalsObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    try {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          const lcp = Math.round(lastEntry.startTime)
          this.webVitals.value.lcp = lcp
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

      // FCP (First Contentful Paint)
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const fcp = Math.round(entry.startTime)
            this.webVitals.value.fcp = fcp
          }
        }
      })
      paintObserver.observe({ type: 'paint', buffered: true })

      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as { hadRecentInput?: boolean }).hadRecentInput) {
            clsValue += (entry as { value?: number }).value || 0
            this.webVitals.value.cls = parseFloat(clsValue.toFixed(3))
          }
        }
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })

      // TTFB (Time to First Byte)
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navEntries[0]) {
        this.webVitals.value.ttfb = Math.round(navEntries[0].responseStart)
      }
    } catch {
      // Navegadores sem suporte a certos tipos de observação
    }
  }

  public track(name: AnalyticsEventType, properties: Record<string, unknown> = {}) {
    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name,
      properties: {
        ...properties,
        url: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      },
      timestamp: new Date().toLocaleTimeString('pt-BR')
    }

    // Armazena no buffer reativo local
    this.events.value.unshift(event)
    if (this.events.value.length > 80) {
      this.events.value.pop()
    }
    this.persistEvents()

    // Envia ao PostHog se inicializado
    if (this.isPosthogInitialized) {
      posthog.capture(name, properties)
    }

    // Log estruturado no console durante o desenvolvimento
    if (import.meta.env.DEV) {
      console.info(
        '%c[Leve o Mar · Analytics]',
        'color: #05BFDB; font-weight: bold; background: #0A2B42; padding: 2px 6px; border-radius: 4px;',
        name,
        properties
      )
    }
  }

  public pageview(path: string, title?: string) {
    this.track('$pageview', {
      path,
      title: title || (typeof document !== 'undefined' ? document.title : ''),
      referrer: typeof document !== 'undefined' ? document.referrer : ''
    })
  }

  public clearEvents() {
    this.events.value = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('leve-o-mar:analytics-events')
    }
  }
}

export const analytics = new AnalyticsService()
