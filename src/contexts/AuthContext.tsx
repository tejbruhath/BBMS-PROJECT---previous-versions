
import React, { createContext, useContext, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return true;
    }
    toast({
      variant: "destructive",
      title: "Login Failed",
      description: "Invalid credentials",
    });
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "Successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
