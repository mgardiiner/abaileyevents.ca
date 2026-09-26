import about from '~/data/about.json'
import comingSoon from '~/data/coming-soon.json'
import contact from '~/data/contact.json'
import faq from '~/data/faq.json'
import focusData from '~/data/focus.json'
import gallery from '~/data/gallery.json'
import hero from '~/data/hero.json'
import nav from '~/data/nav.json'
import packages from '~/data/packages.json'
import rentals from '~/data/rentals.json'
import services from '~/data/services.json'
import testimonials from '~/data/testimonials.json'

// Keyed by file name in app/data/. Every page reads its copy through useContent(), so the website
// editor's preview can swap in unpublished changes.
// Where each photo's subject sits, as [x, y] percentages keyed by photo path (see photoFocus).
const focus: Record<string, [number, number]> = focusData
const files = { about, 'coming-soon': comingSoon, contact, faq, focus, gallery, hero, nav, packages, rentals, services, testimonials }
const content = reactive(files)

export type ContentFiles = typeof files
export type ContentName = keyof ContentFiles
export const contentNames = Object.keys(files) as ContentName[]

export function useContent<K extends ContentName>(name: K): ContentFiles[K] {
  return content[name] as ContentFiles[K]
}

// Swaps in new content for one file. Objects and arrays are updated in place, so a component that
// kept hold of part of a file (`const { bloomBar } = services`) sees the change too.
export function patchContent(name: ContentName, next: unknown) {
  patch(content[name], next)
}

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)

function patch(target: any, next: any) {
  if (Array.isArray(target) && Array.isArray(next)) {
    next.forEach((item, i) => {
      if (i < target.length && (isObject(target[i]) && isObject(item) || Array.isArray(target[i]) && Array.isArray(item))) patch(target[i], item)
      else target[i] = item
    })
    target.splice(next.length)
    return
  }
  for (const key of Object.keys(target)) if (!(key in next)) delete target[key]
  for (const [key, value] of Object.entries(next)) {
    const current = target[key]
    if (isObject(current) && isObject(value) || Array.isArray(current) && Array.isArray(value)) patch(current, value)
    else target[key] = value
  }
}
