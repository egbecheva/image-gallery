import { useQuery } from '@tanstack/react-query';

const PER_PAGE = 30;
const apiKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

let images;
const fetchImages = async (currentPage) => {
  let URL = `https://api.unsplash.com/photos/?client_id=${apiKey}&page=${currentPage}&per_page=${PER_PAGE}`;
  try {
    let response = await fetch(URL);
    images = await response.json();
    return images;
  } catch (e) {
    console.log(new Error(e));
  }
};

const useImageApi = (currentPage) => {
  return useQuery(['images'], () => fetchImages(currentPage));
};
export { useImageApi };
