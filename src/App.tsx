
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BloodBankProvider } from "./contexts/BloodBankContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { PrivateRoute } from "./components/PrivateRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DonorForm from "./pages/DonorForm";
import Inventory from "./pages/Inventory";
import RecipientForm from "./pages/RecipientForm";
import TransfusionEvents from "./pages/TransfusionEvents";
import Blockchain from "./pages/Blockchain";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BloodBankProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/donor" element={<DonorForm />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/recipient" element={<RecipientForm />} />
                <Route 
                  path="/transfusions" 
                  element={
                    <PrivateRoute>
                      <TransfusionEvents />
                    </PrivateRoute>
                  } 
                />
                <Route path="/blockchain" element={<Blockchain />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BloodBankProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
