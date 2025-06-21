"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SkillsByCategory,
  SKILL_CATEGORY_LABELS,
  SkillCategory,
} from "@/types";
import { useState } from "react";
// Import only used icons from react-icons
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaTools,
  FaCloud,
  FaCode,
  FaCogs,
  FaPython,
  FaPhp,
  FaAws,
  FaDocker,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaVuejs,
  FaFigma,
  FaSass,
  FaRegQuestionCircle,
} from "react-icons/fa";
import {
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiFirebase,
  SiTailwindcss,
  SiExpress,
  SiGraphql,
  SiNextdotjs,
} from "react-icons/si";

interface SkillsSectionProps {
  skillsByCategory: SkillsByCategory;
  className?: string;
}

// Map skill names to react-icons components
const skillIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  React: FaReact,
  "Node.js": FaNodeJs,
  "Express.js": SiExpress,
  TypeScript: SiTypescript,
  JavaScript: FaJs,
  HTML5: FaHtml5,
  CSS3: FaCss3Alt,
  SCSS: FaSass,
  "Tailwind CSS": SiTailwindcss,
  Vue: FaVuejs,
  "Vue.js": FaVuejs,
  Python: FaPython,
  PHP: FaPhp,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  Redis: SiRedis,
  Firebase: SiFirebase,
  Git: FaGitAlt,
  Docker: FaDocker,
  AWS: FaAws,
  Vercel: FaRegQuestionCircle, // fallback icon
  Figma: FaFigma,
  "VS Code": FaRegQuestionCircle, // fallback icon
  "REST APIs": FaCloud,
  GraphQL: SiGraphql,
  Next: SiNextdotjs,
  "Next.js": SiNextdotjs,
  // Add more mappings as needed
};

const categoryIcons: Record<
  SkillCategory,
  React.ComponentType<{ className?: string }>
> = {
  frontend: FaReact,
  backend: FaNodeJs,
  devops: FaCloud,
  database: FaDatabase,
  tools: FaTools,
  languages: FaCode,
  frameworks: FaCogs,
  other: FaRegQuestionCircle,
};

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

export function SkillsSection({
  skillsByCategory,
  className,
}: SkillsSectionProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Filter out empty categories
  const categoriesWithSkills = Object.entries(skillsByCategory).filter(
    ([, skills]) => skills.length > 0,
  ) as [SkillCategory, (typeof skillsByCategory)[SkillCategory]][];

  if (categoriesWithSkills.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground"
        >
          No skills added yet.
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categoriesWithSkills.map(([category, skills]) => {
        const CategoryIcon = categoryIcons[category];
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setHoveredCategory(category)}
            onHoverEnd={() => setHoveredCategory(null)}
            className="group"
          >
            <Card className="h-full bg-gradient-to-br from-card/80 via-card to-card/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
              />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                animate={
                  hoveredCategory === category ? { x: "200%" } : { x: "-100%" }
                }
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              <CardHeader className="pb-4 relative z-10">
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <motion.div
                      className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CategoryIcon className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span className="group-hover:text-primary transition-colors duration-300">
                      {SKILL_CATEGORY_LABELS[category]}
                    </span>
                    <motion.div
                      className="ml-auto text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {skills.length}
                    </motion.div>
                  </CardTitle>
                </motion.div>
              </CardHeader>

              <CardContent className="relative z-10">
                <motion.div
                  className="grid grid-cols-2 gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {skills.map((skill, index) => {
                    const SkillIcon =
                      skillIconMap[skill.name] || FaRegQuestionCircle;
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="w-full"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group/skill cursor-default"
                        >
                          <Badge
                            variant="secondary"
                            className="tech-badge group/skill w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium border border-primary/10 bg-background/60 hover:bg-background hover:border-primary/30 transition-all duration-300 rounded-lg"
                          >
                            <motion.div
                              initial={{ opacity: 0.7 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <SkillIcon className="w-4 h-4 text-primary shrink-0 filter grayscale group-hover/skill:filter-none group-hover/skill:text-inherit transition-all duration-300" />
                            </motion.div>
                            <span className="truncate">{skill.name}</span>
                          </Badge>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Simplified grid view for all skills
export function SkillsSectionGrid({
  skillsByCategory,
  className,
}: Omit<SkillsSectionProps, "displayMode">) {
  const categoriesWithSkills = Object.entries(skillsByCategory).filter(
    ([, skills]) => skills.length > 0,
  ) as [SkillCategory, (typeof skillsByCategory)[SkillCategory]][];

  if (categoriesWithSkills.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categoriesWithSkills.map(([category, skills]) => {
        const Icon = categoryIcons[category];
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full bg-accent/10 hover:bg-accent/20 transition-colors duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="w-5 h-5 text-primary" />
                  {SKILL_CATEGORY_LABELS[category]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Badge variant="secondary" className="tech-badge">
                        {skill.name}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Enhanced compact skills display
export function SkillsCompact({
  skillsByCategory,
  maxSkills = 12,
  className,
}: SkillsSectionProps & { maxSkills?: number }) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Flatten all skills and take the most recent ones
  const allSkills = Object.values(skillsByCategory)
    .flat()
    .sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
      const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, maxSkills);

  if (allSkills.length === 0) {
    return null;
  }

  const skillContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  // Simplified animations to avoid TypeScript issues

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      variants={skillContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-wrap gap-3">
        {allSkills.map((skill, index) => {
          const SkillIcon = skillIconMap[skill.name] || FaRegQuestionCircle;
          const isHovered = hoveredSkill === skill.id.toString();

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onHoverStart={() => setHoveredSkill(skill.id.toString())}
                onHoverEnd={() => setHoveredSkill(null)}
                className="relative group cursor-default"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <Badge
                  variant="secondary"
                  className="tech-badge relative flex items-center gap-2 px-4 py-2 text-sm font-medium border border-primary/20 bg-background/80 hover:bg-background hover:border-primary/40 transition-all duration-300 rounded-lg backdrop-blur-sm shadow-sm hover:shadow-md"
                >
                  <motion.div
                    animate={{
                      rotate: isHovered ? 360 : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    <SkillIcon className="w-4 h-4 text-primary shrink-0 transition-all duration-300" />
                  </motion.div>
                  <span className="font-medium">{skill.name}</span>

                  {/* Skill level indicator (if available) */}
                  {skill.proficiency_level && (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary/60"
                      animate={{
                        scale: isHovered ? [1, 1.2, 1] : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: isHovered ? Infinity : 0,
                      }}
                    />
                  )}
                </Badge>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg text-xs whitespace-nowrap z-10"
                    >
                      <span className="text-muted-foreground">
                        {skill.category ? `${skill.category} skill` : "Skill"}
                      </span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border/50" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Show more indicator */}
      {Object.values(skillsByCategory).flat().length > maxSkills && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Badge
            variant="outline"
            className="text-xs px-3 py-1 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-default"
          >
            +{Object.values(skillsByCategory).flat().length - maxSkills} more
            skills
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
}
