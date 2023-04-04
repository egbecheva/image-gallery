import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { useImageApi } from './hooks/useImageApi';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ImagesGallery from './ImagesGallery';

export const handlers = [
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

//setup server with mocked data
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const { result } = renderHook(() => useImageApi(1), { wrapper });

test('query hook renders data successfully', async () => {
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});

test('query hook renders 30 results per page', async () => {
  await waitFor(() => expect(result.current.data).toHaveLength(30));
});

test('query hook handles error', async () => {
  server.use(
    rest.get('*', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const { result } = renderHook(() => useImageApi(1), {
    wrapper,
  });

  expect(result.current.error).toBeDefined();
});

test('loads mocked result in component', async () => {
  // ARRANGE
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  render(<ImagesGallery />, { wrapper });

  // ASSERT
  expect(screen.getAllByRole('img')).toHaveLength(1);
});
