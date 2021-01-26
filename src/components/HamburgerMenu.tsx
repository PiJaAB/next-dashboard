import React from 'react';

type Props = {
  toggleSidebarActive: () => void;
  sidebarActive: boolean;
};

export default function HamburgerMenu({
  toggleSidebarActive,
  sidebarActive,
}: Props): JSX.Element {
  return (
    <div className="hamburger-menu">
      <label>
        <input
          type="checkbox"
          onChange={toggleSidebarActive}
          checked={sidebarActive}
        />
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path className="line--1" d="M0 40h62c13 0 6 28-4 18L35 35" />
          <path className="line--2" d="M0 50h70" />
          <path className="line--3" d="M0 60h62c13 0 6-28-4-18L35 65" />
        </svg>
      </label>
    </div>
  );
}
