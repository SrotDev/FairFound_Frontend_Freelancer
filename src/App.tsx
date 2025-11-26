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
import ReEvaluationPage from "@/pages/Freelancer/ReEvaluationPage";
import SentimentInsightsPage from "@/pages/Freelancer/SentimentInsightsPage";
import ProfilePage from "@/pages/Freelancer/ProfilePage";
import MentorshipRequestPage from "@/pages/Freelancer/MentorshipRequestPage";
import ComparisonHistoryPage from "@/pages/Freelancer/ComparisonHistoryPage";
import ComparisonDetailPage from "@/pages/Freelancer/ComparisonDetailPage";
import NotFound from "./pages/NotFound";

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
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/dashboard/industry" element={<IndustryDashboardPage />} />
              <Route path="/freelancer/dashboard" element={<FreelancerDashboardPage />} />
              <Route path="/freelancer/compare" element={<ProfileComparisonPage />} />
              <Route path="/freelancer/insights" element={<InsightsPage />} />
              <Route path="/freelancer/roadmap" element={<CareerRoadmapPage />} />
              <Route path="/freelancer/re-evaluation" element={<ReEvaluationPage />} />
              <Route path="/auth/register" element={<RegistrationPage />} />
              <Route path="/freelancer/sentiment" element={<SentimentInsightsPage />} />
              <Route path="/freelancer/profile" element={<ProfilePage />} />
              <Route path="/freelancer/mentorship" element={<MentorshipRequestPage />} />
              <Route path="/freelancer/comparisonhistory" element={<ComparisonHistoryPage />} />
              <Route path="/freelancer/comparedetail" element={<ComparisonDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
