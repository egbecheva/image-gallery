import { useImageApi } from '../../hooks/useImageApi';
import {
  fireEvent,
  screen,
  render,
  cleanup,
  renderHook,
  waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ImagesGallery from '../components/ImagesGallery';

afterEach(cleanup);

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const { result } = renderHook(() => useImageApi(1), { wrapper });

test('component shows 30 results per page', async () => {
  render(<ImagesGallery />, { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(screen.getAllByRole('img')).toHaveLength(30);
});

test('images have alt text', async () => {
  render(<ImagesGallery />, { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  const images = screen.getAllByRole('img');
  images.forEach((image) => {
    expect(image).toHaveAttribute('alt');
  });
});

test('clicking on an image should trigger setIsSelectedImage', async () => {
  render(<ImagesGallery />, { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  const firstImage = await screen.findByTestId('image-card-container');
  expect(firstImage).toHaveClass('item');
  fireEvent.click(firstImage);

  expect(await screen.findByTestId('image-card-container')).toHaveClass(
    'full-screen'
  );
});

test('clicking on a button should show all images', async () => {
  render(<ImagesGallery />, { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  const firstImage = await screen.findByTestId('image-card-container');
  fireEvent.click(firstImage);
  const backButton = screen.getByTestId('back-button');
  fireEvent.click(backButton);

  expect(await screen.findByTestId('image-gallery-container')).toHaveClass(
    'multi-column-masonry'
  );
});
