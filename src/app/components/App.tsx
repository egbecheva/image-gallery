import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase.js';
import { updateFavorite, fetchFavorites } from '../../services/userService.js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
// import './App.css';
import NavBar from './NavBar';
import ImagesGallery from './ImagesGallery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Session } from '@supabase/gotrue-js/src/lib/types';

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>('');
  const [authChecked, setAuthChecked] = useState(false);

  const handleSignOut = () => {
    supabase.auth.signOut();
    setSession(null);
    setUserEmail('');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      //@ts-ignore.
      setSession(session);
      setAuthChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      //@ts-ignore
      setSession(session);
      setUserEmail(session?.user.email);
      setAuthChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!authChecked) {
    return <div></div>;
  }

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
              // onAuthSuccess={async (event, session) => {
              // const { user } = session;
              // const { data, error } = await supabase
              //   .from('users')
              //   .update({ full_name: user.user_metadata.full_name })
              //   .eq('id', user.id);
              // if (error) {
              //   console.log(error);
              // } else {
              //   console.log(data);
              // }
              // }}
            />
          </div>
        </div>
      </div>
    );
  } else
    return (
      <QueryClientProvider client={queryClient}>
        <div className='App'>
          <ReactQueryDevtools />
          <NavBar
            handleSignOut={handleSignOut}
            full_name={userEmail ? userEmail : ''}
          />
          <ImagesGallery
            currentSession={session}
            updateFavorite={updateFavorite}
            fetchFavorites={fetchFavorites}
          />
        </div>
      </QueryClientProvider>
    );
}

export default App;
