import { supabase } from './supabase';

const fetchFavorite = async (v) => {
  try {
    const { data, error } = await supabase.from('user_favorites').select('*');
    if (error) {
      console.log(error);
    } else {
      console.log('fetched ok: ', data);
    }
  } catch (e) {
    console.log(e);
  }
};

const updateFavorite = async (userId, imageIdArray) => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .upsert(
        { user_id: userId, image_id: imageIdArray },
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

export { updateFavorite, fetchFavorite };
