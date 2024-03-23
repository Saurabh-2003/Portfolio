'use client'

import React, { useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaCircle, FaStar } from 'react-icons/fa';
import ProjectCard from './ProjectCard';
import { Roboto } from 'next/font/google';
import { IoScale } from 'react-icons/io5';

interface Project {
  img: string;
  name: string;
  description: string;
  link: string;
  tech: string;
  color:string;
}

const roboto = Roboto({
  weight: '500',
  subsets: ['latin'],
});

const projects: Project[] = [
  {
    // img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596082/portfolio/v9to1wiorlej9fzmioeg.png'
    img: '/code-fusion.png',
    name: 'Code Fusion',
    description: 'A real time collaborative code editor for multiple programming languages support and wide range of awesome themes.',
    link: 'https://code-fusion-frontend.vercel.app/',
    tech: 'ReactJS, NodeJS, Javascript, Tailwind-css and Framer-Motion',
    color:'bg-emerald-600'
  },
  {
    // img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1709005176/portfolio/rqownukgjrzop6xxaas2.png',
    img:'/chat.png',
    name: 'Chit-Chat',
    description: "An awesome application that lets you connect with your friends and family anytime, anywhere.",
    link: "https://chat-app-react-frontend.vercel.app/",
    tech: "React, MongoDB, Nodejs, express and socketIO",
    color:'bg-indigo-700'
  },
  {
    // img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596118/portfolio/gz32nvro0ohl8t7q3jis.png',
    img:'/commerce.png',
    name: "E-commerce App",
    description: 'A cutting-edge E-commerce application with a sleek and intuitive user interface.',
    link: 'https://your-ecommerce-app.com',
    tech: 'MongoDb, Express, Node JS, Express and Redux for global state management',
    color:'bg-violet-600'
  },
  {
    // img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596107/portfolio/gxilqhqmw5gqotya3ifj.png',
    img:'/music.png',
    name: 'Music Streaming Platform',
    description: 'A music streaming app clone with a modern user interface and powerful features.',
    link: 'https://spotify-clone-app.com',
    tech: 'Next.js 13, Typescript, Stripe, Tailwind CSS and Supabase',
    color:'bg-green-500'
  },
];

const Projects: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const endX = e.touches[0].clientX;
    const diff = endX - startX;
    const threshold = window.innerWidth / 4; 
    if (diff > threshold) {
      prevProject();
      setStartX(null); 
    } else if (diff < -threshold) {
      nextProject();
      setStartX(null); 
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const endX = e.clientX;
    const diff = endX - startX;
    const threshold = window.innerWidth / 100; 
    if (diff > threshold) {
      prevProject();
      setStartX(null); 
    } else if (diff < -threshold) {
      nextProject();
      setStartX(null); 
    }
  };

  const handleMouseUp = () => {
    setStartX(null);
  };

  const nextProject = () => {
    setActiveIndex((prevIndex) => (prevIndex === projects.length - 1 ? prevIndex : prevIndex + 1));
  };

  const prevProject = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  return (
    <div className="select-none   scroll-smooth mt-20 w-full  overflow-hidden">
      <div className='flex max-sm:justify-center flex-col gap-2 mt-4 mb-4  ml-20 max-md:ml-0'>
        <p className='flex gap-10 max-sm:gap-4 max-sm:justify-center items-center'>
          <FaStar className='bg-stone-500/40 size-14 max-sm:size-10  rounded-full p-2' color='white'/>
        <h1 className='text-3xl max-sm:text-xl max-md:text-2xl  text-stone-100 font-bold  '>Featured Projects</h1>
        </p>
        <p className='text-slate-300 max-sm:text-center max-sm:text-sm text-lg'>A curated selection of my most interesting projects.</p>
      </div>
      <div
        className="relative flex items-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={containerRef}
      >
        
        <div
          className="flex   w-full h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * (100 / projects.length)}%)`, 
            width: `${projects.length * 100}%`,
          }}
        >
          {projects.map((project, index) => (
            <div key={index} className={` flex w-max justify-center transition-all duration-700 ${activeIndex === index ? 'scale-100' : 'scale-75'}`}>
              <ProjectCard
                image={project.img}
                link={project.link}
                topicName={project.name}
                description={project.description}
                tech={project.tech}
                color={project.color}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='flex mt-2 h-full items-center justify-center w-full'>
        {projects.map((projects, index) => (
          <FaCircle
          onClick={() =>setActiveIndex(index)}
            key={index}
            className={`cursor-pointer transition duration-500 ${index === activeIndex ? 'text-white mr-2 size-6' : 'text-gray-700 mr-2  size-4'}`}
          />
        ))}
      </div>

          
    </div>
  );
};

export default Projects;
