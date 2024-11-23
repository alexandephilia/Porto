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
      fontFamily: '"Fira Code", "Courier New", monospace',
    },
    links: [
      { href: "/about", label: "About Me", icon: User, description: "Learn more about my background" },
      { href: "#experience", label: "Experience", icon: Briefcase, description: "My professional journey" },
      { href: "mailto:0xnihilist@gmail.com", label: "Contact", icon: Mail, description: "Get in touch" },
    ],
  },
  {
    title: "Hobbies",
    titleStyle: {
      fontFamily: '"Fira Code", "Courier New", monospace',
    },
    links: [
      { href: "/projects/ai", label: "AI Research", icon: Code, description: "Exploring artificial intelligence" },
      { href: "https://uiverse.io/profile/0xnihilism", label: "Web Components", icon: Globe, description: "Building reusable UI components" },
      { href: "https://www.notion.so/Experimental-Prompting-86aa8f988fce404cbf70134690d2635a", label: "Prompt Engineering", icon: Palette, description: "Crafting effective AI prompts" },
    ],
  },
];

export const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:0xnihilist@gmail.com", icon: Mail, label: "Email" },
]; 