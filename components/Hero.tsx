// Hero.tsx

import { motion } from 'framer-motion';
import TypeEffect from './TypeEffect';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5, 
  });
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: .8 }}
    className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden"
    >
      
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute w-64 h-64 bg-gradient-to-br from-yellow-500 to-pink-500 rounded-full top-1/4 left-1/4 transform translate-x-1/4 translate-y-1/4 opacity-20"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full top-1/2 right-1/4 transform -translate-x-1/4 -translate-y-1/4 opacity-20"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: .5 }}
      >
        <img src="/me.png" className="rounded-full mb-4 w-80  h-80  bg-slate-300 backdrop-blur-sm  shadow-lg" alt="Portrait" />
        
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
        transition={{ duration: 1 }}
            href='#projects'
            className="relative border group  hover:border-indigo-500  inline-flex h-12 overflow-hidden rounded-full p-[1px] f">
            <span className="inline-flex h-full  w-full cursor-pointer transition duration-300 group-hover:text-indigo-500 items-center justify-center rounded-full group-hover:bg-slate-900 py-1 px-10 text-sm font-medium text-white backdrop-blur-3xl">
              Explore My Work
            </span>
        </motion.a>

      </div>
      
    </motion.div>
  );
};

export default Hero;
