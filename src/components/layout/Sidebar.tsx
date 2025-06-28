import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { useSound } from "@/components/SoundContext";
import MiniAudioPlayer from "@/components/MiniAudioPlayer";
import { LayoutDashboard, Heart, MessageSquareText, BarChart3, User, Sparkles, Settings, LogOut, Gamepad2 } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  collapsed,
  setCollapsed
}: SidebarProps) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { showMiniPlayer, currentAmbientSound, stopAmbientSound } = useSound();
  
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />
    }, 
    {
      name: "Safe Space",
      href: "/safe-space",
      icon: <Heart className="h-5 w-5" />
    }, 
    {
      name: "Chat",
      href: "/chat",
      icon: <MessageSquareText className="h-5 w-5" />
    }, 
    {
      name: "Stats",
      href: "/stats",
      icon: <BarChart3 className="h-5 w-5" />
    }, 
    {
      name: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />
    }, 
    {
      name: "Minigames",
      href: "/minigames",
      icon: <Gamepad2 className="h-5 w-5" />
    }, 
    {
      name: "Models",
      href: "/models",
      icon: <Sparkles className="h-5 w-5" />
    }
  ];

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile, setCollapsed]);

  // Get sound info for mini player
  const soundOptions = [
    { type: 'rain', name: 'Rain', emoji: '🌧️' },
    { type: 'ocean', name: 'Ocean', emoji: '🌊' },
    { type: 'fireplace', name: 'Fireplace', emoji: '🔥' },
    { type: 'forest', name: 'Forest', emoji: '🌳' }
  ];
  
  const currentSound = soundOptions.find(s => s.type === currentAmbientSound);

  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-40", 
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-4">
        <h2 className={cn(
          "font-bold text-sm text-sidebar-foreground text-center", 
          collapsed ? "hidden" : "block"
        )}>
          MindScape
        </h2>
      </div>

      {/* Navigation - Scrollable content */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1">
          {navigation.map(item => (
            <Link key={item.href} to={item.href}>
              <Button 
                variant="ghost" 
                className={cn(
                  "justify-start gap-3 w-full font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", 
                  location.pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground", 
                  collapsed ? "px-3 justify-center" : "px-4"
                )}
              >
                {item.icon}
                <span className={cn("text-sm", collapsed && "hidden")}>
                  {item.name}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Mini Player in Sidebar */}
      {showMiniPlayer && currentSound && !collapsed && (
        <div className="flex-shrink-0 p-2 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-lg p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{currentSound.emoji}</span>
                <span className="text-xs font-medium">{currentSound.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={stopAmbientSound}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0 p-2 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className={cn(
            "justify-start gap-3 w-full font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "px-3 justify-center" : "px-4"
          )}
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          <span className={cn("text-sm", collapsed && "hidden")}>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
