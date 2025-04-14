
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  // We no longer redirect - the component itself handles authentication
  return <>{children}</>;
};
