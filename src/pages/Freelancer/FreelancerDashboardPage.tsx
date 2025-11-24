import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { PseudoRankingBadge } from "@/components/freelancer/PseudoRankingBadge";
import { useAppContext } from "@/context/AppContext";
import { Eye, TrendingUp, Target, Mail, ArrowRight } from "lucide-react";

const FreelancerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, freelancerProfile, calculatePseudoRanking } = useAppContext();
  const pseudoRanking = calculatePseudoRanking();

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Freelancer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "there"}. Here's where you stand today.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PseudoRankingBadge score={pseudoRanking} />

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

          <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Ready to see how you compare?</h3>
                <p className="text-white/90">
                  Compare your profile against top freelancers and specific competitors
                </p>
              </div>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
                onClick={() => navigate("/freelancer/compare")}
              >
                Compare your profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
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
