import lume from 'lume/mod.ts';
import base_path from 'lume/plugins/base_path.ts';
import date from 'lume/plugins/date.ts';
import extractDate from 'lume/plugins/extract_date.ts';
import feed from 'lume/plugins/feed.ts';
import inline from 'lume/plugins/inline.ts';
import metas from 'lume/plugins/metas.ts';
import minify_html from 'lume/plugins/minify_html.ts';
import postcss from 'lume/plugins/postcss.ts';

import activitypub from './src/_plugins/activitypub.ts';

const site = lume({
  src: './src',
  location: new URL('https://gilesdring.com/'),
});

site.preprocess(['.md'], (pages) => {
  for (const page of pages) {
    const excerptMarker = /<!--\s*more\s*-->/;
    if (page.data.content && page.data.content!.match(excerptMarker)) {
      const excerpt = page.data.content.split(excerptMarker)[0];
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
site.use(inline());
site.use(minify_html());
site.use(postcss());
site.use(feed({
  query: 'blog-post',
  info: {
    title: '=site.title',
    description: '=site.description',
  },
  items: {
    title: '=title',
    description: '=excerpt || =description',
  },
}));

site.use(extractDate());

site.use(activitypub({
  account: 'fedi',
  domain: new URL('https://gilesdring.com'),
  publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtDbr2qQMdt+TIT8PpNdM
uNIv+ngyIOwPUWZ75tOy9PMS22W800MfDQj1R4RQZwL8nRDqXlmytmlhQEf+l1sY
HWS+fGrBdqmSq8h5hoSgV+U2mDcCXWqmcvl39nrz46bHgXOsqlX2rNIza484TYLh
+xDtbRLKXxOWLitrCregl86BYRaBzJq6M08Cnog3wPzp8tpfTPsqYGGosk+XE7WT
nml816hQytE8u80jo4V1v88JQGnFpBz6E8c97EFVnZEs5oiLJDuhscuYNLeU3x1q
b/CFJk1a7EPR5OiP2AqsEBTahV0i/80ENkpN53I4qUkSEu3MfmscYuxujgyo6Xnx
vwIDAQAB
-----END PUBLIC KEY-----`
}));

site.add('assets/style.css');

site.add('assets/images');
site.add('squarespace_images/');

// Copy over old projects
site.copy('vallers2013/');
site.copy('spinner/');

export default site;
