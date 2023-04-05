// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node'
import { rest } from 'msw';


const handlers = [
  rest.get('*', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          alt_description: 'person holding white and black ceramic mug',
          urls: {
            raw: 'https://images.unsplash.com/photo-1587502536575-6dfba0a6e017?ixid=Mnw0MTg4MjF8MXwxfGFsbHwxfHx8fHx8Mnx8MTY3OTk5ODAyNw&ixlib=rb-4.0.3',
            full: 'https://images.unsplash.com/photo-1587502536575-6dfba0a6e017?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MTg4MjF8MXwxfGFsbHwxfHx8fHx8Mnx8MTY3OTk5ODAyNw&ixlib=rb-4.0.3&q=85',
            regular:
              'https://images.unsplash.com/photo-1587502536575-6dfba0a6e017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MTg4MjF8MXwxfGFsbHwxfHx8fHx8Mnx8MTY3OTk5ODAyNw&ixlib=rb-4.0.3&q=80&w=1080',
            small:
              'https://images.unsplash.com/photo-1587502536575-6dfba0a6e017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MTg4MjF8MXwxfGFsbHwxfHx8fHx8Mnx8MTY3OTk5ODAyNw&ixlib=rb-4.0.3&q=80&w=400',
            thumb:
              'https://images.unsplash.com/photo-1587502536575-6dfba0a6e017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MTg4MjF8MXwxfGFsbHwxfHx8fHx8Mnx8MTY3OTk5ODAyNw&ixlib=rb-4.0.3&q=80&w=200',
            small_s3:
              'https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1587502536575-6dfba0a6e017',
          },
        },
      ])
    );
  }),
];

export const server = setupServer(...handlers)

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())