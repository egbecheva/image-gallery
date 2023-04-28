import React from 'react';
import './NavBar.css';

function NavBar() {
  return (
    <nav>
      <div>
        <button>
          <a href='/'>1 - 99 likes</a>
        </button>
        <button>
          <a href='/'>100 - 500 likes</a>
        </button>
        <button>
          <a href='/'>500+ likes</a>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
