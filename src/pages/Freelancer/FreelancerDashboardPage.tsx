import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { PseudoRankingBadge } from "@/components/freelancer/PseudoRankingBadge";
import { useAppContext } from "@/context/AppContext";
import { Eye, TrendingUp, Target, Mail, ArrowRight, ClipboardList } from "lucide-react";
import { Users } from "lucide-react";
import { MessageSquareQuote } from "lucide-react";

const FreelancerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, freelancerProfile, calculatePseudoRanking } = useAppContext();
  const pseudoRanking = calculatePseudoRanking();

  return (
    <div className="container py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Freelancer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "there"}. Here's where you stand today.
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-accent/40 text-accent hover:bg-accent/10
            dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          onClick={() => navigate("/freelancer/comparison-history")}
        >
          <ClipboardList className="h-4 w-4" />
          Comparison History
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card
            className="p-6
            bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10
            dark:from-[#0E1422] dark:via-[#1B2540] dark:to-[#2A3960]
            text-foreground dark:text-white border border-accent/20 dark:border-white/10"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Ready to see how you compare?</h3>
                <p className="text-muted-foreground dark:text-white/80">
                  Compare your profile against top freelancers and specific competitors
                </p>
              </div>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 shadow-md"
                onClick={() => navigate("/freelancer/compare")}
              >
                Compare your profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <PseudoRankingBadge score={pseudoRanking} />

          {/* Sentiment analysis CTA */}
          <Card className="p-6 border-primary/30 bg-primary/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/20 p-2">
                  <MessageSquareQuote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold">Analyze Client Sentiment</h3>
                  <p className="text-sm text-muted-foreground">Turn raw reviews & comments into improvement actions.</p>
                </div>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                onClick={() => navigate("/freelancer/sentiment")}
              >
                Open Sentiment Insights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <StatCard
              title="Profile Completeness"
              value={`${freelancerProfile.profileCompleteness}%`}
              icon={Target}
              trend="+5% vs last month"
              trendUp={true}
            />
            <StatCard
              title="Profile Views"
              value={freelancerProfile.profileViews}
              icon={Eye}
              trend="+12 this week"
              trendUp={true}
            />
            <StatCard
              title="Proposal Success Rate"
              value={`${freelancerProfile.proposalSuccessRate}%`}
              icon={TrendingUp}
              trend="-2% vs last month"
              trendUp={false}
            />
            <StatCard
              title="Job Invitations"
              value={freelancerProfile.jobInvitations}
              icon={Mail}
              trend="This month"
              trendUp={true}
            />
          </div>
          
        </div>

        <div className="space-y-6">
          {/* Highlighted mentorship CTA (right column) */}
          <Card
            className="p-6 bg-gradient-to-br from-yellow-100/60 via-orange-100/40 to-rose-100/50 dark:from-yellow-900/30 dark:via-orange-900/20 dark:to-rose-900/20 border-2 border-yellow-300/50 dark:border-yellow-500/40 shadow-lg"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-yellow-200/60 p-2 dark:bg-yellow-700/40">
                  <Users className="h-5 w-5 text-yellow-700 dark:text-yellow-200" />
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-bold">Get Mentorship from Professionals</h3>
                  <p className="text-sm text-muted-foreground">
                    Need human guidance? Request mentorship, share context, and chat with pros.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
                  onClick={() => navigate("/freelancer/mentorship")}
                >
                  Request Mentorship
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {freelancerProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="font-semibold">${freelancerProfile.hourlyRate}/hr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Portfolio Items</span>
                <span className="font-semibold">{freelancerProfile.portfolioItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Repeat Clients</span>
                <span className="font-semibold">{freelancerProfile.repeatClientsRate}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="mb-2 text-lg font-semibold">Next Steps</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <ArrowRight className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Compare your profile with competitors
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Get AI-powered insights
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Follow your personalized roadmap
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboardPage;
