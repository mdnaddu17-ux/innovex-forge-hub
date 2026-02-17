import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import EngineeringBackground from '@/components/EngineeringBackground';
import BrandIntro from '@/components/BrandIntro';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Suspense, lazy, useState } from 'react';

const Index = lazy(() => import('./pages/Index'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const About = lazy(() => import('./pages/About'));
const FutureGoals = lazy(() => import('./pages/FutureGoals'));
const AddProject = lazy(() => import('./pages/AddProject'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const BecomeMember = lazy(() => import('./pages/BecomeMember'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
              <Suspense fallback={<div className="pt-24 text-center">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/future-goals" element={<FutureGoals />} />
                  <Route path="/add-project" element={<ProtectedRoute allow={['creator', 'admin']}><AddProject /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute allow={['admin']}><AdminPanel /></ProtectedRoute>} />
                  <Route path="/become-member" element={<BecomeMember />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
