import { supabase } from './supabase';

const fetchFavorites = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      console.log(error);
    } else {
      return data;
    }
  } catch (e) {
    console.log(e);
  }
};

const updateFavorite = async (userId, imageData) => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .upsert(
        { user_id: userId, image_data: imageData },
        { onConflict: 'user_id' }
      )
      .select();
    if (error) {
      console.error('Error updating data:', error);
    } else {
      console.log('User updated successfully:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export { updateFavorite, fetchFavorites };
