import { Github, Linkedin, Mail, User, Briefcase, Phone, Globe, Code, Server, Palette, Layout } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon?: any;
  description?: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export const navSections: NavSection[] = [
  {
    title: "About",
    links: [
      { href: "/about", label: "About Me", icon: User, description: "Learn more about my background" },
      { href: "/experience", label: "Experience", icon: Briefcase, description: "My professional journey" },
      { href: "/contact", label: "Contact", icon: Phone, description: "Get in touch" },
    ],
  },
  {
    title: "Projects",
    links: [
      { href: "/projects/web", label: "Web Development", icon: Globe, description: "Modern web applications" },
      { href: "/projects/mobile", label: "Mobile Development", icon: Layout, description: "Cross-platform apps" },
      { href: "/projects/backend", label: "Backend Development", icon: Server, description: "Scalable solutions" },
    ],
  },
  
];

export const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:example@email.com", icon: Mail, label: "Email" },
]; 