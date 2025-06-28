
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ProfileAvatar } from "./ProfileAvatar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={cn(
          "flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full transition-all duration-200",
          collapsed ? "ml-16" : "ml-60"
        )}>
          <div className="mb-6 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30"
            >
              <MessageSquare className="h-4 w-4" /> 
              Quick Chat
            </Button>
            
            <div className="flex items-center gap-2">
              <ProfileAvatar />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-1 border-primary/20 hover:bg-primary/10 hover:border-primary/30"
              >
                <LogOut className="h-4 w-4" /> 
                Sign Out
              </Button>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
