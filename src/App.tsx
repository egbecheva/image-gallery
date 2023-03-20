import React from 'react';
import './App.css';
import NavBar from './NavBar';
import ImagesGallery from './ImagesGallery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <NavBar />
        <ImagesGallery />
      </div>
    </QueryClientProvider>
  );
}

export default App;
