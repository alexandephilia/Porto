// Import necessary packages and components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useCallback } from "react";
import { useAnimationOptimizer } from '@/hooks/useAnimationOptimizer';
import { useOptimizedIntersection } from '@/hooks/useOptimizedIntersection';

const BlogSection = () => {
  // Sample blog posts data
  const posts = [
    {
      title: "Understanding Modern Web Development",
      preview: "Exploring the latest trends and best practices...",
      date: "March 2024",
      readTime: "5 min read",
    },
    // Add more blog posts here
    {
      title: "Mastering React Hooks",
      preview: "A deep dive into React Hooks and how to use them effectively...",
      date: "April 2024",
      readTime: "7 min read",
    },
    {
      title: "CSS Grid vs. Flexbox",
      preview: "When to use CSS Grid and Flexbox in your layouts...",
      date: "May 2024",
      readTime: "6 min read",
    },
    {
      title: "TypeScript Best Practices",
      preview: "Essential TypeScript patterns and tips for better code quality...",
      date: "June 2024",
      readTime: "8 min read",
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const optimize = useAnimationOptimizer(sectionRef);
  
  // Create a ref callback that handles both refs
  const handleRef = useCallback((el: HTMLElement | null) => {
    if (el) {
      sectionRef.current = el;
      optimize();
    }
  }, [optimize]);

  // Use the intersection observer separately
  useOptimizedIntersection(() => {
    if (sectionRef.current) {
      optimize();
    }
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const blurValue = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  const opacityValue = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.3]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Controls the delay between each card
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      filter: "blur(10px)",
      transform: "translateZ(0)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transform: "translateZ(0)",
      transition: {
        duration: 0.5,
        ease: "easeOut"
      },
    },
  };

  return (
    <motion.section 
      ref={handleRef}
      className="container py-16"
      style={{
        filter: blurValue,
        opacity: opacityValue,
      }}
    >
      <h2 className="text-3xl font-bold text-left mb-12">Latest Articles</h2>
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {posts.map((post, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
          >
            <Card className="h-full hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{post.title}</CardTitle>
                <div className="flex items-center flex-wrap gap-2 text-sm mt-2">
                  <Book className="h-4 w-4 text-muted-foreground" />
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {post.readTime}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {post.date}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.preview}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default BlogSection;