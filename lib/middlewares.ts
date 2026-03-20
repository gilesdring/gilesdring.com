import { Middleware } from 'lume/core/server.ts';

export function mimetype(typeMap: { [k: string]: string }): Middleware {
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