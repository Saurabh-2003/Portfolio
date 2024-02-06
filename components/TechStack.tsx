import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';


const frontend = ['HTML', 'CSS', 'JAVASCRIPT', 'TYPESCRIPT', 'REACTJS', 'NEXTJS', 'TAILWIND'];
const backend = ['NODE JS', 'EXPRESS', 'REST API', 'NEXT AUTH', 'REDUX'];
const database = ['MONGODB', 'MY SQL', 'POSTGRES SQL'];
const devops = ['GIT', 'DOCKER'];

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
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
    <ul className='grid lg:grid-cols-7 md:grid-cols-4 sm:grid-cols-2 gap-4 ml-4'>
      <AnimatePresence initial={false}>
        {isVisible &&
          techStack.map((tech, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`w-32 border-2 text-sm py-1 text-center rounded-lg bg-black/5 dark:bg-white/5 dark:text-white/80 text-slate-700`}
              style={{ borderColor: getRandomColor() }}
            >
              {tech}
            </motion.li>
          ))}
      </AnimatePresence>
    </ul>
  );

  return (
    <div ref={ref} className='flex flex-col px-28 mt-8 gap-6'>
      <div className='flex items-center'>
        <h1 className='dark:text-slate-400 text-slate-700 w-24 font-bold text-lg'>Frontend: </h1>
        {renderList(frontend)}
      </div>
      <div className='flex items-center'>
        <h1 className='dark:text-slate-400 font-bold text-slate-700 w-24 text-lg'>Backend :</h1>
        {renderList(backend)}
      </div>
      <div className='flex items-center'>
        <h1 className='dark:text-slate-400 font-bold text-slate-700 w-24 text-lg'>Database :</h1>
        {renderList(database)}
      </div>
      <div className='flex items-center'>
        <h1 className='dark:text-slate-400 font-bold text-slate-700 w-24 text-lg'>Devops :</h1>
        {renderList(devops)}
      </div>
    </div>
  );
};

export default TechStack;