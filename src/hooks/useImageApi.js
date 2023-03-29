import { useQuery } from '@tanstack/react-query';

const PER_PAGE = 30;
const apiKey = process.env.REACT_APP_API_KEY;

const fetchImages = async (p) => {
  let URL = `https://api.unsplash.com/photos/?client_id=${apiKey}&page=${p}&per_page=${PER_PAGE}`;
  try {
    let response = await fetch(URL);
    let images = await response.json();
    return images;
  } catch (e) {
    console.log('Error', e);
  }
};

const useImageApi = (pageCount) => {
  return useQuery(['images'], () => fetchImages(pageCount));
};
export { useImageApi };
