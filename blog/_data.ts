export function url(page) {
  // /blog/:year/:month/:day/:slug/
  const folder = page.src.path.split('_')[0].replace(/-/g, "/");
  const url = page.dest.path.replace(/^\/blog/, folder) + "/";
  return url;
}