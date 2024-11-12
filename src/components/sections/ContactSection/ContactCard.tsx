import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface ContactCardProps {
  title: string;
  icon: LucideIcon;
  value: string;
  color: string;
  delay?: number;
  href: string;
}

export const ContactCard = ({ title, icon: Icon, value, color, delay = 0, href }: ContactCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 1, 1, 0.3]
  );

  const y = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [50, 0, 0, 50]
  );

  const blur = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  return (
    <motion.div
      ref={cardRef}
      style={{
        opacity,
        y,
        filter: blur,
        willChange: "transform"
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
    >
      <a href={href} className="block">
        <Card className={`group hover:blur-[1px] transition-all ${color} cursor-pointer w-full`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {value}
            </p>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
};