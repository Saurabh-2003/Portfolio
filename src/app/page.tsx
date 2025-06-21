"use client";
import { Suspense } from "react";
import { Navigation } from "@/components/public/Navigation";
import { HeroSection } from "@/components/public/HeroSection";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { ExperienceSection } from "@/components/public/ExperienceSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { ContactSection } from "@/components/public/ContactSection";

import { LoadingSkeleton } from "@/components/public/LoadingSkeleton";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen scroll-smooth container max-w-3xl mx-auto !px-0 ">
      <Navigation />
      <main className="relative flex flex-col gap-20 ">
        <Suspense fallback={<LoadingSkeleton />}>
          <HeroSection />
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
