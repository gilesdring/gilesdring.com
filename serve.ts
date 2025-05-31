import Server from 'lume/core/server.ts';

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/_site`,
});

server.use(async (request, next) => {
  const url = new URL(request.url);

  if (!['/fedi'].includes(url.pathname)) {
    return next(request);
  }

  // Here you can modify the request before being passed to next middlewares
  const response = await next(request);
  response.headers.set('content-type', 'application/activity+json;');

  // Here you can modify the response before being returned to the previous middleware
  return response;
});

server.start();

console.log('Listening on http://localhost:8000');
