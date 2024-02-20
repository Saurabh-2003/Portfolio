import { Roboto } from "next/font/google"
import {motion, useAnimate, useAnimation} from 'framer-motion'
import { useInView } from 'react-intersection-observer';
import { useEffect } from "react";
const roboto = Roboto ({
  weight: '500',
  subsets: ['latin'],
})
const Socials = () => {

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false, // Set triggerOnce to false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);


  return (
   <div className="flex flex-col gap-8 font-mono pb-14 ">
    <h1 className={`text-slate-500 text-4xl text-center ${roboto.className}`}>
       <span className="bg-clip-text bg-gradient-to-r from-violet-600 
    to-blue-600 text-transparent"> Social </span> Links
    </h1>
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      exit="hidden" // Set the exit variant
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0 },
      }}
      transition={{ duration: 0.8 }}
    className="flex items-center flex-wrap justify-center gap-40 cursor-pointer">
      <div className="flex flex-col items-center gap-4 text-slate-700 dark:text-slate-400">
        <img src="/leetcode.png" className="h-20 w-20 bg-transparent " alt="leetcode" />
        <h1>Leetcode</h1>
      </div>
      <div className="flex flex-col items-center gap-4 text-slate-700 dark:text-slate-400 cursor-pointer">
        <img src="/code-forces.png"  className="h-20 w-20 bg-transparent   object-center" alt="code-forces" />
        <h1>Codeforces</h1>
      </div>
      <div className="flex flex-col items-center gap-4 text-slate-700 dark:text-slate-400 cursor-pointer">
        <img src="/github.png"  className="h-20 w-20 bg-transparent  "  alt="github" />
        <h1>Github</h1>
      </div>
    </motion.div>

   </div>
  )
}

export default Socials