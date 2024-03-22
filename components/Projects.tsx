import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useDragControls } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { Roboto } from 'next/font/google';
import { FaAlignLeft, FaArrowLeft, FaArrowRight, FaCircle } from 'react-icons/fa';
import { ImArrowLeft, ImPointLeft } from 'react-icons/im';


const roboto = Roboto({
  weight: '500',
  subsets: ['latin'],
});

const projects = [
  {
    img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596082/portfolio/v9to1wiorlej9fzmioeg.png',
    name: 'Code Fusion',
    description: 'A real time collaborative code editor for multiple programming languages',
    link: 'https://code-fusion-frontend.vercel.app/',
    tech: 'ReactJS, NodeJS, Javascript, Tailwind-css and Framer-Motion',
  },
  {
    img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1709005176/portfolio/rqownukgjrzop6xxaas2.png',
    name: 'Chat App',
    description: "An awesome application that lets you connect with your friends and family anytime, anywhere. 🌐✨",
    link: "https://chat-app-react-frontend.vercel.app/",
    tech: "React, MongoDB, Nodejs, express and socketIO",
  },
  {
    img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596118/portfolio/gz32nvro0ohl8t7q3jis.png',
    name: "E-commerce App",
    description: 'A cutting-edge E-commerce application with a sleek and intuitive user interface.',
    link: 'https://your-ecommerce-app.com',
    tech: 'MongoDb, Express, Node JS, Express and Redux for global state management',
  },
  {
    img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596107/portfolio/gxilqhqmw5gqotya3ifj.png',
    name: 'Music Streaming Platform',
    description: 'A music streaming app clone with a modern user interface and powerful features.',
    link: 'https://spotify-clone-app.com',
    tech: 'Next.js 13, Typescript, Stripe, Tailwind CSS and Supabase',
  },
];



const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextProject = () => {
    setActiveIndex((prevIndex) => (prevIndex === projects.length - 1 ? prevIndex : prevIndex + 1));
  };

  const prevProject = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  return (
    <div className=" select-none mt-20  w-full h-screen overflow-hidden">
      <h1 className='text-4xl mb-10 text-transparent bg-clip-text bg-gradient-to-l font-bold text-center from-purple-500 to-indigo-500'> Projects</h1>
      
      <div className="relative h-fit flex items-center overflow-hidden">
        {/* Previous Button */}
      <div className="absolute top-1/2 left-10 max-sm:left-4 transform -translate-y-1/2 z-10">
        <button onClick={prevProject} className="hover:text-white text-white/60 transition focus:outline-none ">
          <FaArrowLeft className=' size-16 max-md:size-12 max-sm:size-8'  />
        </button>
      </div>

      {/* Next Button */}
      <div className="absolute top-1/2 right-10 max-sm:right-4 transform -translate-y-1/2 z-10">
        <button onClick={nextProject} className="hover:text-white text-white/60 focus:outline-none">
        <FaArrowRight className='size-16 max-md:size-12 max-sm:size-8 ' />
        </button>
      </div>
        {/* For Projects */}
        <div
          className="flex gap-12 px-20 transition-transform duration-[.8s] ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * 23}%)`,
            width: `${projects.length * 80}%`,
          }}
        >
          {projects.map((project, index) => (
            <div key={index} className="w-screen flex justify-center">
              <ProjectCard
                image={project.img}
                link={project.link}
                topicName={project.name}
                description={project.description}
                tech={project.tech}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='flex mt-8 items-center justify-center w-full'>
        {projects.map((projects, index) => (
          <FaCircle
            key={index}
            size={20}
            className={index === activeIndex ? 'text-white mr-2' : 'text-gray-600 mr-2'}
          />
        ))}
      </div>

          
    </div>
  );
};

export default Projects;