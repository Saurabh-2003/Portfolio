import React from 'react';
import { Roboto, B612, Inter } from 'next/font/google';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
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

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: .2, 
  });

  return (
    <div className='relative min-h-screen text-white overflow-hidden py-10 px-10'>
      <h1 className={`text-4xl text-center text-slate-500 mt-16 ${roboto.className}`}>
        My <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600'>Skills</span>
      </h1>
      <div className='grid grid-cols-1 antialiased md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: .6 }}
          className='rounded-xl p-6'
        >
          <h3 className='text-xl text-indigo-600 font-bold'><span className='text-3xl'>🚀</span> MERN Stack Aficionado</h3>
          <p className={`text-slate-400 ${inter.className}`}>Explore my in-depth knowledge and hands-on experience with the MERN stack, crafting robust and scalable applications.</p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: .6 }}
          className='rounded-xl p-6'
        >
          <h3 className='text-xl text-indigo-600 font-bold'><span className='text-3xl'>🔗</span> Redux Maestro</h3>
          <p className={`text-slate-400 ${inter.className}`}>Experience seamless state management with my proficiency in Redux, ensuring a smooth flow of data in your applications.</p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: .6 }}
          className='rounded-xl p-6'
        >
          <h3 className='text-xl text-indigo-600 font-bold'><span className='text-3xl'>⚡</span> Real-time Magic</h3>
          <p className={`text-slate-400 ${inter.className}`}>Bring your applications to life with my expertise in Socket.io, enabling real-time communication and interactivity.</p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: .6 }}
          className='rounded-xl p-6'
        >
          <h3 className='text-xl text-indigo-600 font-bold'><span className='text-3xl'>🎨</span> Tailwind CSS Artisan</h3>
          <p className={`text-slate-400 ${inter.className}`}>Craft visually stunning interfaces with my proficiency in Tailwind CSS, ensuring a beautiful and responsive design.</p>
        </motion.div>
      </div>
      <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: .6 }}
          className='rounded-xl p-6'
        >
          <TechStack />
      </motion.div>
      
    </div>
  );
};

export default Skills;
