import React, {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
  useEffect,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
// import './App.css';
// import './ImagesGallery.css';
import styles from './ImagesGallery.module.css';
import { useImageApi } from '../hooks/useImageApi';
import Skeleton from '@mui/material/Skeleton';
import Masonry from 'react-layout-masonry';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Session } from '@supabase/gotrue-js/src/lib/types';

type ImagesGalleryProps = {
  currentSession: Session;
  updateFavorite: (userId: string, imageData: object) => void;
  fetchFavorites: (userId: string) => Promise<
    | {
        [x: string]: any;
      }[]
    | undefined
  >;
};

type Urls = {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
};

function ImagesGallery({
  currentSession,
  fetchFavorites,
  updateFavorite,
}: ImagesGalleryProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isSuccess, isLoading } = useImageApi(currentPage);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [images, setImages] = useState([]);
  const [favImages, setFavImages] = useState<any[]>([]);
  // Ref to the container with elements
  let imagesList = useRef(null);

  useEffect(() => {
    fetchFavorites(currentSession.user.id).then((data: any) =>
      setFavImages(data[0].image_data)
    );
  }, []);

  useEffect(() => {
    if (data) {
      // Append the new data to the accumulated data list
      if (Array.isArray(data)) {
        //@ts-ignore
        setImages((prevDataList) => [...prevDataList, ...data]);
      }
      // setImages((prevDataList) => [...prevDataList, ...data]);
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (imagesList, options) => {
        const target = imagesList[(imagesList.length - 1) / 2];

        if (target.isIntersecting) {
          setCurrentPage(currentPage + 1);
        }
      },
      {
        threshold: 0.1, // Example threshold value, change it as per your needs
      }
    );

    imagesList.current && observer.observe(imagesList.current);

    return () => {
      imagesList.current && observer.unobserve(imagesList.current);
    };
  }, [images]);

  const handleClose = (e: any) => {
    e.stopPropagation();
    setSelectedImage('');
  };

  const handleAddFavorites = (event: any, id: string): void => {
    event.stopPropagation();
    setFavImages((prevImagesIds) => [...prevImagesIds, id]);
    updateFavorite(currentSession.user.id, [...favImages, id]);
  };

  const handleRemoveFavorites = (event: any, id: string): void => {
    event.stopPropagation();
    setFavImages((prevImagesIds) => prevImagesIds.filter((el) => el !== id));
    updateFavorite(
      currentSession.user.id,
      favImages.filter((el) => el !== id)
    );
  };

  return (
    <div
      data-testid='image-gallery-container'
      key={uuidv4()}
      className={`${styles.container} ${styles.masonry}`}
    >
      <Masonry
        columns={
          !selectedImage
            ? { 350: 1, 640: 2, 768: 3, 1024: 4, 1280: 5 }
            : { 350: 1, 640: 1, 768: 1, 1024: 1, 1280: 1 }
        }
        gap={15}
      >
        {isSuccess &&
          images?.map(
            (
              {
                alt_description,
                urls,
                id,
              }: {
                alt_description: string;
                urls: Urls;
                id: string;
              },
              i
            ) => (
              <div
                key={alt_description + uuidv4()}
                onClick={() => {
                  setSelectedImage(urls.small);
                }}
                data-testid='image-card-container'
                className={
                  !selectedImage
                    ? `${styles.item}`
                    : selectedImage === urls.small
                    ? `${styles.fullScreen}`
                    : `${styles.invisible}`
                }
              >
                <div data-testid='image-card' className={`${styles.imageCard}`}>
                  <div>
                    <div
                      className={`${styles.backButton}`}
                      data-testid='back-button'
                      style={{
                        fontSize: '40px',
                      }}
                      onClick={handleClose}
                    >
                      &#8592;
                    </div>
                  </div>
                  <img
                    ref={imagesList}
                    className={`${styles.img}`}
                    key={alt_description + uuidv4()}
                    alt={alt_description ? alt_description : ''}
                    src={
                      selectedImage === alt_description
                        ? urls.small_s3
                        : urls.small
                    }
                  />
                  {!favImages.includes(id) ? (
                    <FavoriteBorderIcon
                      className={`${styles.heart}`}
                      onClick={(event) => handleAddFavorites(event, id)}
                    />
                  ) : (
                    <FavoriteIcon
                      className={`${styles.heart}`}
                      onClick={(event) => handleRemoveFavorites(event, id)}
                    />
                  )}
                </div>
                <div className={`${styles.altText}`}>
                  {typeof alt_description === 'object'
                    ? null
                    : alt_description?.charAt(0).toUpperCase() +
                      alt_description?.slice(1)}
                </div>
              </div>
            )
          )}
        {isLoading && (
          <Skeleton variant='rectangular' width={210} height={118} />
        )}
      </Masonry>
    </div>
  );
}

export default ImagesGallery;
