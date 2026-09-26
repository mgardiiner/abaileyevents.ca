import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { addDevServerHandler, defineNuxtModule } from '@nuxt/kit'
import { createError, defineEventHandler, readBody } from 'h3'

// `npm run dev` only: lets the website editor (/admin) read and save the files in this checkout
// instead of the GitHub repo, for trying changes locally. Nothing here ships with the site.
export default defineNuxtModule({
  meta: { name: 'admin-local' },
  setup(_, nuxt) {
    if (!nuxt.options.dev) return
    const root = nuxt.options.rootDir
    const dataDir = join(root, 'app/data')
    const imagesDir = join(root, 'public/images')

    async function listImages(dir: string): Promise<string[]> {
      const entries = await readdir(dir, { withFileTypes: true })
      const nested = await Promise.all(entries.map(entry => entry.isDirectory()
        ? listImages(join(dir, entry.name))
        : Promise.resolve(/\.(?:jpe?g|png|webp)$/i.test(entry.name) ? [`/${relative(join(root, 'public'), join(dir, entry.name))}`] : [])))
      return nested.flat()
    }

    // Only content files and photos, with no way out of those folders.
    const writable = (path: string) => /^app\/data\/[a-z-]+\.json$/.test(path) || /^public\/images\/[\w/-]+\.(?:jpe?g|png|webp)$/i.test(path)

    addDevServerHandler({
      route: '/__admin-local',
      handler: defineEventHandler(async (event) => {
        if (event.method === 'GET') {
          const names = (await readdir(dataDir)).filter(name => name.endsWith('.json'))
          const files = Object.fromEntries(await Promise.all(names.map(async name => [name.replace(/\.json$/, ''), await readFile(join(dataDir, name), 'utf8')])))
          return { files, images: await listImages(imagesDir) }
        }
        if (event.method === 'POST') {
          const { changes } = await readBody<{ changes: { path: string, text?: string, base64?: string }[] }>(event)
          const refused = changes.filter(change => !writable(change.path) || change.path.includes('..'))
          if (refused.length) throw createError({ statusCode: 400, statusMessage: `Not writable: ${refused.map(change => change.path).join(', ')}` })
          for (const change of changes) {
            const target = join(root, change.path)
            await mkdir(dirname(target), { recursive: true })
            await writeFile(target, change.base64 !== undefined ? Buffer.from(change.base64, 'base64') : change.text ?? '')
          }
          return { ok: true }
        }
        throw createError({ statusCode: 405 })
      }),
    })
  },
})
