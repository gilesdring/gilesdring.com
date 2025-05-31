import { account, domain } from './_config.ts';
import site from '../../_config.ts';

export const url = `/@${account}`;

export default function ({ metas }) {
  const actor = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `https://${domain}/@${account}`,
    type: 'Person',
    following: 'https://mastodon.me.uk/users/gilesdring/following',
    followers: 'https://mastodon.me.uk/users/gilesdring/followers',
    outbox: `https://${domain}/socialweb/outbox`,
    // inbox: 'https://activitypubdotnet.azurewebsites.net/api/Inbox',
    preferredUsername: account,
    name: metas.site,
    summary: metas.description,
    url: site.options.location.toString(),
    discoverable: true,
    memorial: false,
    icon: {
      type: 'Image',
      mediaType: 'image/png',
      url: `https://${domain}/assets/images/sad-viking-favicon-64.png`,
    },
    // image: {
    //   type: 'Image',
    //   mediaType: 'image/png',
    //   url: 'https://maho.dev/img/avatar.png',
    // },
    publicKey: {
      '@context': 'https://w3id.org/security/v1',
      '@id': `https://${domain}/@${account}#main-key`,
      '@type': 'Key',
      controller: `https://${domain}/@${account}`,
      publicKeyPem: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtDbr2qQMdt+TIT8PpNdM
uNIv+ngyIOwPUWZ75tOy9PMS22W800MfDQj1R4RQZwL8nRDqXlmytmlhQEf+l1sY
HWS+fGrBdqmSq8h5hoSgV+U2mDcCXWqmcvl39nrz46bHgXOsqlX2rNIza484TYLh
+xDtbRLKXxOWLitrCregl86BYRaBzJq6M08Cnog3wPzp8tpfTPsqYGGosk+XE7WT
nml816hQytE8u80jo4V1v88JQGnFpBz6E8c97EFVnZEs5oiLJDuhscuYNLeU3x1q
b/CFJk1a7EPR5OiP2AqsEBTahV0i/80ENkpN53I4qUkSEu3MfmscYuxujgyo6Xnx
vwIDAQAB
-----END PUBLIC KEY-----`,
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
