import React, { useEffect, useState } from 'react';
import './App.css';
import { ApiResponseData } from './types';

function LikedPosts() {
  let [data, setData] = useState<ApiResponseData[]>([]);
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchImages = async () => {
    let images;
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/?client_id=${apiKey}&per_page=30`
      );
      images = await response.json();
      setData(images);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      {data &&
        data.map((e) => (
          <div key={e.id}>
            <img src={e.links.self} />
          </div>
        ))}
    </div>
  );
}

export default LikedPosts;
