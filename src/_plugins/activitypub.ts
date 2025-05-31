import { Page } from 'lume/core/file.ts';

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

/**

https://maho.dev/2024/02/a-guide-to-implementing-activitypub-in-a-static-site-or-any-website-part-3/

https://browser.pub/@fedi@gilesdring.com

https://shkspr.mobi/blog/2024/02/activitypub-server-in-a-single-file/

https://w3c-ccg.github.io/security-vocab/#publicKey

owner is deprecated - controller
*/
export function activitypub(
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

    const actor = new Actor(config);

    function generateNote(page: Lume.Data) {
      const link = new URL(page.url, site.options.location);

      // const content = page.page.document.querySelector('main')?.innerHTML;
      const content = `${page.title}<br><a href="${link}">${link}</a>`;

      const note = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `${link}-create`,
        type: 'Create',
        actor: actor.id,
        object: {
          id: link,
          type: 'Note',
          content: content,
          url: link,
          attributedTo: actor.id,
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
      const { domain, urls } = config;
      return JSON.stringify(
        {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: `${domain.origin}${urls.outbox}`,
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
          content: JSON.stringify(actor.webfinger, null, 2),
        }),
      );

      site.pages.push(
        Page.create({
          url: `/${config.account}`,
          content: actor.toString(),
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

export class Actor {
  account: string;
  domain: Required<ActivityPubOptions>['domain'];
  urls: Required<ActivityPubOptions>['urls'];
  publicKey: ActivityPubOptions['publicKey'];
  constructor(
    config: Pick<
      Required<ActivityPubOptions>,
      'account' | 'domain' | 'urls' | 'publicKey'
    >,
  ) {
    const { account, domain, urls, publicKey } = config;
    this.account = account;
    this.domain = domain;
    this.urls = urls;
    this.publicKey = publicKey;
  }

  get id() {
    return `${this.domain.origin}/${this.account}`;
  }

  get webfinger() {
    return {
      subject: `acct:${this.account}@${this.domain.host}`,
      aliases: [`${this.domain.origin}/@${this.account}`],
      links: [
        {
          rel: 'self',
          type: 'application/activity+json',
          href: this.id,
        },
        {
          rel: 'http://webfinger.net/rel/profile-page',
          type: 'text/html',
          href: `${this.domain}`,
        },
      ],
    };
  }

  get config() {
    return {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: this.id,
      type: 'Person',
      following: 'https://mastodon.me.uk/users/gilesdring/following',
      followers: 'https://mastodon.me.uk/users/gilesdring/followers',
      outbox: `${this.domain.origin}${this.urls.outbox}`,
      inbox: `${this.domain.origin}${this.urls.inbox}`,
      preferredUsername: this.account,
      // name: metas?.site,
      // summary: metas?.description,
      url: this.domain,
      discoverable: true,
      memorial: false,
      icon: {
        type: 'Image',
        mediaType: 'image/png',
        // TODO pass this in as config
        url: `${this.domain.origin}/assets/images/sad-viking-favicon-64.png`,
      },
      // image: {
      //   type: 'Image',
      //   mediaType: 'image/png',
      //   url: 'https://maho.dev/img/avatar.png',
      // },
      publicKey: {
        '@context': 'https://w3id.org/security/v1',
        '@type': 'Key',
        id: `${this.id}#main-key`,
        owner: this.id,
        publicKeyPem: this.publicKey,
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
  }

  toString() {
    return JSON.stringify(this.config, null, 2);
  }
}
