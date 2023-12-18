import Link from 'next/link';
import React from 'react';

export default function Navbar({ about }: any) {
  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-150 w-full bg-transparent text-sm py-4">
      <nav
        className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-end"
        aria-label="Global"
      >
        {!about ? (
          ''
        ) : (
          <a
            className="font-medium text-lg text-white hover:text-gray-400 dark:text-white dark:hover:text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 transition-[0.7s]"
            href="#"
          >
            <Link href={'/'}>Home</Link>
          </a>
        )}
        {about ? (
          ''
        ) : (
          <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
            <a
              className="font-medium text-lg text-white hover:text-gray-400 dark:text-white dark:hover:text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 transition-[0.7s]"
              href="#"
            >
              <Link href={'/about'}>About</Link>
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
