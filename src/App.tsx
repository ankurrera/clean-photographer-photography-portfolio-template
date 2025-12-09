import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/useAuth";
import { useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Project from "./pages/Project";
import CategoryGallery from "./pages/CategoryGallery";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

/**
 * Component to manage body classes based on route
 */
const BodyClassManager = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Add 'admin-dashboard' class to body when on admin routes
    if (location.pathname.startsWith('/admin')) {
      document.body.classList.add('admin-dashboard');
    } else {
      document.body.classList.remove('admin-dashboard');
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('admin-dashboard');
    };
  }, [location.pathname]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <BodyClassManager />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/category/:category" element={<CategoryGallery />} />
                <Route path="/project/:slug" element={<Project />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
