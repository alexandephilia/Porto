import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useAnimationControls } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Grain component
const Grain = ({ opacity = 0.8 }) => {
    const controls = useAnimationControls();
    const { theme } = useTheme();

    useEffect(() => {
        controls.start({
            x: ["0%", "-5%", "-15%", "7%", "-5%", "-15%", "15%", "0%", "3%", "-10%"],
            y: ["0%", "-10%", "5%", "-25%", "25%", "10%", "0%", "15%", "35%", "10%"],
            transition: {
                duration: 8,
                ease: "linear",
                repeat: Infinity,
            }
        });
    }, [controls]);

    return (
        <div style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 9999,
            overflow: "hidden",
            willChange: "transform",
            transform: "translateZ(0)"
        }}>
            <motion.div
                animate={controls}
                style={{
                    backgroundSize: "64px 64px",
                    backgroundRepeat: "repeat",
                    background: theme === 'dark'
                        ? "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')"
                        : "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
                    opacity: theme === 'dark' ? opacity : opacity * 0.8,
                    inset: "-200%",
                    width: "400%",
                    height: "400%",
                    position: "absolute",
                    filter: theme === 'dark'
                        ? 'none'
                        : 'invert(1) brightness(0.8)',
                    backfaceVisibility: "hidden",
                    perspective: 1000,
                    transformStyle: "preserve-3d"
                }}
            />
        </div>
    );
};

interface ResearchLink {
    title: string;
    description: string;
    url: string;
    category: string;
    tags: string[];
}

const researchLinks: ResearchLink[] = [
    {
        title: "Anthropic",
        description: "Explore Claude's capabilities in reasoning, analysis, and coding assistance.",
        url: "https://claude.ai",
        category: "AI Assistants",
        tags: ["Claude", "Close Source", "Research"]
    },
    {
        title: "OpenAI",
        description: "Latest developments in GPT's large language models and their applications.",
        url: "https://openai.com/gpt-4",
        category: "Language Models",
        tags: ["GPT", "Close Source", "Research", "Memories", "Reasoning"]
    },
    {
        title: "DeepSeek",
        description: "Powerful AI model with 236B parameters and 64K context length. Specializes in math, code, and reasoning with impressive benchmark results.",
        url: "https://www.deepseek.com",
        category: "AI Models",
        tags: ["Open Source", "Math", "Coding", "Reasoning"]
    },
    {
        title: "Mistral",
        description: "Open and portable generative AI offering cutting-edge models. Features customization and multi-deployment options.",
        url: "https://mistral.ai",
        category: "Open Source AI",
        tags: ["Open Source", "Customizable", "Multi-deployment"]
    },
];

// Update TerminalWindow component with green borders
const TerminalWindow = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-lg border border-green-400/30 bg-black/60 backdrop-blur-sm overflow-hidden relative">
        <div className="h-8 border-b border-green-400/30 flex items-center px-4 bg-black/20">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
        </div>
        <div className="relative">
            {children}
        </div>
    </div>
);



// Update TypewriterText component to handle width properly
const TypewriterText = ({ text, onComplete, className = "" }: {
    text: string;
    onComplete?: () => void;
    className?: string;
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setDisplayedText(""); // Reset text when component mounts
        setIsTyping(true);
        const chars = text.split('');
        let currentIndex = 0;

        const timer = setInterval(() => {
            if (currentIndex < chars.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
                onComplete?.();
            }
        }, 50);

        return () => clearInterval(timer);
    }, [text, onComplete]);

    return (
        <span className={`inline-block ${className}`}>
            {displayedText}
            {isTyping && (
                <span className="border-r-2 border-green-400 animate-blink ml-[1px]">&nbsp;</span>
            )}
        </span>
    );
};

// Update LoadingAnimation component
const LoadingAnimation = ({ onComplete }: { onComplete: () => void }) => {
    const [dots, setDots] = useState("");
    const [currentLine, setCurrentLine] = useState(0);

    const loadingLines = [
        "Initializing terminal session",
        "Establishing secure connection",
        "Loading AI research data",
        "Mounting research directory",
        "Ready"
    ];

    useEffect(() => {
        const dotsTimer = setInterval(() => {
            setDots(d => d.length < 3 ? d + "." : "");
        }, 200);

        const lineTimer = setTimeout(() => {
            if (currentLine < loadingLines.length - 1) {
                setCurrentLine(l => l + 1);
                setDots("");
            } else {
                setTimeout(onComplete, 500);
            }
        }, 1500);

        return () => {
            clearInterval(dotsTimer);
            clearTimeout(lineTimer);
        };
    }, [currentLine, onComplete]);

    return (
        <div className="text-green-400/80 space-y-1">
            {loadingLines.slice(0, currentLine + 1).map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="text-green-400/60">$</span>
                    <motion.span
                        initial={{ filter: 'blur(4px)', opacity: 0 }}
                        animate={{ filter: 'blur(0px)', opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {line}{i === currentLine ? dots : ""}
                        {i !== currentLine && <span className="text-green-400 ml-2">✓</span>}
                    </motion.span>
                </div>
            ))}
        </div>
    );
};

const AIResearchPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    return (
        <div className="min-h-screen bg-black/50 text-green-400 font-mono">
            <Grain opacity={0.08} />

            <nav className="fixed w-full top-0 z-50">
                <div className="bg-black/80 backdrop-blur-sm border-b border-white/20">
                    <div className="container max-w-5xl flex h-16 items-center">
                        <Link to="/">
                            <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <TypewriterText
                            text="~/ai-research $"
                            className="ml-4 text-xl text-white"
                        />
                    </div>
                </div>
            </nav>

            <div className="container max-w-5xl pt-24 pb-16">
                {isLoading ? (
                    <TerminalWindow>
                        <div className="p-6">
                            <LoadingAnimation onComplete={() => {
                                setIsLoading(false);
                                setTimeout(() => setShowContent(true), 100);
                            }} />
                        </div>
                    </TerminalWindow>
                ) : (
                    <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                        {researchLinks.map((link, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: index * 0.3,
                                    duration: 0.5,
                                    ease: "easeOut"
                                }}
                                className="mb-6"
                            >
                                <TerminalWindow>
                                    <div className="p-6 relative">
                                        <div className="flex items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="group flex items-center gap-2 min-w-0 flex-1">
                                                        <span className="text-green-400/60 shrink-0 group-hover:text-green-400/80 transition-colors">$</span>
                                                        <TypewriterText
                                                            text={link.title}
                                                            className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors"
                                                        />
                                                    </div>
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-400/80 hover:text-green-300 transition-colors ml-4"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </div>
                                                <div className="mt-4 text-green-300/90 bg-black/20 p-2 rounded">
                                                    <TypewriterText
                                                        text={link.description}
                                                        className="group-hover:text-green-300 transition-colors"
                                                    />
                                                </div>
                                                <div className="flex gap-2 mt-4 flex-wrap">
                                                    {link.tags.map((tag, tagIndex) => (
                                                        <motion.div
                                                            key={tagIndex}
                                                            initial={{
                                                                opacity: 0,
                                                                filter: 'blur(4px)',
                                                                x: -20
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                filter: 'blur(0px)',
                                                                x: 0
                                                            }}
                                                            transition={{
                                                                duration: 0.5,
                                                                delay: tagIndex * 0.1 + 0.5, // Add delay based on tag index + base delay
                                                                ease: "easeOut"
                                                            }}
                                                        >
                                                            <TypewriterText
                                                                text={tag}
                                                                className="text-xs border border-green-400/30 px-2 py-0.5 rounded-sm bg-black/20 group-hover:text-green-300 transition-colors"
                                                            />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TerminalWindow>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIResearchPage; 