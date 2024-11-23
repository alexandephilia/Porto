import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/statusbadge";
import { SiCardano } from "react-icons/si";
import { motion } from "framer-motion"; // Add this import at the top
import { Linkedin, Mail, User, Skull } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback } from 'react'; // Add this import
import { Separator } from "@/components/ui/separator";
import { ShimmerDot } from "@/components/ui/shimmer-dot";
import { Skeleton } from "../ui/skeleton";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface HeroSectionProps {
  name: string;
  title: React.ReactNode;
  subtitle: string;
  profileImage: string;
  socialLinks?: SocialLink[];
}

export const HeroSection = ({
  name,
  title,
  subtitle,
  profileImage,
  socialLinks = [
    {
      href: "https://linkedin.com/in/your-profile",
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn"
    },
    {
      href: "mailto:0xnihilist@gmail.com",
      icon: <Mail className="h-5 w-5" />,
      label: "Email"
    },
    {
      href: "resume.pdf",
      icon: <User className="h-5 w-5" />,
      label: "Resume"
    }
  ]
}: HeroSectionProps) => {
  // Enhanced image variants with elastic, blur, and grayscale effects
  const imageVariants = {
    initial: {
      opacity: 0,
      scale: 0.1,
      filter: "blur(20px) grayscale(100%)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px) grayscale(100%)",
      transition: {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1],
        scale: {
          type: "spring",
          damping: 15,
          stiffness: 70,
          restDelta: 0.001
        },
        opacity: {
          duration: 0.8
        },
        filter: {
          duration: 0.8
        }
      }
    },
    hover: {
      filter: "blur(3px) grayscale(0%)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      filter: "blur(3px) grayscale(0%)",
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const preventTouchActions = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      <div className="absolute bottom-0 w-full px-8 h-[2px]">
        <div className="w-full h-full border-b-[1px] border-dashed border-foreground/10" />
      </div>

      <section className="container min-h-[70vh] pt-24 md:pt-32 pb-12 relative flex flex-col items-center justify-center border-l-[1px] border-r-[1px] border-dashed border-foreground/10">
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <ShimmerButton className="w-full">
            <div
              className="group transition-all duration-500 bg-black p-8 rounded-lg border-[1px] border-muted-foreground/10 ring-1 ring-foreground/10"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Left Side - Image and Name */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div
                      className="absolute -inset-[2px] rounded-full animate-gradient-rotate"
                      style={{
                        background: 'linear-gradient(90deg, #3f3f46, #71717a, #3f3f46)',
                        backgroundSize: '200% 200%',
                        filter: 'blur(4px)',
                        maskImage: 'radial-gradient(circle at center, transparent 65%, black 70%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, transparent 65%, black 70%)',
                      }}
                    />
                    <motion.div
                      className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full composite-layer touch-none select-none"
                      variants={imageVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                      onTouchStart={preventTouchActions}
                      onTouchMove={preventTouchActions}
                      onTouchEnd={preventTouchActions}
                      style={{
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        willChange: 'transform',
                        contain: 'paint layout',
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'none',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        WebkitTouchCallout: 'none'
                      }}
                    >
                      <img
                        src={profileImage}
                        alt="Profile memoji"
                        className="w-full h-full object-cover transition-all duration-200 prevent-drag select-none touch-none grayscale"
                        style={{
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          willChange: 'transform',
                          WebkitTouchCallout: 'none',
                          WebkitUserSelect: 'none',
                          userSelect: 'none',
                          pointerEvents: 'none',
                          touchAction: 'none'
                        }}
                        draggable={false}
                        onContextMenu={preventTouchActions}
                        onTouchStart={preventTouchActions}
                        onTouchMove={preventTouchActions}
                        onTouchEnd={preventTouchActions}
                        onMouseDown={preventTouchActions}
                        role="presentation"
                      />
                    </motion.div>
                  </div>

                  <h1 className="text-2xl md:text-xl font-bold group hover:blur-[2px] transition-all duration-300 mt-4">
                    {typeof name === 'string' ? name.split("").map((letter, index) => (
                      <span
                        key={index}
                        className="inline-block hover:animate-wave transition-all duration-300 group-hover:animate-wave touch-none"
                        style={{
                          fontFamily: '"Libre Bodoni", serif',
                          fontWeight: 600,
                          fontStyle: 'italic',
                          animationDelay: `${index * 0.05}s`,
                          animationFillMode: "forwards",
                          letterSpacing: '0.02em'
                        }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    )) : name}
                  </h1>

                  <div className="flex items-center gap-2 opacity-0 animate-[fadeInBlur_0.8s_ease_forwards] [animation-delay:300ms]">
                    <StatusBadge
                      status="Working on"
                      icon={<SiCardano className="h-4 w-4" />}
                      text="Existence"
                    />
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="space-y-4 w-full max-w-xl">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Skull className="w-4 h-4 text-foreground/20" />
                      <Separator className="flex-1" />
                    </div>

                    <p className="text-xs md:text-base leading-relaxed text-muted-foreground/80 animate-fade-in-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] max-w-[90%] mx-auto">
                      {title}
                    </p>
                    <p className="text-xs md:text-base leading-relaxed text-muted-foreground/80 animate-fade-in-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] max-w-[90%] mx-auto">
                      {subtitle}
                    </p>
                  </div>

                  <div className="flex gap-5 animate-fade-in-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
                    {socialLinks.map((link, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-11 w-11 hover:blur-[2px] transition-all duration-300 bg-background/20"
                              onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
                            >
                              {link.icon}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-sm">{link.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ShimmerButton>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce opacity-50 pointer-events-none">
          <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-foreground/20 rounded-full mt-2"></div>
          </div>
        </div>
      </section>
    </div>
  );
}; 