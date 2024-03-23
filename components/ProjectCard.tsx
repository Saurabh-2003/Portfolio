import React from 'react';
import { Roboto } from 'next/font/google';
import { FaAlignRight, FaAngleRight, FaArrowRight, FaChevronRight } from 'react-icons/fa';
import { GrGithub } from 'react-icons/gr';

const roboto = Roboto({
  weight: '500',
  subsets: ['latin'],
});

interface ProjectCardProps {
  image: string;
  link: string;
  topicName: string;
  description: string;
  tech: string;
  color:string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, link, topicName, description, tech, color}) => {
  return (
    <div className='flex cursor-grab md:mx-40 rounded-xl bg-black max-md:h-[400px] max-md:mx-4 w-full flex-col relative overflow-hidden items-center justify-end'>
      <img className='object-cover select-none brightness-50 w-full h-full ' src={image} alt={topicName} />
      <div className='absolute max-sm:px-2 bg-transparent py-10 w-full px-10 h-fit flex justify-end flex-col overflow-hidden'>
        <span className='text-white max-md:text-xl text-5xl font-bold'>{topicName}</span>
        <div className='text-xl text-slate-300 max-md:text-sm w-full'>
          <p className='font-medium w-1/2 max-md:w-full'>{description}</p>
          <p className='font-medium mt-4 flex items-center gap-10'>
            <button className='flex rounded-md gap-2 items-center justify-center border border-slate-500 bg-gray-800 transition duration-300 hover:bg-gray-900 px-6 py-2'>
              Github <GrGithub size={25} />
            </button>
            <button className={`flex group text-white font-normal transition-all duration-500 rounded-md gap-2 ${color} hover:bg-transparent items-center justify-center border px-6 py-2`}>
              Visit <span className='group-hover:translate-x-2 transition duration-500'><FaArrowRight /></span>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
