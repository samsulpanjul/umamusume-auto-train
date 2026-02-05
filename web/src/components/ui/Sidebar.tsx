import { cn } from "@/lib/utils";
import {
  Settings,
  Dumbbell,
  // Trophy, 
  Layout,
  Cog,
  Calendar,
  Star,
  Flag
} from "lucide-react";
import { Badge } from "./badge";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  appVersion: string;
  eventCount?: number;
  raceCount?: number;
  skillCount?: number;
}

const navItems = [
  { id: "set-up", label: "Set-Up", icon: Cog },
  { id: "general", label: "General", icon: Settings },
  { id: "training", label: "Training", icon: Dumbbell },
  { id: "skills", label: "Skills", icon: Star },
  { id: "schedule", label: "Race Schedule", icon: Flag },
  { id: "events", label: "Events", icon: Calendar },
  { id: "timeline", label: "Timeline", icon: Layout },
];

export function Sidebar({ activeTab, setActiveTab, appVersion, eventCount, raceCount, skillCount }: SidebarProps) {
  return (
    <div className="w-64 h-screen sticky top-0 flex flex-col">
      <div className="p-3 py-4 absolute">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Uma Auto Train</h1>
        <span className="text-sm block w-full text-right font-bold text-slate-400 -mt-2">v{appVersion || "Loading..."}</span>
      </div>
      <nav className="flex-1 content-center px-3 space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "uma-btn w-full grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 py-3 rounded-md transition-colors font-medium",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer "
            )}
          >
            <item.icon className="w-4 h-4 justify-self-start" />
            {item.label}
            {((item.id === "events" && (eventCount ?? 0) > 0) ||
              (item.id === "schedule" && (raceCount ?? 0) > 0) ||
              (item.id === "skills" && (skillCount ?? 0) > 0)) && (
              <Badge variant="default" className="text-xs px-2 justify-self-end">
                {item.id === "events" ? eventCount : item.id === "schedule" ? raceCount : skillCount}
              </Badge>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}