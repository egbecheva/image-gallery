import { useImageApi } from './useImageApi';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../setupTests';
import { rest } from 'msw';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const { result } = renderHook(() => useImageApi(1), { wrapper });

it('query hook renders data successfully', async () => {
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});

it('query hook renders 30 results per page', async () => {
  await waitFor(() => expect(result.current.data).toHaveLength(30));
});

it('query hook handles error', async () => {
  server.use(
    rest.get('*', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const { result } = renderHook(() => useImageApi(1), {
    wrapper,
  });
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.error).toBeDefined();
});

describe('useImageApi', () => {
  it('logs an error message when fetchImages throws an error', async () => {
    server.use(
      rest.get('*', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    renderHook(() => useImageApi(1), {
      wrapper,
    });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const error = 'SyntaxError: Unexpected end of JSON input';
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(new Error(error));
    });

    consoleSpy.mockRestore();
  });
});
