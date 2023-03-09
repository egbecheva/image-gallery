import React from 'react';
import './App.css';
import NavBar from './NavBar';
import LikedPosts from './LikedPosts';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <LikedPosts />
    </div>
  );
}

export default App;
