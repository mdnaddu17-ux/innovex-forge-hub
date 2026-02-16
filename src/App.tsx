import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import EngineeringBackground from "@/components/EngineeringBackground";
import BrandIntro from "@/components/BrandIntro";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import FutureGoals from "./pages/FutureGoals";
import AddProject from "./pages/AddProject";
import AdminPanel from "./pages/AdminPanel";
import BecomeMember from "./pages/BecomeMember";
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer";

import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          {!introComplete && <BrandIntro onComplete={() => setIntroComplete(true)} />}
          <BrowserRouter>
            <EngineeringBackground />
            <Header />
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/future-goals" element={<FutureGoals />} />
                <Route path="/add-project" element={<AddProject />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/become-member" element={<BecomeMember />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
