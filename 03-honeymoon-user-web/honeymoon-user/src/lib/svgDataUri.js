/** Build a valid data: URL for inline SVG (safe quoting in JS). */
export function svgDataUri(svgMarkup) {
  return 'data:image/svg+xml,' + encodeURIComponent(svgMarkup);
}
