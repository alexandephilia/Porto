import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedGradientText = ({ text, className = "" }: AnimatedTextProps) => {
  const controls = useAnimationControls();
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      controls.start({
        backgroundPosition: ["0% 50%", "-200% 50%"],
        transition: {
          duration: 3,
          ease: "linear",
          repeat: Infinity,
        }
      });
    }
  }, [controls, theme]);

  if (theme === 'light') {
    return (
      <div className={`font-bold text-black ${className}`}>
        {text}
      </div>
    );
  }

  return (
    <motion.div
      animate={controls}
      className={`font-bold ${className}`}
      style={{
        backgroundImage: "linear-gradient(to right, #ffffff, #6b7280, #6b7280, #6b7280, #ffffff)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textFillColor: "transparent",
      }}
    >
      {text}
    </motion.div>
  );
}; 