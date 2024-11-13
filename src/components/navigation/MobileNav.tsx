import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Github, Linkedin, Mail, Menu, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navSections, socialLinks, type NavSection as NavSectionType } from "@/config/navigation";
import { useState } from "react";

interface NavSectionProps extends NavSectionType {
  index: number;
}

const springTransition = {
  type: "spring",
  damping: 15,
  stiffness: 150,
  mass: 0.8,
  restDelta: 0.01
};

const NavSection = ({ title, links, index }: NavSectionProps) => (
  <motion.div 
    className="flex flex-col gap-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index, ...springTransition }}
  >
    <div className="flex flex-col space-y-2">
      {links.map((link, idx) => (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, x: -20, filter: "blur(0px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          whileHover={{ filter: "blur(2px)" }}
          transition={{ 
            delay: 0.1 * idx,
            ...springTransition,
            filter: { duration: 0.2 }
          }}
        >
          <Button
            variant="ghost"
            className="w-full text-center rounded-none h-16 transition-all duration-300 hover:bg-transparent"
            asChild
          >
            <a href={link.href} className="relative">
              <span className="relative z-10 text-[28px] font-medium tracking-tight">
                {link.label}
              </span>
            </a>
          </Button>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const SocialLinks = () => (
  <motion.div 
    className="pt-4 border-t"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, ...springTransition }}
  >
    <div className="flex justify-center gap-4">
      {socialLinks.map(({ href, icon: Icon, label }, idx) => (
        <motion.div
          key={href}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 + idx * 0.1, ...springTransition }}
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full transition-all duration-300 backdrop-blur-sm bg-black/20 border-none h-12 w-12 hover:bg-black/30 hover:blur-[2px]"
            asChild
          >
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={label}
              className="relative"
            >
              <Icon className="h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-transparent relative group"
        >
          <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={{
              open: { 
                rotate: 180,
                scale: 1.2,
              },
              closed: { 
                rotate: 0,
                scale: 1
              }
            }}
            transition={{
              type: "spring",
              damping: 10,
              stiffness: 100,
            }}
          >
            <Menu className="h-6 w-6" />
          </motion.div>
        </Button>
      </SheetTrigger>
      <AnimatePresence mode="wait">
        {isOpen && (
          <SheetContent 
            className="w-full sm:w-[400px] rounded-l-[20px] backdrop-blur-xl bg-background/95 p-0 overflow-hidden"
            side="right"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, duration: 0.5 }}
              className="h-full p-6"
            >
              <div className="flex flex-col gap-4 pt-12 px-2">
                {navSections.map((section, index) => (
                  <NavSection key={section.title} {...section} index={index} />
                ))}
                <SocialLinks />
              </div>
            </motion.div>
          </SheetContent>
        )}
      </AnimatePresence>
    </Sheet>
  );
};