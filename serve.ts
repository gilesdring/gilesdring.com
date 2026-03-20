import Server from 'lume/core/server.ts';
import { mimetype } from './lib/middlewares.ts';

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/_site`,
});

server.use(mimetype({
  '/fedi': 'application/activity+json;',
  '/activitypub/.+': 'application/activity+json;',
  '/.well-known/webfinger': 'application/json;',
}));

server.start();

console.log('Listening on http://localhost:8000');
