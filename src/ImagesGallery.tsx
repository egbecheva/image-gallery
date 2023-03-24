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

  const isImageBlurred = (alt: string, selected: string | undefined) => {
    if (isSelectedImage && selected !== alt) {
      return true;
    }
  };

  console.log('rendered');

  return (
    <div className='masonry'>
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
              <div className='imageCard'>
                <img
                  onClick={() => {
                    setImageAltText(alt_description);
                    setIsSelectedImage(true);
                  }}
                  className={
                    isImageClicked(alt_description, imageAltText)
                      ? 'full-screen'
                      : isImageBlurred(alt_description, imageAltText)
                      ? 'blurred'
                      : 'item'
                  }
                  key={uuidv4()}
                  alt={alt_description}
                  src={imageAltText === alt_description ? urls.raw : urls.thumb}
                />

                <div>{alt_description}</div>
              </div>
            </div>
          )
        )}
    </div>
  );
}

export default ImagesGallery;
