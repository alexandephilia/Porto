import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { Github, Linkedin, Mail, User, Menu, Book, Wrench, Heart, Coffee } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { Code, Server } from "lucide-react";
import { 
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiWebflow,
  SiFramer,
  SiVercel,
  SiGithub,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiNetlify,
  SiReplit,
  SiCardano
} from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/statusbadge";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { motion, useAnimationControls } from "framer-motion";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import BlogSection from "@/components/sections/BlogSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import FloatingMenu from "@/components/FloatingMenu";
import { MobileNav } from "@/components/navigation/MobileNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { AnimatedGradientText } from "@/components/ui/animated-text";
import { AnimatedTyping } from "@/components/ui/animated-typing";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:text-accent-foreground hover:blur-[2px]",
            className
          )}
          {...props}
        >
          <div className="text-sm font-bold leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Grain = ({ opacity = 0.8 }) => {
  const controls = useAnimationControls();
  const { theme } = useTheme();
  
  useEffect(() => {
    controls.start({
      x: ["0%", "-5%", "-15%", "7%", "-5%", "-15%", "15%", "0%", "3%", "-10%"],
      y: ["0%", "-10%", "5%", "-25%", "25%", "10%", "0%", "15%", "35%", "10%"],
      transition: {
        duration: 8,
        ease: "linear",
        repeat: Infinity,
      }
    });
  }, [controls]);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      pointerEvents: "none",
      zIndex: 9999,
      overflow: "hidden",
      willChange: "transform",
      transform: "translateZ(0)"
    }}>
      <motion.div
        animate={controls}
        style={{
          backgroundSize: "64px 64px",
          backgroundRepeat: "repeat",
          background: theme === 'dark' 
            ? "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')"
            : "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
          opacity: theme === 'dark' ? opacity : opacity * 0.8,
          inset: "-200%",
          width: "400%",
          height: "400%",
          position: "absolute",
          filter: theme === 'dark' 
            ? 'none' 
            : 'invert(1) brightness(0.8)',
          backfaceVisibility: "hidden" as const,
          perspective: 1000,
          transformStyle: "preserve-3d" as const
        }}
      />
    </div>
  );
};

const Index = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 16.67) { // Longer than one frame
            console.warn('Long task detected:', entry);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Grain opacity={0.06} />
      {/* Navigation */}
      
      <nav className="fixed w-full top-0 z-50">
        <div 
          className="relative"
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          {/* Update blur layer with matching styles */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
          />
          
          {/* Content container with proper z-index */}
          <div className="relative z-10 container max-w-5xl flex h-16 items-center justify-between">
          {/* Left side - Logo and Desktop Navigation */}
          <div className="flex items-center gap-6">
            <AnimatedGradientText 
              text="Portfolio" 
              className="text-xl"
            />
            {/* Desktop Navigation - Moved here */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>About</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/30 to-muted/20 p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-2 text-lg font-bold">
                              Garry Alexander
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground w-[205px] mb-4">
                              A <strong>nihilist</strong> who loves to code and coffee ☕
                            </p>
                            <div className="grid grid-cols-2 gap-2 mt-auto">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="hover:blur-[1px] transition-all duration-300"
                              >
                                GitHub
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="hover:blur-[1px] transition-all duration-300"
                              >
                                LinkedIn
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="hover:blur-[1px] transition-all duration-300"
                              >
                                Twitter
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="hover:blur-[1px] transition-all duration-300"
                              >
                                Email
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="hover:blur-[1px] transition-all duration-300"
                                asChild
                              >
                                <a  href="resume.pdf" target="_blank" rel="noopener noreferrer">
                                  Resume
                                </a>
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="hover:blur-[1px] transition-all duration-300"
                              >
                                Blog
                              </Button>
                            </div>
                          </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/about" title="About Me">
                          <span className="font-bold">Learn more about my background and experience</span>
                        </ListItem>
                        <ListItem href="/experience" title="Experience">
                          <span className="font-bold">View my professional journey and achievements</span>
                        </ListItem>
                        <ListItem href="/contact" title="Contact">
                          <span className="font-bold">Get in touch for collaboration</span>
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <ListItem href="/projects/web" title="Web Development">
                          Modern web applications built with React and TypeScript
                        </ListItem>
                        <ListItem href="/projects/mobile" title="Mobile Development">
                          Cross-platform mobile applications
                        </ListItem>
                        <ListItem href="/projects/backend" title="Backend Development">
                          Scalable backend solutions and APIs
                        </ListItem>
                        <ListItem href="/projects/design" title="UI/UX Design">
                          User interface and experience design projects
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Skills</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <ListItem href="/skills/frontend" title="Frontend">
                          React, TypeScript, Tailwind CSS, Next.js
                        </ListItem>
                        <ListItem href="/skills/backend" title="Backend">
                          Node.js, Express, PostgreSQL, MongoDB
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right side - Mobile Menu and Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileNav />
            </div>
            <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container max-w-5xl px-4 sm:px-6 md:px-8">
        <HeroSection 
          name="Garry Alexander"
          title={
            <>
              <div className="flex flex-col items-center text-center gap-1">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span>A</span>
                  <strong className="dark:text-white dark:drop-shadow-[0_0_0.3rem_#ffffff70]">front-end developer</strong>
                  <span>&</span>
                  <strong className="dark:text-white dark:drop-shadow-[0_0_0.3rem_#ffffff70]">nihilist</strong>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span>who contemplate about</span>
                  <AnimatedTyping 
                    words={["coffee.", "existence.", "space.", "futurism."]} 
                    className="font-bold text-[#2a2a29] drop-shadow-[0_0_0.0rem_#656564] animate-pulse mix-blend-screen filter brightness-150 dark:text-[#EEEEEE] dark:drop-shadow-[0_0_0.3rem_#00ff9570] dark:animate-pulse dark:mix-blend-screen dark:filter dark:brightness-100"
                  />
                </div>
              </div>
            </>
          }
          subtitle="and experiment in the cosmic absurdity of life. 
           Starting from 0 to 1, or probably creating an accidental masterpiece."
          profileImage="/Untitled.jpeg"
        />
      </div>

      {/* Projects Section */}
      <div className="container max-w-5xl px-4 sm:px-6 md:px-8">
        <ProjectsSection />
      </div>

      {/* Skills Section */}
      <div className="container max-w-5xl px-4 sm:px-6 md:px-8">
        <SkillsSection />
      </div>

      {/* Blog Section */}
      <div className="container max-w-5xl px-4 sm:px-6 md:px-8">
        <BlogSection />
      </div>

    
      {/* Experience Section */}
      <div className="container max-w-5xl px-4 sm:px-6 md:px-8">
        <ExperienceSection />
      </div>


      {/* Contact Section */}
      <div className="container max-w-5xl px-4 sm:px-6 md:px-8">
        <ContactSection />
      </div>

      {/* Footer Section */}
      <footer className="border-t mt-16">
      <div className="container max-w-5xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Built with caffeine by <strong>Garry Alexander</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Deployed on
            </span>
            <a 
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer" 
              className="hover:opacity-70 transition-opacity"
            >
              <svg height="16" viewBox="0 0 283 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H85.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>

      {/* Floating Menu */}
      <FloatingMenu />
    </div>
  );
};

export default Index;
