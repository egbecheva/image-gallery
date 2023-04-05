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

  let [isSelectedImage, setIsSelectedImage] = useState<boolean>(false);
  let [imageAltText, setImageAltText] = useState<string>('');
  let [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isSuccess } = useImageApi(currentPage);

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
