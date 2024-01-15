import React from 'react';
// import './NavBar.css';
import styles from './NavBar.module.css';

type NavBarProps = {
  full_name: string;
  handleSignOut: () => void;
};

function NavBar({ full_name, handleSignOut }: NavBarProps) {
  return (
    <nav className={`${styles.nav}`}>
      <div>
        <button className={`${styles.button}`}>
          <a href='/'>1 - 99 likes</a>
        </button>
        <button className={`${styles.button}`}>
          <a className={`${styles.a}`} href='/'>
            100 - 500 likes
          </a>
        </button>
        <button className={`${styles.button}`}>
          <a href='/'>500+ likes</a>
        </button>
      </div>
      <div>
        <span>{full_name && full_name}</span>
        <button className={`${styles.button}`} onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
