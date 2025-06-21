"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/public/project-card";
import {
  AnimatedSection,
  AnimatedGrid,
  AnimatedGridItem,
} from "@/components/public/animated-sections";
import { Project } from "@/types";
import { getProjects } from "@/lib/actions/projects";

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="pb-20  rounded-xl">
      <AnimatedSection>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">
              Featured Projects
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Here are some of my recent projects that showcase my skills and
              passion for development.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-video bg-muted animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2  gap-8">
              {projects.map((project, index) => (
                <AnimatedGridItem key={project.id} index={index}>
                  <ProjectCard project={project} />
                </AnimatedGridItem>
              ))}
            </AnimatedGrid>
          )}
        </div>
      </AnimatedSection>
    </section>
  );
}
