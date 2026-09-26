// Keeps the part of a photo chosen in the website editor ("Choose what shows") in view wherever the
// photo is cropped to an arch, circle or card. Use as `:style="photoFocus(src)"` on an object-cover img.
export function photoFocus(src?: string) {
  const point = src ? useContent('focus')[src] : undefined
  return point ? { objectPosition: `${point[0]}% ${point[1]}%` } : undefined
}
