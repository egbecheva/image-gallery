import React from 'react';
import './NavBar.css';

function NavBar() {
  return (
    <nav>
      <span>
        <a href='/'>1 - 99 likes</a>
      </span>
      <span>
        <a href='/'>100 - 500 likes</a>
      </span>
      <span>
        <a href='/'>500+ likes</a>
      </span>
    </nav>
  );
}

export default NavBar;
