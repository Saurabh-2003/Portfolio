import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

const frontend = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Tailwind'];
const backend = ['Node.js', 'Express', 'REST API', 'Next Auth', 'Redux'];
const database = ['MongoDB', 'MySQL', 'PostgreSQL'];
const devops = ['Git', 'Docker'];


const TechStack = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(inView);
  }, [inView]);

  const renderList = (techStack : String[]) => (
    <ul className={`flex flex-wrap gap-4`}>
      <AnimatePresence initial={false}>
        {isVisible &&
          techStack.map((tech, index) => (
            <motion.li
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="px-8 py-2 rounded-full border border-y-1 text-center flex-grow relative bg-slate-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border-transparent"
            >
                <div className="absolute inset-x-0 h-px w-full mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                <div className="absolute inset-x-0 h-px w-full mx-auto -bottom-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                <span className="relative z-20">
                  {tech}
                </span>
            </motion.li>
          ))}
      </AnimatePresence>
    </ul>
  );

  return (
    <div ref={ref} className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6 mx-10 mt-8'>
      <div className='flex relative flex-col border border-gray-700 rounded-xl py-6 px-4'>
        <h1 className='text-2xl text-gray-200 text-center mb-3'>Frontend</h1>
        {renderList(frontend)}
        <div className="absolute inset-x-0 h-px w-full mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                <div className="absolute inset-x-0 h-px w-full mx-auto -bottom-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </div>
      <div className='flex relative flex-col border border-gray-700 rounded-xl py-6 px-4'>
        <h1 className='text-2xl text-gray-200 text-center mb-3'>Backend</h1>
        {renderList(backend)}
        <div className="absolute inset-x-0 h-px w-full mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                <div className="absolute inset-x-0 h-px w-full mx-auto -bottom-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </div>
      <div className='flex relative flex-col border border-gray-700 rounded-xl py-6 px-4'>
        <h1 className='text-2xl text-gray-200 text-center mb-3'>Database</h1>
        {renderList(database)}
        <div className="absolute inset-x-0 h-px w-full mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                <div className="absolute inset-x-0 h-px w-full mx-auto -bottom-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </div>
      <div className='flex relative flex-col border border-gray-700  py-6 px-4'>
        <h1 className='text-2xl text-gray-200 text-center mb-3'>Devops</h1>
        {renderList(devops)}
        <div className="absolute inset-x-0 h-px w-full mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        <div className="absolute inset-x-0 h-px w-full mx-auto -bottom-px shadow-2xl  bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      
      </div>
    </div>
  );
};

export default TechStack;
