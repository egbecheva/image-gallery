import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import './ImagesGallery.css';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useImageApi } from '../hooks/useImageApi';

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

  let [selectedImage, setSelectedImage] = useState<string>('');
  let [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isSuccess } = useImageApi(currentPage);

  const handleClose = (e: any) => {
    e.stopPropagation();
    setSelectedImage('');
  };

  return (
    <div
      data-testid='image-gallery-container'
      key={uuidv4()}
      className={selectedImage ? `one-column-masonry` : `multi-column-masonry`}
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
            <div
              onClick={() => {
                setSelectedImage(urls.small);
              }}
              data-testid='image-card-container'
              className={
                !selectedImage
                  ? 'item'
                  : selectedImage === urls.small
                  ? 'full-screen'
                  : 'invisible'
              }
            >
              <div data-testid='image-card' className='image-card'>
                <div className='button-container'>
                  <div
                    className='back-button'
                    data-testid='back-button'
                    style={{
                      fontSize: '40px',
                    }}
                    onClick={handleClose}
                  >
                    &#8592;
                  </div>
                </div>
                <div className='image-container'>
                  <img
                    key={alt_description + uuidv4()}
                    alt={alt_description ? alt_description : ''}
                    src={
                      selectedImage === alt_description
                        ? urls.small
                        : urls.small_s3
                    }
                  />

                  <div className='alt-text'>
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
