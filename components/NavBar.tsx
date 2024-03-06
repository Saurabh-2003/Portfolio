import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {Moon, Sun} from 'lucide-react'
import { GoHomeFill } from 'react-icons/go';
import { GiSkills } from 'react-icons/gi';
import { GrProjects } from 'react-icons/gr';
import { MdContactMail } from 'react-icons/md';
import { IoIosMail } from 'react-icons/io';
import { FaUserCircle } from 'react-icons/fa';
import { ImPower } from 'react-icons/im';
import { IoChatbubbles } from 'react-icons/io5';
const NavBar = () => {
  

  return (
    <nav>
      <div className={`fixed flex flex-col z-20  w-full items-center justify-center`}>
        <ul className={`flex gap-6 max-sm:w-full max-sm:justify-center  mx-auto  text-sm items-center overflow-hidden
               backdrop-blur-sm text-slate-200 px-10  max-sm:rounded-none   
               rounded-full bg-white/10 mt-2 max-sm:mt-0`}>
          
          <li className='hover:bg-black/5 p-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125'>
            <a href='#home' className='flex flex-col items-center'>
              <GoHomeFill size={20} title='Home'/>
              <span>Home</span>
            </a>
          </li>
          <li className='hover:bg-black/5 p-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125'>
            <a href='#skills' className='flex flex-col items-center'> 
            <ImPower size={20} title='Skills'/>
            <span>Skills</span>
            </a>
          </li>
          <li className='hover:bg-black/5 p-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125'>
            <a href='#projects' className='flex flex-col items-center'>
              <GrProjects size={20} title='Skills' />
              <span>Projects</span>
            </a>
          </li>

          <li className='hover:bg-black/5 p-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125'>
            <a href='#contact' className='flex flex-col items-center'> 
            <IoChatbubbles  size={20} title='Email me'/>
            <span>Contact</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
