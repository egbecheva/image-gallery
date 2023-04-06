import React from 'react';
import './NavBar.css';

function NavBar() {
  return (
    <nav>
      <button>
        <a href='/'>1 - 99 likes</a>
      </button>
      <button>
        <a href='/'>100 - 500 likes</a>
      </button>
      <button>
        <a href='/'>500+ likes</a>
      </button>
    </nav>
  );
}

export default NavBar;
