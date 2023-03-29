import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { useImageApi } from './hooks/useImageApi';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const api_key = process.env.REACT_APP_API_KEY;
const current_page = 1;
const per_page = 30;

const handlers = [
  rest.get(
    `https://api.unsplash.com/photos/?client_id=${api_key}&page=${current_page}&per_page=${per_page}`,
    (req, res, ctx) => {
      const productIds = req.url.searchParams.getAll('id');
      return res(ctx.json([productIds]));
    }
  ),
];

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

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

test('bbb', async () => {
  const { result } = renderHook(() => useImageApi(), { wrapper });
  console.log('result', result.current.data);
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
