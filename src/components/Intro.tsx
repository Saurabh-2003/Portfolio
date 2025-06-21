"use client";

import Image from "next/image";
import React from "react";
import { motion, Variants, cubicBezier } from "framer-motion";
import { FolderGit2, Mail } from "lucide-react";

const Intro: React.FC = () => {
  // Animation variants for text elements
  const textVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: cubicBezier(0.43, 0.13, 0.23, 0.96),
      },
    },
  };

  // Animation variants for image
  const imageVariants: Variants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: cubicBezier(0.43, 0.13, 0.23, 0.96),
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28"
    >
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <motion.div variants={textVariants} className="flex-1">
          <motion.h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Hi, I&apos;m [Your Name]
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            I&apos;m a full-stack developer passionate about building digital
            solutions that make a difference. I specialize in crafting clean,
            efficient, and user-friendly applications.
          </motion.p>
          <motion.div className="space-x-4">
            <a
              href="#projects"
              className="inline-block px-6 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <FolderGit2 className="w-5 h-5 inline-block mr-2 -mt-1" />
              View My Work
            </a>
            <a
              href="#contact"
              className="inline-block px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Mail className="w-5 h-5 inline-block mr-2 -mt-1" />
              Get in Touch
            </a>
          </motion.div>
        </motion.div>

        <motion.div variants={imageVariants} className="flex-shrink-0">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-800">
            <Image
              src="/your-avatar.jpg" // Replace with your image path
              alt="Profile picture"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 12rem, 16rem"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Intro;
