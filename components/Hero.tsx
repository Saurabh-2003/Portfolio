// Hero.tsx

import { motion } from 'framer-motion';
import TypeEffect from './TypeEffect';

const Hero = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen pt-20 text-white overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute w-64 h-64 bg-gradient-to-br from-yellow-500 to-pink-500 rounded-full top-1/4 left-1/4 transform translate-x-1/4 translate-y-1/4 opacity-20"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full top-1/2 right-1/4 transform -translate-x-1/4 -translate-y-1/4 opacity-20"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <img src="/me.png" className="rounded-full mb-4 w-80  h-80 border-2 border-slate-500/50 bg-slate-100/50 backdrop-blur-sm  shadow-lg" alt="Portrait" />
        
      </motion.div>

      <div className="z-10 max-w-4xl text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Hey there, I'm{' '}
          <motion.span
            className="text-indigo-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <TypeEffect />
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg text-slate-300 font-extralight md:text-xl antialiased mb-8"
        >
          Full Stack Web Developer | Machine Learning Enthusiast | Computer Science Engineering Student
        </motion.p>
        <motion.a 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
            href='#projects'
            className="relative border inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-900 py-1 px-10 text-sm font-medium text-white backdrop-blur-3xl">
              Explore My Work
            </span>
        </motion.a>

      </div>
      
    </div>
  );
};

export default Hero;
