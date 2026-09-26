import { contentNames, type ContentName } from '~/composables/useContent'

// Where the website editor reads and saves content. On the live site that's the GitHub repo: a
// publish is one commit to main, which the Pages workflow deploys. `npm run dev` adds a local
// option that reads and writes the files in this checkout instead (modules/admin-local.ts).
export const SITE_REPO = 'mgardiiner/abaileyevents.ca'
export const SITE_BRANCH = 'main'
export const SITE_URL = 'https://abaileyevents.ca'

export interface LoadedSite {
  files: Record<ContentName, any>
  // Repo path -> blob sha of each content file, to spot edits made elsewhere before publishing.
  shas: Record<string, string>
  // Site paths of every photo, like /images/gallery/jm-wedding/veil-kiss.jpg
  images: string[]
  updatedAt?: string
}

// A file to write, by repo path: content JSON as text, photos as base64.
export interface Change {
  path: string
  text?: string
  base64?: string
}

export type DeployState = 'waiting' | 'building' | 'live' | 'failed' | 'unknown'

export interface Backend {
  kind: 'github' | 'local'
  load: () => Promise<LoadedSite>
  publish: (changes: Change[], message: string, base: Record<string, string>, progress: (done: number, total: number) => void) => Promise<{ commit: string, shas: Record<string, string> }>
  deployState: (commit: string) => Promise<DeployState>
}

export type EditorErrorCode = 'bad-key' | 'no-access' | 'read-only' | 'offline' | 'conflict' | 'failed'

export class EditorError extends Error {
  constructor(public code: EditorErrorCode, detail = '', public files: string[] = []) {
    super(detail || code)
  }
}

export const contentPath = (name: ContentName) => `app/data/${name}.json`
const IMAGE = /^public(\/images\/.+\.(?:jpe?g|png|webp))$/i

export function githubBackend(key: string): Backend {
  const api = `https://api.github.com/repos/${SITE_REPO}`

  async function call(path: string, init: RequestInit & { raw?: boolean } = {}) {
    let res: Response
    try {
      res = await fetch(api + path, {
        ...init,
        // GitHub caches reads for a minute; always ask for the current state.
        cache: 'no-store',
        headers: {
          'Accept': init.raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
          'Authorization': `Bearer ${key}`,
          'X-GitHub-Api-Version': '2022-11-28',
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        },
      })
    }
    catch {
      throw new EditorError('offline')
    }
    if (res.status === 401) throw new EditorError('bad-key')
    if (res.status === 403 || res.status === 404) throw new EditorError('no-access', `${res.status} ${path}`)
    if (!res.ok) throw new EditorError('failed', `${res.status} ${path}: ${(await res.text()).slice(0, 200)}`)
    return res
  }
  const get = (path: string) => call(path).then(res => res.json())
  const post = (path: string, body: unknown, method = 'POST') => call(path, { method, body: JSON.stringify(body) }).then(res => res.json())

  async function tree(treeSha: string) {
    const listing = await get(`/git/trees/${treeSha}?recursive=1`)
    return listing.tree as { path: string, type: string, sha: string }[]
  }

  return {
    kind: 'github',

    async load() {
      const branch = await get(`/branches/${SITE_BRANCH}`)
      const head: string = branch.commit.sha
      const entries = await tree(branch.commit.commit.tree.sha)
      const shas: Record<string, string> = {}
      const images: string[] = []
      for (const entry of entries) {
        if (entry.type !== 'blob') continue
        if (entry.path.startsWith('app/data/')) shas[entry.path] = entry.sha
        const image = entry.path.match(IMAGE)
        if (image) images.push(image[1]!)
      }
      const names = contentNames
      const texts = await Promise.all(names.map(name => call(`/contents/${contentPath(name)}?ref=${head}`, { raw: true }).then(res => res.text())))
      const files = Object.fromEntries(names.map((name, i) => [name, JSON.parse(texts[i]!)])) as LoadedSite['files']
      return { files, shas, images, updatedAt: branch.commit.commit.committer?.date }
    },

    async publish(changes, message, base, progress) {
      try {
        const ref = await get(`/git/ref/heads/${SITE_BRANCH}`)
        const parent: string = ref.object.sha
        const parentCommit = await get(`/git/commits/${parent}`)
        // Someone (or another device) published this part of the site after the editor opened it.
        const current = Object.fromEntries((await tree(parentCommit.tree.sha)).map(entry => [entry.path, entry.sha]))
        const conflicts = changes.filter(change => change.path in base && current[change.path] !== base[change.path]).map(change => change.path)
        if (conflicts.length) throw new EditorError('conflict', '', conflicts)

        // One file at a time: GitHub throttles bursts of uploads, and it lets the editor show progress.
        const written: { path: string, mode: '100644', type: 'blob', sha: string }[] = []
        for (const change of changes) {
          progress(written.length, changes.length)
          const blob = await post('/git/blobs', change.base64 !== undefined
            ? { content: change.base64, encoding: 'base64' }
            : { content: change.text, encoding: 'utf-8' })
          written.push({ path: change.path, mode: '100644', type: 'blob', sha: blob.sha })
        }
        progress(written.length, changes.length)

        const newTree = await post('/git/trees', { base_tree: parentCommit.tree.sha, tree: written })
        const commit = await post('/git/commits', { message, tree: newTree.sha, parents: [parent] })
        await post(`/git/refs/heads/${SITE_BRANCH}`, { sha: commit.sha }, 'PATCH')
        return { commit: commit.sha as string, shas: Object.fromEntries(written.map(entry => [entry.path, entry.sha])) }
      }
      catch (error) {
        // Reading worked when signing in, so a refusal here means the key can't write.
        if (error instanceof EditorError && error.code === 'no-access') throw new EditorError('read-only', error.message)
        throw error
      }
    },

    // Needs the key to have Actions read access; without it the editor just says "a few minutes".
    async deployState(commit) {
      try {
        const { workflow_runs: runs } = await get(`/actions/runs?head_sha=${commit}&per_page=5`)
        const run = runs?.[0]
        if (!run) return 'waiting'
        if (run.status !== 'completed') return 'building'
        return run.conclusion === 'success' ? 'live' : 'failed'
      }
      catch {
        return 'unknown'
      }
    },
  }
}

// Checks a key can open the repo before keeping it.
export async function checkKey(key: string) {
  await githubBackend(key).load().then(() => undefined, (error) => {
    throw error instanceof EditorError ? error : new EditorError('failed', String(error))
  })
}

export function localBackend(): Backend {
  const endpoint = '/__admin-local'
  return {
    kind: 'local',
    async load() {
      const res = await fetch(endpoint, { cache: 'no-store' }).catch(() => null)
      if (!res?.ok) throw new EditorError('offline')
      const data = await res.json() as { files: Record<string, string>, images: string[] }
      const files = Object.fromEntries(Object.entries(data.files).map(([name, text]) => [name, JSON.parse(text)])) as LoadedSite['files']
      return { files, shas: {}, images: data.images }
    },
    async publish(changes, _message, _base, progress) {
      progress(0, changes.length)
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ changes }) }).catch(() => null)
      if (!res?.ok) throw new EditorError('failed', res ? await res.text() : 'dev server unreachable')
      progress(changes.length, changes.length)
      return { commit: 'local', shas: {} }
    },
    async deployState() {
      return 'live'
    },
  }
}
