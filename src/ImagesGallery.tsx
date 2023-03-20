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
  // let currentPage = useRef(1);

  const COUNT_PHOTOS = 50;
  const PER_PAGE = 30;
  const apiKey = process.env.REACT_APP_API_KEY;
  const countPages = Math.round(COUNT_PHOTOS / PER_PAGE);
  const fetchImages = async (p: number) => {
    let URL = `https://api.unsplash.com/photos/?client_id=${apiKey}&page=${p}&per_page=${PER_PAGE}`;
    try {
      let response = await fetch(URL);
      let images = await response.json();
      return images;
    } catch (e) {
      console.log('Error', e);
    }
  };

  let oldArr: any = [];
  let currArr: any = [];

  let baba = async (pg: number) => {
    for (let i = pg; i <= countPages; i++) {
      let imgs: any = await fetchImages(i);
      currArr = [...oldArr, ...imgs];
      oldArr = currArr;
    }
    return currArr;
  };

  const { data, isSuccess } = useQuery(
    ['images'],
    () =>
      baba(currentPage).then((response) => {
        setImagesData(response);
        return response;
      }),
    {
      keepPreviousData: true,
    }
  );

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
            <img
              className='item'
              key={uuidv4()}
              alt={alt_description}
              src={urls?.thumb}
            />
          )
        )}
    </div>
  );
}

export default ImagesGallery;
