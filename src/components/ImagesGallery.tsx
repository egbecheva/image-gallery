import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import './ImagesGallery.css';
import { useImageApi } from '../hooks/useImageApi';

function ImagesGallery() {
  type Urls = {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isSuccess, isLoading } = useImageApi(currentPage);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [images, setImages] = useState(data);

  console.log('images', images && images);

  let containerRef = useRef(null);
  let imageRef = useRef(null);

  console.log(data);

  let options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  };

  useEffect(() => {
    const callBack = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        entry.isIntersecting && setCurrentPage((i) => i + 1);
        setImages([...images, ...data]);
      });
    };
    const observer = new IntersectionObserver(callBack, options);

    const observable = imageRef.current;

    if (observable) {
      observer.observe(observable);
    }

    return () => {
      if (observable) {
        observer.unobserve(observable);
      }
    };
  }, [options]);

  const handleClose = (e: any) => {
    e.stopPropagation();
    setSelectedImage('');
  };

  return (
    <div
      ref={containerRef}
      data-testid='image-gallery-container'
      key={uuidv4()}
      className={`container masonry
       ${selectedImage ? `one-column-masonry` : `multi-column-masonry`}
      `}
    >
      {isLoading && <div>Loading</div>}
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
              ref={imageRef}
              key={alt_description}
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
                  <div id='image-wrapper'>
                    <img
                      key={alt_description + uuidv4()}
                      alt={alt_description ? alt_description : ''}
                      src={
                        selectedImage === alt_description
                          ? urls.small
                          : urls.small_s3
                      }
                    />
                  </div>
                  <div className='alt-text'>
                    {typeof alt_description === 'object'
                      ? null
                      : alt_description?.charAt(0).toUpperCase() +
                        alt_description?.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      {/* <button onClick={() => handleRefetch(7)}>AABAB</button> */}
    </div>
  );
}

export default ImagesGallery;
