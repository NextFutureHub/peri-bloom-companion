import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Symptoms from "./pages/Symptoms";
import Education from "./pages/Education";
import Settings from "./pages/Settings";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useApp();
  return profile.onboardingComplete ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes = () => {
  const { profile } = useApp();

  return (
    <BrowserRouter>
      <div className="pb-20 md:pb-0 md:pt-20">
        {profile.onboardingComplete && <Navigation />}
        <Routes>
          <Route path="/" element={profile.onboardingComplete ? <Navigate to="/dashboard" /> : <Onboarding />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ai-chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
          <Route path="/symptoms" element={<ProtectedRoute><Symptoms /></ProtectedRoute>} />
          <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
