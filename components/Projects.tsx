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
    img: 'https://img.freepik.com/free-vector/realistic-phone-text-bubble-collection_23-2149507740.jpg?w=1060&t=st=1705246815~exp=1705247415~hmac=9e00247479393a5820e701752ddffae43e6314a8f13352ecd3419a7b4c73d2b2',
    name: 'Chat App',
    description: "An awesome application that lets you connect with your friends and family anytime, anywhere. 🌐✨",
    link: "https://ww.wxampl.com",
    tech:"React, MongoDB, Nodejs, express and socketIO"
  },
  {
    img:'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    name:"E-commerce App",
    description: 'A cutting-edge E-commerce application with a sleek and intuitive user interface.',
    link: 'https://your-ecommerce-app.com',
    tech: 'MongoDb, Express, Node JS, Express and Redux for global state managaement',
  },
  {
    img: 'https://ez-snippet.vercel.app/_next/image?url=%2Fprojects%2Fspotify-clone.gif&w=1920&q=75',
    name: 'Spotify Clone',
    description: 'A music streaming app clone with a modern user interface and powerful features.',
    link: 'https://spotify-clone-app.com',
    tech: 'Next.js 13, React Hook Form, Zustand, Radix UI, Typescript, Tailwind CSS',
  },
  {
    img: 'https://ez-snippet.vercel.app/_next/image?url=%2Fprojects%2Fdiscord-clone.jpeg&w=1920&q=75',
    name: 'Discord Clone',
    description: 'A messaging and communication app clone with a sleek design and real-time features.',
    link: 'https://discord-clone-app.com',
    tech: 'Next.js 13, React Hook Form, Zustand, Shadcn and Typescript'
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
