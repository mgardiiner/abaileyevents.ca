// Opens the GitHub key that nuxt.config.ts seals into the build with the editor password.
// A wrong password fails AES-GCM's integrity check, so it returns null rather than a garbled key.
const bytes = (base64: string) => Uint8Array.from(atob(base64), char => char.charCodeAt(0))

export async function openSealedKey(sealed: string, password: string): Promise<string | null> {
  const [rounds, salt, iv, data] = sealed.split('.')
  if (!rounds || !salt || !iv || !data) return null
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: bytes(salt), iterations: Number(rounds) },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
  try {
    return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(iv) }, key, bytes(data)))
  }
  catch {
    return null
  }
}
