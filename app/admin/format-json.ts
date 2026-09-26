// Writes the content files the way they're laid out by hand: two-space indents, short lists on one
// line, and lists of simple records (gallery photos, filter names) one record per line unless they
// hold prose like an FAQ answer, so a change made in the website editor shows up as a small diff.
const PRIMITIVE_LIST_WIDTH = 100
const PROSE_LENGTH = 120

const isPrimitive = (value: unknown) => value === null || typeof value !== 'object'
const isShort = (value: unknown) => typeof value !== 'string' || value.length <= PROSE_LENGTH
// A field cleared in the editor is left undefined, which drops it from the file as JSON.stringify does.
const fieldsOf = (value: object) => Object.entries(value).filter(([, field]) => field !== undefined)
const isFlatRecord = (value: unknown) =>
  !!value && typeof value === 'object' && !Array.isArray(value)
  && fieldsOf(value).every(([, field]) => (isPrimitive(field) && isShort(field)) || (Array.isArray(field) && field.every(isPrimitive)))

function inline(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(inline).join(', ')}]`
  if (value && typeof value === 'object') {
    const entries = fieldsOf(value)
    return entries.length ? `{ ${entries.map(([key, field]) => `${JSON.stringify(key)}: ${inline(field)}`).join(', ')} }` : '{}'
  }
  return JSON.stringify(value)
}

function format(value: unknown, indent: string): string {
  if (isPrimitive(value)) return JSON.stringify(value)
  const next = `${indent}  `
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    if (value.every(isPrimitive) && inline(value).length + indent.length <= PRIMITIVE_LIST_WIDTH) return inline(value)
    const oneLine = value.every(isFlatRecord)
    return `[\n${value.map(item => next + (oneLine ? inline(item) : format(item, next))).join(',\n')}\n${indent}]`
  }
  const entries = fieldsOf(value as object)
  if (!entries.length) return '{}'
  return `{\n${entries.map(([key, field]) => `${next}${JSON.stringify(key)}: ${format(field, next)}`).join(',\n')}\n${indent}}`
}

export function formatJson(value: unknown) {
  return `${format(value, '')}\n`
}
