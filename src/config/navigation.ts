import { Github, Linkedin, Mail } from "lucide-react";

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
    title: "Main",
    links: [
      {
        label: "About",
        href: "/about",
      },
      {
        label: "Projects",
        href: "/projects",
      },
      {
        label: "Experience",
        href: "/experience",
      },
      {
        label: "Skills",
        href: "/skills",
      },
      {
        label: "Contact",
        href: "/contact",
      },
    ],
  },
];

export const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:example@email.com", icon: Mail, label: "Email" },
]; 