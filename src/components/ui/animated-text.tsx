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
      <span className={`font-bold text-black ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <motion.span
      animate={controls}
      className={`font-bold ${className}`}
      style={{
        display: "inline-block",
        backgroundImage: "linear-gradient(to right, #ffffff, rgba(255,255,255,0.5), rgba(255,255,255,0.5), rgba(255,255,255,0.5), #ffffff)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
    >
      {text}
    </motion.span>
  );
}; 