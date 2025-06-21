"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../shared/theme-toggle";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { scrollY } = useScroll();

  // Handle scroll direction for navigation visibility
  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY ? "down" : "up";
    const isScrollingDown = direction === "down";
    const scrollPosition = latest;

    setIsScrolled(scrollPosition > 50);

    // Hide nav when scrolling down past 100px, show when scrolling up
    if (scrollPosition > 100) {
      setIsVisible(!isScrollingDown);
    } else {
      setIsVisible(true);
    }

    setLastScrollY(scrollPosition);
  });

  // Track active section based on scroll position
  useEffect(() => {
    const sections = ["about", "skills", "projects", "experience", "contact"];

    const observerOptions = {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ];

  // Simplified to avoid TypeScript issues

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
              : "bg-transparent"
          }`}
        >
          <div className="container max-w-3xl mx-auto">
            <div className="flex items-center justify-between h-16 px-4">
              {/* Logo/Theme Toggle */}
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThemeToggle />
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.substring(1);
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      {item.label}

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Hover indicator */}
                      <motion.div
                        className="absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full"
                        initial={{ width: 0, x: "-50%" }}
                        whileHover={{ width: "80%" }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.a>
                  );
                })}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="relative p-2 rounded-lg"
                  >
                    <AnimatePresence mode="wait">
                      {isMobileMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 180 }}
                          exit={{ rotate: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 0 }}
                          exit={{ rotate: 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="px-4 py-3 space-y-1 bg-background/95 backdrop-blur-xl border-b border-border/50 rounded-b-lg">
                    {navItems.map((item) => {
                      const isActive = activeSection === item.href.substring(1);
                      return (
                        <motion.a
                          key={item.href}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -20, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.href);
                          }}
                          className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                              ? "text-primary bg-primary/10 border border-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.label}</span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary rounded-full"
                              />
                            )}
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60"
            style={{
              scaleX:
                typeof window !== "undefined"
                  ? scrollY.get() /
                    (document.documentElement.scrollHeight - window.innerHeight)
                  : 0,
              transformOrigin: "left",
            }}
            initial={{ scaleX: 0 }}
          />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
