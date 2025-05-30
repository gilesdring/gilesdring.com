import { Page } from 'lume/core/file.ts';

export function url(page: Page) {
  // Aiming for this -> /blog/:year/:month/:day/:slug/
  // console.debug('INPUT:', page.src.path, page.data.date)
  const postDate = page.data.date.toISOString().split('T')[0].replaceAll(
    '-',
    '/',
  );
  const newUrl = [null, 'blog', postDate, page.data.basename, null].join('/');
  // console.debug('OUTPUT:', page.src.path, newUrl);
  return newUrl;
}
