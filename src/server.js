'use strict';

process.on('unhandledRejection', reason => {
  console.error(reason.stack);
});

const { parse } = require('url');

const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');

const serveRootFiles = require('./serveRootFiles');

const internalPrefixes = ['/_next/*', '/static/*'];
const port = process.env.SERVER_PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  dir: __dirname,
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  router.get(internalPrefixes, async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  router.get('*', async ctx => {
    const { pathname } = parse(ctx.url);
    await app.render(ctx.req, ctx.res, '/', { pathname });
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })
  server.use(serveRootFiles);
  server.use(router.routes());

  server.listen(port, error => {
    if (error) {
      throw error;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
});
