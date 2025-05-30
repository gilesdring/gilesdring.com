import lume from "lume/mod.ts";
import base_path from "lume/plugins/base_path.ts";
import date from "lume/plugins/date.ts";
import extractDate from "lume/plugins/extract_date.ts";
import feed from "lume/plugins/feed.ts";
import metas from "lume/plugins/metas.ts";
import minify_html from "lume/plugins/minify_html.ts";
import postcss from "lume/plugins/postcss.ts";

const site = lume({
  src: './src',
  location: new URL('https://gilesdring.com/'),
});

site.preprocess(['.md'], (pages) => {
  for (const page of pages) {
    const excerptMarker = /<!--\s*more\s*-->/
    if (page.data.content && page.data.content!.match(excerptMarker)) {
      const excerpt = page.data.content.split(excerptMarker)[0]
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
site.use(metas());
site.use(minify_html());
site.use(postcss());
site.use(feed({
  query: "blog-post",
  info: {
    title: "=site.title",
    description: "=site.description",
  },
  items: {
    title: "=title",
    description: "=excerpt || =description",
  }
}))

site.use(extractDate());

site.add('assets/style.css');

site.add('assets/images');
site.add('squarespace_images/');

// Copy over old projects
site.copy('vallers2013/');
site.copy('spinner/');

export default site;
