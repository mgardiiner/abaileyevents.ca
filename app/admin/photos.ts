// Photos chosen in the website editor are resized in the browser before they're saved: phone and
// camera files run 5–7 MB, and 1600px on the long edge is plenty for every spot on the site.
const LONG_EDGE = 1600
const QUALITY = 0.82

export interface PreparedPhoto {
  blob: Blob
  w: number
  h: number
}

export class UnsupportedPhotoError extends Error {}

export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  }
  catch {
    throw new UnsupportedPhotoError(file.name)
  }
  const scale = Math.min(1, LONG_EDGE / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const context = canvas.getContext('2d')!
  context.imageSmoothingQuality = 'high'
  context.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', QUALITY))
  if (!blob) throw new UnsupportedPhotoError(file.name)
  return { blob, w, h }
}

export function slugify(text: string) {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '')
}

// "jm-wedding" -> "JM Wedding": two-letter parts are a couple's initials.
export function folderLabel(folder: string) {
  return folder.split('-').map(part => part.length <= 2 ? part.toUpperCase() : part[0]!.toUpperCase() + part.slice(1)).join(' ')
}

export function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

// Photos waiting to be published are kept on this device (IndexedDB), so closing the tab before
// publishing doesn't lose them.
export interface StoredPhoto extends PreparedPhoto {
  path: string
}

const DB = 'abe-website-editor'
const STORE = 'photos'

function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'path' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await database()
  return new Promise<T>((resolve, reject) => {
    const request = action(db.transaction(STORE, mode).objectStore(STORE))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  }).finally(() => db.close())
}

export const storedPhotos = {
  all: () => run<StoredPhoto[]>('readonly', store => store.getAll()).catch(() => [] as StoredPhoto[]),
  put: (photo: StoredPhoto) => run('readwrite', store => store.put(photo)).catch(() => undefined),
  remove: (path: string) => run('readwrite', store => store.delete(path)).catch(() => undefined),
  clear: () => run('readwrite', store => store.clear()).catch(() => undefined),
}
