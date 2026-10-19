// Prerendered at build time: a plain-text brief for AI assistants (llmstxt.org), built from the
// same app/data files as the pages, so an editor publish updates it on the next deploy.
import about from '../../app/data/about.json'
import contact from '../../app/data/contact.json'
import faq from '../../app/data/faq.json'
import gallery from '../../app/data/gallery.json'
import hero from '../../app/data/hero.json'
import packages from '../../app/data/packages.json'
import rentals from '../../app/data/rentals.json'
import services from '../../app/data/services.json'

const SITE = 'https://abaileyevents.ca'

export default defineEventHandler((event) => {
  const price = (item: { pricePrefix?: string; price?: string }) =>
    item.price ? `${item.pricePrefix ? `${item.pricePrefix} ` : ''}${item.price} CAD. ` : 'Custom quotes. '

  const lines = [
    '# ABailey Events',
    '',
    `> ${hero.seo.description}`,
    '',
    `ABailey Events is based in ${contact.location} and serves ${contact.serviceArea} (Simcoe County and Muskoka, Ontario, Canada). It is run by Ayla Bailey, a WPIC certified wedding planner. ${services.intro}`,
    '',
    '## Services',
    '',
    ...packages.items.map((item) => `- [${item.name}](${SITE}/event-planning#packages): ${price(item)}${item.summary}`),
    `- [${services.bloomBar.title}](${SITE}/event-planning#bloom-bar): Custom quotes. ${services.bloomBar.body.join(' ')} Perfect for ${services.bloomBar.perfectFor.join(', ').toLowerCase()}.`,
    `- [${rentals.package.name}](${SITE}/decor-rentals): ${price(rentals.package)}${rentals.package.summary}`,
    `- Custom quotes: ${packages.custom.body}`,
    '',
    '## Frequently asked questions',
    '',
    ...faq.groups.flatMap((group) => group.items.map((item) => `- **${item.q}** ${item.a}`)),
    '',
    '## Contact',
    '',
    `- [Request a consultation or quote](${SITE}/contact)`,
    `- Email: ${contact.email}`,
    `- Instagram: [@${contact.instagram}](${contact.instagramUrl})`,
    '',
    '## Pages',
    '',
    `- [Home](${SITE}/): ${hero.seo.description}`,
    `- [Event Planning](${SITE}/event-planning): ${services.seo.description}`,
    `- [Décor Rentals](${SITE}/decor-rentals): ${rentals.seo.description}`,
    `- [About](${SITE}/about): ${about.seo.description}`,
    `- [Gallery](${SITE}/gallery): ${gallery.seo.description}`,
    `- [FAQ](${SITE}/faq): ${faq.seo.description}`,
    `- [Contact](${SITE}/contact): ${contact.seo.description}`,
    '',
  ]

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return lines.join('\n')
})
