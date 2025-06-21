"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ExternalLink, Github, User } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";
import { AnimatedSection } from "@/components/public/animated-sections";
import { useEffect, useState } from "react";
import { getContactInfoForPublic } from "@/lib/actions/contact";

// Define props interface for ContactSection
interface ContactSectionProps {
  className?: string;
}

// Define a ContactInfo type for the contactInfo state
interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

/**
 * ContactSection Component
 * Displays contact information and a contact form
 */
export function ContactSection({ className }: ContactSectionProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const data = await getContactInfoForPublic();
        setContactInfo(data);
      } catch {
        setContactInfo(null);
      }
    }
    fetchContactInfo();
  }, []);

  return (
    <section id="contact" className={`  ${className || ""}`}>
      <AnimatedSection>
        <div className="flex flex-col  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">
              Get In Touch
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Let&apos;s discuss your next project or just say hello. I&apos;m
              always open to new opportunities and collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <ContactForm className="h-full" showCard={true} />

            <div className="space-y-6">
              <Card className="bg-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Feel free to reach out through any of these channels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${
                        contactInfo?.email || "hello@example.com"
                      }`}
                      className="text-sm hover:underline"
                      rel="noopener noreferrer"
                    >
                      {contactInfo?.email || "hello@example.com"}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${contactInfo?.phone || "+1234567890"}`}
                      className="text-sm hover:underline"
                      rel="noopener noreferrer"
                    >
                      {contactInfo?.phone || "+1 (234) 567-8900"}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={contactInfo?.linkedin || "https://linkedin.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={contactInfo?.github || "https://github.com/example"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      GitHub Profile
                    </a>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-accent/10">
                <CardHeader>
                  <CardTitle>Let&apos;s Work Together</CardTitle>
                  <CardDescription>
                    I&apos;m currently available for freelance projects and
                    full-time opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Whether you&apos;re looking to build a new web application
                    or improve an existing system. I&apos;d love to help bring
                    your ideas to life.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Web Development
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      API Development
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Database Design
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Consulting
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
