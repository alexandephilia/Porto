// Import necessary dependencies for animations, UI components, and icons
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, User, Briefcase, Code, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define menu items with their icons, labels and destinations
const menuItems = [
  { icon: <Home className="h-5 w-5" />, label: "Home", href: "#" },
  { icon: <Code className="h-5 w-5" />, label: "Projects", href: "#projects" },
  { icon: <Briefcase className="h-5 w-5" />, label: "Experience", href: "#experience" },
  { icon: <User className="h-5 w-5" />, label: "About", href: "#about" },
  { icon: <Mail className="h-5 w-5" />, label: "Contact", href: "#contact" },
  { icon: <X className="h-5 w-5" />, label: "Close", onClick: true },
];

const FloatingMenu = () => {
  // State management for menu open/close and animation states
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimatingIcons, setIsAnimatingIcons] = useState(false);
  const [iconsHaveFadedOut, setIconsHaveFadedOut] = useState(false);

  // Handle menu close animation sequence
  const handleClose = async () => {
    setIsAnimatingIcons(true);
    await fadeOutIcons(); // Wait for all icons to fade out
    setIconsHaveFadedOut(true);
    setIsOpen(false);
    setIsAnimatingIcons(false);
    setIconsHaveFadedOut(false);
  };

  // Helper function to create delay for icon fade out animation
  const fadeOutIcons = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, menuItems.length * 100 + 200); // Calculate enough time for all icons to fade out
    });
  };

  // Calculate menu width based on screen size
  const mobileWidth = menuItems.length * 48 + 16; // Mobile width (48px per item + 16px padding)
  const desktopWidth = menuItems.length * 44; // Desktop width (44px per item)

  return (
    // Wrap menu in TooltipProvider for hover tooltips
    <TooltipProvider delayDuration={100}>
      {/* Fixed positioning for floating menu */}
      <div className="fixed bottom-20 sm:bottom-20 left-1/2 -translate-x-1/2 z-50">
        {/* Container for menu animations */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={false}
        >
          {/* Animated menu background */}
          <motion.div
            className={cn(
              "absolute left-1/2 shadow-lg border border-border/50 transition-colors duration-300",
              "bg-background/30 backdrop-blur-md"
            )}
            animate={{
              width: isOpen 
                ? `clamp(${desktopWidth}px, ${mobileWidth}px, ${mobileWidth}px)` 
                : 56,
              height: 56,
              x: "-50%",
              borderRadius: 45,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              mass: 1.2,
              duration: 0.8,
              delay: iconsHaveFadedOut ? 0 : 0.4 // Delay menu unexpand until icons fade out completely
            }}
          >
            {/* Animated menu items container */}
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center px-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ 
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: iconsHaveFadedOut ? 0.3 : 0.5
                    }
                  }}
                >
                  {/* Menu items layout */}
                  <div className="flex items-center justify-center gap-2.5">
                    {menuItems.map((item, index) => (
                      // Individual menu item animations
                      <motion.div
                        key={index}
                        initial={{
                          scale: 0.5,
                          opacity: 0,
                          y: -20,
                          filter: "blur(8px)"
                        }}
                        animate={{
                          scale: 1.1,
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.4,
                            ease: [0.68, -0.55, 0.27, 1.55],
                            delay: 0.5 + (index * 0.1) // Staggered animation delay
                          }
                        }}
                        exit={{
                          scale: 0.5,
                          opacity: 0,
                          y: -20,
                          filter: "blur(8px)",
                          transition: {
                            duration: 0.2,
                            ease: [0.68, -0.55, 0.27, 1.55],
                            delay: index * 0.1 // Sequential delay for each icon exit
                          }
                        }}
                      >
                        {/* Tooltip wrapper for each menu item */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-full hover:bg-accent/20 hover:blur-[1px] active:scale-95 transition-all duration-200"
                              onClick={item.onClick ? handleClose : undefined}
                              asChild={!item.onClick}
                            >
                              {/* Render either close button or navigation link */}
                              {item.onClick ? (
                                item.icon
                              ) : (
                                <a href={item.href}>
                                  {item.icon}
                                </a>
                              )}
                            </Button>
                          </TooltipTrigger>
                          {/* Tooltip content - hidden on mobile */}
                          <TooltipContent 
                            side="top" 
                            className="hidden md:block bg-background/80 backdrop-blur-md border-border/50"
                            sideOffset={5}
                          >
                            <span className="font-medium">{item.label}</span>
                          </TooltipContent>
                        </Tooltip>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Menu trigger button animation */}
            <AnimatePresence mode="wait">
              {!isOpen && (
                <motion.div
                  key="menu"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}
                  exit={{ opacity: 0 }}
                >
                  {/* Menu trigger button with tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-[56px] w-[56px] rounded-full hover:bg-accent/20 active:scale-95 transition-all duration-200"
                        onClick={() => setIsOpen(true)}
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="bg-background/80 backdrop-blur-md border-border/50"
                    >
                      <span className="font-medium">Menu</span>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default FloatingMenu;
