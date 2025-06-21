"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  {
    name: "Email",
    href: "mailto:your.email@example.com",
    icon: Mail,
    color: "hover:text-blue-500",
  },
  {
    name: "GitHub",
    href: "https://github.com/yourusername",
    icon: Github,
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    icon: Linkedin,
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/yourusername",
    icon: Twitter,
    color: "hover:text-blue-400",
  },
];

const Contact = () => {
  return (
    <section
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      id="contact"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Let&apos;s Connect
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          I&apos;m always open to new opportunities and interesting projects.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to start a conversation?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Whether you have a project in mind or just want to chat, I&apos;m
              here to help!
            </p>
          </div>

          <div className="flex justify-center space-x-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${link.color} transition-colors duration-200`}
                title={link.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <link.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="mailto:your.email@example.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
              Send me a message
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center mt-16 text-gray-600 dark:text-gray-400"
      >
        <p>Or find me around the web:</p>
        <p className="mt-2">@yourusername</p>
      </motion.div>
    </section>
  );
};

export default Contact;
