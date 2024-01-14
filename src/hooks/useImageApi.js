import { useQuery } from '@tanstack/react-query';

const PER_PAGE = 30;
const apiKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

const fetchImages = async (currentPage) => {
  let URL = `https://api.unsplash.com/photos/?client_id=D987Vn4xFbxWNoQaHIq9RU7B24wEDe7GahHeHM_09uk&page=${currentPage}&per_page=${PER_PAGE}`;
  try {
    let response = await fetch(URL);
    let images = await response.json();
    return images;
  } catch (e) {
    console.log(new Error(e));
  }
};

const useImageApi = (currentPage) => {
  return useQuery(['images', currentPage], () => fetchImages(currentPage), {
    keepPreviousData: true,
  });
};
export { useImageApi };
