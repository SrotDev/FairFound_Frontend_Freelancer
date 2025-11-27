import { Toaster } from "@/components/ui/toaster";
import { AuthRoute, ProtectedRoute } from "@/routes/AuthGuards";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/Landing/LandingPage";
import RegistrationPage from "@/pages/Auth/RegistrationPage";
import LoginPage from "@/pages/Auth/LoginPage";
import IndustryDashboardPage from "@/pages/Onboarding/IndustryDashboardPage";
import FreelancerDashboardPage from "@/pages/Freelancer/FreelancerDashboardPage";
import ProfileComparisonPage from "@/pages/Freelancer/ProfileComparisonPage";
import InsightsPage from "@/pages/Freelancer/InsightsPage";
import CareerRoadmapPage from "@/pages/Freelancer/CareerRoadmapPage";
import NotFound from "./pages/NotFound";
import ComparisonHistoryPage from "@/pages/Freelancer/ComparisonHistoryPage";
import ComparisonDetailPage from "@/pages/Freelancer/ComparisonDetailPage";
import ProfilePage from "@/pages/Freelancer/ProfilePage";
import MentorshipRequestPage from "@/pages/Freelancer/MentorshipRequestPage";
import MentorshipDashboardPage from "@/pages/Professional/MentorshipDashboardPage";
import SentimentInsightsPage from "@/pages/Freelancer/SentimentInsightsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/industry" element={<IndustryDashboardPage />} />
              <Route path="/freelancer/register" element={<AuthRoute><RegistrationPage /></AuthRoute>} />
              <Route path="/auth/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
              <Route path="/freelancer/dashboard" element={<ProtectedRoute><FreelancerDashboardPage /></ProtectedRoute>} />
              <Route path="/freelancer/compare" element={<ProtectedRoute><ProfileComparisonPage /></ProtectedRoute>} />
              <Route path="/freelancer/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
              <Route path="/freelancer/roadmap" element={<ProtectedRoute><CareerRoadmapPage /></ProtectedRoute>} />
              <Route path="/freelancer/comparison-history" element={<ProtectedRoute><ComparisonHistoryPage /></ProtectedRoute>} />
              <Route path="/freelancer/comparison-history/:id" element={<ProtectedRoute><ComparisonDetailPage /></ProtectedRoute>} />
              <Route path="/freelancer/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/freelancer/mentorship" element={<ProtectedRoute><MentorshipRequestPage /></ProtectedRoute>} />
              <Route path="/freelancer/sentiment" element={<ProtectedRoute><SentimentInsightsPage /></ProtectedRoute>} />
              <Route path="/pro/mentorship" element={<ProtectedRoute><MentorshipDashboardPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
