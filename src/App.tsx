import { Toaster } from "@/components/ui/toaster";
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
              <Route path="/freelancer/register" element={<RegistrationPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/freelancer/dashboard" element={<FreelancerDashboardPage />} />
              <Route path="/freelancer/compare" element={<ProfileComparisonPage />} />
              <Route path="/freelancer/insights" element={<InsightsPage />} />
              <Route path="/freelancer/roadmap" element={<CareerRoadmapPage />} />
              <Route path="/freelancer/comparison-history" element={<ComparisonHistoryPage />} />
              <Route path="/freelancer/comparison-history/:id" element={<ComparisonDetailPage />} />
              <Route path="/freelancer/profile" element={<ProfilePage />} />
              <Route path="/freelancer/mentorship" element={<MentorshipRequestPage />} />
              <Route path="/freelancer/sentiment" element={<SentimentInsightsPage />} />
              <Route path="/pro/mentorship" element={<MentorshipDashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
