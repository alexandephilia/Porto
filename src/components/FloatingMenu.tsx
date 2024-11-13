// Import necessary dependencies for animations, UI components, and icons
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, User, Award, Terminal, Mail, Menu, X, Hash, Calculator, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/Command";

type UnitCategory = 'length' | 'weight' | 'temperature';

interface UnitConversion {
  from: string;
  to: string;
  multiplier?: number;
  formula?: (value: number) => number;
}

const unitConversions: Record<UnitCategory, UnitConversion[]> = {
  length: [
    { from: 'km', to: 'miles', multiplier: 0.621371 },
    { from: 'miles', to: 'km', multiplier: 1.60934 },
    { from: 'm', to: 'ft', multiplier: 3.28084 },
    { from: 'ft', to: 'm', multiplier: 0.3048 },
    { from: 'cm', to: 'inch', multiplier: 0.393701 },
    { from: 'inch', to: 'cm', multiplier: 2.54 },
  ],
  weight: [
    { from: 'kg', to: 'lbs', multiplier: 2.20462 },
    { from: 'lbs', to: 'kg', multiplier: 0.453592 },
    { from: 'g', to: 'oz', multiplier: 0.035274 },
    { from: 'oz', to: 'g', multiplier: 28.3495 },
  ],
  temperature: [
    {
      from: 'c', to: 'f',
      formula: (c) => (c * 9 / 5) + 32
    },
    {
      from: 'f', to: 'c',
      formula: (f) => (f - 32) * 5 / 9
    },
  ],
};

const calculatorExamples = [
  "2 + 2",
  "15% of 80",
  "5 × 3",
  "100 ÷ 4",
  "25% of 200",
  "3 × (4 + 2)",
  "50 + 50",
  "8 × 7",
  "120 - 45",
  "10% of 150"
];

// Add these utility functions at the top
const safeEvaluate = (expression: string): number => {
  // Tokenize the expression
  const tokens = expression.match(/(\d*\.?\d+|[-+*/()])/g) || [];

  // Simple recursive descent parser
  let pos = 0;

  const parseExpression = (): number => {
    let value = parseTerm();

    while (pos < tokens.length) {
      const operator = tokens[pos];
      if (operator !== '+' && operator !== '-') break;
      pos++;
      const nextValue = parseTerm();
      value = operator === '+' ? value + nextValue : value - nextValue;
    }

    return value;
  };

  const parseTerm = (): number => {
    let value = parseNumber();

    while (pos < tokens.length) {
      const operator = tokens[pos];
      if (operator !== '*' && operator !== '/') break;
      pos++;
      const nextValue = parseNumber();
      if (operator === '*') {
        value *= nextValue;
      } else if (operator === '/') {
        if (nextValue === 0) throw new Error('Division by zero');
        value /= nextValue;
      }
    }

    return value;
  };

  const parseNumber = (): number => {
    if (tokens[pos] === '(') {
      pos++;
      const value = parseExpression();
      if (tokens[pos] !== ')') throw new Error('Missing closing parenthesis');
      pos++;
      return value;
    }

    const value = parseFloat(tokens[pos]);
    if (isNaN(value)) throw new Error('Invalid number');
    pos++;
    return value;
  };

  return parseExpression();
};

const converterExamples = [
  "5km to miles",
  "100f to c",
  "2.5kg to lbs",
  "30cm to inch",
  "60miles to km",
  "1000g to oz"
];

const FloatingMenu = () => {
  // State management for menu open/close and animation states
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimatingIcons, setIsAnimatingIcons] = useState(false);
  const [iconsHaveFadedOut, setIconsHaveFadedOut] = useState(false);
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  const [isCalculatorMode, setIsCalculatorMode] = useState(false);
  const [calculationResult, setCalculationResult] = useState<string | null>(null);
  const [isConverterMode, setIsConverterMode] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Handle menu close animation sequence
  const handleClose = async () => {
    setIsAnimatingIcons(true);
    await fadeOutIcons();
    setIconsHaveFadedOut(true);
    setIsOpen(false);
    setIsAnimatingIcons(false);
    setIconsHaveFadedOut(false);
  };

  // Helper function to create delay for icon fade out animation
  const fadeOutIcons = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, menuItems.length * 100 + 200);
    });
  };

  const handleCommandSelect = (href: string) => {
    setShowCommandDialog(false);
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
  };

  // Update the calculation logic in your component
  const calculateResult = (value: string) => {
    try {
      let cleanInput = value.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/×|x/g, '*')
        .replace(/÷/g, '/');

      // Handle percentage calculations
      if (cleanInput.includes('%') && cleanInput.includes('of')) {
        const parts = cleanInput.split(/of/i);
        if (parts.length === 2) {
          const percentage = parseFloat(parts[0].replace('%', ''));
          const total = parseFloat(parts[1]);
          if (!isNaN(percentage) && !isNaN(total)) {
            const result = (percentage / 100) * total;
            setCalculationResult(formatResult(result));
            return;
          }
        }
      }

      // Handle regular calculations
      cleanInput = cleanInput.replace(/([0-9.]+)%/g, '($1/100)');
      const result = safeEvaluate(cleanInput);
      setCalculationResult(formatResult(result));
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculationResult(null);
    }
  };

  const getRandomExample = () => {
    const randomIndex = Math.floor(Math.random() * calculatorExamples.length);
    return calculatorExamples[randomIndex];
  };

  // Define menu items inside the component
  const menuItems = [
    {
      icon: <Terminal className="h-5 w-5" />,
      label: "Command",
      onClick: () => setShowCommandDialog(true),
      command: true
    },
    {
      icon: <Hash className="h-5 w-5" />,
      label: "Twitter",
      href: "https://x.com/0xnihilism",
      external: true
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "About",
      href: "#about",
      external: false
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Contact",
      href: "#contact",
      external: false
    },
    {
      icon: <X className="h-5 w-5" />,
      label: "Close",
      onClick: handleClose
    },
  ];

  // Calculate menu width based on screen size
  const mobileWidth = menuItems.length * 48 + 16;
  const desktopWidth = menuItems.length * 44;

  // Add this helper function at the top of your component
  const formatResult = (result: number, isUnitConversion = false): string => {
    if (!Number.isFinite(result)) return null;

    // Handle very small or very large numbers
    if (Math.abs(result) < 0.000001 || Math.abs(result) > 1e21) {
      return result.toExponential(2);
    }

    // For regular numbers
    if (Number.isInteger(result)) {
      return String(result);
    }

    // Different precision for unit conversions vs calculations
    if (isUnitConversion) {
      // Use 3 decimal places for unit conversions
      const fixedResult = result.toFixed(3);
      // Remove trailing zeros but keep at least 3 decimal places
      return fixedResult.replace(/\.?0+$/, '');
    } else {
      // For calculations, use 2 decimal places
      const fixedResult = result.toFixed(2);
      return fixedResult.endsWith('0') ? fixedResult : fixedResult.replace(/\.?0+$/, '');
    }
  };

  const handleUnitConversion = (input: string): string | null => {
    try {
      const match = input.match(/(\d+\.?\d*)\s*([a-zA-Z]+)\s*(?:to|in)\s*([a-zA-Z]+)/i);
      if (!match) return null;

      const [, valueStr, fromUnit, toUnit] = match;
      const value = parseFloat(valueStr);
      if (isNaN(value)) return null;

      for (const category of Object.keys(unitConversions) as UnitCategory[]) {
        const conversion = unitConversions[category].find(
          c => c.from.toLowerCase() === fromUnit.toLowerCase() &&
            c.to.toLowerCase() === toUnit.toLowerCase()
        );

        if (conversion) {
          const result = conversion.formula
            ? conversion.formula(value)
            : value * conversion.multiplier!;
          return `${formatResult(result, true)} ${toUnit.toLowerCase()}`;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  // Update the input handler to check for both calculator and converter modes
  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (!value.trim()) {
      setIsConverterMode(false);
      setIsCalculatorMode(false);
      setCalculationResult(null);
      setConversionResult(null);
      return;
    }

    // More lenient conversion pattern
    const conversionPattern = /(\d+\.?\d*)\s*([a-zA-Z]+)\s*(?:to|in)\s*([a-zA-Z]+)/i;
    const isConversion = conversionPattern.test(value);

    if (isConversion) {
      setIsConverterMode(true);
      setIsCalculatorMode(false);
      const result = handleUnitConversion(value);
      setConversionResult(result);
      setCalculationResult(null);
    } else {
      // Check if it contains any math operators or numbers
      const hasCalculation = /[\d+\-*×x÷/().%]|of/i.test(value);
      if (hasCalculation) {
        setIsConverterMode(false);
        setIsCalculatorMode(true);
        setConversionResult(null);
        calculateResult(value.replace(/\s+/g, '')); // Remove spacing restrictions
      }
    }
  };

  // Refactor the tool selection handlers into separate functions
  const handleCalculatorExample = () => {
    const example = getRandomExample();
    setInputValue(example);
    setIsCalculatorMode(true);
    setIsConverterMode(false);
    setConversionResult(null);
    calculateResult(example);
  };

  const handleConverterExample = () => {
    const example = converterExamples[Math.floor(Math.random() * converterExamples.length)];
    setInputValue(example);
    setIsConverterMode(true);
    setIsCalculatorMode(false);
    setCalculationResult(null);
    const result = handleUnitConversion(example);
    setConversionResult(result);
  };

  return (
    // Wrap menu in TooltipProvider for hover tooltips
    <TooltipProvider delayDuration={100}>
      <CommandDialog
        open={showCommandDialog}
        onOpenChange={setShowCommandDialog}
      >
        <CommandInput
          placeholder="Calculate or convert units..."
          onExternalValueChange={handleInputChange}
          isCalculatorMode={isCalculatorMode}
          isConverterMode={isConverterMode}
          value={inputValue}
        />
        <CommandList>
          <CommandEmpty>
            {isCalculatorMode && calculationResult ? (
              <motion.div
                className="px-3 -my-3 flex items-center gap-2"
                initial={{ scale: 1, filter: "blur(0px)" }}
                animate={{
                  scale: [1, 1.05, 1],
                  filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.5, 1],
                  scale: {
                    ease: [0.22, 1, 0.36, 1],
                  },
                  filter: {
                    ease: "easeInOut",
                    delay: 0.1
                  }
                }}
              >
                <Calculator className="h-4 w-4 text-orange-500/50" />
                <span className="text-orange-500 font-bold text-base drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] tracking-wide">
                  = {calculationResult}
                </span>
              </motion.div>
            ) : isConverterMode && conversionResult ? (
              <motion.div
                className="px-3 -my-3 flex items-center gap-2"
                initial={{ scale: 1, filter: "blur(0px)" }}
                animate={{
                  scale: [1, 1.05, 1],
                  filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.5, 1],
                  scale: {
                    ease: [0.22, 1, 0.36, 1],
                  },
                  filter: {
                    ease: "easeInOut",
                    delay: 0.1
                  }
                }}
              >
                <ArrowLeftRight className="h-4 w-4 text-blue-500/50" />
                <span className="text-blue-500 font-bold text-base drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] tracking-wide">
                  = {conversionResult}
                </span>
              </motion.div>
            ) : (
              !isCalculatorMode && !isConverterMode && (
                <div className="py-6 text-center text-sm">
                  No results found.
                </div>
              )
            )}
          </CommandEmpty>
          <CommandGroup heading="Tools">
            {/* Update Calculator Tool */}
            <CommandItem
              onSelect={handleCalculatorExample}
              className="cursor-none flex items-center gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border/40">
                <Calculator className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm">Calculate</span>
                <span className="text-xs text-muted-foreground">
                  Basic math and percentage calculations
                </span>
              </div>
            </CommandItem>
            {/* Calculator Examples */}
            <div className="px-2 py-1.5 text-xs text-muted-foreground border-b mb-2">
              <div className="flex gap-2 items-center">
                <span className="opacity-70">Examples:</span>
                <div className="flex gap-2">
                  <span className="text-orange-500/70">2 + 2</span>
                  <span className="opacity-50">·</span>
                  <span className="text-orange-500/70">15% of 80</span>
                  <span className="opacity-50">·</span>
                  <span className="text-orange-500/70">5 × 3</span>
                </div>
              </div>
            </div>

            {/* Update Converter Tool */}
            <CommandItem
              onSelect={handleConverterExample}
              className="cursor-none flex items-center gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border/40">
                <ArrowLeftRight className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm">Convert Units</span>
                <span className="text-xs text-muted-foreground">
                  Length, weight, and temperature
                </span>
              </div>
            </CommandItem>
            {/* Converter Examples */}
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              <div className="flex gap-2 items-center">
                <span className="opacity-70">Examples:</span>
                <div className="flex gap-2">
                  <span className="text-blue-500/70">5km to miles</span>
                  <span className="opacity-50">·</span>
                  <span className="text-blue-500/70">100f to c</span>
                  <span className="opacity-50">·</span>
                  <span className="text-blue-500/70">2kg to lbs</span>
                </div>
              </div>
            </div>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Fixed positioning for floating menu */}
      <div className="fixed bottom-20 sm:bottom-20 left-1/2 -translate-x-1/2 z-50">
        {/* Container for menu animations */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={false}
          data-magnetic="true"
        >
          {/* Animated menu background */}
          <motion.div
            className={cn(
              "absolute left-1/2 shadow-lg border border-border/50 transition-colors duration-300",
              "bg-background/30 backdrop-blur-md"
            )}
            animate={{
              width: isOpen
                ? `clamp(${desktopWidth}px, ${mobileWidth}px, ${mobileWidth}px)`
                : 56,
              height: 56,
              x: "-50%",
              borderRadius: 45,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              mass: 1.2,
              duration: 0.8,
              delay: iconsHaveFadedOut ? 0 : 0.4 // Delay menu unexpand until icons fade out completely
            }}
          >
            {/* Animated menu items container */}
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center px-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: iconsHaveFadedOut ? 0.3 : 0.5
                    }
                  }}
                >
                  {/* Menu items layout */}
                  <div className="flex items-center justify-center gap-2.5">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{
                          scale: 0.5,
                          opacity: 0,
                          y: -20,
                          filter: "blur(8px)"
                        }}
                        animate={{
                          scale: 1.1,
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.4,
                            ease: [0.68, -0.55, 0.27, 1.55],
                            delay: 0.5 + (index * 0.1)
                          }
                        }}
                        exit={{
                          scale: 0.5,
                          opacity: 0,
                          y: -20,
                          filter: "blur(8px)",
                          transition: {
                            duration: 0.2,
                            ease: [0.68, -0.55, 0.27, 1.55],
                            delay: index * 0.1
                          }
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-full hover:bg-accent/20 hover:blur-[1px] active:scale-95 transition-all duration-200 cursor-none"
                              onClick={item.onClick ? item.onClick : undefined}
                              data-magnetic="true"
                            >
                              {item.onClick || item.command ? (
                                item.icon
                              ) : (
                                <a
                                  href={item.href}
                                  target={item.external ? "_blank" : undefined}
                                  rel={item.external ? "noopener noreferrer" : undefined}
                                  className="w-full h-full flex items-center justify-center cursor-none"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  data-magnetic="true"
                                >
                                  {item.icon}
                                </a>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-background/80 backdrop-blur-md border-border/50 cursor-none"
                            sideOffset={5}
                          >
                            <span className="font-medium">{item.label}</span>
                          </TooltipContent>
                        </Tooltip>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Menu trigger button animation */}
            <AnimatePresence mode="wait">
              {!isOpen && (
                <motion.div
                  key="menu"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}
                  exit={{ opacity: 0 }}
                >
                  {/* Menu trigger button with tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-[56px] w-[56px] rounded-full hover:bg-accent/20 active:scale-95 transition-all duration-200 cursor-none"
                        onClick={() => setIsOpen(true)}
                        data-magnetic="true"
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-background/80 backdrop-blur-md border-border/50"
                    >
                      <span className="font-medium">Menu</span>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default FloatingMenu;
