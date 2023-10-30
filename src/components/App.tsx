import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import './App.css';
import NavBar from './NavBar';
import ImagesGallery from './ImagesGallery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const supabase = createClient(
  'https://farwxdneeuusnodhhuvb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcnd4ZG5lZXV1c25vZGhodXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2Nzc3MDIsImV4cCI6MTk5NjI1MzcwMn0.B-crC-fdDpSBog7sZsbyfobs0HaRhJ8xN91YSRRx1oI'
);

function App() {
  const [session, setSession] = useState(null);
  const [userEmail, setUserEmail] = useState<string | undefined>('');

  const handleSignOut = () => {
    supabase.auth.signOut();
    setSession(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      //@ts-ignore
      setSession(session);
      setUserEmail(session?.user.email);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      //@ts-ignore
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className='container'>
        <div style={{ textAlign: 'center' }} className='row'>
          <div style={{ display: 'inline-block' }} className='col-12'>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['github']}
              //@ts-ignore
              onAuthSuccess={async (event, session) => {
                const { user } = session;
                const { data, error } = await supabase
                  .from('users')
                  .update({ full_name: user.user_metadata.full_name })
                  .eq('id', user.id);
                if (error) {
                  console.log(error);
                } else {
                  console.log(data);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <NavBar
          handleSignOut={handleSignOut}
          full_name={userEmail ? userEmail : ''}
        />
        <ImagesGallery />
      </div>
    </QueryClientProvider>
  );
}

export default App;
