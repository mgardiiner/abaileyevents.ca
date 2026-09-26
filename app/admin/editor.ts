import { reactive, watch } from 'vue'
import { contentNames, type ContentName } from '~/composables/useContent'
import { EditorError, contentPath, githubBackend, localBackend, type Backend, type Change, type DeployState } from './backend'
import { formatJson } from './format-json'
import { blobToBase64, preparePhoto, slugify, storedPhotos } from './photos'
import { sections, type Field, type Group, type Section } from './sections'

// The website editor's state: what's published, the draft being edited, photos waiting to be
// published, and the publish itself. One copy for the whole page.

export const getAt = (root: any, path: string) => path.split('.').reduce((node, key) => node?.[key], root)

export function setAt(root: any, path: string, value: unknown) {
  const keys = path.split('.')
  const last = keys.pop()!
  const parent = keys.reduce((node, key) => node[key], root)
  parent[last] = value
}

export const clone = <T>(value: T): T => value === undefined ? value : JSON.parse(JSON.stringify(value))
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

interface Toast {
  id: number
  message: string
  tone: 'info' | 'success' | 'error'
  action?: { label: string, run: () => void }
}

export interface Photo {
  url: string
  w: number
  h: number
  // Added in the editor and not published yet.
  pending: boolean
}

interface PhotoRequest {
  folder: string
  fromGallery?: boolean
  title: string
  resolve: (path: string | null) => void
}

export interface Problem {
  section: Section
  group: Group
  label: string
}

const KEY_STORAGE = 'abe-editor-key'
const LOCAL_STORAGE = 'abe-editor-local'
const DRAFT_STORAGE = 'abe-editor-draft'

const state = reactive({
  mode: 'signed-out' as 'signed-out' | 'loading' | 'ready',
  backend: null as Backend['kind'] | null,
  original: {} as Record<ContentName, any>,
  draft: {} as Record<ContentName, any>,
  shas: {} as Record<string, string>,
  images: [] as string[],
  updatedAt: '',
  photos: {} as Record<string, Photo>,
  publishing: '' as string,
  deploy: null as null | { commit: string, state: DeployState, startedAt: number },
  toasts: [] as Toast[],
  photoRequest: null as PhotoRequest | null,
})

let backend: Backend | null = null
let previewHash = ''
// Photos waiting to be published, by site path. Kept out of `state` so Vue doesn't wrap them.
const blobs = new Map<string, Blob>()

function storage(kind: 'local' | 'session') {
  try {
    return kind === 'local' ? localStorage : sessionStorage
  }
  catch {
    return null
  }
}
const read = (kind: 'local' | 'session', key: string) => storage(kind)?.getItem(key) ?? null
function write(kind: 'local' | 'session', key: string, value: string | null) {
  try {
    if (value === null) storage(kind)?.removeItem(key)
    else storage(kind)?.setItem(key, value)
  }
  catch {}
}

// --- Signing in -------------------------------------------------------------------------------

export function configure(options: { previewHash: string }) {
  previewHash = options.previewHash
}

// The site's pages sit behind the coming-soon page until launch; open them for a signed-in
// editor so the preview (and the site itself) shows the real pages.
function openSitePages() {
  if (previewHash) document.cookie = `preview=${previewHash}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
}

export async function signIn(kind: Backend['kind'], key = '', remember = true) {
  backend = kind === 'github' ? githubBackend(key.trim()) : localBackend()
  state.backend = kind
  await load()
  if (kind === 'github') {
    write(remember ? 'local' : 'session', KEY_STORAGE, key.trim())
    write(remember ? 'session' : 'local', KEY_STORAGE, null)
  }
  else {
    write('session', LOCAL_STORAGE, '1')
  }
  openSitePages()
}

// Picks up where the last visit left off. Returns why it couldn't, if a saved key stopped working.
export async function resume(): Promise<EditorError | null> {
  const key = read('local', KEY_STORAGE) ?? read('session', KEY_STORAGE)
  const kind = key ? 'github' : import.meta.dev && read('session', LOCAL_STORAGE) ? 'local' : null
  if (!kind) return null
  try {
    await signIn(kind, key ?? '', !!read('local', KEY_STORAGE))
    return null
  }
  catch (error) {
    if (error instanceof EditorError && error.code === 'bad-key') {
      write('local', KEY_STORAGE, null)
      write('session', KEY_STORAGE, null)
    }
    return error instanceof EditorError ? error : new EditorError('failed', String(error))
  }
}

export function signOut() {
  write('local', KEY_STORAGE, null)
  write('session', KEY_STORAGE, null)
  write('session', LOCAL_STORAGE, null)
  backend = null
  state.mode = 'signed-out'
  state.backend = null
  state.deploy = null
}

// --- Loading and drafts -----------------------------------------------------------------------

export async function load() {
  if (!backend) return
  state.mode = 'loading'
  try {
    const site = await backend.load()
    state.original = site.files
    state.draft = clone(site.files)
    state.shas = site.shas
    state.images = site.images
    state.updatedAt = site.updatedAt ?? ''
    await restoreDraft()
    state.mode = 'ready'
  }
  catch (error) {
    state.mode = 'signed-out'
    throw error
  }
}

async function restoreDraft() {
  for (const photo of await storedPhotos.all()) {
    if (blobs.has(photo.path)) continue
    blobs.set(photo.path, photo.blob)
    state.photos[photo.path] = { url: URL.createObjectURL(photo.blob), w: photo.w, h: photo.h, pending: true }
  }

  const saved = JSON.parse(read('local', DRAFT_STORAGE) ?? 'null') as { backend: string, files: Record<string, unknown>, shas: Record<string, string> } | null
  if (!saved || saved.backend !== state.backend) return
  const restored: ContentName[] = []
  const outdated: ContentName[] = []
  for (const [name, data] of Object.entries(saved.files)) {
    if (!contentNames.includes(name as ContentName)) continue
    const path = contentPath(name as ContentName)
    // Only keep a draft of a file nobody has published over since.
    if ((saved.shas[path] ?? '') === (state.shas[path] ?? '')) {
      state.draft[name as ContentName] = data
      restored.push(name as ContentName)
    }
    else {
      outdated.push(name as ContentName)
    }
  }
  if (outdated.length) {
    notify(`Some unpublished changes (${areaNames(outdated)}) were cleared because that part of the website was updated somewhere else since.`, { tone: 'error' })
  }
  else if (restored.length) {
    notify('Welcome back. Your unpublished changes are just as you left them.', { action: { label: 'Discard them', run: discardAll } })
  }
}

// Saves the draft on this device as it changes, so nothing is lost if the tab closes.
let saveTimer: ReturnType<typeof setTimeout> | undefined
watch(() => state.draft, () => {
  if (state.mode !== 'ready') return
  clearTimeout(saveTimer)
  saveTimer = setTimeout(saveDraft, 400)
}, { deep: true })

function saveDraft() {
  const names = changedFiles()
  if (!names.length) return write('local', DRAFT_STORAGE, null)
  write('local', DRAFT_STORAGE, JSON.stringify({
    backend: state.backend,
    files: Object.fromEntries(names.map(name => [name, state.draft[name]])),
    shas: Object.fromEntries(names.map(name => [contentPath(name), state.shas[contentPath(name)] ?? ''])),
  }))
}

export function discardAll() {
  state.draft = clone(state.original)
  for (const path of [...blobs.keys()]) forgetPhoto(path)
  write('local', DRAFT_STORAGE, null)
}

// --- What changed -----------------------------------------------------------------------------

export const changedFiles = () => contentNames.filter(name => state.draft[name] !== undefined && !same(state.draft[name], state.original[name]))

export const isChanged = (file: ContentName, path: string) => !same(getAt(state.draft[file], path), getAt(state.original[file], path))
// A field belongs to something added since the last publish (a new question, photo or card).
export function isNew(file: ContentName, path: string) {
  const parent = path.slice(0, Math.max(path.lastIndexOf('.'), 0))
  return !!parent && getAt(state.original[file], parent) === undefined
}

export function revert(file: ContentName, path: string) {
  setAt(state.draft[file], path, clone(getAt(state.original[file], path)))
}

// The draft paths a field edits, relative to its file.
function fieldPaths(field: Field, base: string): string[] {
  if (field.type === 'note') return []
  const at = (key: string) => base ? `${base}.${key}` : key
  if (field.type === 'photo') return [at(field.key), ...(field.altKey ? [at(field.altKey)] : [])]
  if (field.type === 'gallery') return [at(field.key), at('highlights')]
  return [at(field.key)]
}

export const fileOf = (field: Field, group: Group) => field.file ?? group.file

export function groupChanges(group: Group) {
  return group.fields.filter(field => fieldPaths(field, '').some(path => isChanged(fileOf(field, group), path))).length
}

export const sectionChanges = (section: Section) => section.groups.reduce((total, group) => total + groupChanges(group), 0)

export const changedSections = () => sections.filter(section => sectionChanges(section) > 0)

function areaNames(files: ContentName[]) {
  const names = sections.filter(section => section.groups.some(group => group.fields.some(field => files.includes(fileOf(field, group))))).map(section => section.title)
  return [...new Set(names)].join(', ')
}

const pendingPhotosInUse = () => {
  const text = JSON.stringify(state.draft)
  return [...blobs.keys()].filter(path => text.includes(JSON.stringify(path)))
}

export const hasChanges = () => changedFiles().length > 0 || pendingPhotosInUse().length > 0

// Required fields left empty, in the order they appear in the editor.
export function problems(): Problem[] {
  const found: Problem[] = []
  const seen = new Set<string>()
  const check = (section: Section, group: Group, fields: Field[], file: ContentName, base: string, prefix: string) => {
    for (const field of fields) {
      if (field.type === 'note' || field.type === 'gallery') continue
      const fieldFile = field.file ?? file
      const path = base ? `${base}.${field.key}` : field.key
      if (field.showIf && !field.showIf(state.draft[fieldFile])) continue
      if ((field.type === 'text' || field.type === 'textarea') && field.required) {
        const id = `${fieldFile}:${path}`
        if (!seen.has(id) && !String(getAt(state.draft[fieldFile], path) ?? '').trim()) {
          seen.add(id)
          found.push({ section, group, label: prefix + field.label })
        }
      }
      if (field.type === 'cards') {
        const items = (getAt(state.draft[fieldFile], path) ?? []) as Record<string, unknown>[]
        items.forEach((item, i) => {
          const name = String(item[field.titleKey] ?? '').trim()
          check(section, group, field.fields, fieldFile, `${path}.${i}`, `${prefix}${field.itemLabel} ${i + 1}${name ? ` (${name})` : ''}: `)
        })
      }
      if (field.type === 'photos' && field.min) {
        const count = ((getAt(state.draft[fieldFile], path) ?? []) as unknown[]).length
        if (count < field.min) found.push({ section, group, label: `${prefix}${field.label}: add ${field.min - count} more` })
      }
    }
  }
  for (const section of sections) for (const group of section.groups) check(section, group, group.fields, group.file, '', '')
  return found
}

// --- Photos -----------------------------------------------------------------------------------

export const photoUrl = (path: string) => state.photos[path]?.url ?? path
export const photoSize = (path: string) => state.photos[path]

// Resizes a chosen photo, gives it a tidy file name in `folder`, and holds it until publishing.
export async function addPhoto(file: File, folder: string) {
  const prepared = await preparePhoto(file)
  const name = slugify(file.name.replace(/\.[^.]+$/, '')) || 'photo'
  let path = `/images/${folder}/${name}.jpg`
  for (let n = 2; state.images.includes(path) || path in state.photos; n++) path = `/images/${folder}/${name}-${n}.jpg`
  blobs.set(path, prepared.blob)
  state.photos[path] = { url: URL.createObjectURL(prepared.blob), w: prepared.w, h: prepared.h, pending: true }
  await storedPhotos.put({ path, ...prepared })
  return path
}

function forgetPhoto(path: string) {
  blobs.delete(path)
  storedPhotos.remove(path)
  const photo = state.photos[path]
  if (photo) URL.revokeObjectURL(photo.url)
  delete state.photos[path]
}

// Opens the photo chooser; resolves with the chosen photo's path, or null if it was closed.
export function choosePhoto(options: Omit<PhotoRequest, 'resolve'>) {
  state.photoRequest?.resolve(null)
  return new Promise<string | null>((resolve) => {
    state.photoRequest = { ...options, resolve }
  })
}

export function closePhotoChooser(path: string | null) {
  state.photoRequest?.resolve(path)
  state.photoRequest = null
}

// The draft with photos that aren't on the live site yet pointing at their copy in the browser.
export function previewFiles() {
  let text = JSON.stringify(state.draft)
  for (const [path, photo] of Object.entries(state.photos)) text = text.split(JSON.stringify(path)).join(JSON.stringify(photo.url))
  return JSON.parse(text) as Record<ContentName, unknown>
}

// --- Publishing -------------------------------------------------------------------------------

export async function publish() {
  if (!backend || state.publishing) return
  const names = changedFiles()
  const photos = pendingPhotosInUse()
  const areas = changedSections().map(section => section.title)
  state.publishing = 'Getting your changes ready…'
  try {
    const changes: Change[] = []
    for (const path of photos) changes.push({ path: `public${path}`, base64: await blobToBase64(blobs.get(path)!) })
    for (const name of names) changes.push({ path: contentPath(name), text: formatJson(state.draft[name]) })
    const base = Object.fromEntries(names.map(name => [contentPath(name), state.shas[contentPath(name)] ?? '']).filter(([, sha]) => sha))
    const photoNote = photos.length ? ` (${photos.length} new photo${photos.length === 1 ? '' : 's'})` : ''
    const message = `Update ${areas.join(', ') || 'photos'} from the website editor${photoNote}`

    const result = await backend.publish(changes, message, base, (done) => {
      state.publishing = done < photos.length ? `Uploading photos (${done + 1} of ${photos.length})…` : 'Saving your changes…'
    })

    state.original = clone(state.draft)
    Object.assign(state.shas, result.shas)
    for (const path of photos) {
      state.photos[path]!.pending = false
      state.images.push(path)
      blobs.delete(path)
      storedPhotos.remove(path)
    }
    // Photos added and then removed again before publishing aren't needed.
    for (const path of [...blobs.keys()]) forgetPhoto(path)
    write('local', DRAFT_STORAGE, null)
    state.updatedAt = new Date().toISOString()
    state.deploy = { commit: result.commit, state: 'waiting', startedAt: Date.now() }
    followDeploy(result.commit)
  }
  finally {
    state.publishing = ''
  }
}

async function followDeploy(commit: string) {
  while (backend && state.deploy?.commit === commit) {
    const now = await backend.deployState(commit)
    if (state.deploy?.commit !== commit) return
    state.deploy.state = now
    if (now === 'live' || now === 'failed' || now === 'unknown') return
    if (Date.now() - state.deploy.startedAt > 12 * 60_000) {
      state.deploy.state = 'unknown'
      return
    }
    await new Promise(resolve => setTimeout(resolve, 8000))
  }
}

export function dismissDeploy() {
  state.deploy = null
}

// --- Messages ---------------------------------------------------------------------------------

let toastId = 0
export function notify(message: string, options: { tone?: Toast['tone'], action?: Toast['action'] } = {}) {
  const toast = { id: ++toastId, message, tone: options.tone ?? 'info', action: options.action }
  state.toasts.push(toast)
  setTimeout(() => dismissToast(toast.id), options.action || toast.tone === 'error' ? 10000 : 5000)
}

export function dismissToast(id: number) {
  const index = state.toasts.findIndex(toast => toast.id === id)
  if (index >= 0) state.toasts.splice(index, 1)
}

// Removes an item from a list, with a message offering to put it back.
export function removeWithUndo(list: unknown[], index: number, what: string) {
  const [removed] = list.splice(index, 1)
  notify(`${what} removed.`, { action: { label: 'Undo', run: () => list.splice(index, 0, removed) } })
}

export { state as editor }
