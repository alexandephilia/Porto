import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatePresence } from "framer-motion";

type TimerMode = 'work' | 'break';

export const PomodoroCard = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [taskInput, setTaskInput] = useState('');
    const [currentTask, setCurrentTask] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    const blurValue = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!cardRef.current || !isHovered) return;
            const rect = cardRef.current.getBoundingClientRect();
            setPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isHovered]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Switch modes when timer ends
            setMode(prev => prev === 'work' ? 'break' : 'work');
            setTimeLeft(mode === 'work' ? 5 * 60 : 25 * 60);
            setIsRunning(false);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleReset = () => {
        setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
        setIsRunning(false);
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && taskInput.trim()) {
            setCurrentTask(taskInput);
            setTaskInput('');
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
    };

    return (
        <motion.div
            ref={cardRef}
            style={{ filter: blurValue }}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
        >
            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative overflow-hidden group hover:shadow-lg transition-all duration-500 border border-black/20 ring-1 ring-black/5 dark:border-white/10 hover:border-black/30 hover:ring-black/10"
                style={{
                    minHeight: '320px',
                    padding: '1.5rem',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                }}
            >
                <AnimatePresence>
                    {currentTask && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(4px)" }}
                            className="absolute top-6 right-6 max-w-[200px]"
                        >
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                                <p className="text-sm truncate">{currentTask}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        {mode === 'work' ? (
                            <>
                                <Brain className="h-4 w-4" />
                                <span className="text-sm font-medium">Podomoro</span>
                            </>
                        ) : (
                            <>
                                <Coffee className="h-4 w-4" />
                                <span className="text-sm font-medium">Break Time</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center mb-6">
                    <span className="text-6xl font-mono font-bold">
                        {formatTime(timeLeft)}
                    </span>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={toggleTimer}
                        data-magnetic="true"
                        className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors pointer-events-auto"
                    >
                        {isRunning ? (
                            <Pause className="h-6 w-6" />
                        ) : (
                            <Play className="h-6 w-6" />
                        )}
                    </button>
                    <button
                        onClick={handleReset}
                        data-magnetic="true"
                        className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors pointer-events-auto"
                    >
                        <RotateCcw className="h-6 w-6" />
                    </button>
                </div>

                <div className="mt-6 w-[90%] sm:w-[80%] max-w-[260px] sm:max-w-[300px] mx-auto">
                    <div className="relative">
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="What are you working on?"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 text-[10px] sm:text-sm text-center transition-all duration-300"
                            style={{
                                fontSize: `${Math.max(9, Math.min(12, 14 - taskInput.length / 10))}px`
                            }}
                        />
                    </div>
                </div>

                {isHovered && (
                    <div
                        className="absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none"
                        style={{
                            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`
                        }}
                    />
                )}
            </Card>
        </motion.div>
    );
};