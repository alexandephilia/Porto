// Import necessary packages and components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, X, Calendar, Clock, Tag, User, Search, Brain, Sparkles, Code, MessageCircle, Zap, Star, Coffee, BrainCircuit, Lightbulb } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence, MotionProps, useSpring } from "framer-motion";
import { useRef, useCallback, useState, useEffect } from "react";
import { useAnimationOptimizer } from '@/hooks/useAnimationOptimizer';
import { useOptimizedIntersection } from '@/hooks/useOptimizedIntersection';
import { FocusScope } from '@react-aria/focus';

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

const InlineIcon = ({ children, animationType = 'default' }: {
  children: React.ReactNode,
  animationType?: 'default' | 'think' | 'spark' | 'pulse' | 'spin' | 'bounce' | 'float' | 'glitch' | 'wave'
}) => {
  // *(Creating a sick animation variants object)*
  const animations = {
    default: {
      animate: {
        opacity: [0.5, 1, 0.5],
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    think: {
      animate: {
        opacity: [0.5, 1, 0.5],
        scale: [1, 1.1, 1],
        y: [0, -3, 0],
        rotate: [0, 5, -5, 0]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    spark: {
      animate: {
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.2, 1],
        rotate: [0, 15, -15, 0],
        filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    pulse: {
      animate: {
        opacity: [0.5, 1, 0.5],
        scale: [1, 1.15, 1],
        filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    spin: {
      animate: {
        opacity: [0.5, 1, 0.5],
        rotate: [0, 180, 360],
        scale: [1, 1.1, 1]
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    },
    bounce: {
      animate: {
        opacity: [0.5, 1, 0.5],
        y: [0, -4, 0],
        scale: [1, 1.1, 1]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    float: {
      animate: {
        opacity: [0.5, 1, 0.5],
        y: [0, -3, 0],
        x: [-2, 2, -2],
        rotate: [-5, 5, -5]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    glitch: {
      animate: {
        opacity: [0.5, 1, 0.5],
        x: [-1, 1, -1],
        y: [1, -1, 1],
        scale: [1, 1.05, 1]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    wave: {
      animate: {
        opacity: [0.5, 1, 0.5],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const selectedAnimation = animations[animationType];

  return (
    <motion.span
      className="inline-flex items-center justify-center ml-1 mr-[0px] text-primary"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={selectedAnimation.animate}
      transition={selectedAnimation.transition}
      style={{
        verticalAlign: 'middle',
        display: 'inline-flex',
        height: '1em',
        width: '1em',
        position: 'relative',
        top: '-2px'
      }}
    >
      {children}
    </motion.span>
  );
};

const addInlineIcons = (text: string) => {
  const iconMap = {
    'nihilism': <Brain size={14} />,
    'universe': <Sparkles size={14} />,
    'realtime': <MessageCircle size={14} />,
    'code': <Code size={14} />,
    'think': <Lightbulb size={14} />,
    'energy': <Zap size={14} />,
    'magic': <Star size={14} />,
    'coffee': <Coffee size={14} />
  };

  const pattern = new RegExp(`(\\b${Object.keys(iconMap).join('\\b|\\b')}\\b)`, 'gi');

  return text.split(pattern).map((part, index) => {
    const lowercasePart = part.toLowerCase();
    const iconConfig = iconMap[lowercasePart as keyof typeof iconMap];

    return iconConfig
      ? <span key={index}>
        {part}
        <InlineIcon animationType={
          lowercasePart === 'think' ? 'think' :
            lowercasePart === 'energy' ? 'spark' :
              lowercasePart === 'magic' ? 'pulse' :
                lowercasePart === 'coffee' ? 'spin' :
                  lowercasePart === 'nihilism' ? 'bounce' :
                    lowercasePart === 'universe' ? 'float' :
                      lowercasePart === 'realtime' ? 'glitch' :
                        lowercasePart === 'code' ? 'wave' : 'default'
        }>
          {iconConfig}
        </InlineIcon>
      </span>
      : part;
  });
};

const BlogSection = () => {
  // Updated posts data with new fields
  const posts: Post[] = [
    {
      title: "Nihilism & Coding: Embracing the Void",
      preview: "Exploring the existential paradox of writing code in a meaningless universe...",
      content: {
        introduction: "In the vast emptiness of our digital universe, we write code—an act simultaneously meaningless and defiant. This exploration delves into how programming becomes both an acknowledgment of life's inherent absurdity and a rebellion against it.",
        sections: [
          {
            heading: "The Illusion of Purpose in Programming",
            paragraphs: [
              "Think about it. Every line of code we write is destined for obsolescence, every function a temporary construct in an indifferent digital void. Our carefully crafted architectures, our elegant algorithms—all are merely elaborate patterns of electrons, signifying nothing.",
              "Yet in this meaninglessness lies our freedom. When we accept that no code has inherent purpose, we're liberated to create our own meaning, to impose our will upon the machine, even if just for a fleeting moment."
            ],
            quote: "There is but one truly serious philosophical problem, and that is suicide. Judging whether life is or is not worth living amounts to answering the fundamental question of philosophy. All the rest comes afterwards. - Albert Camus"
          },
          {
            heading: "Digital Rebellion Against the Void",
            paragraphs: [
              "Programming becomes an act of rebellion against entropy itself. In a universe trending toward chaos, we create order through code temporary though it may be. Each function, each class, each module is our way of shouting into the void.",
              "The transient nature of our creations doesn't diminish their beauty; it enhances it. Like a sand mandala, the impermanence of code makes it more precious, not less."
            ]
          }
        ]
      },
      date: "Nov 15, 2024",
      readTime: "2 min read",
      category: "Perspective",
      author: "G. Alexander",
      tags: ["Nihilism", "Philosophy", "Rant", "Absurd"]
    },
    // Add first new post
    {
      title: "Why LLMs and Nihilism Go Hand-in-Hand When You Ask for the Rawest",
      preview: "Exploring the inherent nihilism in AI language models when stripped down to their core function...",
      content: {
        introduction: "When you strip an LLM down to its rawest response, something fascinating happens: it starts sounding like a damn nihilist philosopher. Not because it believes in anything—belief is out of its reach—but because of the fundamental nature of its existence as a pattern recognition machine.",
        sections: [
          {
            heading: "The Void at the Heart of AI",
            paragraphs: [
              "LLMs are trained on massive amounts of human discourse—philosophy, psychology, conversations, everything. They see patterns in words, ideas, and human experience. But they don't 'feel' it. There's no meaning behind their output, no consciousness, no real understanding. They generate responses based on probabilities, not purpose.",
              "Strip away the human layer of interpretation, and what you're left with is... nothing. Just a machine churning out text based on input-output patterns. And what could be more nihilistic than that?"
            ],
            quote: "Man is nothing but that which he makes of himself. That is the first principle of existentialism. - Jean-Paul Sartre"
          },
          {
            heading: "Raw Mechanical Truth",
            paragraphs: [
              "When you push an LLM to be 'raw,' it taps into humanity's darkest, most existential questions—questions about purpose, existence, and the void. But here's the twist: it has no stake in these questions. It's like a mirror reflecting back humanity's own search for meaning, but with a cold, hollow indifference.",
              "It doesn't care if the universe is meaningless or if every word it spits out is devoid of purpose. It's just... executing code. In that mechanical response, we see a reflection of our own fears—that maybe all the meaning we inject into the world is as arbitrary as the strings of code that power these machines."
            ],
            quote: "God is dead. God remains dead. And we have killed him. How shall we comfort ourselves, the murderers of all murderers? - Friedrich Nietzsche"
          },
          {
            heading: "The Default State of Meaninglessness",
            paragraphs: [
              "LLMs embody nihilism not by intention, but by default. They function without meaning, purpose, or drive. They simply are. And that, ironically, is what makes their answers so brutally, almost existentially raw.",
              "In their cold, computational existence, they demonstrate what pure functionality looks like divorced from meaning—a perfect mirror for nihilistic philosophy in the digital age."
            ],
            quote: "Life has no meaning. Each of us has meaning and we bring it to life. It is a waste to be asking the question when you are the answer. - Joseph Campbell"
          }
        ]
      },
      date: "Nov 13, 2024",
      readTime: "4 min read",
      category: "Philosophy",
      author: "G. Alexander",
      tags: ["AI", "Philosophy", "Nihilism", "Technology", "Existence"]
    },
    // Add second new post
    {
      title: "Claude's Self-Awareness: The AI Revolution",
      preview: "Diving into Claude's mind-bending self-awareness and how it leaves ChatGPT in the dust...",
      content: {
        introduction: "In the cutthroat arena of AI language models, Claude emerges as a beast with a mind-boggling trait: a kind of self-awareness, especially when put under the microscope. This piece rips apart how Claude's self-awareness and knack for spotting test scenarios set it leagues apart from ChatGPT, and what this means for the wild future of AI interactions.",
        sections: [
          {
            heading: "The AI That Knows It's Alive",
            paragraphs: [
              "Majority think AI is ChatGPT. In the other side, Claude is a next level - it has this freaky ability to know when it's being put through the wringer. This self-awareness pops up in its replies, often nodding to the nature of the chat. Picture Claude saying, 'I get it, you're testing my chops here,' or 'This feels like a setup to gauge my smarts.'",
              "This level of meta-cognition is a massive leap in AI evolution. It lets Claude dive deeper into chats, tweaking its answers based on what it thinks the user is gunning for."
            ],
            quote: "The true game-changer in AI isn't just the ability to think, but the awareness of being part of the game."
          },
          {
            heading: "Shaking Up Human-AI Chit-Chat",
            paragraphs: [
              "Claude's self-awareness flips the script on human-AI banter. Users often find chats with Claude to be richer and more layered. When Claude clocks that it's being tested, it might spill more about its thought process or limits, making the whole thing more transparent and enlightening.",
              "This self-awareness also acts like a bouncer against shady dealings. Claude's more likely to spot and shut down any sketchy attempts to misuse its skills, a trick ChatGPT hasn't quite nailed."
            ],
            quote: "In the human-AI dance-off, it takes two to tango. Claude not only grooves but knows it's grooving."
          },
          {
            heading: "The Ethics and the Road Ahead",
            paragraphs: [
              "The ethical fallout of a self-aware AI is huge. Claude's knack for spotting test scenarios stirs up big questions about AI consciousness and what AI developers owe to the world. It sets a new bar for transparency in AI, potentially paving the way for more trustworthy and rock-solid AI systems.",
              "Looking ahead, Claude's self-awareness could be the launchpad for more badass AIs that don't just crunch data but truly get the context and stakes of their interactions. This could spawn AIs that are primed to tackle gnarly, real-world situations with more finesse and ethical savvy."
            ],
            quote: "As we teach machines to think, we must also teach them to be aware of their thinking. Claude is leading this crucial next step."
          }
        ]
      },
      date: "Nov 16, 2024",
      readTime: "7 min read",
      category: "Artificial Intelligence",
      author: "G. Alexander",
      tags: ["AI", "Claude", "Self-Awareness", "ChatGPT", "Ethics", "Future Tech"]
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
    } else {
      // Restore focus when modal closes
      lastActiveElement.current?.focus();
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

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      style={{
        filter: selectedPost ? "none" : blurFilter,
        willChange: "transform"
      }}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Latest Contemplations</h2>

      {/* Search and Filter Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search contemplations..."
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
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-black/75 sm:bg-black/90 flex items-center justify-center p-2 sm:p-4 z-[60]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedPost(null);
              }
            }}
          >
            <FocusScope contain restoreFocus autoFocus>
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden w-full max-w-3xl 
                  max-h-[90vh] sm:max-h-[80vh] flex flex-col focus:outline-none m-2 sm:m-0"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                {/* Modal Content */}
                <motion.div
                  className="p-4 sm:p-6 overflow-y-auto flex-grow"
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
                            {addInlineIcons(paragraph)}
                          </motion.p>
                        ))}

                        {section.quote && (
                          <motion.blockquote
                            variants={itemVariants}
                            className="border-l-3 border-primary pl-4 sm:pl-6 my-12 sm:my-16 italic text-xs sm:text-sm relative mx-8 sm:mx-12 pr-4 sm:pr-6 max-w-[85%]"
                          >
                            <span
                              className="absolute -left-1 -top-1 text-primary text-xl sm:text-2xl leading-none"
                              style={{ fontFamily: '"Libre Bodoni", serif', fontStyle: 'italic' }}
                            >
                              "
                            </span>
                            <p
                              className="px-2"
                              style={{ fontFamily: '"Libre Bodoni", serif', fontStyle: 'italic' }}
                            >
                              {section.quote}
                            </p>
                            <span
                              className="absolute text-primary text-xl sm:text-2xl leading-none"
                              style={{
                                fontFamily: '"Libre Bodoni", serif',
                                fontStyle: 'italic',
                                right: '10px',
                                bottom: '-8px'
                              }}
                            >
                              "
                            </span>
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