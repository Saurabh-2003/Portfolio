"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ImGithub } from "react-icons/im";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Play, Lightbulb, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  className?: string;
  index?: number;
}

export function ProjectCard({
  project,
  className,
  index = 0,
}: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  function truncateWords(text: string, wordLimit: number): string {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "…";
  }

  // Simplified animations to avoid TypeScript issues

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`group relative max-w-sm w-full mx-auto rounded-2xl overflow-hidden h-full cursor-pointer ${className}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
          {/* Image Section */}
          <div className="relative overflow-hidden">
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Image
                src={project?.image ?? "/nebula.jpg"}
                alt={project.title}
                className="w-full h-[200px] object-cover"
                width={500}
                height={300}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Loading overlay */}
              <AnimatePresence>
                {!imageLoaded && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-muted animate-pulse"
                  />
                )}
              </AnimatePresence>

              {/* Corner action buttons (always visible) */}
              <div className="absolute top-3 right-3 flex gap-2">
                {project.deployed_link && (
                  <motion.a
                    target="_blank"
                    href={project.deployed_link}
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaExternalLinkAlt className="w-3 h-3 text-white" />
                  </motion.a>
                )}
                {project.github_link && (
                  <motion.a
                    target="_blank"
                    href={project.github_link}
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/10"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ImGithub className="w-3 h-3 text-white" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col flex-1 p-6 gap-4">
            {/* Title */}
            <motion.h3
              className="text-xl font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300"
              whileHover={{ x: 2 }}
            >
              {project.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              {truncateWords(project.description, 25)}
            </motion.p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {project.tech_stack?.slice(0, 4).map((tech, techIndex) => (
                <motion.div
                  key={tech}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, delay: 0.1 + techIndex * 0.05 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200 cursor-default"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
              {project.tech_stack && project.tech_stack.length > 4 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Badge
                    variant="outline"
                    className="text-xs px-3 py-1 hover:bg-accent transition-colors duration-200"
                  >
                    +{project.tech_stack.length - 4} more
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* View Details Button */}
            {project.description.trim().split(/\s+/).length > 25 && (
              <motion.button
                className="mt-2 w-full px-4 py-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border border-primary/20 hover:border-primary/30 transition-all duration-300 text-sm font-medium group/button"
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View Details</span>
                <motion.svg
                  className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </motion.svg>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background/95 via-background to-background/95 backdrop-blur-xl border border-border/50 shadow-2xl">
          <DialogHeader className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex-1">
                <DialogTitle className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  {project.title}
                </DialogTitle>
                {project.duration && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{project.duration}</span>
                  </div>
                )}
              </div>

              {project.video && (
                <div className="flex gap-3">
                  <motion.a
                    target="_blank"
                    href={project.video}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 hover:border-red-500/30 transition-all text-red-500 text-sm font-medium"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    <span>Demo Video</span>
                  </motion.a>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-8 mt-8">
            {/* Project Video */}
            <motion.div
              className="w-full rounded-xl overflow-hidden border bg-black/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <video
                className="w-full h-64 object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/project_video.mov" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>

            {/* Description */}
            <motion.div
              className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                About This Project
              </h3>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🛠️</span>
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tech_stack?.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-default"
                    >
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            {project.features &&
              (typeof project.features === "string"
                ? project.features.trim()
                : project.features.length > 0) && (
                <motion.div
                  className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Key Features
                  </h3>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.features}
                  </div>
                </motion.div>
              )}

            {/* Learnings and Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.learnings &&
                (typeof project.learnings === "string"
                  ? project.learnings.trim()
                  : project.learnings) && (
                  <motion.div
                    className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Lightbulb className="w-6 h-6 text-yellow-500" />
                      Key Learnings
                    </h3>
                    <div className="text-muted-foreground leading-relaxed">
                      {Array.isArray(project.learnings) ? (
                        project.learnings.map((l, i) => (
                          <motion.div
                            key={i}
                            className="flex items-start gap-3 mb-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                          >
                            <span className="text-primary mt-1.5 text-lg">
                              •
                            </span>
                            <span>{l}</span>
                          </motion.div>
                        ))
                      ) : (
                        <div className="whitespace-pre-line">
                          {project.learnings}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

              {project.challenges &&
                (typeof project.challenges === "string"
                  ? project.challenges.trim()
                  : project.challenges) && (
                  <motion.div
                    className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                      Challenges Overcome
                    </h3>
                    <div className="text-muted-foreground leading-relaxed">
                      {Array.isArray(project.challenges) ? (
                        project.challenges.map((c, i) => (
                          <motion.div
                            key={i}
                            className="flex items-start gap-3 mb-3"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                          >
                            <span className="text-primary mt-1.5 text-lg">
                              •
                            </span>
                            <span>{c}</span>
                          </motion.div>
                        ))
                      ) : (
                        <div className="whitespace-pre-line">
                          {project.challenges}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
