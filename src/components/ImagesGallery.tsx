import React, {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
  useEffect,
} from 'react';
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
  const [images, setImages] = useState([]);

  // Ref to the container with elements
  let containerRef = useRef(null);

  function isElementInViewport(element: any) {
    const rect = element.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.left < window.innerWidth &&
      rect.top < window.innerHeight
    );
  }

  function findLastElementInViewport(elements: any) {
    let lastElement = null;

    for (let i = elements.length - 1; i >= 0; i--) {
      if (isElementInViewport(elements[i])) {
        lastElement = elements[i];
        break;
      }
    }

    return lastElement;
  }

  const scrollTo = useMemo(() => {
    // Find all elements in container which will be checked if are in view or not
    //@ts-ignore
    const nodeElements = containerRef.current?.querySelectorAll('img');
    if (nodeElements && images) {
      return findLastElementInViewport(nodeElements);
    }

    return null;
  }, [currentPage]);

  //TODO

  // useLayoutEffect(() => {
  //   //@ts-ignore
  //   if (scrollTo) {
  //     // Scroll to element with should be in view after rendering
  //     //@ts-ignore
  //     scrollTo.scrollIntoView();
  //   }
  //   // Scroll by height of nav
  //   window.scrollBy(0, window.innerHeight);
  // }, [scrollTo]);

  useEffect(() => {
    if (data) {
      // Append the new data to the accumulated data list
      //@ts-ignore
      setImages((prevDataList) => [...prevDataList, ...data]);
    }
  }, [data]);

  useEffect(() => {
    // Add a scroll event listener to detect when the user has scrolled to the bottom
    function handleScroll() {
      if (
        //if user scrolled to  bottom
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        // User scrolled to the bottom, increment the page
        setCurrentPage(currentPage + 1);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);

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
        images?.map(
          ({
            alt_description,
            urls,
          }: {
            alt_description: string;
            urls: Urls;
          }) => (
            <div
              key={alt_description + uuidv4()}
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
