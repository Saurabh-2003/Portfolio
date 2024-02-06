"use client";
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {Moon, Sun} from 'lucide-react'
const NavBar = () => {
  const [dark, setDark] = useState('light');

  const toggleTheme = () => {
    const window = document.documentElement;
    if (dark === 'dark') {
      window.classList.remove('dark');
      setDark('light');
      localStorage.setItem('theme', 'light');
    } else {
      window.classList.add('dark');
      setDark('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      setDark(theme);
      const window = document.documentElement;
      window.classList.toggle('dark', theme === 'dark');
    }
  }, []);

  return (
    <nav>
      <div className={`h-16 fixed flex z-20 justify-between  w-full items-center`}>
        <div className='absolute top-2 left-2 bg-gradient-to-tr from-purple-600 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white'>
          S
        </div>
        <ul className={`flex gap-4 text-sm items-center overflow-hidden
               backdrop-blur-sm
              ${dark === 'dark' ? 'dark:bg-slate-700/20' : 'bg-slate-100/20'} 
              dark:text-slate-300 text-slate-700 px-3 py-2 rounded-full mx-auto`}>
          <li onClick={toggleTheme} className='cursor-pointer px-2 py-2 dark:hover:bg-slate-100/10 hover:bg-black/5 rounded-full'>
            {dark === 'light' ? <Sun className='text-yellow-500' /> : <Moon className='text-blue-500'/>}
          </li>
          <li  className=' hover:bg-black/5 p-2 cursor-pointer dark:hover:bg-slate-100/10'>
            <a href='#home'>
            Home
            </a>
          </li>
          <li className='hover:bg-black/5 p-2 cursor-pointer dark:hover:bg-slate-100/10'>
            <a href='#skills'> Skills</a>
          </li>
          <li className=' hover:bg-black/5 p-2 cursor-pointer dark:hover:bg-slate-100/10'>
            <a href='#projects'> Projects</a>
          </li>
          <li className='hover:bg-black/5 p-2 cursor-pointer dark:hover:bg-slate-100/10'>
            <a href='#socials'>Socials</a>
          </li>
          <li 
          className='bg-gradient-to-tr from-purple-600 to-blue-600 p-2 rounded-3xl text-white cursor-pointer '>
            <a
            href='/'
            download='resume.pdf'
            >
            Download Resume
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
