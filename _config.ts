import lume from "lume/mod.ts";
import base_path from "lume/plugins/base_path.ts";
import date from "lume/plugins/date.ts";
// import inline from "lume/plugins/inline.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import metas from "lume/plugins/metas.ts";
import minify_html from "lume/plugins/minify_html.ts";
import postcss from "lume/plugins/postcss.ts";

const site = lume();

site.preprocess(['.md'], (pages) => {
  for (const page of pages) {
    if (page.data.content && page.data.content!.match(/<!--more-->/)) {
      const excerpt = page.data.content.split('<!--more-->')[0]
      page.data.excerpt = excerpt;
    }
    // const excerpt = (page.data.content && page.data.content!.match(/<!--more-->/)) ? page.data.content.split(/<!--more-->/)[0] : undefined;
    // console.log(excerpt);
    // if (
    //   page.content.match(/^<!--more-->/)
    // ) {
    //   console.log(page.src.path);
    // };
  }
});

site.ignore('admin');

site.use(base_path());
site.use(date());
// site.use(inline());
site.use(nunjucks());
site.use(metas());
site.use(minify_html());
site.use(postcss());

site.add('assets/style.css');

site.copy("assets/images");
site.copy([".html"]);

export default site;
