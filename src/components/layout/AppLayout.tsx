
import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Heart, Droplet, Users, Clipboard, Activity, Database, Github, LogOut, Info, Home } from "lucide-react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const menuItems = [
    { title: "Home", path: "/", icon: Home },
    { title: "Donor Form", path: "/donor", icon: Heart },
    { title: "Inventory", path: "/inventory", icon: Droplet },
    { title: "Recipient Form", path: "/recipient", icon: Users },
    { title: "Transfusion Events", path: "/transfusions", icon: Activity },
    { title: "Blockchain", path: "/blockchain", icon: Database },
    { title: "About", path: "/about", icon: Info },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="px-6 py-4">
            <div className="flex items-center gap-2">
              <Droplet className="h-6 w-6 text-blood-600" />
              <Link to="/" className="text-xl font-bold tracking-tight">BloodLink</Link>
            </div>
            <p className="text-xs text-sidebar-foreground/60 mt-1">
              Supply Chain Nexus
            </p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        className={`transition-all duration-300 ${location.pathname === item.path ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"}`}
                      >
                        <Link to={item.path} className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="px-6 py-4">
            <div className="flex justify-between items-center text-xs">
              <span>© BloodLink 2025</span>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="border-b h-14 flex items-center px-6 animate-fade-in">
            <SidebarTrigger />
            <div className="ml-4 flex items-center">
              <Droplet className="h-5 w-5 text-blood-600 animate-pulse mr-2" />
              <Link to="/" className="text-lg font-medium">BloodLink Supply Chain Nexus</Link>
            </div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto animate-fade-in">
            <Outlet />
          </main>
          
          <footer className="border-t p-4 text-center text-sm text-muted-foreground animate-fade-in">
            BloodLink Supply Chain Nexus - Secure Blood Donation Management System
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};
