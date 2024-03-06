import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { Roboto } from 'next/font/google';

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
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3, // Adjust this threshold as needed
  });

  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center  text-white overflow-hidden'>
      <div className='py-20 px-10'>
        <h1 className={`text-4xl text-center mb-14 text-slate-500 ${roboto.className}`}>
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600'>My </span>
          Projects
        </h1>
        <div className='grid lg:grid-cols-3 gap-10 md:grid-cols-2 sm:grid-cols-1'>
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              ref={index === 0 ? ref : null} // Set the ref only for the first project
              initial={{ opacity: 0}}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: .8 }}
            >
              <ProjectCard
                image={project.img}
                topicName={project.name}
                description={project.description}
                link={project.link}
                tech={project.tech}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
