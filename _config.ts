import lume from 'lume/mod.ts';
import base_path from 'lume/plugins/base_path.ts';
import codeHighlight from 'lume/plugins/code_highlight.ts';
import date from 'lume/plugins/date.ts';
import extractDate from 'lume/plugins/extract_date.ts';
import feed from 'lume/plugins/feed.ts';
import inline from 'lume/plugins/inline.ts';
import metas from 'lume/plugins/metas.ts';
import minify_html from 'lume/plugins/minify_html.ts';
import postcss from 'lume/plugins/postcss.ts';

import { fontsource } from "@dringtech/lume-utils/plugin";

import { exerptProcessor } from "./lib/excerpt.ts";
import { timeStamp } from "./lib/cache-buster.ts";
import { weeknoteProcessor } from "./lib/weeknotes.ts";

import activitypub from './src/_plugins/activitypub.ts';

const site = lume({
  src: './src',
  location: new URL('https://gilesdring.com/'),
}, {
  markdown: {
    options: {
      typographer: true
    }
  }
});

site.data('layout', '/layouts/page.vto')
site.data('buildInfo', {
  timestamp: timeStamp(),
  date: Temporal.Now.plainDateISO().toString(),
});

site.preprocess(['.md'], exerptProcessor);
site.preprocess(['.html'], weeknoteProcessor);

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

site.use(await fontsource({
  fonts: [
    "montagu-slab",
    "stack-sans-headline"
  ],
}))

site.use(extractDate());
site.use(codeHighlight());

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
-----END PUBLIC KEY-----`,
}));

site.add('/human.json');
site.add('assets/');

site.add('squarespace_images/');

// Copy over old projects
site.copy('vallers2013/');
site.copy('spinner/');

site.mergeKey("breadcrumbs", "array");

export default site;
