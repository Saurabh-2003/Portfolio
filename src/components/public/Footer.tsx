"use client";
import React, { useState } from "react";
import {
  FaArrowUp,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaHeart,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const socialLinks = [
  {
    href: "https://github.com/yourusername",
    label: "GitHub",
    icon: FaGithub,
    color: "hover:text-gray-900 dark:hover:text-white",
    bg: "hover:bg-gray-100 dark:hover:bg-gray-800",
  },
  {
    href: "https://linkedin.com/in/yourusername",
    label: "LinkedIn",
    icon: FaLinkedin,
    color: "hover:text-blue-600 dark:hover:text-blue-400",
    bg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  {
    href: "https://twitter.com/yourusername",
    label: "Twitter",
    icon: FaTwitter,
    color: "hover:text-blue-400 dark:hover:text-blue-300",
    bg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
];

// Simplified to avoid TypeScript issues

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  // Scroll to top handler with smooth animation
  const handleGoToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Show scroll-to-top button when scrolled down
  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mt-8"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-yellow-500/10 rounded-full blur-xl"
        />
      </div>

      <Card className="relative w-full glass-card border border-border/50 shadow-xl overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="relative z-10 px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              {socialLinks.map(({ href, label, icon: Icon, color, bg }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onHoverStart={() => setHoveredSocial(label)}
                  onHoverEnd={() => setHoveredSocial(null)}
                  className={`relative p-3 rounded-xl transition-all duration-300 ${color} ${bg} group`}
                >
                  <Icon className="w-5 h-5 transition-colors duration-300" />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredSocial === label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg text-xs whitespace-nowrap z-20"
                      >
                        {label}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border/50" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-current opacity-0"
                    animate={
                      hoveredSocial === label
                        ? {
                            scale: [1, 1.5],
                            opacity: [0.5, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
              ))}
            </motion.div>

            {/* Copyright and Made with Love */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaHeart className="w-4 h-4 text-red-500" />
                </motion.div>
                <span>by</span>
                <motion.span
                  className="font-medium text-foreground"
                  whileHover={{ scale: 1.05 }}
                >
                  Saurabh
                </motion.span>
              </div>

              <div className="hidden md:block w-px h-4 bg-border" />

              <div className="text-center md:text-left">
                © {new Date().getFullYear()} All rights reserved
              </div>
            </motion.div>

            {/* Scroll to Top Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AnimatePresence>
                {isVisible && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        onClick={handleGoToTop}
                        size="icon"
                        className="relative rounded-full glass hover:glass-hover border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 group"
                        aria-label="Scroll to top"
                      >
                        <motion.div
                          animate={{ y: [0, -2, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <FaArrowUp className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
                        </motion.div>

                        {/* Glow effect on hover */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Bottom border animation */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </Card>
    </motion.footer>
  );
};

export default Footer;
