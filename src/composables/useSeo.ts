export interface SeoMetaOptions {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'product' | 'article'
}

const DEFAULT_TITLE = 'Leve o Mar · Garrafas Temáticas com Água e Memórias do Litoral Brasileiro'
const DEFAULT_DESCRIPTION =
  'Coleção artesanal de garrafas colecionáveis com água do mar microfiltrada, coordenadas náuticas e caligrafia afetiva das praias mais icônicas do Brasil.'
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'

function updateMetaTag(attributeName: string, attributeValue: string, content: string) {
  if (typeof document === 'undefined') return

  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attributeName, attributeValue)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function updateCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return

  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

export function useSeo(options: SeoMetaOptions = {}) {
  if (typeof document === 'undefined') return

  const fullTitle = options.title ? `${options.title} | Leve o Mar` : DEFAULT_TITLE
  const description = options.description || DEFAULT_DESCRIPTION
  const image = options.image || DEFAULT_IMAGE
  const currentUrl = options.url || window.location.href
  const type = options.type || 'website'

  // Título e Descrição Básica
  document.title = fullTitle
  updateMetaTag('name', 'description', description)

  // Open Graph (WhatsApp, Facebook, LinkedIn)
  updateMetaTag('property', 'og:title', fullTitle)
  updateMetaTag('property', 'og:description', description)
  updateMetaTag('property', 'og:image', image)
  updateMetaTag('property', 'og:url', currentUrl)
  updateMetaTag('property', 'og:type', type)
  updateMetaTag('property', 'og:site_name', 'Leve o Mar')

  // Twitter Cards
  updateMetaTag('name', 'twitter:card', 'summary_large_image')
  updateMetaTag('name', 'twitter:title', fullTitle)
  updateMetaTag('name', 'twitter:description', description)
  updateMetaTag('name', 'twitter:image', image)

  // Canonical Link
  updateCanonicalUrl(currentUrl)
}
