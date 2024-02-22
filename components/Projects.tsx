// Projects.tsx

import React from 'react';
import ProjectCard from './ProjectCard';
import {Roboto} from 'next/font/google'

const roboto = Roboto ({
  weight: '500',
  subsets: ['latin'],
})

const projects = [
  {
    img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596082/portfolio/v9to1wiorlej9fzmioeg.png',
    name: 'Code Fusion',
    description: 'A real time collaborative code editor for multiple programming languages',
    link: 'https://code-fusion-frontend.vercel.app/',
    tech: 'ReactJS, NodeJS, Javascript, Tailwind-css and Framer-Motion'
  },
  {
    img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596112/portfolio/regf0smu0zddkb3ivbq7.png',
    name: 'Chat App',
    description: "An awesome application that lets you connect with your friends and family anytime, anywhere. 🌐✨",
    link: "https://ww.wxampl.com",
    tech:"React, MongoDB, Nodejs, express and socketIO"
  },
  {
    img:'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596118/portfolio/gz32nvro0ohl8t7q3jis.png',
    name:"E-commerce App",
    description: 'A cutting-edge E-commerce application with a sleek and intuitive user interface.',
    link: 'https://your-ecommerce-app.com',
    tech: 'MongoDb, Express, Node JS, Express and Redux for global state managaement',
  },

  {
    img: 'https://res.cloudinary.com/djw8cxrrp/image/upload/v1708596107/portfolio/gxilqhqmw5gqotya3ifj.png',
    name: 'Music Streaming Platform',
    description: 'A music streaming app clone with a modern user interface and powerful features.',
    link: 'https://spotify-clone-app.com',
    tech: 'Next.js 13, Typescript, Stripe, Tailwind CSS and Supabase',
  },

  // Add more project objects as needed
];

const Projects = () => {
  return (
    <div className='flex flex-col px-20 py-20'>
      <div className={`text-4xl py-10 underline text-center bg-clip-text bg-gradient-to-br font-mono 
      from-violet-500 to-blue-600 text-transparent ${roboto.className}`}>
        Projects
      </div>
      <div className='grid lg:grid-cols-4 gap-10 md:grid-cols-2 sm:grid-cols-1'>
      {projects.map((project) => (
        <ProjectCard
          key={project.name}
          image={project.img}
          topicName={project.name}
          description={project.description}
          link={project.link}
          tech={project.tech}
        />
      ))}
      </div>
    </div>
  );
};

export default Projects;
