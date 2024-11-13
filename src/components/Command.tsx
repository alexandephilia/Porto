import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Terminal, Calculator, ArrowLeftRight } from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const calculateExpression = (input: string): string | null => {
    try {
        // Remove whitespace
        const cleanInput = input.replace(/\s+/g, '');

        // Basic validation
        if (!cleanInput.match(/^[\d+\-*/.()%\s]+$/)) return null;

        // Handle percentage calculations
        if (cleanInput.includes('%')) {
            const parts = cleanInput.split('%');
            if (parts.length === 2) {
                const num = parseFloat(parts[0]);
                const total = parseFloat(parts[1]);
                return String((num / 100) * total);
            }
            return null;
        }

        // Evaluate the expression
        // eslint-disable-next-line no-eval
        const result = eval(cleanInput);
        return Number.isFinite(result) ? String(result) : null;
    } catch {
        return null;
    }
};

const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
            className
        )}
        shouldFilter={false}
        filter={(value, search) => {
            if (!search) return 1
            return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
        }}
        {...props}
    />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
    const dialogRef = React.useRef<HTMLDivElement>(null);

    // Add this function to detect mobile devices
    const isMobile = () => {
        if (typeof window === 'undefined') return false;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Handle ESC key
    React.useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && props.open) {
                event.preventDefault();
                props.onOpenChange?.(false);
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [props.open, props.onOpenChange]);

    return (
        <DialogPrimitive.Root open={props.open} onOpenChange={props.onOpenChange}>
            <DialogPrimitive.Portal>
                <AnimatePresence>
                    {props.open && (
                        <DialogPrimitive.Content asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 z-50 min-h-full w-full overflow-hidden bg-background/80 backdrop-blur-sm p-0 shadow-lg flex items-center justify-center"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        props.onOpenChange?.(false);
                                    }
                                }}
                            >
                                <motion.div
                                    ref={dialogRef}
                                    initial={{
                                        opacity: 0,
                                        y: -20,
                                        scale: 0.95,
                                        filter: "blur(12px)"
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        filter: "blur(0px)"
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: 20,
                                        scale: 0.95,
                                        filter: "blur(12px)"
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.1,
                                        ease: [0.32, 0.72, 0, 1],
                                    }}
                                    className="w-full max-w-[90%] sm:max-w-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <motion.div
                                        className="rounded-lg border bg-popover shadow-lg overflow-hidden"
                                        initial={{ filter: "blur(12px)" }}
                                        animate={{ filter: "blur(0px)" }}
                                        exit={{ filter: "blur(12px)" }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.2
                                        }}
                                    >
                                        <Command
                                            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
                                            shouldFilter={!isMobile()}
                                        >
                                            {children}
                                        </Command>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </DialogPrimitive.Content>
                    )}
                </AnimatePresence>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
CommandDialog.displayName = "CommandDialog"

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
        isCalculatorMode?: boolean;
        isConverterMode?: boolean;
        onExternalValueChange?: (value: string) => void;
        value?: string;
    }
>(({ className, isCalculatorMode, isConverterMode, onExternalValueChange, value, ...props }, ref) => {
    const [wasCleared, setWasCleared] = React.useState(false);

    const handleValueChange = (newValue: string) => {
        if (newValue === '') {
            setWasCleared(true);
            setTimeout(() => setWasCleared(false), 0);
        }
        onExternalValueChange?.(newValue);
    };

    return (
        <div className="flex items-center border-b px-3 relative" cmdk-input-wrapper="">
            {isCalculatorMode ? (
                <Calculator className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            ) : isConverterMode ? (
                <ArrowLeftRight className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            ) : (
                <Terminal className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            )}
            <CommandPrimitive.Input
                ref={ref}
                value={value}
                className={cn(
                    "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 pr-12",
                    className
                )}
                onValueChange={handleValueChange}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                data-lpignore="true"
                {...props}
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-60">
                ESC
            </kbd>
        </div>
    );
});
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
        {...props}
    />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className="py-6 text-center text-sm"
        {...props}
    />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
            className
        )}
        {...props}
    />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 h-px bg-border", className)}
        {...props}
    />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-none select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
            className
        )}
        {...props}
    >
        <motion.div
            variants={{
                hidden: {
                    opacity: 0,
                    x: -20,
                    scale: 0.95,
                    filter: "blur(10px)"
                },
                show: {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: {
                        type: "spring",
                        stiffness: 80, // Reduced for smoother motion
                        damping: 16, // Increased damping for slower movement
                        mass: 1.2, // Slightly increased mass
                        duration: 1.5, // Longer duration
                        velocity: 0.3 // Added lower velocity for smoother motion
                    }
                }
            }}
            initial="hidden"
            animate="show"
            className="flex w-full items-center gap-3"
        >
            {props.children}
        </motion.div>
    </CommandPrimitive.Item>
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                "ml-auto text-xs tracking-widest text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}
CommandShortcut.displayName = "CommandShortcut"

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
} 