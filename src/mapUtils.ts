/** Google Maps search link — opens the native Maps app on phones. */
export function mapsUrl(name: string, area: string): string {
  const query = `${name}, ${area}, Jordan`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
