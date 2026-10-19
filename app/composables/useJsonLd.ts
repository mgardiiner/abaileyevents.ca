// schema.org structured data, prerendered into each page so search engines and AI answer
// engines read the business, its services and its FAQ as facts rather than inferring them.
export const SITE_URL = 'https://abaileyevents.ca'
export const BUSINESS = { '@id': `${SITE_URL}/#business` }

// "Simcoe Muskoka" is two regions; naming both lets either one match a search.
export const AREA_SERVED = [
  { '@type': 'AdministrativeArea', name: 'Simcoe County, Ontario' },
  { '@type': 'AdministrativeArea', name: 'Muskoka, Ontario' },
]

export function useJsonLd(key: string, data: () => Record<string, unknown>) {
  useHead({
    script: [
      {
        key: `ld-${key}`,
        type: 'application/ld+json',
        innerHTML: computed(() => JSON.stringify({ '@context': 'https://schema.org', ...data() })),
      },
    ],
  })
}

// "$1,500" → an Offer in CAD; a "Starting at" price becomes a minimum. No price, no offer.
export function offerFor(price?: string, startingAt = false) {
  const amount = Number(price?.replace(/[^\d.]/g, ''))
  if (!amount) return undefined
  return startingAt
    ? { '@type': 'Offer', priceCurrency: 'CAD', priceSpecification: { '@type': 'PriceSpecification', minPrice: amount, priceCurrency: 'CAD' } }
    : { '@type': 'Offer', priceCurrency: 'CAD', price: amount }
}
