"use client";

import { useState, useEffect } from "react";
import { AnimatedSection } from "@/components/public/animated-sections";
import { SkillsCompact } from "@/components/public/skills-section";
import { SkillsByCategory } from "@/types";
import { getSkillsForPublic } from "@/lib/actions/skills";

// Interface for component props
interface SkillsSectionProps {
  className?: string;
}

export function SkillsSection({ className }: SkillsSectionProps) {
  const [skillsByCategory, setSkillsByCategory] = useState<SkillsByCategory>({
    frontend: [],
    backend: [],
    devops: [],
    database: [],
    tools: [],
    languages: [],
    frameworks: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await getSkillsForPublic();
        setSkillsByCategory(data);
      } catch {
        setSkillsByCategory({
          frontend: [],
          backend: [],
          devops: [],
          database: [],
          tools: [],
          languages: [],
          frameworks: [],
          other: [],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  return (
    <section
      id="skills"
      className={`py-14  bg-muted/30 rounded-xl w-full ${className || ""}`}
    >
      <AnimatedSection className="">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">
              Skills & Technologies
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Technologies and tools I work with to bring ideas to life.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="w-full">
              <SkillsCompact skillsByCategory={skillsByCategory} className="" />
            </div>
          )}
        </div>
      </AnimatedSection>
    </section>
  );
}
