import { setupServer } from 'msw/node';
import { rest } from 'msw';

export function createServer(handlerConfig) {
  const handlers = handlerConfig.map((config) => {
    return rest[config.method || 'get'](config.path, (req, res, ctx) => {
      console.log('req', req);
      return res(ctx.json(config(req, res, ctx)));
    });
  });

  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });
}
