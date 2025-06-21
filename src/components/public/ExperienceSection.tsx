"use client";

import { useState, useEffect } from "react";
import { ExperienceCard } from "@/components/public/experience-card";
import { AnimatedSection } from "@/components/public/animated-sections";
import { Experience } from "@/types";
import { getExperiences } from "@/lib/actions/experience";

// Props interface for this component
interface ExperienceSectionProps {
  className?: string;
}

export function ExperienceSection({ className }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch {
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  return (
    <section id="experience" className={` ${className || ""}`}>
      <AnimatedSection>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">
              Professional Experience
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              My journey as a developer and the experiences that shaped my
              career.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {loading
              ? // Loading state
                Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-muted animate-pulse rounded-lg"
                    />
                  ))
              : // Render experience cards
                experiences.map((experience, index) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                    index={index}
                    className="mb-8"
                  />
                ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
