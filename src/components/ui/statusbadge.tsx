import { Badge } from "./badge";

export interface StatusBadgeProps {
  status: "Working on" | string;
  icon: React.ReactNode;
  text: string;
}

export function StatusBadge({ status, icon, text }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "working on":
        return "bg-sky-400";
      case "completed":
        return "bg-sky-400";
      default:
        return "bg-sky-400";
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status.toLowerCase()) {
      case "working on":
        return "shadow-[0_0_5px_#38bdf8,0_0_10px_#38bdf8,0_0_15px_#38bdf8]";
      case "completed":
        return "shadow-[0_0_5px_#38bdf8,0_0_10px_#38bdf8,0_0_15px_#38bdf8]";
      default:
        return "shadow-[0_0_5px_#38bdf8,0_0_10px_#38bdf8,0_0_15px_#38bdf8]";
    }
  };

  return (
    <Badge
      variant="outline"
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-background to-muted 
        hover:from-muted hover:to-background hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] 
        dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] 
        hover:scale-[1.01] hover:-translate-y-[1px] 
        transition-all duration-300 ease-out group"
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`absolute inset-0 rounded-full ${getStatusColor(status)}/50 animate-ping ${getStatusGlow(status)}`} />
          <div className={`relative w-2 h-2 rounded-full ${getStatusColor(status)} animate-pulse ${getStatusGlow(status)}`} />
        </div>
        <span className="text-sm font-medium">{status}</span>
      </div>
      <div className="flex items-center gap-1.5 pl-2 border-l border-muted-foreground/20">
        {icon}
        <span className="font-semibold">{text}</span>
      </div>
    </Badge>
  );
}