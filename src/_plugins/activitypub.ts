import { Page } from 'lume/core/file.ts';

export type ActivityPubOptions = {
  account: string;
  domain: URL;
  urls: {
    outbox: string;
    notes: string;
  };
};

function activitypub(
  options: Partial<ActivityPubOptions> | Partial<ActivityPubOptions>[],
) {
  if (Array.isArray(options)) {
    throw new Error('multiple options not yet supported');
  }

  return (site: Lume.Site) => {
    const config: ActivityPubOptions = {
      domain: new URL(site.options.location.origin),
      ...options,
      urls: {
        outbox: '/activitypub/outbox',
        notes: '/activitypub/notes',
      },
    };

    site.data('activitypub', config);

    function generateNote(page: Lume.Data) {
      const link = new URL(page.url, site.options.location);

      const content = page.page.document.querySelector('main');

      const note = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `${link}#create`,
        type: 'Create',
        actor: `${config.domain}/@${config.account}`,
        object: {
          id: link,
          type: 'Note',
          content: content?.innerHTML,
          url: link,
          attributedTo: `${config.domain}/@${config.account}`,
          to: 'https://www.w3.org/ns/activitystreams#Public',
          cc: [],
          published: page.date,
        },
        // tag: [
        //   {
        //     Type: 'Mention',
        //     Href: 'https://hachyderm.io/users/mapache',
        //     Name: '@mapache@hachyderm.io',
        //   },
        //   {
        //     Type: 'Hashtag',
        //     Href: 'https://maho.dev/tags/ai',
        //     Name: '#ai',
        //   },
        // ],
        // replies: {
        //   id: 'https://maho.dev/socialweb/replies/1dff22b5faf3fbebc5aaf2bb5b5dbe2c',
        //   type: 'Collection',
        //   first: {
        //     type: 'CollectionPage',
        //     next:
        //       'https://maho.dev/socialweb/replies/1dff22b5faf3fbebc5aaf2bb5b5dbe2c?page=true',
        //     partOf:
        //       'https://maho.dev/socialweb/replies/1dff22b5faf3fbebc5aaf2bb5b5dbe2c',
        //     items: [],
        //   },
        // },
      };
      return note;
    }

    function generateOutbox(pages: Lume.Data[]) {
      return JSON.stringify(
        {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: `https://${config.domain}${config.urls.outbox}`,
          type: 'OrderedCollection',
          // summary: site.data.metas?.description,
          totalItems: pages.length,
          orderedItems: pages.map(generateNote),
        },
        null,
        2,
      );
    }

    site.process(() => {
      site.pages.push(
        Page.create({
          url: config.urls.outbox,
          content: generateOutbox(site.search.pages('blog-post', 'date=desc')),
        }),
      );
    });
  };
}

export default activitypub;
