import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navSections, type NavSection as NavSectionType } from "@/config/navigation";
import { useState } from "react";
import { SystemStatus } from "./SystemStatus";

interface NavSectionProps extends NavSectionType {
  index: number;
  titleStyle?: React.CSSProperties;
}

const springTransition = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

const NavSection = ({ title, links, index, titleStyle }: NavSectionProps) => (
  <motion.div
    className="flex-1 flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index, ...springTransition }}
  >
    <h3
      className="text-sm uppercase tracking-wider text-muted-foreground mb-2 text-center"
      style={titleStyle}
    >
      {title}
    </h3>
    <div className="flex-1 flex flex-col justify-evenly">
      {links.map((link, idx) => (
        <motion.div
          key={link.href}
          initial={{
            opacity: 0,
            x: idx % 2 === 0 ? -100 : 100,
            filter: "blur(16px)",
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            scale: 1
          }}
          whileHover={{
            filter: "blur(1.5px)",
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          transition={{
            delay: 0.2 + (idx * 0.1),
            x: {
              type: "spring",
              damping: 25,
              stiffness: 120,
              duration: 0.8
            },
            filter: {
              duration: 0.8,  // Matched with slide duration
              ease: "easeOut"
            },
            opacity: {
              duration: 0.8,
              ease: "easeOut"
            },
            scale: {
              duration: 0.8,
              ease: "easeOut"
            }
          }}
        >
          <Button
            variant="ghost"
            className="w-full justify-center rounded-lg h-12 text-center px-2 transition-all duration-200"
            asChild
          >
            <a href={link.href}>
              <span className="text-lg font-medium tracking-tight">
                {link.label}
              </span>
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
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-transparent relative"
        >
          <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 }
            }}
            transition={springTransition}
          >
            <Menu className="h-6 w-6" />
          </motion.div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] rounded-t-[20px] bg-background/80 backdrop-blur-xl">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={springTransition}
          className="h-full pt-8 px-4 pb-6 flex flex-col"
        >
          <div className="flex-1 flex flex-col">
            {navSections.map((section, index) => (
              <NavSection key={section.title} {...section} index={index} />
            ))}
          </div>
          <SystemStatus />
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
};