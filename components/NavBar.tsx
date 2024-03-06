'use client'
import React, { useState, useEffect, useRef } from 'react';
import { GoHomeFill } from 'react-icons/go';
import { GrProjects } from 'react-icons/gr';
import { ImPower } from 'react-icons/im';
import { IoChatbubbles } from 'react-icons/io5';
import { TiThMenu } from 'react-icons/ti';
import { easeInOut, motion } from 'framer-motion';

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        menuIconRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuIconRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, menuIconRef]);

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <div className="fixed flex flex-col select-none z-20 mt-2 ml-4 w-20 items-center">
        <motion.div
          ref={menuIconRef}
          initial={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={toggleMenu}
          className={`cursor-pointer transition-colors duration-500 rounded-full mb-4 px-2 py-2 ${menuOpen && 'bg-indigo-600'}`}
        >
          <TiThMenu size={30} className="text-white" />
        </motion.div>
        <motion.ul
          ref={menuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -20 }}
          transition={{ duration: 0.5, ease: easeInOut }}
          className={`flex flex-col gap-4 w-full max-sm:w-full max-sm:justify-center text-sm items-center overflow-hidden
                      text-slate-400 py-2`}
          style={{ display: menuOpen ? 'flex' : 'none' }}
        >
          <motion.li
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.95 }}
            className="hover:bg-black/10 cursor-pointer"
            onClick={handleMenuItemClick}
          >
            <a href="#home" className="flex flex-col items-center">
              <GoHomeFill className='text-white' size={23} title="Home" />
              <span>Home</span>
            </a>
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.95 }}
            className="hover:bg-black/10 cursor-pointer"
            onClick={handleMenuItemClick}
          >
            <a href="#skills" className="flex flex-col items-center">
              <ImPower className='text-white' size={23} title="Skills" />
              <span>Skills</span>
            </a>
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.95 }}
            className="hover:bg-black/10 cursor-pointer"
            onClick={handleMenuItemClick}
          >
            <a href="#projects" className="flex flex-col items-center">
              <GrProjects className='text-white' size={23} title="Skills" />
              <span>Projects</span>
            </a>
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.95 }}
            className="hover:bg-black/10 cursor-pointer"
            onClick={handleMenuItemClick}
          >
            <a href="#contact" className="flex flex-col items-center">
              <IoChatbubbles className='text-white' size={23} title="Email me" />
              <span>Contact</span>
            </a>
          </motion.li>
        </motion.ul>
      </div>
    </nav>
  );
};

export default NavBar;
