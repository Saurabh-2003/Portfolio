import React from 'react';
import { Roboto, B612, Inter } from 'next/font/google';
import TechStack from './TechStack';

const roboto = Roboto({
  weight: '500',
  subsets: ['latin'],
});

const b6 = B612({
  weight: '400',
  subsets: ['latin'],
});

const inter = Inter({
  weight: '500',
  subsets: ['latin'],
  display: 'swap',
});

const Skills = () => {
  return (
    <div className='relative text-white overflow-hidden py-10 px-10'>
      <h1 className={`text-4xl text-center text-slate-500 ${roboto.className}`}>
        My <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600'>Skills</span>
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8'>
        <div className='rounded-xl  p-6'>
          <h3 className='text-xl text-blue-600'><span className='text-3xl'>🚀</span> MERN Stack Aficionado</h3>
          <p className={` text-slate-400 ${inter.className}`}>Explore my in-depth knowledge and hands-on experience with the MERN stack, crafting robust and scalable applications.</p>
        </div>

        <div className='rounded-xl  p-6'>
          <h3 className='text-xl text-blue-600'><span className='text-3xl'>🔗</span> Redux Maestro</h3>
          <p className={` text-slate-400 ${inter.className}`}>Experience seamless state management with my proficiency in Redux, ensuring a smooth flow of data in your applications.</p>
        </div>

        <div className='rounded-xl  p-6'>
          <h3 className='text-xl text-blue-600'><span className='text-3xl'>⚡</span> Real-time Magic</h3>
          <p className={` text-slate-400 ${inter.className}`}>Bring your applications to life with my expertise in Socket.io, enabling real-time communication and interactivity.</p>
        </div>

        <div className='rounded-xl  p-6'>
          <h3 className='text-xl text-blue-600'><span className='text-3xl'>🎨</span> Tailwind CSS Artisan</h3>
          <p className={` text-slate-400 ${inter.className}`}>Craft visually stunning interfaces with my proficiency in Tailwind CSS, ensuring a beautiful and responsive design.</p>
        </div>
      </div>
      <TechStack />
    </div>
  );
};

export default Skills;
