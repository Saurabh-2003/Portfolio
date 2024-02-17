import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import {Montserrat} from 'next/font/google'

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display:'swap',
  fallback: ['Arial', 'sans-serif'],
});

const frontend = ['HTML', 'CSS', 'JAVASCRIPT', 'TYPESCRIPT', 'REACTJS', 'NEXTJS', 'TAILWIND'];
const backend = ['NODE JS', 'EXPRESS', 'REST API', 'NEXT AUTH', 'REDUX'];
const database = ['MONGODB', 'MY SQL', 'POSTGRES SQL'];
const devops = ['GIT', 'DOCKER'];

const getRandomColor = () => {
  const randomChannel = () => Math.floor(Math.random() * 256);
  const neonIntensity = 200; 

  const r = (randomChannel() + neonIntensity) % 256;
  const g = (randomChannel() + neonIntensity) % 256;
  const b = (randomChannel() + neonIntensity) % 256;

  const rgbToHex = (rgb:number) => {
    let hex = rgb.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const color = '#' + rgbToHex(r) + rgbToHex(g) + rgbToHex(b);
  return color;
};


const TechStack = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(inView);
  }, [inView]);

  const renderList = (techStack: string[]) => (
    <ul className={`flex text-sm flex-wrap gap-4 `}>
      <AnimatePresence initial={false}>
        {isVisible &&
          techStack.map((tech, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`w-32 flex-grow  border-[1px] py-1 capitalize text-center rounded-lg bg-black/5 dark:bg-white/5 dark:text-white/80 text-slate-600`}
              style={{ borderColor: getRandomColor() }}
            >
              {tech.toLocaleLowerCase()}
            </motion.li>
          ))}
      </AnimatePresence>
    </ul>
  );

  return (
    <div ref={ref} className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 mx-10 mt-8 gap-6'>
      <div className='flex flex-col  dark:border-[1px] dark:border-slate-500 dark:bg-neutral-900/20 bg-slate-200/30  rounded-xl py-4 px-4'>
        <h1 className='dark:text-slate-400  text-slate-600  text-lg w-full text-center mb-3'>Frontend </h1>
        {renderList(frontend)}
      </div>
      <div className='flex flex-col dark:border-[1px]  dark:bg-neutral-900/20 bg-slate-200/30 dark:border-slate-500 rounded-lg py-4 px-4'>
        <h1 className='dark:text-slate-400  text-slate-600  w-full text-lg text-center  mb-3'>Backend</h1>
        {renderList(backend)}
      </div>
      <div className='flex flex-col dark:border-[1px]  dark:bg-neutral-900/20 bg-slate-200/30 dark:border-slate-500 rounded-lg py-4 px-4'>
        <h1 className='dark:text-slate-400  text-slate-600 w-full  text-lg text-center  mb-3'>Database</h1>
        {renderList(database)}
      </div>
      <div className='flex flex-col dark:border-[1px]  dark:bg-neutral-900/20 bg-slate-200/30 dark:border-slate-500 rounded-lg py-4 px-4'>
        <h1 className='dark:text-slate-400  text-slate-600 w-full  text-lg text-center  mb-3'>Devops</h1>
        {renderList(devops)}
      </div>
    </div>
  );
};

export default TechStack;