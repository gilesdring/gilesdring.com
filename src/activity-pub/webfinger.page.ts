export default function* ({ activitypub }: Lume.Data) {
  const { account, domain } = activitypub;
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
  yield {
    url: '/.well-known/webfinger',
    content: JSON.stringify(content, null, 2),
  };
}
