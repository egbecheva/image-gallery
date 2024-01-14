import React from 'react';
// import './NavBar.css';

type NavBarProps = {
  full_name: string;
  handleSignOut: () => void;
};

function NavBar({ full_name, handleSignOut }: NavBarProps) {
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
      <div>
        <span>{full_name && full_name}</span>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </nav>
  );
}

export default NavBar;
