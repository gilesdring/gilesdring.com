import { Page } from "lume/core/file.ts";

export function url(page: Page) {
  // Aiming for this -> /blog/:year/:month/:day/:slug/
  const folder = page.src.path.split('_')[0].replace(/-/g, "/");
  return page.data.url.replace(/^\/blog/, folder).toLowerCase()
}