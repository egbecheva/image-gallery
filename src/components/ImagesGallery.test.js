import { useImageApi } from '../hooks/useImageApi';
import { screen, render, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ImagesGallery from './ImagesGallery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const { result } = renderHook(() => useImageApi(1), { wrapper });

test('component shows 30 results per page', async () => {
  // ARRANGE
  render(<ImagesGallery />, { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  // ASSERT
  expect(screen.getAllByRole('img')).toHaveLength(30);
});
