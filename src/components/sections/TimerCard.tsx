import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Moon, Loader2, Globe2, Calendar, Clock } from "lucide-react";

interface LocationData {
    city: string;
    country: string;
    timezone: string;
    temp?: number;
    loading: boolean;
    error: string | null;
}

// Custom hook for location
const useLocation = () => {
    const [locationData, setLocationData] = useState<LocationData>({
        city: "",
        country: "",
        timezone: "",
        loading: true,
        error: null
    });

    useEffect(() => {
        let watchId: number;

        const isMobileDevice = () => {
            return (
                typeof window !== 'undefined' &&
                (navigator.userAgent.match(/Android/i) ||
                    navigator.userAgent.match(/webOS/i) ||
                    navigator.userAgent.match(/iPhone/i) ||
                    navigator.userAgent.match(/iPad/i) ||
                    navigator.userAgent.match(/iPod/i) ||
                    navigator.userAgent.match(/BlackBerry/i) ||
                    navigator.userAgent.match(/Windows Phone/i))
            );
        };

        const getIPBasedLocation = async () => {
            try {
                console.log("Fetching IP-based location...");
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                console.log("IP location data:", data);

                if (data.error) {
                    throw new Error('IP location service error');
                }

                // Get weather data using coordinates from IP
                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&current_weather=true&timezone=${encodeURIComponent(data.timezone)}`
                );
                const weatherData = await weatherResponse.json();

                setLocationData({
                    city: data.city || "Unknown",
                    country: data.country_code || "",
                    timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                    temp: weatherData.current_weather?.temperature,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('IP location error:', error);
                setLocationData({
                    city: "Unknown",
                    country: "",
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    loading: false,
                    error: error instanceof Error ? error.message : "Location error"
                });
            }
        };

        const getGPSLocation = async (latitude: number, longitude: number) => {
            try {
                console.log("Fetching GPS location data for:", latitude, longitude);
                const reverseGeocode = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
                );
                const locationData = await reverseGeocode.json();
                console.log("GPS location data:", locationData);

                // Get timezone from coordinates
                const timezoneResponse = await fetch(
                    `https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_TIMEZONEDB_API_KEY&format=json&by=position&lat=${latitude}&lng=${longitude}`
                );
                const timezoneData = await timezoneResponse.json();

                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=${encodeURIComponent(timezoneData.zoneName)}`
                );
                const weatherData = await weatherResponse.json();

                setLocationData({
                    city: locationData.city || "Unknown",
                    country: locationData.countryCode || "",
                    timezone: timezoneData.zoneName || Intl.DateTimeFormat().resolvedOptions().timeZone,
                    temp: weatherData.current_weather?.temperature,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('GPS location error:', error);
                setLocationData({
                    city: "Unknown",
                    country: "",
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    loading: false,
                    error: error instanceof Error ? error.message : "Location error"
                });
            }
        };

        // Choose location method based on device type
        if (isMobileDevice()) {
            console.log("Mobile device detected, using GPS...");
            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        console.log("GPS position received:", position);
                        getGPSLocation(position.coords.latitude, position.coords.longitude);
                    },
                    (err) => {
                        console.error('GPS error:', err);
                        // Fallback to IP-based location if GPS fails
                        getIPBasedLocation();
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            } else {
                console.log("Geolocation not supported, falling back to IP...");
                getIPBasedLocation();
            }
        } else {
            console.log("Desktop device detected, using IP-based location...");
            getIPBasedLocation();
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    return locationData;
};

export const TimerCard = () => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [currentTime, setCurrentTime] = useState(new Date());
    const { city, country, timezone, temp, loading, error } = useLocation();

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
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            requestAnimationFrame(() => {
                setPosition({ x, y });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isHovered]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format time for display
    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedHours = hours.toString().padStart(2, '0');

        return {
            time: `${formattedHours}:${minutes}:${seconds}`,
            period
        };
    };

    // Format date - This already uses real current date
    const formatDate = (date: Date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];     // Gets current day
        const monthName = months[date.getMonth()]; // Gets current month
        const dayNum = date.getDate();           // Gets current date

        return `${dayName}, ${monthName} ${dayNum}`;
    };

    // Get week number - This calculates the real current week
    const getWeekNumber = (date: Date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const generateProgressBars = () => {
        const totalBars = 60;
        const currentSecond = currentTime.getSeconds();
        const nextSecond = (currentSecond + 1) % 60;

        return (
            <div className="flex w-full space-x-0.5">
                {Array.from({ length: totalBars }).map((_, index) => {
                    const isActive = index <= currentSecond;
                    const isCurrentBar = index === currentSecond;
                    const isNextBar = index === nextSecond;
                    const delay = index * 0.03;

                    return (
                        <div
                            key={index}
                            className={`
                                h-3 flex-1 rounded-full transition-all duration-300
                                timer-progress-bar
                                ${isActive
                                    ? 'dark:bg-lime-300 bg-lime-600'
                                    : 'dark:bg-lime-400/20 bg-lime-600/20'
                                }
                                ${isCurrentBar ? 'current' : ''}
                                ${isNextBar ? 'next' : ''}
                            `}
                            style={{
                                animation: isActive
                                    ? `timer-wave 1s ease-in-out ${delay}s infinite`
                                    : 'none',
                                transform: isCurrentBar ? 'scaleY(1.5)' : 'scaleY(1)',
                                opacity: isActive ? 1 : 0.2,
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            /* Scope animations to specific timer elements */
            .timer-progress-bar {
                box-shadow: 0 0 5px rgba(132, 204, 22, 0.5),
                           0 0 10px rgba(132, 204, 22, 0.3);
                transition: all 0.3s ease;
                position: relative;
            }

            .timer-progress-bar.current {
                box-shadow: 0 0 10px rgba(132, 204, 22, 0.8),
                           0 0 20px rgba(132, 204, 22, 0.6),
                           0 0 30px rgba(132, 204, 22, 0.4);
                animation: timer-pulse 2s infinite;
            }

            @keyframes timer-wave {
                0% {
                    transform: scaleY(1);
                    filter: blur(0.1px);
                    opacity: 0.7;
                }
                50% {
                    transform: scaleY(1.5);
                    filter: blur(0.5px);
                    opacity: 1;
                }
                100% {
                    transform: scaleY(1);
                    filter: blur(0.3px);
                    opacity: 0.8;
                }
            }

            @keyframes timer-pulse {
                0%, 100% {
                    box-shadow: 0 0 10px rgba(132, 204, 22, 0.8),
                               0 0 20px rgba(132, 204, 22, 0.6),
                               0 0 30px rgba(132, 204, 22, 0.4);
                }
                50% {
                    box-shadow: 0 0 15px rgba(132, 204, 22, 0.9),
                               0 0 25px rgba(132, 204, 22, 0.7),
                               0 0 35px rgba(132, 204, 22, 0.5);
                }
            }

            .timer-progress-bar.current::after {
                content: '';
                position: absolute;
                right: -5px;
                top: 0;
                width: 10px;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(132, 204, 22, 1));
                filter: blur(4px);
                animation: timer-hitNext 1s ease-in-out infinite;
                transform-origin: right;
                z-index: 10;
            }

            @keyframes timer-hitNext {
                0%, 100% {
                    transform: scaleX(1);
                    opacity: 0.7;
                    filter: blur(4px);
                }
                50% {
                    transform: scaleX(1);
                    opacity: 1;
                    filter: blur(8px);
                }
            }

            .timer-progress-bar.next {
                animation: timer-nextActivation 1s ease-in-out infinite;
                position: relative;
            }

            .timer-progress-bar.next::before {
                content: '';
                position: absolute;
                left: -5px;
                top: 0;
                width: 10px;
                height: 100%;
                background: linear-gradient(90deg, rgba(132, 204, 22, 1), transparent);
                filter: blur(4px);
                animation: timer-receiveGlow 1s ease-in-out infinite;
                transform-origin: left;
                z-index: 10;
            }

            @keyframes timer-receiveGlow {
                0%, 100% {
                    transform: scaleX(1);
                    opacity: 0.7;
                    filter: blur(4px);
                }
                50% {
                    transform: scaleX(1);
                    opacity: 1;
                    filter: blur(8px);
                }
            }

            @keyframes timer-nextActivation {
                0%, 100% {
                    transform: scaleY(1);
                    filter: blur(0px);
                    box-shadow: 0 0 5px rgba(132, 204, 22, 0.3),
                               0 0 10px rgba(132, 204, 22, 0.2);
                }
                50% {
                    transform: scaleY(1.8);
                    filter: blur(2px);
                    box-shadow: 0 0 20px rgba(132, 204, 22, 1),
                               0 0 40px rgba(132, 204, 22, 0.8),
                               0 0 60px rgba(132, 204, 22, 0.6);
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // New: Create a state to track if the screen is desktop-sized
    const [isDesktop, setIsDesktop] = useState(false);

    // New: Effect to check and update screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024); // Assuming 1024px as the desktop breakpoint
        };

        checkScreenSize(); // Check on initial render
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Add this new function to calculate Jakarta time and difference
    const getJakartaTimeInfo = () => {
        const localTime = new Date();
        const jakartaTime = new Date(localTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

        // Calculate time difference in hours
        const diffHours = Math.round((jakartaTime.getTime() - localTime.getTime()) / (1000 * 60 * 60));

        // Format Jakarta time
        const hours = jakartaTime.getHours() % 12 || 12;
        const minutes = jakartaTime.getMinutes().toString().padStart(2, '0');
        const period = jakartaTime.getHours() >= 12 ? 'PM' : 'AM';

        return {
            time: `${hours}:${minutes}${period}`,
            diff: diffHours >= 0 ? `+${diffHours}` : diffHours
        };
    };

    return (
        <motion.div
            ref={cardRef}
            style={{
                filter: blurValue,
                position: 'relative'
            }}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{
                    boxShadow: '0 0 80px 80px rgba(255, 255, 255, 0.05)',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                    pointerEvents: 'none'
                }}
            />

            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative overflow-hidden group hover:shadow-lg transition-all duration-500 cursor-pointer border border-black/20 ring-1 ring-black/5 dark:border-white/10 hover:border-black/30 hover:ring-black/10"
                style={{
                    minHeight: '320px',
                    minWidth: isDesktop ? '390px' : 'auto', // Apply min-width only for desktop
                    display: 'flex',
                    flexDirection: 'column',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'transform 0.3s ease-out, min-width 0.3s ease-out', // Smooth transition for min-width changes
                    padding: '1.5rem',
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        {loading ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Detecting location...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                                    <MapPin className="h-4 w-4 mu" />
                                    <span className="text-sm font-medium">
                                        {city}, {country}
                                    </span>
                                    {temp !== undefined && (
                                        <span className="text-sm text-muted-foreground">
                                            {temp}°C
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 ml-3">
                                    <span className="text-[10px] text-muted-foreground/60">
                                        {timezone}
                                    </span>
                                    {/* <Globe2 className="h-3.5 w-3.5 text-muted-foreground/60" /> */}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="self-start relative">
                        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 rounded-full py-1 px-2 border-t border-white/20 dark:border-black/20">
                            <div className="relative w-2 h-2">
                                <div className="absolute inset-0 rounded-full bg-lime-500/50 animate-ping shadow-[0_0_5px_#84cc16,0_0_10px_#84cc16]"></div>
                                <div className="relative w-full h-full rounded-full bg-lime-500 animate-pulse shadow-[0_0_5px_#84cc16,0_0_10px_#84cc16,0_0_15px_#84cc16]"></div>
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium">JKT {getJakartaTimeInfo().time}</span>
                        </div>
                        <span className="absolute -bottom-4 right-[6%] -translate-x-1/2 text-[6px] sm:text-[8px] bg-white/10 text-black dark:text-muted-foreground px-1 rounded-full shadow-sm">
                            GMT{getJakartaTimeInfo().diff}
                        </span>
                    </div>
                </div>

                <div className="mb-6">{generateProgressBars()}</div>

                <div className="flex justify-center items-center mb-6">
                    <div className="flex flex-col items-center">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl sm:text-5xl font-mono font-bold tracking-wider">
                                {formatTime(currentTime).time}
                            </span>
                            <span className="text-sm sm:text-base font-mono text-muted-foreground">
                                {formatTime(currentTime).period}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground/60 mt-2">
                            local time
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">{formatDate(currentTime)}</span>
                        </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        <span className="font-medium">Week {getWeekNumber(currentTime)}</span>
                    </div>
                </div>

                {isHovered && (
                    <div
                        className="absolute inset-0 z-10 transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`
                        }}
                    />
                )}
            </Card>
        </motion.div>
    );
};