import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://farwxdneeuusnodhhuvb.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcnd4ZG5lZXV1c25vZGhodXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2Nzc3MDIsImV4cCI6MTk5NjI1MzcwMn0.B-crC-fdDpSBog7sZsbyfobs0HaRhJ8xN91YSRRx1oI';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
