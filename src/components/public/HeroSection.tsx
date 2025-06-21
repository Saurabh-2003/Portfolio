"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Github, MapPin, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/actions/profile";
import { Profile } from "@/types";

const AVAILABILITY_OPTIONS: {
  value: Profile["availability"];
  label: string;
  color: string;
  bgColor: string;
}[] = [
  {
    value: "available",
    label: "Available for work",
    color: "bg-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    value: "not_available",
    label: "Not available",
    color: "bg-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    value: "freelance",
    label: "Open to freelancing",
    color: "bg-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
];

// Floating animation component
const FloatingElement = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
      rotate: [0, 1, 0, -1, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    {children}
  </motion.div>
);

// Sparkle animation component
const SparkleIcon = ({ className }: { className?: string }) => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className={className}
  >
    <Sparkles className="w-4 h-4 text-yellow-400" />
  </motion.div>
);

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchProfile();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Simplified animations to avoid TypeScript issues

  if (!isLoaded) {
    return (
      <section className="relative pt-32 w-full min-h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </section>
    );
  }

  return (
    <motion.section
      id="about"
      className="relative pt-32 w-full min-h-[80vh] flex items-center"
      style={{ y, opacity }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-20">
          <SparkleIcon />
        </div>
        <div className="absolute top-40 right-20 opacity-30">
          <SparkleIcon className="delay-1000" />
        </div>
        <div className="absolute bottom-40 left-20 opacity-25">
          <SparkleIcon className="delay-2000" />
        </div>

        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-xl"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full"
      >
        {/* Mobile Layout */}
        <div className="flex flex-col gap-8 px-4 h-full w-full md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-row items-center gap-6 w-full justify-center"
          >
            <FloatingElement>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-md" />
                <Avatar className="size-32 !rounded-xl relative border-2 border-white/10 shadow-2xl">
                  <AvatarImage
                    className="object-cover"
                    src={profile?.profile_image || "/profile.png"}
                    alt={profile?.name || "User"}
                  />
                  <AvatarFallback className="text-lg font-semibold !rounded-xl text-gray-700 bg-gradient-to-br from-gray-100 to-gray-200">
                    {profile?.name
                      ? profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "ST"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </FloatingElement>

            <div className="flex flex-col items-start text-left gap-3 flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-2xl font-extrabold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
              >
                {profile?.name || "Saurabh Thapliyal"}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-muted-foreground text-sm font-medium"
              >
                {profile?.headline || "Full Stack Developer & UI/UX Enthusiast"}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-col items-start gap-2 text-xs text-muted-foreground"
              >
                {profile?.availability && (
                  <motion.div
                    className="flex items-center gap-2 px-2 py-1 rounded-full glass"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full ${
                        AVAILABILITY_OPTIONS.find(
                          (opt) => opt.value === profile.availability,
                        )?.color || "bg-gray-400"
                      }`}
                    />
                    <span className="text-xs">
                      {
                        AVAILABILITY_OPTIONS.find(
                          (opt) => opt.value === profile.availability,
                        )?.label
                      }
                    </span>
                  </motion.div>
                )}
                <motion.div
                  className="flex items-center gap-2 px-2 py-1 rounded-full glass"
                  whileHover={{ scale: 1.02 }}
                >
                  <MapPin className="h-3 w-3" />
                  <span>
                    {profile?.location
                      ? `Based in ${profile.location}`
                      : "Based in India"}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col md:flex-row items-center md:items-start gap-12 h-full w-full">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6 items-center flex-shrink-0"
          >
            <FloatingElement>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <Avatar className="size-40 !rounded-xl relative border-2 border-white/10 shadow-2xl">
                  <AvatarImage
                    className="object-cover"
                    src={profile?.profile_image || "/profile.png"}
                    alt={profile?.name || "User"}
                  />
                  <AvatarFallback className="text-2xl font-semibold !rounded-xl text-gray-700 bg-gradient-to-br from-gray-100 to-gray-200">
                    {profile?.name
                      ? profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "ST"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </FloatingElement>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col w-full gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  className="w-full glass hover:glass-hover border-white/20 hover:border-white/30 transition-all duration-300"
                  size="sm"
                  asChild
                >
                  <a href="#contact" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Get in touch
                  </a>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  className="w-full glass hover:glass-hover border-white/20 hover:border-white/30 transition-all duration-300"
                  size="sm"
                  asChild
                >
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View GitHub
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 flex flex-col justify-center min-w-0 w-full space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight"
            >
              {profile?.name || "Saurabh Thapliyal"}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              <p className="text-xl text-muted-foreground font-medium">
                {profile?.headline || "Full Stack Developer & UI/UX Enthusiast"}
              </p>

              <div className="flex items-center gap-4 text-sm">
                {profile?.availability && (
                  <motion.div
                    className={`flex items-center gap-2 px-3 py-2 rounded-full glass ${
                      AVAILABILITY_OPTIONS.find(
                        (opt) => opt.value === profile.availability,
                      )?.bgColor || "bg-gray-400/10"
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full ${
                        AVAILABILITY_OPTIONS.find(
                          (opt) => opt.value === profile.availability,
                        )?.color || "bg-gray-400"
                      }`}
                    />
                    <span className="font-medium">
                      {
                        AVAILABILITY_OPTIONS.find(
                          (opt) => opt.value === profile.availability,
                        )?.label
                      }
                    </span>
                  </motion.div>
                )}

                <motion.div
                  className="flex items-center gap-2 px-3 py-2 rounded-full glass"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <MapPin className="h-4 w-4" />
                  <span>
                    {profile?.location
                      ? `Based in ${profile.location}`
                      : "Based in India"}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-muted-foreground text-lg leading-relaxed max-w-2xl"
            >
              {profile?.about ||
                "Passionate about crafting exceptional digital experiences through clean code and thoughtful design. I specialize in React, Node.js, and modern full-stack web technologies with a user-first mindset."}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
