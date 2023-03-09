export type User = {
  accepted_tos: boolean;
  bio: string;
  first_name: string;
  for_hire: boolean;
  id: string;
  instagram_username: string;
  last_name: string;
  links: {
    self: string;
    html: string;
    photos: string;
    likes: string;
    portfolio: string;
  };
  location: string;
  name: string;
  portfolio_url: string;
  profile_image: {
    small: string;
    medium: string;
    large: string;
  };
  social: {
    instagram_username: string;
    portfolio_url: string;
    twitter_username: string;
    paypal_email: null | string;
  };
  total_collections: number;
  total_likes: number;
  total_photos: number;
  twitter_username: string;
  updated_at: string;
  username: string;
  width: number;
}


export interface ApiResponseData {
  alt_description: string;
  blur_hash: string;
  color: string;
  created_at: string;
  current_user_collections: [];
  description: string;
  height: number;
  id: string;
  liked_by_user: false;
  likes: number;
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  promoted_at: string;
  sponsorship: null | string;
  topic_submissions: {};
  updated_at: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: User
};