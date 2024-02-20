
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
    <div  className={`flex max-md:pt-16 max-md:px-0 max-md:flex-col mx-auto z-10 gap-2 px-28 justify-between  items-center min-h-[100svh] `}  >  
        <div className='flex max-md:w-4/5 flex-col w-2/5 '>
          <motion.div 
          initial={{opacity:0, x:"-100%"}}
          animate={{opacity:1, x:0}} 
          transition={{ duration: 0.8 }}
           className={` text-7xl  text-slate-700 dark:text-slate-200`}
           >
            Hey there, I'm <span className='bg-clip-text text-transparent bg-gradient-to-t from-purple-700 to-blue-600'>Saurabh Thapliyal</span>.
          </motion.div>
          <motion.div 
            initial = {{opacity:0,x:"100%"}}
            animate = {{opacity: 1, x:0}}
            transition={{ duration: 0.8 }}
            className='  text-lg text-ellipsis dark:text-slate-300 text-slate-600'>
              Full Stack Web Developer | Machine Learning Enthusiast | Computer Science Engineering Student at Graphic Era Hill University
          </motion.div>
          <motion.div
            initial= {{opacity:0,y:"100%"}}
            animate = {{opacity:1, y:0}}
            transition={{ duration: 0.8 }}
          >
            <a href="#projects" className={` mx-auto  text-white bg-gradient-to-tr w-1/2 grid place-content-center rounded-3xl mt-10 h-10 from-purple-600 to-blue-600 dark:text-slate-300 dark:hover:text-slate-100 hover:cursor-pointer`}>
            Explore My Work
          </a>
          </motion.div>

        </div>
        <motion.div
          initial= {{opacity:0,y:"-100%"}}
          animate = {{opacity:1, y:0}} 
          transition={{ duration: 0.6, delay:.1 }}
        className='h-full  flex items-center pt-12'>
        <div className="h-[500px] w-[500px] max-md:h-[300px] max-md:w-[300px] overflow-hidden rounded-full bg-gradient-radial from-blue-500 to-violet-500">
          <img src='/me.png' className=' mt-6 brightness-125' />
        </div>
      </motion.div>

  </div>

  );
};

export default Hero;
