import Server, { Middleware } from 'lume/core/server.ts';

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/_site`,
});

function mimetype(typeMap: { [k: string]: string }): Middleware {
  return async (request, next) => {
    const url = new URL(request.url);

    const type = Object.entries(typeMap).map(([match, value]) =>
      url.pathname.match(new RegExp(match)) && value
    ).find((t) => t != null);

    if (!type) {
      return next(request);
    }

    const response = await next(request);
    response.headers.set('content-type', type);

    return response;
  };
}

server.use(mimetype({
  '/fedi': 'application/activity+json;',
  '/.well-known/webfinger': 'application/json;',
}));

server.start();

console.log('Listening on http://localhost:8000');
