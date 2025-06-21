"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Building,
  Award,
  Target,
  BookOpen,
  ChevronDown,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types";
import { useState } from "react";

interface ExperienceCardProps {
  experience: Experience;
  className?: string;
  index?: number;
}

// Simplified animations to avoid TypeScript issues

export function ExperienceCard({
  experience,
  className,
  index = 0,
}: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse achievements if it's a string
  const achievements = Array.isArray(experience.achievements)
    ? experience.achievements
    : JSON.parse(experience.achievements || "[]");

  const hasExpandableContent =
    achievements.length > 3 ||
    (experience.challenges_faced && experience.challenges_faced.length > 100) ||
    (experience.learnings && experience.learnings.length > 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transition: "all 0.3s ease",
      }}
    >
      <Card className="relative overflow-hidden border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Timeline indicator */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-primary/20"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: index * 0.1, duration: 0.8 }}
        />

        <CardHeader className="pb-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <motion.div
                className="flex items-start gap-3 mb-3"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mt-1"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Building className="w-5 h-5 text-primary" />
                </motion.div>

                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                    {experience.role}
                  </CardTitle>

                  <motion.div
                    className="flex items-center gap-2 mt-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-semibold text-primary text-lg">
                      {experience.company_name}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-2"
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
              >
                <Calendar className="w-3 h-3" />
                <span className="font-medium">{experience.duration}</span>
              </Badge>
            </motion.div>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardDescription className="text-base leading-relaxed text-muted-foreground">
              {experience.role_description}
            </CardDescription>
          </motion.div>

          {/* Achievements Section */}
          {achievements && achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <motion.h4
                className="flex items-center gap-3 font-semibold text-foreground text-lg"
                whileHover={{ x: 2 }}
              >
                <motion.div
                  className="p-1.5 rounded-lg bg-emerald-500/10"
                  whileHover={{ rotate: 5 }}
                >
                  <Award className="w-4 h-4 text-emerald-500" />
                </motion.div>
                Key Achievements
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {achievements.length}
                </Badge>
              </motion.h4>

              <motion.div className="space-y-3">
                <AnimatePresence>
                  {achievements
                    .slice(0, isExpanded ? achievements.length : 3)
                    .map((achievement: string, achievementIndex: number) => (
                      <motion.div
                        key={achievementIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: achievementIndex * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/20 dark:border-emerald-800/20 group/achievement hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors duration-200"
                        whileHover={{ x: 4, scale: 1.01 }}
                      >
                        <motion.div
                          className="w-2 h-2 rounded-full bg-emerald-400 mt-2.5 shrink-0"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: achievementIndex * 0.2,
                          }}
                        />
                        <span className="text-sm leading-relaxed group-hover/achievement:text-foreground transition-colors duration-200">
                          {achievement}
                        </span>
                      </motion.div>
                    ))}
                </AnimatePresence>

                {achievements.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-200"
                    >
                      <span>
                        {isExpanded
                          ? "Show Less"
                          : `Show ${achievements.length - 3} More`}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Challenges and Learnings Grid */}
          <AnimatePresence>
            {(experience.challenges_faced || experience.learnings) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                layout
              >
                {experience.challenges_faced && (
                  <motion.div
                    className="space-y-3 p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/20 dark:border-orange-800/20"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.h4
                      className="flex items-center gap-2 font-semibold text-foreground"
                      whileHover={{ x: 2 }}
                    >
                      <motion.div
                        className="p-1.5 rounded-lg bg-orange-500/10"
                        whileHover={{ rotate: 5 }}
                      >
                        <Target className="w-4 h-4 text-orange-500" />
                      </motion.div>
                      Challenges Faced
                    </motion.h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isExpanded
                        ? experience.challenges_faced
                        : experience.challenges_faced.length > 100
                        ? `${experience.challenges_faced.substring(0, 100)}...`
                        : experience.challenges_faced}
                    </p>
                  </motion.div>
                )}

                {experience.learnings && (
                  <motion.div
                    className="space-y-3 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/20 dark:border-blue-800/20"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.h4
                      className="flex items-center gap-2 font-semibold text-foreground"
                      whileHover={{ x: 2 }}
                    >
                      <motion.div
                        className="p-1.5 rounded-lg bg-blue-500/10"
                        whileHover={{ rotate: 5 }}
                      >
                        <BookOpen className="w-4 h-4 text-blue-500" />
                      </motion.div>
                      Key Learnings
                    </motion.h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isExpanded
                        ? experience.learnings
                        : experience.learnings.length > 100
                        ? `${experience.learnings.substring(0, 100)}...`
                        : experience.learnings}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand/Collapse for long content */}
          {hasExpandableContent && !achievements.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center pt-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <span>{isExpanded ? "Show Less" : "Read More"}</span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Compact version for timeline view
export function ExperienceCardCompact({
  experience,
  className,
  index = 0,
}: ExperienceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={className}
    >
      <Card className="border-l-4 border-l-primary/50 hover:border-l-primary transition-all duration-300 hover:shadow-md bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-semibold text-base leading-tight hover:text-primary transition-colors">
                {experience.role}
              </h3>
              <p className="text-sm font-medium text-primary">
                {experience.company_name}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs self-start sm:self-center flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              {experience.duration}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {experience.role_description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Timeline version with connector
export function ExperienceCardTimeline({
  experience,
  isLast = false,
  className,
  index = 0,
}: ExperienceCardProps & { isLast?: boolean }) {
  return (
    <div className={`relative ${className}`}>
      {/* Timeline connector */}
      {!isLast && (
        <motion.div
          className="absolute left-6 top-16 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent"
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ delay: index * 0.2, duration: 0.8 }}
        />
      )}

      {/* Timeline dot */}
      <motion.div
        className="absolute left-4 top-8 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.2 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-primary"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="ml-12"
      >
        <Card className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">
                  {experience.role}
                </CardTitle>
                <p className="text-primary font-medium flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {experience.company_name}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs self-start flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                {experience.duration}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <CardDescription className="text-sm leading-relaxed">
              {experience.role_description}
            </CardDescription>

            {/* Show only first 2 achievements in timeline view */}
            {(() => {
              const achievements = Array.isArray(experience.achievements)
                ? experience.achievements
                : JSON.parse(experience.achievements || "[]");

              if (achievements.length > 0) {
                return (
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Achievements
                    </h5>
                    <ul className="space-y-1">
                      {achievements
                        .slice(0, 2)
                        .map(
                          (achievement: string, achievementIndex: number) => (
                            <motion.li
                              key={achievementIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.3 + achievementIndex * 0.1,
                              }}
                              className="flex items-start gap-2 text-sm"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                              <span className="text-muted-foreground leading-relaxed">
                                {achievement}
                              </span>
                            </motion.li>
                          )
                        )}
                      {achievements.length > 2 && (
                        <li className="text-xs text-muted-foreground ml-4 italic">
                          +{achievements.length - 2} more achievements
                        </li>
                      )}
                    </ul>
                  </div>
                );
              }
              return null;
            })()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
