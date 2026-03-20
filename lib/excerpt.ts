export function exerptProcessor(pages) {
  for (const page of pages) {
    const excerptMarker = /<!--\s*more\s*-->/;
    if (page.data.content && page.data.content!.match(excerptMarker)) {
      const excerpt = page.data.content.split(excerptMarker)[0];
      page.data.excerpt = excerpt;
      if (!page.data.description) page.data.description = page.data.excerpt;
    }
  }
}