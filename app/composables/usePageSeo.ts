// Each page's title and description live in its data file under `seo`.
export function usePageSeo(seo: { title: string; description: string }) {
  useSeoMeta({
    title: seo.title,
    description: seo.description,
    ogTitle: seo.title,
    ogDescription: seo.description,
  })
}
