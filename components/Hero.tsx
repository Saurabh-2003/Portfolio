
import { Montserrat, Inter } from 'next/font/google';
import {motion} from 'framer-motion'

const montserrat = Montserrat({
  weight: '500',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  weight: '500',
  subsets: ['latin'],
  display: 'swap',
})

const Hero = () => {


  return (
    <div  className={`flex max-md:flex-col relative  z-10 gap-2 px-28  items-center h-[100svh] `}  >  
        <div className='flex flex-col w-2/5 '>
          <motion.div 
          initial={{opacity:0, x:"-100%"}}
          animate={{opacity:1, x:0}} 
          transition={{ duration: 0.8 }}
           className={` text-7xl ${montserrat.className} text-slate-700 dark:text-slate-200`}
           >
            Hey there, I'm <span className='bg-clip-text text-transparent bg-gradient-to-t from-purple-700 to-blue-600'>Saurabh Thapliyal</span>.
          </motion.div>
          <motion.div 
            initial = {{opacity:0,x:"100%"}}
            animate = {{opacity: 1, x:0}}
            transition={{ duration: 0.8 }}
            className='  text-lg text-ellipsis dark:text-slate-300 text-slate-600'>
              As a passionate Computer Science Engineering student, I thrive on turning ideas into reality through technology. Welcome to my digital playground!
          </motion.div>
          <motion.div
            initial= {{opacity:0,y:"100%"}}
            animate = {{opacity:1, y:0}}
            transition={{ duration: 0.8 }}
          >
            <a href="#projects" className={`${inter.className} mx-auto  text-white bg-gradient-to-tr w-1/2 grid place-content-center rounded-3xl mt-10 h-10 from-purple-600 to-blue-600 dark:text-slate-300 dark:hover:text-slate-100 hover:cursor-pointer`}>
            Explore My Work
          </a>
          </motion.div>

        </div>
        <motion.div
          initial= {{opacity:0,y:"-100%"}}
          animate = {{opacity:1, y:0}} 
          transition={{ duration: 0.6, delay:.1 }}
        className='h-full w-1/2 ml-auto relative flex items-center magicpattern pt-12'>
        <div className="mask">
          <img src='/me.png' className='h-[500px]  rounded-full ml-auto mr-8 mt-24 brightness-125' />
        </div>
      </motion.div>

  </div>

  );
};

export default Hero;
