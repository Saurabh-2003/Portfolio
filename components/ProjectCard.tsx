import React from 'react';
import { Roboto } from 'next/font/google';

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
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, link, topicName, description, tech }) => {
  return (
    <div className='flex rounded-xl flex-col relative group overflow-hidden w-2/3 h-full items-center justify-center mb-4'>
      <img className='h-full w-full object-fill' src={image} alt={topicName} />
      <div className=' translate-y-[65%] transition-all duration-700 group-hover:rounded-t-xl  absolute w-full h-full mt-10 flex flex-col overflow-hidden bg-white/60 backdrop-blur-md '>
        <span className='text-indigo-500 text-center text-xl font-bold'>{topicName}</span>
        <div className='px-2'>
          <p className='text-slate-700 font-bold'>{description}</p>
          <p className='text-slate-600 font-medium'>
            <span className='font-semibold'>Tech Stack:</span> {tech}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
