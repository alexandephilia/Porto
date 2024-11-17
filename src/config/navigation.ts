import { Github, Linkedin, Mail, User, Briefcase, Phone, Globe, Code, Server, Palette, Layout } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon?: any;
  description?: string;
}

export interface NavSection {
  title: string;
  titleStyle?: React.CSSProperties;
  links: NavLink[];
}

export const navSections: NavSection[] = [
  {
    title: "About",
    titleStyle: {
      fontFamily: '"Libre Bodoni", serif',
      fontStyle: 'italic'
    },
    links: [
      { href: "/about", label: "About Me", icon: User, description: "Learn more about my background" },
      { href: "/experience", label: "Experience", icon: Briefcase, description: "My professional journey" },
      { href: "/contact", label: "Contact", icon: Phone, description: "Get in touch" },
    ],
  },
  {
    title: "Hobbies",
    titleStyle: {
      fontFamily: '"Libre Bodoni", serif',
      fontStyle: 'italic'
    },
    links: [
      { href: "/projects/ai", label: "AI Research", icon: Code, description: "Exploring artificial intelligence" },
      { href: "/projects/components", label: "Web Components", icon: Globe, description: "Building reusable UI components" },
      { href: "/projects/prompts", label: "Prompt Engineering", icon: Palette, description: "Crafting effective AI prompts" },
    ],
  },
];

export const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:example@email.com", icon: Mail, label: "Email" },
]; 