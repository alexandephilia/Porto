import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FormEvent, useState, useRef, useEffect } from "react";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isNear, setIsNear] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isNearCard, setIsNearCard] = useState(false);
  const [cardCursorPosition, setCardCursorPosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Detect if cursor is within 100px of the card
        const isNear = x >= -100 && x <= rect.width + 100 &&
          y >= -100 && y <= rect.height + 100;

        setIsNearCard(isNear);
        setCardCursorPosition({ x, y });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const mailtoLink = `mailto:0xnihilist@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="w-full"
    >
      <div ref={cardRef} className="relative">
        {/* Glow effect container */}
        <motion.div
          className="absolute -inset-[1px] rounded-lg"
          style={{
            opacity: isNearCard ? 1 : 0,
            background: `radial-gradient(
              90px circle at ${cardCursorPosition.x}px ${cardCursorPosition.y}px,
              ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)'},
              transparent 40%
            )`,
          }}
          transition={{ duration: 0.2 }}
        />

        <Card className="overflow-hidden w-full backdrop-blur-md bg-white/30 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-700/30 relative">
          <div className="md:grid md:grid-cols-5">
            <div className="p-8 md:col-span-2 dark:text-white backdrop-blur-md bg-white/30 dark:bg-zinc-900/30">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <p className="mb-8 text-lg dark:text-gray-300">
                I'm always interested in hearing about new projects and opportunities.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-4 py-1.5 text-sm flex items-center gap-2 dark:border-zinc-700 dark:text-white">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Available for hire
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-4 py-1.5 text-sm flex items-center gap-2 dark:border-zinc-700 dark:text-white">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Open to collaboration
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-8 md:col-span-3">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Responsive Container for Name and Email */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium dark:text-white">Name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-md border backdrop-blur-sm bg-white/20 dark:bg-zinc-800/20 
          border-gray-200 dark:border-zinc-700/30 px-4 py-3 text-base dark:text-white 
          placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 
          dark:focus:ring-zinc-700/30 transition-all"
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium dark:text-white">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-md border backdrop-blur-sm bg-white/20 dark:bg-zinc-800/20 
          border-gray-200 dark:border-zinc-700/30 px-4 py-3 text-base dark:text-white 
          placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 
          dark:focus:ring-zinc-700/30 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-white">Subject</label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-md border backdrop-blur-sm bg-white/20 dark:bg-zinc-800/20 
        border-gray-200 dark:border-zinc-700/30 px-4 py-3 text-base dark:text-white 
        placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 
        dark:focus:ring-zinc-700/30 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-white">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-md border backdrop-blur-sm bg-white/20 dark:bg-zinc-800/20 
        border-gray-200 dark:border-zinc-700/30 px-4 py-3 h-40 resize-none text-base text-black dark:text-white 
        placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 
        dark:focus:ring-zinc-700/30 transition-all"
                    required
                  />
                </div>

                <motion.div
                  ref={buttonRef}
                  className="relative h-16 w-full cursor-pointer overflow-hidden rounded-full p-[1.5px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      opacity: isNear && !isHovered ? 1 : 0,
                      background: `radial-gradient(circle 150px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255,255,255,0.9), transparent 40%)`,
                    }}
                    transition={{ opacity: { duration: 0.3 } }}
                  />
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: `conic-gradient(
                          from 0deg at 50% 50%,
                          transparent,
                          rgba(255,255,255,0.8),
                          rgba(255,255,255,0.9),
                          rgba(255,255,255,0.8),
                          transparent
                        )`,
                        filter: 'blur(8px)',
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                  <div className="absolute inset-[1.5px] rounded-full bg-black dark:bg-zinc-950" />
                  <Button
                    type="submit"
                    className="relative h-full w-full rounded-full bg-black dark:bg-zinc-950 font-medium 
        text-white transition-all hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  >
                    Send Message
                  </Button>
                </motion.div>
              </form>
            </div>

          </div>
        </Card>
      </div>
    </motion.div>
  );
};