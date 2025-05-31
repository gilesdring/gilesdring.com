import { Page } from 'lume/core/file.ts';
/**

https://maho.dev/2024/02/a-guide-to-implementing-activitypub-in-a-static-site-or-any-website-part-3/

https://browser.pub/@fedi@gilesdring.com

https://shkspr.mobi/blog/2024/02/activitypub-server-in-a-single-file/

https://w3c-ccg.github.io/security-vocab/#publicKey

owner is deprecated - controller
 */
export type ActivityPubOptions = {
  account: string;
  publicKey: string;
  domain?: URL;
  urls?: Partial<{
    inbox: string;
    outbox: string;
    notes: string;
  }>;
};

function activitypub(
  options: ActivityPubOptions | ActivityPubOptions[],
) {
  if (Array.isArray(options)) {
    throw new Error('multiple options not yet supported');
  }

  if (!options.account) {
    throw new ReferenceError('ActivityPub account name not provided');
  }

  if (!options.publicKey) {
    throw new ReferenceError('ActivityPub public key not provided');
  }

  return (site: Lume.Site) => {
    const config: Required<ActivityPubOptions> = {
      domain: new URL(site.options.location.origin),
      ...options,
      urls: {
        outbox: '/activitypub/outbox',
        inbox: '/activitypub/inbox',
        notes: '/activitypub/notes',
      },
    };

    site.data('activitypub', config);

    function generateWebfinger() {
      const { account, domain } = config;

      const content = {
        subject: `acct:${account}@${domain.host}`,
        aliases: [`${domain.origin}/@${account}`],
        links: [
          {
            rel: 'self',
            type: 'application/activity+json',
            href: `${domain.origin}/@${account}`,
          },
          {
            rel: 'http://webfinger.net/rel/profile-page',
            type: 'text/html',
            href: `${domain}`,
          },
        ],
      };

      return JSON.stringify(content, null, 2);
    }

    function generateActor() {
      const { account, domain, urls, publicKey } = config;
      const actor = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `${domain.origin}/@${account}`,
        type: 'Person',
        following: 'https://mastodon.me.uk/users/gilesdring/following',
        followers: 'https://mastodon.me.uk/users/gilesdring/followers',
        outbox: `${domain.origin}${urls.outbox}`,
        inbox: `${domain.origin}${urls.inbox}`,
        preferredUsername: account,
        // name: metas?.site,
        // summary: metas?.description,
        url: domain,
        discoverable: true,
        memorial: false,
        icon: {
          type: 'Image',
          mediaType: 'image/png',
          url: `${domain.origin}/assets/images/sad-viking-favicon-64.png`,
        },
        // image: {
        //   type: 'Image',
        //   mediaType: 'image/png',
        //   url: 'https://maho.dev/img/avatar.png',
        // },
        publicKey: {
          '@context': 'https://w3id.org/security/v1',
          '@id': `${domain.origin}/@${account}#main-key`,
          '@type': 'Key',
          controller: `${domain.origin}/@${account}`,
          publicKeyPem: publicKey,
        },
        // attachment: [
        //   {
        //     type: 'PropertyValue',
        //     name: 'Blog',
        //     value:
        //       '<a href="https://dringtech.com/blog" target="_blank" rel="nofollow noopener noreferrer me" translate="no"><span class="invisible">https://</span><span class="">dringtech.com/blog</span><span class="invisible"></span></a>',
        //   },
        //   {
        //     type: 'PropertyValue',
        //     name: 'LinkedIn',
        //     value:
        //       '<a href="https://www.linkedin.com/in/gilesdring" target="_blank" rel="nofollow noopener noreferrer me" translate="no"><span class="invisible">https://www.</span><span class="">linkedin.com/in/gilesdring</span><span class="invisible"></span></a>',
        //   },
        //   {
        //     type: 'PropertyValue',
        //     name: 'GitHub',
        //     value:
        //       '<a href="https://github.com/dringtech" target="_blank" rel="nofollow noopener noreferrer me" translate="no"><span class="invisible">https://</span><span class="">github.com/mahomedalid</span><span class="invisible"></span></a>',
        //   },
        // ],
      };
      return JSON.stringify(actor, null, 2);
    }

    function generateNote(page: Lume.Data) {
      const link = new URL(page.url, site.options.location);
      const { account, domain } = config;

      const content = page.page.document.querySelector('main');

      const note = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `${link}-create`,
        type: 'Create',
        actor: `${domain.origin}/@${account}`,
        object: {
          id: link,
          type: 'Note',
          content: content?.innerHTML,
          url: link,
          attributedTo: `${domain.origin}/@${account}`,
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
          url: '/.well-known/webfinger',
          content: generateWebfinger(),
        }),
      );

      site.pages.push(
        Page.create({
          url: `/@${config.account}`,
          content: generateActor(),
        }),
      );

      site.pages.push(
        Page.create({
          url: config.urls.outbox!,
          content: generateOutbox(site.search.pages('blog-post', 'date=desc')),
        }),
      );
    });
  };
}

export default activitypub;
