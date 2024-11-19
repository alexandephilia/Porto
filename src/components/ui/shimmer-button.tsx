import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ShimmerButtonProps {
    children: React.ReactNode;
    className?: string;
}

export const ShimmerButton = ({ children, className = "" }: ShimmerButtonProps) => {
    const [isNear, setIsNear] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const isNearButton = x >= -50 && x <= rect.width + 50 && y >= -50 && y <= rect.height + 50;

                setIsNear(isNearButton);
                if (isNearButton) {
                    setCursorPosition({ x, y });
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <motion.div
            ref={buttonRef}
            className={`relative p-[1px] rounded-lg overflow-hidden ${className}`}
        >
            {/* Glow effect */}
            <motion.div
                className="absolute inset-0"
                style={{
                    opacity: isNear ? 1 : 0,
                    background: `radial-gradient(circle 150px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255,255,255,0.4), transparent 50%)`,
                    pointerEvents: 'none',
                }}
                transition={{ opacity: { duration: 0.3 } }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}; 