import { account, domain } from './_config.ts';

export const url = '/.well-known/webfinger';

export default function () {
  const content = {
    subject: `acct:${account}@${domain}`,
    aliases: [`https://${domain}/@${account}`],
    links: [
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `https://${domain}/@${account}`,
      },
      {
        rel: 'http://webfinger.net/rel/profile-page',
        type: 'text/html',
        href: `https://${domain}`,
      },
    ],
  };
  return JSON.stringify(content, null, 2);
}
