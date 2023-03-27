import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { ApiResponseData } from './types';
import './ImagesGallery.css';
import { useQueryClient, useQuery } from '@tanstack/react-query';

function ImagesGallery() {
  const queryClient = useQueryClient();

  type Urls = {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
  };

  let [imagesData, setImagesData] = useState<ApiResponseData[]>([]);
  let [currentPage, setCurrentPage] = useState<number>(1);
  let [isSelectedImage, setIsSelectedImage] = useState<boolean>(false);
  let [imageAltText, setImageAltText] = useState<string>('');
  // let imageAltText = useRef<string>();
  // let currentPage = useRef(1);

  // const COUNT_PHOTOS = 30;
  const PER_PAGE: number = 30;
  const apiKey: string | undefined = process.env.REACT_APP_API_KEY;
  // const countPages = Math.round(COUNT_PHOTOS / PER_PAGE);
  const fetchImages = async (p: number) => {
    let URL = `https://api.unsplash.com/photos/?client_id=${apiKey}&page=${p}&per_page=${PER_PAGE}`;
    try {
      let response = await fetch(URL);
      let images = await response.json();
      setImagesData(images);
      return images;
    } catch (e) {
      console.log('Error', e);
    }
  };

  //in case we need to fetch more pages from API at once

  // let fetchCombinedImages = async (pg: number) => {
  //   let oldArr: any = [];
  //   let currArr: any = [];
  //   for (let i = pg; i <= countPages; i++) {
  //     let imgs: ApiResponseData[] = await fetchImages(i);
  //     currArr = [...oldArr, ...imgs];
  //     oldArr = currArr;
  //   }
  //   return currArr;
  // };

  const { data, isSuccess } = useQuery(
    ['images'],
    () => fetchImages(currentPage),
    {
      keepPreviousData: true,
    }
  );

  const isImageClicked = (alt: string, selected: string | undefined) => {
    if (isSelectedImage && selected === alt) return true;
  };

  const isImageInvisible = (alt: string, selected: string | undefined) => {
    if (isSelectedImage && selected !== alt) {
      return true;
    }
  };

  const handleImagePreview = (
    altData: string,
    selectedImageAlt: string
  ): string => {
    if (isImageClicked(altData, selectedImageAlt)) {
      return 'full-screen';
    }
    if (isImageInvisible(altData, selectedImageAlt)) {
      return 'invisible';
    }
    return 'item';
  };

  return (
    <div
      className={
        isSelectedImage ? `one-column-masonry` : `multi-column-masonry`
      }
    >
      {isSuccess &&
        data.map(
          ({
            alt_description,
            urls,
          }: {
            alt_description: string;
            urls: Urls;
          }) => (
            <div>
              <div
                className={
                  handleImagePreview(alt_description, imageAltText) +
                  '-imageCard'
                }
              >
                <div className='button-container'>
                  <div
                    className={
                      handleImagePreview(alt_description, imageAltText) +
                      ' back-button'
                    }
                    style={{
                      fontSize: '40px',
                    }}
                    onClick={() => setIsSelectedImage(false)}
                  >
                    &#8592;
                  </div>
                </div>
                <div className='image-container'>
                  <img
                    onClick={() => {
                      setImageAltText(alt_description);
                      setIsSelectedImage(true);
                    }}
                    className={handleImagePreview(
                      alt_description,
                      imageAltText
                    )}
                    key={alt_description + uuidv4()}
                    alt={alt_description}
                    src={
                      imageAltText === alt_description
                        ? urls.small
                        : urls.small_s3
                    }
                  />

                  <div
                    className={handleImagePreview(
                      alt_description,
                      imageAltText
                    )}
                  >
                    {alt_description?.charAt(0).toUpperCase() +
                      alt_description?.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
    </div>
  );
}

export default ImagesGallery;
