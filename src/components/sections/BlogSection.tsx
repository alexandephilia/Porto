// Import necessary packages and components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, X, Calendar, Clock, Tag, User, Search } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence, MotionProps, useSpring } from "framer-motion";
import { useRef, useCallback, useState, useEffect } from "react";
import { useAnimationOptimizer } from '@/hooks/useAnimationOptimizer';
import { useOptimizedIntersection } from '@/hooks/useOptimizedIntersection';
import { FocusScope } from '@react-aria/focus';
import { useKeyboard } from '@react-aria/interactions';

// Update the Post interface to match new data structure
interface Post {
  title: string;
  preview: string;
  content: {
    introduction: string;
    sections: {
      heading?: string;
      paragraphs: string[];
      quote?: string;
    }[];
  };
  date: string;
  readTime: string;
  category: string;
  author: string;
  tags: string[];
}

// Add this type definition near your Post interface
type ColumnPosts = Post[][];

// Update type definitions
interface MotionComponentProps extends MotionProps {
  children?: React.ReactNode;
  className?: string;
}

// Add these variants at the top of your component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    filter: "blur(8px)",
    transition: {
      type: "tween",
      ease: "easeInOut"
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "tween",
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

// Add this function at the top of the component
const scrollToTop = (element: HTMLElement) => {
  if (element) {
    element.scrollTop = 0;
  }
};

const BlogSection = () => {
  // Updated posts data with new fields
  const posts: Post[] = [
    {
      title: "Understanding Modern Web Development",
      preview: "Exploring the latest trends and best practices...",
      content: {
        introduction: "Modern web development has evolved significantly over the past decade, bringing new challenges and opportunities for developers.",
        sections: [
          {
            heading: "The Evolution of Frontend Development",
            paragraphs: [
              "Frontend development has transformed from simple HTML and CSS to complex application architectures. Modern developers need to understand not just the basics, but also complex state management, build tools, and performance optimization techniques.",
              "With the rise of frameworks like React, Vue, and Angular, component-based architecture has become the standard approach to building user interfaces."
            ],
            quote: "The best way to predict the future is to implement it. - Alan Kay"
          },
          {
            heading: "Performance and User Experience",
            paragraphs: [
              "Performance has become a crucial aspect of web development. Users expect fast, responsive applications that work seamlessly across all devices.",
              "Modern performance optimization techniques include code splitting, lazy loading, and various caching strategies."
            ]
          }
        ]
      },
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Web Development",
      author: "G. Alexander",
      tags: ["JavaScript", "React", "Vue", "Angular", "WebAssembly"]
    },
    // Add first new post
    {
      title: "The Philosophy of Software Architecture",
      preview: "Exploring the intersection of philosophical principles and software design patterns...",
      content: {
        introduction: "Software architecture is more than just technical decisions - it's a philosophical endeavor that requires deep thinking about structure, meaning, and purpose. This article explores how philosophical concepts like determinism, dualism, and emergence relate to software design patterns. We'll examine how different architectural styles reflect different worldviews, and how understanding these connections can lead to better design decisions. From microservices to monoliths, every architectural choice carries philosophical implications worth considering.",
        sections: [
          {
            heading: "Determinism",
            paragraphs: [
              "Determinism is the philosophical concept that all events are determined by prior events. In software architecture, this means that every decision made during the design and implementation of a system is determined by prior decisions. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision.",
              "Determinism can be achieved by using a deterministic approach to software architecture. This means that all decisions are made with a clear understanding of the consequences of each decision. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision."
            ],
            quote: "In a deterministic system, the future is not a possibility but an inevitability, shaped entirely by the decisions of the past."
          },
          {
            heading: "Dualism",
            paragraphs: [
              "Dualism is the philosophical concept that there are two fundamental substances in the universe: mind and matter. In software architecture, this means that there are two fundamental components in the universe: code and data. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision.",
              "Dualism can be achieved by using a dualistic approach to software architecture. This means that all decisions are made with a clear understanding of the consequences of each decision. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision."
            ]
          },
          {
            heading: "Emergence",
            paragraphs: [
              "Emergence is the philosophical concept that new structures can emerge from existing structures. In software architecture, this means that new structures can emerge from existing structures. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision.",
              "Emergence can be achieved by using an emergent approach to software architecture. This means that all decisions are made with a clear understanding of the consequences of each decision. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision."
            ]
          }
        ]
      },
      date: "March 20, 2024",
      readTime: "8 min read",
      category: "Philosophy",
      author: "G. Alexander",
      tags: ["Architecture", "Philosophy", "Design Patterns", "System Design", "Theory"]
    },
    // Add second new post
    {
      title: "Quantum Computing: A Developer's Perspective",
      preview: "Understanding quantum computing principles and their implications for future software development...",
      content: {
        introduction: "As quantum computing moves from theory to practice, developers need to understand its fundamental principles and potential impact on software development. This article breaks down key quantum computing concepts like superposition, entanglement, and quantum gates from a developer's perspective. We'll explore current quantum programming frameworks, discuss potential applications in cryptography and optimization, and examine how quantum computing might reshape our approach to algorithm design and problem-solving in the coming decades.",
        sections: [
          {
            heading: "Superposition",
            paragraphs: [
              "Superposition is the fundamental concept of quantum mechanics. It states that a quantum system can exist in multiple states simultaneously. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision.",
              "Superposition can be achieved by using a superposition approach to quantum computing. This means that all decisions are made with a clear understanding of the consequences of each decision. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision."
            ],
            quote: "The beauty of quantum superposition lies not in being everything at once, but in the possibility of becoming anything until observed."
          },
          {
            heading: "Entanglement",
            paragraphs: [
              "Entanglement is the phenomenon where two particles become correlated in such a way that the state of one particle is dependent on the state of the other particle. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision.",
              "Entanglement can be achieved by using an entanglement approach to quantum computing. This means that all decisions are made with a clear understanding of the consequences of each decision. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision."
            ]
          },
          {
            heading: "Quantum Gates",
            paragraphs: [
              "Quantum gates are the basic building blocks of quantum computing. They are used to manipulate the state of a quantum system. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision.",
              "Quantum gates can be achieved by using a quantum gates approach to quantum computing. This means that all decisions are made with a clear understanding of the consequences of each decision. This can lead to better design decisions because it ensures that all decisions are made with a clear understanding of the consequences of each decision."
            ],
            quote: "If classical gates are the alphabet of traditional computing, quantum gates are the poetry of quantum computation - they speak in possibilities rather than certainties."
          }
        ]
      },
      date: "March 25, 2024",
      readTime: "10 min read",
      category: "Science",
      author: "G. Alexander",
      tags: ["Quantum", "Computing", "Future Tech", "Programming", "Physics"]
    },
    // ... other posts
  ];

  // New state management
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [columns, setColumns] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const modalRef = useRef<HTMLDivElement>(null);

  // Existing refs and optimization
  const sectionRef = useRef<HTMLElement>(null);
  const optimize = useAnimationOptimizer(sectionRef);

  // Add scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  });

  // Add smooth progress spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Add blur filter transform
  const blurFilter = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  // Column management
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 1024) setColumns(2);
      else setColumns(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter management
  useEffect(() => {
    const filtered = posts.filter(post =>
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.introduction.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || post.category === selectedCategory)
    );
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  // Categories computation
  const categories = Array.from(new Set(posts.map(post => post.category)));

  // Column distribution
  const columnPosts: ColumnPosts = Array.from({ length: columns }, (_, i) =>
    filteredPosts.filter((_, index) => index % columns === i)
  );

  // Add these new refs and state
  const initialFocusRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  // Add focus management when modal opens/closes
  useEffect(() => {
    if (selectedPost) {
      // Store the currently focused element
      lastActiveElement.current = document.activeElement as HTMLElement;

      // Focus the modal after it opens
      requestAnimationFrame(() => {
        initialFocusRef.current?.focus();
      });

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus when modal closes
      lastActiveElement.current?.focus();

      // Restore body scroll
      document.body.style.overflow = 'unset';
    }
  }, [selectedPost]);

  // Handle escape key
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && selectedPost) {
      setSelectedPost(null);
    }
  }, [selectedPost]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // Add this useEffect to handle scroll locking
  useEffect(() => {
    if (selectedPost) {
      // Store current scroll position
      const scrollY = window.scrollY;

      // Add styles to prevent body scroll while maintaining position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';

      return () => {
        // Remove styles and restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [selectedPost]);

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      style={{
        filter: blurFilter,
        willChange: "transform"
      }}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Latest Articles</h2>

      {/* Search and Filter Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <div className="relative">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            data-magnetic="true"
            data-hover-effect="true"
            className="w-full px-4 py-2 pr-10 rounded-md border border-input bg-background text-foreground 
              focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200
              hover:border-primary/50 relative cursor-none select-none
              appearance-none"
          >
            <option value="" data-hover-effect="true">All Categories</option>
            {categories.map(category => (
              <option
                key={category}
                value={category}
                data-hover-effect="true"
              >
                {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {columnPosts.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-8">
            {column.map((post, postIndex) => (
              <motion.div
                key={post.title}
                initial={{
                  opacity: 0,
                  y: -20,
                  filter: "blur(10px)",
                  transform: "translateZ(0)" // Force GPU acceleration
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.7,
                    delay: postIndex * 0.1,
                    ease: [0.21, 0.47, 0.32, 0.98], // Custom easing
                    filter: {
                      duration: 0.4,
                      delay: postIndex * 0.1 + 0.2 // Slightly delayed blur effect
                    }
                  }
                }}
                viewport={{
                  once: true,
                  margin: "-100px"
                }}
                className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden will-change-transform"
              >
                {/* Post Card Content */}
                <div className="p-6 flex flex-col h-[280px]">
                  {/* Top section with category and date */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>

                  {/* Title and preview with controlled height */}
                  <div className="flex-1 overflow-hidden">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-4">{post.preview}</p>
                  </div>

                  {/* Bottom section - will stay at bottom */}
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-border">
                    <div className="flex items-center text-xs">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
                        <Book className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      Read more
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-4 z-[60] overflow-y-auto overscroll-none touch-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedPost(null);
              }
            }}
          >
            <FocusScope contain restoreFocus autoFocus>
              <motion.div
                ref={(el) => {
                  if (el) {
                    modalRef.current = el;
                    initialFocusRef.current = el;
                    // Ensure modal content starts from top when opened
                    scrollToTop(el);
                  }
                }}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="bg-card text-card-foreground rounded-lg shadow-lg overflow-y-auto w-full sm:max-w-3xl 
                  min-h-screen sm:min-h-0 sm:max-h-[80vh] flex flex-col focus:outline-none 
                  relative mt-0 sm:mt-4"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onAnimationComplete={() => {
                  // Ensure modal is scrolled to top after animation
                  if (modalRef.current) {
                    scrollToTop(modalRef.current);
                  }
                }}
              >
                {/* Modal Header - Make it sticky */}
                <motion.div
                  variants={itemVariants}
                  className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 sm:px-6 sm:py-4
                    flex justify-between items-center"
                >
                  <h2
                    id="modal-title"
                    className="text-xl sm:text-2xl font-bold tracking-tight line-clamp-1"
                  >
                    {selectedPost.title}
                  </h2>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-muted-foreground hover:text-foreground focus:outline-none 
                      focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm p-1 ml-2"
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </motion.div>

                {/* Modal Content - Update padding and spacing */}
                <motion.div
                  className="p-4 sm:p-6 flex-grow"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Modal Header */}
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-between items-start mb-3 sm:mb-4"
                  >
                    <h2
                      id="modal-title"
                      className="text-xl sm:text-2xl font-bold tracking-tight"
                    >
                      {selectedPost.title}
                    </h2>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm p-1"
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </motion.div>

                  {/* Post Metadata */}
                  <motion.div
                    variants={containerVariants}
                    className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-[10px] sm:text-xs text-muted-foreground border-b border-border pb-2 sm:pb-3"
                  >
                    {[
                      { icon: <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />, text: selectedPost.author },
                      { icon: <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />, text: selectedPost.date },
                      { icon: <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />, text: selectedPost.readTime },
                      { icon: <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />, text: selectedPost.category }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex items-center"
                      >
                        {item.icon}
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Introduction */}
                  <motion.p
                    variants={itemVariants}
                    className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6"
                  >
                    {selectedPost.content.introduction}
                  </motion.p>

                  {/* Content Sections */}
                  <motion.div variants={containerVariants}>
                    {selectedPost.content.sections.map((section, sectionIndex) => (
                      <motion.div
                        key={sectionIndex}
                        variants={containerVariants}
                        className="space-y-2 sm:space-y-3 mb-6"
                      >
                        {section.heading && (
                          <motion.h3
                            variants={itemVariants}
                            className="text-base sm:text-lg font-semibold tracking-tight mt-4 sm:mt-6 mb-2 sm:mb-3"
                          >
                            {section.heading}
                          </motion.h3>
                        )}

                        {section.paragraphs.map((paragraph, pIndex) => (
                          <motion.p
                            key={pIndex}
                            variants={itemVariants}
                            className="text-xs sm:text-sm leading-relaxed"
                          >
                            {paragraph}
                          </motion.p>
                        ))}

                        {section.quote && (
                          <motion.blockquote
                            variants={itemVariants}
                            className="border-l-3 border-primary pl-4 sm:pl-6 my-6 sm:my-8 italic text-xs sm:text-sm relative mx-8 sm:mx-12 pr-4 sm:pr-6 max-w-[85%]"
                          >
                            <span className="absolute -left-1 -top-3 text-primary text-xl sm:text-2xl leading-none" style={{ fontFamily: '"Libre Bodoni", serif', fontStyle: 'italic' }}>"</span>
                            <p className="px-2" style={{ fontFamily: '"Libre Bodoni", serif', fontStyle: 'italic' }}>{section.quote}</p>
                            <span className="absolute text-primary text-xl sm:text-2xl leading-none" style={{ fontFamily: '"Libre Bodoni", serif', fontStyle: 'italic', right: '-4px', bottom: '-8px' }}>"</span>
                          </motion.blockquote>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Tags */}
                  <motion.div
                    variants={containerVariants}
                    className="flex flex-wrap gap-1 sm:gap-1.5 pt-2 sm:pt-3 border-t border-border"
                  >
                    {selectedPost.tags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        variants={itemVariants}
                        className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium 
                          bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            </FocusScope>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default BlogSection;