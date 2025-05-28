import React, { FC } from 'react';
import Link from 'next/link';

const NavBar: FC = () => {
  return (
    <nav className='bg-gray-800 p-4'>
      <ul className='flex space-x-4'>
        <li>
          <Link href='/' className='text-white hover:text-gray-300'>
            Home
          </Link>
        </li>
        <li>
          <Link href='/about' className='text-white hover:text-gray-300'>
            About
          </Link>
        </li>
        <li>
          <Link href='/word-search' className='text-white hover:text-gray-300'>
            Word Search
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;