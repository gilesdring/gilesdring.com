import lume from "lume/mod.ts";
import base_path from "lume/plugins/base_path.ts";
import date from "lume/plugins/date.ts";
// import inline from "lume/plugins/inline.ts";
import liquid from "lume/plugins/liquid.ts";
import metas from "lume/plugins/metas.ts";
import minify_html from "lume/plugins/minify_html.ts";
import sass from "lume/plugins/sass.ts";

const site = lume();

site.preprocess(['.njk', '.html', '.md'], (page) => {
  if (
    !Boolean(page.src.path.match(/^\/blog/)) ||
    page.data.title !== undefined
  ) return;
  const title = page.src.path.split(/_/)[1].split(/-/).map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
  page.data.title = title;
});

site.use(base_path());
site.use(date());
// site.use(inline());
site.use(liquid());
site.use(metas());
site.use(minify_html());
site.use(sass());

site.copy("assets/images");

export default site;
