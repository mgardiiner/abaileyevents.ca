import type { Component } from 'vue'
import { Flower2, Gem, Hourglass, House, Images, Mail, MessageCircleQuestionMark, MessageSquareQuote, Tag, UserRound } from 'lucide-vue-next'
import type { ContentName } from '~/composables/useContent'

// What the website editor shows: one section per part of the site, in the words the site uses,
// each mapping its fields onto the content files in app/data/. Keys are dot paths inside the file
// (`package.features`, `ctas.0.label`); a field's `file` overrides its group's.
//
// Adding something new to a data file? Add a field here so it can be edited too.

export interface PreviewTarget {
  path: string
  hash?: string
}

interface Base {
  key: string
  label: string
  help?: string
  file?: ContentName
  // Only show the field while this is true, e.g. a note that's only visible on sample reviews.
  showIf?: (data: any) => boolean
}

export interface TextField extends Base {
  type: 'text' | 'textarea'
  placeholder?: string
  required?: boolean
  // A soft limit: the editor counts characters and says when it's over, but doesn't stop typing.
  max?: number
  // Keeps related values in step, e.g. the Instagram links when the username changes.
  derive?: (value: string, data: any) => void
}

export interface NumberField extends Base {
  type: 'number'
  min: number
  max: number
}

export interface ToggleField extends Base {
  type: 'toggle'
  // The stored value is the opposite of the switch, e.g. "These are real reviews" -> placeholder: false.
  invert?: boolean
}

export interface ListField extends Base {
  type: 'list'
  multiline?: boolean
  itemLabel: string
  addLabel: string
}

export interface CardsField extends Base {
  type: 'cards'
  itemLabel: string
  // The item field shown as each card's title while it's folded.
  titleKey: string
  // A short item field shown beside the title, like a package's price.
  noteKey?: string
  fields: Field[]
  // Leave out to keep a fixed set: the cards can be edited but not added, removed or moved.
  addLabel?: string
  template?: Record<string, unknown>
  // Short items (a label or two) shown as rows instead of folding cards.
  compact?: boolean
}

export interface PhotoField extends Base {
  type: 'photo'
  altKey?: string
  // Where new uploads go, under public/images/.
  folder: string
  optional?: boolean
}

// A list of photos: `{ src, alt }` records, or, with `fromGallery`, plain paths of gallery photos.
export interface PhotosField extends Base {
  type: 'photos'
  folder: string
  fromGallery?: boolean
  min?: number
  max?: number
}

export interface GalleryField extends Base {
  type: 'gallery'
}

export interface NoteField {
  type: 'note'
  key?: undefined
  label?: undefined
  file?: undefined
  showIf?: undefined
  text: string
  link?: { section: string, label: string }
}

export type Field = TextField | NumberField | ToggleField | ListField | CardsField | PhotoField | PhotosField | GalleryField | NoteField

export interface Group {
  id: string
  title: string
  help?: string
  file: ContentName
  preview?: PreviewTarget
  // Starts folded; for optional extras like search-engine text.
  folded?: boolean
  fields: Field[]
}

export interface Section {
  id: string
  title: string
  blurb: string
  icon: Component
  preview: PreviewTarget
  groups: Group[]
}

const google = (file: ContentName): Group => ({
  id: 'google',
  title: 'Google & link previews',
  help: 'How this page appears in Google and when someone shares a link to it. Optional: what\'s here already works well.',
  file,
  folded: true,
  fields: [
    { type: 'text', key: 'seo.title', label: 'Page title', help: 'Shown on the browser tab and as the headline in Google.', max: 60 },
    { type: 'textarea', key: 'seo.description', label: 'Description', help: 'The line or two under the headline in Google.', max: 160 },
  ],
})

const smallHeading = (key: string): TextField => ({ type: 'text', key, label: 'Small heading', help: 'The little capitals line above the heading.' })

export const sections: Section[] = [
  {
    id: 'home',
    title: 'Home page',
    blurb: 'Your headline, slideshow and the first things visitors see.',
    icon: House,
    preview: { path: '/' },
    groups: [
      {
        id: 'top',
        title: 'Top of the page',
        help: 'The first thing visitors see: your headline, slideshow and buttons.',
        file: 'hero',
        preview: { path: '/', hash: '#top' },
        fields: [
          { type: 'text', key: 'kicker', label: 'Line above the headline', help: 'Separate the parts with a dot ( · ), like "Wedding & Event Planning · Simcoe Muskoka".' },
          { type: 'text', key: 'title', label: 'Headline', required: true },
          { type: 'text', key: 'titleEmphasis', label: 'Headline, second line', help: 'Shown in italics under the first line.' },
          { type: 'text', key: 'scriptLine', label: 'Handwritten line', help: 'The script-style line under the headline.' },
          { type: 'textarea', key: 'sub', label: 'Introduction' },
          { type: 'text', key: 'ctas.0.label', label: 'First button', help: 'Opens the contact page.', required: true },
          { type: 'text', key: 'ctas.1.label', label: 'Second button', help: 'Goes to your packages.', required: true },
          { type: 'photos', key: 'slides', label: 'Slideshow photos', help: 'They fade from one to the next, starting with the first. Upright (portrait) photos fit best.', folder: 'site', min: 1, max: 8 },
          { type: 'photo', key: 'accent.src', altKey: 'accent.alt', label: 'Small round photo', help: 'Sits on the corner of the slideshow.', folder: 'site' },
          { type: 'list', key: 'trust', label: 'Highlights strip', help: 'The band of short phrases under the top section.', itemLabel: 'Highlight', addLabel: 'Add a highlight' },
          { type: 'text', key: 'tagline', label: 'Tagline', help: 'Shown in the footer at the bottom of every page.' },
        ],
      },
      {
        id: 'what-we-do',
        title: 'What we do',
        help: 'The three photo cards introducing your services.',
        file: 'services',
        preview: { path: '/', hash: '#services' },
        fields: [
          smallHeading('eyebrow'),
          { type: 'text', key: 'title', label: 'Heading', required: true },
          { type: 'textarea', key: 'intro', label: 'Introduction' },
          {
            type: 'cards',
            key: 'offerings',
            label: 'Cards',
            itemLabel: 'Card',
            titleKey: 'title',
            fields: [
              { type: 'text', key: 'title', label: 'Title', required: true },
              { type: 'textarea', key: 'summary', label: 'Short description' },
              { type: 'text', key: 'meta', label: 'Tag on the photo', help: 'Usually the price, like "Packages from $800".' },
              { type: 'photo', key: 'photo', altKey: 'photoAlt', label: 'Photo', folder: 'site' },
              { type: 'text', key: 'cta', label: 'Link text' },
            ],
          },
          { type: 'textarea', key: 'also', label: 'Line under the cards', help: 'Also shown under the Bloom Bar on the Event Planning page.' },
          { type: 'text', key: 'alsoCta', label: 'Linked words at the end of that line', help: 'Opens the contact page.' },
        ],
      },
      {
        id: 'gallery-preview',
        title: 'Gallery preview',
        file: 'gallery',
        preview: { path: '/', hash: '#gallery' },
        fields: [
          { type: 'text', key: 'homeTitle', label: 'Heading', required: true },
          { type: 'photos', key: 'highlights', label: 'Photos', help: 'Five photos from your gallery. The first one is shown largest.', folder: 'gallery', fromGallery: true, min: 5, max: 5 },
          { type: 'text', key: 'homeCta', label: 'Button text' },
        ],
      },
      {
        id: 'meet-ayla',
        title: 'Meet Ayla',
        file: 'about',
        preview: { path: '/', hash: '#about' },
        fields: [
          { type: 'note', text: 'The portrait, heading and first paragraph here come from the About page.', link: { section: 'about', label: 'Edit the About page' } },
          smallHeading('teaserEyebrow'),
          { type: 'text', key: 'teaserCta', label: 'Button text' },
        ],
      },
      google('hero'),
    ],
  },
  {
    id: 'planning',
    title: 'Event Planning',
    blurb: 'Wedding planning and your Bloom Bar.',
    icon: Gem,
    preview: { path: '/event-planning' },
    groups: [
      {
        id: 'top',
        title: 'Top of the page',
        file: 'services',
        preview: { path: '/event-planning' },
        fields: [
          smallHeading('page.eyebrow'),
          { type: 'text', key: 'page.title', label: 'Heading', required: true },
          { type: 'text', key: 'page.emphasis', label: 'Heading, second line', help: 'Shown in italics.' },
          { type: 'textarea', key: 'page.intro', label: 'Introduction' },
          { type: 'text', key: 'page.sections.0.label', label: 'First shortcut link', help: 'Jumps down to Wedding planning.' },
          { type: 'text', key: 'page.sections.1.label', label: 'Second shortcut link', help: 'Jumps down to your packages.' },
          { type: 'text', key: 'page.sections.2.label', label: 'Third shortcut link', help: 'Jumps down to the Bloom Bar.' },
          { type: 'photo', key: 'page.photo', altKey: 'page.photoAlt', label: 'Wide photo', help: 'Shown wide across the page, so a landscape photo works best.', folder: 'site' },
        ],
      },
      {
        id: 'wedding-planning',
        title: 'Wedding planning',
        file: 'services',
        preview: { path: '/event-planning', hash: '#wedding-planning' },
        fields: [
          smallHeading('featured.tag'),
          { type: 'text', key: 'featured.title', label: 'Heading', required: true },
          { type: 'list', key: 'featured.body', label: 'Paragraphs', multiline: true, itemLabel: 'Paragraph', addLabel: 'Add a paragraph' },
          { type: 'text', key: 'featured.cta', label: 'Button text', help: 'Jumps down to your packages.' },
          { type: 'photo', key: 'featured.photo', altKey: 'featured.photoAlt', label: 'Main photo', folder: 'site' },
          { type: 'photo', key: 'featured.detail', altKey: 'featured.detailAlt', label: 'Small square photo', help: 'Overlaps the corner of the main photo.', folder: 'site' },
          { type: 'note', text: 'The package prices listed here come from Packages & prices.', link: { section: 'prices', label: 'Edit packages & prices' } },
        ],
      },
      {
        id: 'bloom-bar',
        title: 'Bloom Bar',
        file: 'services',
        preview: { path: '/event-planning', hash: '#bloom-bar' },
        fields: [
          smallHeading('bloomBar.tag'),
          { type: 'text', key: 'bloomBar.title', label: 'Heading', required: true },
          { type: 'list', key: 'bloomBar.body', label: 'Paragraphs', multiline: true, itemLabel: 'Paragraph', addLabel: 'Add a paragraph' },
          { type: 'text', key: 'bloomBar.perfectForLabel', label: 'Heading above the occasions' },
          { type: 'list', key: 'bloomBar.perfectFor', label: 'Occasions', itemLabel: 'Occasion', addLabel: 'Add an occasion' },
          { type: 'text', key: 'bloomBar.cta', label: 'Button text', help: 'Opens the contact page.' },
          { type: 'text', key: 'bloomBar.galleryCta', label: 'Gallery link text', help: 'Opens the gallery showing only Bloom Bar photos.' },
          { type: 'photo', key: 'bloomBar.photo', altKey: 'bloomBar.photoAlt', label: 'Round photo', folder: 'site' },
          { type: 'photo', key: 'bloomBar.detail', altKey: 'bloomBar.detailAlt', label: 'Small arched photo', folder: 'site' },
          { type: 'note', text: 'The questions near the bottom of this page are your planning questions.', link: { section: 'faq', label: 'Edit questions' } },
        ],
      },
      google('services'),
    ],
  },
  {
    id: 'prices',
    title: 'Packages & prices',
    blurb: 'Your wedding packages, what\'s included, and every price on the site.',
    icon: Tag,
    preview: { path: '/event-planning', hash: '#packages' },
    groups: [
      {
        id: 'wedding-packages',
        title: 'Wedding packages',
        help: 'Shown on the Event Planning page.',
        file: 'packages',
        preview: { path: '/event-planning', hash: '#packages' },
        fields: [
          smallHeading('eyebrow'),
          { type: 'text', key: 'title', label: 'Heading', required: true },
          { type: 'textarea', key: 'intro', label: 'Introduction' },
          {
            type: 'cards',
            key: 'items',
            label: 'Packages',
            itemLabel: 'Package',
            titleKey: 'name',
            noteKey: 'price',
            addLabel: 'Add a package',
            template: { name: '', tag: '', pricePrefix: 'Starting at', price: '', summary: '', highlights: [], features: [], goal: '', cta: 'Book a Consultation' },
            fields: [
              { type: 'text', key: 'name', label: 'Package name', required: true },
              { type: 'text', key: 'tag', label: 'Short tagline' },
              { type: 'text', key: 'pricePrefix', label: 'Words before the price', help: 'Like "Starting at". Leave empty to show just the price.' },
              { type: 'text', key: 'price', label: 'Price', placeholder: '$800', required: true },
              { type: 'textarea', key: 'summary', label: 'Description' },
              { type: 'list', key: 'highlights', label: 'At-a-glance highlights', help: 'Aim for five short highlights. Keep every inclusion in the full list below. If empty, the first five inclusions are shown.', itemLabel: 'Highlight', addLabel: 'Add a highlight' },
              { type: 'list', key: 'features', label: 'Full inclusion list', help: 'Shown when visitors open the full package details.', itemLabel: 'Item', addLabel: 'Add something included' },
              { type: 'textarea', key: 'goal', label: 'The goal', help: 'A closing line inside the full package details.' },
              { type: 'text', key: 'cta', label: 'Button text', help: 'Opens the contact page.' },
            ],
          },
        ],
      },
      {
        id: 'custom-quote',
        title: 'Custom quote box',
        help: 'Sits under the packages.',
        file: 'packages',
        preview: { path: '/event-planning', hash: '#packages' },
        fields: [
          { type: 'text', key: 'custom.title', label: 'Heading' },
          { type: 'textarea', key: 'custom.body', label: 'Text' },
          { type: 'text', key: 'custom.cta', label: 'Button text' },
        ],
      },
      {
        id: 'home-prices',
        title: 'Price tags on the Home page',
        help: 'The small tags on the "What we do" photos. Update these when your prices change.',
        file: 'services',
        preview: { path: '/', hash: '#services' },
        fields: [
          { type: 'text', key: 'offerings.0.meta', label: 'Wedding planning card', placeholder: 'Packages from $800' },
          { type: 'text', key: 'offerings.1.meta', label: 'Bloom Bar card', placeholder: 'Custom quotes' },
          { type: 'text', key: 'offerings.2.meta', label: 'Décor rentals card', placeholder: 'Package $400' },
        ],
      },
      {
        id: 'rental-price',
        title: 'Rental package price',
        file: 'rentals',
        preview: { path: '/decor-rentals', hash: '#rental-package' },
        fields: [
          { type: 'text', key: 'package.price', label: 'Price', placeholder: '$400', required: true },
          { type: 'note', text: 'Everything else about the rental package is on the Décor Rentals page.', link: { section: 'rentals', label: 'Edit Décor Rentals' } },
        ],
      },
    ],
  },
  {
    id: 'rentals',
    title: 'Décor Rentals',
    blurb: 'The rental package, how renting works, and individual pieces.',
    icon: Flower2,
    preview: { path: '/decor-rentals' },
    groups: [
      {
        id: 'top',
        title: 'Top of the page',
        file: 'rentals',
        preview: { path: '/decor-rentals' },
        fields: [
          smallHeading('eyebrow'),
          { type: 'text', key: 'title', label: 'Heading', required: true },
          { type: 'text', key: 'emphasis', label: 'Heading, second line', help: 'Shown in italics.' },
          { type: 'textarea', key: 'intro', label: 'Introduction' },
          { type: 'photos', key: 'photos', label: 'Photos', help: 'The first is the tall arched photo; the second sits beside it.', folder: 'rentals', min: 2, max: 2 },
        ],
      },
      {
        id: 'rental-package',
        title: 'Rental package',
        file: 'rentals',
        preview: { path: '/decor-rentals', hash: '#rental-package' },
        fields: [
          smallHeading('package.tag'),
          { type: 'text', key: 'package.name', label: 'Package name', required: true },
          { type: 'text', key: 'package.price', label: 'Price', placeholder: '$400', required: true },
          { type: 'textarea', key: 'package.summary', label: 'Description' },
          { type: 'list', key: 'package.highlights', label: 'At-a-glance highlights', help: 'Aim for five short highlights. Keep all items and quantities in the full list below.', itemLabel: 'Highlight', addLabel: 'Add a highlight' },
          { type: 'list', key: 'package.features', label: 'Full inclusion list', help: 'Shown when visitors open the full package details.', itemLabel: 'Item', addLabel: 'Add something included' },
          { type: 'list', key: 'package.terms', label: 'Good to know', help: 'Short notes like "Setup included".', itemLabel: 'Note', addLabel: 'Add a note' },
          { type: 'text', key: 'package.cta', label: 'Button text', help: 'Opens the contact page.' },
        ],
      },
      {
        id: 'how-it-works',
        title: 'How renting works',
        file: 'rentals',
        preview: { path: '/decor-rentals', hash: '#how-it-works' },
        fields: [
          smallHeading('steps.eyebrow'),
          { type: 'text', key: 'steps.title', label: 'Heading' },
          {
            type: 'cards',
            key: 'steps.items',
            label: 'Steps',
            itemLabel: 'Step',
            titleKey: 'title',
            addLabel: 'Add a step',
            template: { title: '', body: '' },
            fields: [
              { type: 'text', key: 'title', label: 'Step', required: true },
              { type: 'textarea', key: 'body', label: 'Details' },
            ],
          },
        ],
      },
      {
        id: 'individual-rentals',
        title: 'Individual rentals',
        help: 'Single pieces people can rent on their own. The section shows once you add the first one.',
        file: 'rentals',
        preview: { path: '/decor-rentals', hash: '#individual-rentals' },
        fields: [
          { type: 'text', key: 'itemsTitle', label: 'Heading' },
          {
            type: 'cards',
            key: 'items',
            label: 'Rental pieces',
            itemLabel: 'Rental piece',
            titleKey: 'name',
            noteKey: 'price',
            addLabel: 'Add a rental piece',
            template: { name: '', price: '', description: '' },
            fields: [
              { type: 'text', key: 'name', label: 'Name', placeholder: 'Gold ceremony arch', required: true },
              { type: 'text', key: 'price', label: 'Price', placeholder: '$75', required: true },
              { type: 'textarea', key: 'description', label: 'Short description', help: 'Optional.' },
              { type: 'photo', key: 'photo', altKey: 'photoAlt', label: 'Photo', help: 'Optional. Without one, the piece shows a soft coloured tile.', folder: 'rentals', optional: true },
            ],
          },
          { type: 'textarea', key: 'itemsNote', label: 'Note under the pieces' },
          { type: 'text', key: 'cta', label: 'Quote button text', help: 'Opens the contact page.' },
          { type: 'text', key: 'faqCta', label: 'Questions button text', help: 'Jumps to the rental questions.' },
          { type: 'note', text: 'The questions at the bottom of this page are your rental questions.', link: { section: 'faq', label: 'Edit questions' } },
        ],
      },
      google('rentals'),
    ],
  },
  {
    id: 'gallery',
    title: 'Gallery',
    blurb: 'Add, describe and arrange your photos.',
    icon: Images,
    preview: { path: '/gallery' },
    groups: [
      {
        id: 'photos',
        title: 'Photos',
        file: 'gallery',
        preview: { path: '/gallery', hash: '#photos' },
        fields: [
          { type: 'gallery', key: 'items', label: 'Photos' },
        ],
      },
      {
        id: 'top',
        title: 'Top of the page',
        file: 'gallery',
        preview: { path: '/gallery' },
        fields: [
          smallHeading('eyebrow'),
          { type: 'text', key: 'title', label: 'Heading', required: true },
          { type: 'text', key: 'emphasis', label: 'Heading, second line', help: 'Shown in italics.' },
          { type: 'textarea', key: 'intro', label: 'Introduction', help: 'Followed by a link to your Instagram.' },
        ],
      },
      {
        id: 'event-types',
        title: 'Event type buttons',
        help: 'The buttons above the photos that show one kind of event. A button only appears once a photo uses it.',
        file: 'gallery',
        preview: { path: '/gallery', hash: '#photos' },
        fields: [
          { type: 'cards', key: 'categories', label: 'Buttons', itemLabel: 'Button', titleKey: 'label', compact: true, fields: [{ type: 'text', key: 'label', label: 'Button text', required: true }] },
          { type: 'number', key: 'pageSize', label: 'Photos shown before "Show More"', min: 6, max: 60 },
        ],
      },
      google('gallery'),
    ],
  },
  {
    id: 'about',
    title: 'About Ayla',
    blurb: 'Your story, portrait and quick facts.',
    icon: UserRound,
    preview: { path: '/about' },
    groups: [
      {
        id: 'story',
        title: 'Your story',
        file: 'about',
        preview: { path: '/about', hash: '#about' },
        fields: [
          smallHeading('eyebrow'),
          { type: 'text', key: 'heading', label: 'Heading', required: true },
          { type: 'text', key: 'scriptLine', label: 'Handwritten line' },
          { type: 'list', key: 'paragraphs', label: 'Paragraphs', help: 'The first one is also shown on the Home page.', multiline: true, itemLabel: 'Paragraph', addLabel: 'Add a paragraph' },
          { type: 'list', key: 'facts', label: 'Quick facts', help: 'Shown as small tags.', itemLabel: 'Fact', addLabel: 'Add a fact' },
          { type: 'photo', key: 'portrait', altKey: 'portraitAlt', label: 'Portrait', help: 'Also shown on the Home page. An upright photo works best.', folder: 'site' },
          { type: 'photo', key: 'detail', altKey: 'detailAlt', label: 'Small round photo', folder: 'site' },
          { type: 'text', key: 'cta', label: 'Button text', help: 'Opens the contact page.' },
        ],
      },
      {
        id: 'strip',
        title: 'Photo strip',
        file: 'about',
        preview: { path: '/about' },
        fields: [
          { type: 'text', key: 'strip.title', label: 'Heading' },
          { type: 'photos', key: 'strip.photos', label: 'Photos', folder: 'site', min: 4, max: 4 },
          { type: 'text', key: 'strip.cta', label: 'Button text', help: 'Opens the gallery.' },
          { type: 'note', text: 'Your Kind Words reviews also appear on this page.', link: { section: 'reviews', label: 'Edit Kind Words' } },
        ],
      },
      google('about'),
    ],
  },
  {
    id: 'reviews',
    title: 'Kind Words',
    blurb: 'Reviews from clients and collaborators.',
    icon: MessageSquareQuote,
    preview: { path: '/', hash: '#reviews' },
    groups: [
      {
        id: 'reviews',
        title: 'Reviews',
        help: 'Shown on the Home and About pages.',
        file: 'testimonials',
        preview: { path: '/', hash: '#reviews' },
        fields: [
          smallHeading('eyebrow'),
          { type: 'text', key: 'title', label: 'Heading', required: true },
          {
            type: 'cards',
            key: 'items',
            label: 'Reviews',
            itemLabel: 'Review',
            titleKey: 'cite',
            addLabel: 'Add a review',
            template: { quote: '', cite: '', context: '', fullQuote: '' },
            fields: [
              { type: 'textarea', key: 'quote', label: 'Short excerpt', help: 'Use their original words. Mark any omitted text within a passage with an ellipsis (…).', required: true },
              { type: 'text', key: 'cite', label: 'Who said it', placeholder: 'Jess & Mark, Barrie', required: true },
              { type: 'text', key: 'context', label: 'Event or relationship', placeholder: 'Bridal shower · Bloom Bar' },
              { type: 'textarea', key: 'fullQuote', label: 'Full review', help: 'Preserve the original wording and paragraph breaks. Visitors can open this from the review card.' },
            ],
          },
          { type: 'toggle', key: 'placeholder', invert: true, label: 'These are real reviews', help: 'Turn this on once the sample quotes are replaced. It hides the note under the reviews.' },
          { type: 'text', key: 'note', label: 'Note under the sample reviews', showIf: data => data.placeholder },
        ],
      },
    ],
  },
  {
    id: 'faq',
    title: 'Questions (FAQ)',
    blurb: 'Questions and answers for planning and rentals.',
    icon: MessageCircleQuestionMark,
    preview: { path: '/faq' },
    groups: [
      {
        id: 'top',
        title: 'Top of the page',
        file: 'faq',
        preview: { path: '/faq' },
        fields: [
          smallHeading('eyebrow'),
          { type: 'text', key: 'title', label: 'Heading', required: true },
          { type: 'textarea', key: 'intro', label: 'Introduction' },
        ],
      },
      {
        id: 'planning',
        title: 'Planning & booking questions',
        help: 'Shown on the FAQ page and near the bottom of Event Planning.',
        file: 'faq',
        preview: { path: '/faq', hash: '#faq' },
        fields: [
          { type: 'text', key: 'groups.0.title', label: 'Heading on the FAQ page' },
          { type: 'text', key: 'groups.0.heading', label: 'Heading on the Event Planning page' },
          {
            type: 'cards',
            key: 'groups.0.items',
            label: 'Questions',
            itemLabel: 'Question',
            titleKey: 'q',
            addLabel: 'Add a question',
            template: { q: '', a: '' },
            fields: [
              { type: 'text', key: 'q', label: 'Question', required: true },
              { type: 'textarea', key: 'a', label: 'Answer', required: true },
            ],
          },
        ],
      },
      {
        id: 'rentals',
        title: 'Rental questions',
        help: 'Shown on the FAQ page and at the bottom of Décor Rentals.',
        file: 'faq',
        preview: { path: '/decor-rentals', hash: '#rentals-faq' },
        fields: [
          { type: 'text', key: 'groups.1.title', label: 'Heading on the FAQ page' },
          { type: 'text', key: 'groups.1.heading', label: 'Heading on the Décor Rentals page' },
          {
            type: 'cards',
            key: 'groups.1.items',
            label: 'Questions',
            itemLabel: 'Question',
            titleKey: 'q',
            addLabel: 'Add a question',
            template: { q: '', a: '' },
            fields: [
              { type: 'text', key: 'q', label: 'Question', required: true },
              { type: 'textarea', key: 'a', label: 'Answer', required: true },
            ],
          },
        ],
      },
      {
        id: 'more',
        title: 'Link to all questions',
        file: 'faq',
        preview: { path: '/event-planning', hash: '#planning-faq' },
        fields: [
          { type: 'text', key: 'allCta', label: 'Link text', help: 'Shown under the questions on Event Planning and Décor Rentals.' },
        ],
      },
      google('faq'),
    ],
  },
  {
    id: 'contact',
    title: 'Contact details',
    blurb: 'Email, Instagram, the booking form and the contact page.',
    icon: Mail,
    preview: { path: '/contact' },
    groups: [
      {
        id: 'details',
        title: 'Your details',
        help: 'Used across the site, including the footer.',
        file: 'contact',
        preview: { path: '/contact' },
        fields: [
          { type: 'text', key: 'email', label: 'Email address', help: 'Booking requests are sent here.', required: true },
          {
            type: 'text',
            key: 'instagram',
            label: 'Instagram username',
            help: 'Without the @. The Instagram buttons across the site follow it.',
            required: true,
            derive: (handle, data) => {
              const name = handle.trim().replace(/^@/, '')
              data.instagramUrl = `https://www.instagram.com/${name}/`
              data.messageUrl = `https://ig.me/m/${name}`
            },
          },
          { type: 'text', key: 'location', label: 'Where you\'re based', placeholder: 'Cookstown, Ontario' },
          { type: 'text', key: 'serviceArea', label: 'Area you serve', placeholder: 'Simcoe Muskoka' },
        ],
      },
      {
        id: 'contact-page',
        title: 'Contact page',
        file: 'contact',
        preview: { path: '/contact', hash: '#contact' },
        fields: [
          { type: 'text', key: 'scriptLine', label: 'Handwritten line' },
          { type: 'text', key: 'heading', label: 'Heading', required: true },
          { type: 'textarea', key: 'body', label: 'Introduction' },
          { type: 'text', key: 'cta', label: 'Instagram message button' },
          { type: 'text', key: 'followCta', label: 'Instagram follow link' },
          { type: 'text', key: 'faqPrompt', label: 'Line above the questions link' },
          { type: 'text', key: 'faqCta', label: 'Questions link text' },
        ],
      },
      {
        id: 'form',
        title: 'Booking form',
        help: 'The form on the contact page.',
        file: 'contact',
        preview: { path: '/contact', hash: '#contact' },
        fields: [
          { type: 'text', key: 'form.intentLabel', label: 'Question at the top of the form' },
          { type: 'list', key: 'form.intents', label: 'Answers to choose from', itemLabel: 'Answer', addLabel: 'Add an answer' },
          { type: 'list', key: 'form.eventTypes', label: 'Event types', itemLabel: 'Event type', addLabel: 'Add an event type' },
          { type: 'list', key: 'form.services', label: 'Services they can tick', itemLabel: 'Service', addLabel: 'Add a service' },
          { type: 'text', key: 'form.submit', label: 'Send button text' },
          { type: 'textarea', key: 'form.success', label: 'Message after sending' },
          { type: 'textarea', key: 'form.mailtoNote', label: 'Message when their email app opens' },
          { type: 'textarea', key: 'form.error', label: 'Message if sending doesn\'t work' },
          { type: 'text', key: 'form.endpoint', label: 'Form service address', help: 'FormSubmit sends requests to the email address in this link. Confirm its activation email before using the form. Changing the business email above does not change this destination. Leave empty to open the visitor\'s email app instead.', placeholder: 'https://formsubmit.co/ajax/your@email.com' },
        ],
      },
      {
        id: 'band',
        title: 'Photo band near the bottom of most pages',
        file: 'contact',
        preview: { path: '/', hash: '#book' },
        fields: [
          { type: 'text', key: 'band.title', label: 'Heading', required: true },
          { type: 'textarea', key: 'band.body', label: 'Text' },
          { type: 'text', key: 'band.cta', label: 'Button text', help: 'Opens the contact page. Also used for the footer button.' },
          { type: 'photo', key: 'band.photo', label: 'Background photo', help: 'Shown darkened behind the words, so a calm photo with soft detail works best.', folder: 'site' },
        ],
      },
      google('contact'),
    ],
  },
  {
    id: 'coming-soon',
    title: 'Coming soon page',
    blurb: 'What visitors see until the full website launches.',
    icon: Hourglass,
    preview: { path: '/coming-soon' },
    groups: [
      {
        id: 'page',
        title: 'Coming soon page',
        file: 'coming-soon',
        preview: { path: '/coming-soon' },
        fields: [
          { type: 'text', key: 'kicker', label: 'Line above the headline' },
          { type: 'text', key: 'title', label: 'Headline', required: true },
          { type: 'text', key: 'titleEmphasis', label: 'Headline, last words', help: 'Shown in italics.' },
          { type: 'text', key: 'scriptLine', label: 'Handwritten line' },
          { type: 'textarea', key: 'sub', label: 'Introduction' },
          { type: 'text', key: 'cta', label: 'Instagram message button' },
          { type: 'text', key: 'followCta', label: 'Instagram follow link' },
          { type: 'text', key: 'pageTitle', label: 'Browser tab title' },
        ],
      },
    ],
  },
]

export const findSection = (id: unknown) => sections.find(section => section.id === id)
