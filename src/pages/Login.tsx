
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blood-50 to-blood-100 animate-gradient">
      <Card className="w-[350px] transition-all duration-500 hover:shadow-xl animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <LogIn className="h-6 w-6 text-blood-600 animate-pulse" />
            <CardTitle className="text-2xl">Login</CardTitle>
          </div>
          <CardDescription>
            Enter your credentials to manage transfusions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="transition-all duration-300 hover:border-blood-300 focus:border-blood-500"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-300 hover:border-blood-300 focus:border-blood-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
