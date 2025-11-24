import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PseudoRankingBadge } from "@/components/freelancer/PseudoRankingBadge";
import { useAppContext } from "@/context/AppContext";
import { ArrowRight, TrendingUp, TrendingDown, Sparkles } from "lucide-react";

const ReEvaluationPage = () => {
  const navigate = useNavigate();
  const { previousPseudoRanking, calculatePseudoRanking, freelancerProfile } = useAppContext();

  const currentRanking = calculatePseudoRanking();
  const improvement = previousPseudoRanking ? currentRanking - previousPseudoRanking : 0;

  const metrics = [
    {
      label: "Profile Completeness",
      previous: 72,
      current: freelancerProfile.profileCompleteness,
      unit: "%",
    },
    {
      label: "Portfolio Items",
      previous: 8,
      current: freelancerProfile.portfolioItems,
      unit: " projects",
    },
    {
      label: "Proposal Success Rate",
      previous: 18,
      current: freelancerProfile.proposalSuccessRate,
      unit: "%",
    },
  ];

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            Profile Updated
          </div>
          <h1 className="mb-2 text-4xl font-bold">Profile Re-evaluation</h1>
          <p className="text-muted-foreground">
            Here's how your changes impact your standing
          </p>
        </div>

        <Card className="mb-8 p-8 bg-gradient-to-br from-accent/5 to-secondary/5">
          <h2 className="mb-6 text-center text-2xl font-bold">Before vs After</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 text-center text-sm font-medium text-muted-foreground">Previous Ranking</p>
              <div className="rounded-xl border-2 border-muted bg-background p-6 text-center">
                <div className="mb-2 text-5xl font-bold text-muted-foreground">
                  {previousPseudoRanking || 68}
                </div>
                <p className="text-sm text-muted-foreground">out of 100</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-center text-sm font-medium text-muted-foreground">New Ranking</p>
              <div className="rounded-xl border-2 border-accent bg-background p-6 text-center">
                <div className="mb-2 text-5xl font-bold text-accent">{currentRanking}</div>
                <p className="text-sm text-muted-foreground">out of 100</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-6 py-3">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-lg font-bold text-success">+{improvement} points improvement</span>
            </div>
          </div>
        </Card>

        <Card className="mb-8 p-6">
          <h3 className="mb-4 text-xl font-bold">Key Metric Changes</h3>
          <div className="space-y-4">
            {metrics.map((metric) => {
              const change = metric.current - metric.previous;
              const isPositive = change > 0;

              return (
                <div
                  key={metric.label}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{metric.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {metric.previous}
                      {metric.unit} → {metric.current}
                      {metric.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span
                      className={`text-lg font-bold ${
                        isPositive ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {change}
                      {metric.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="mb-8 p-6 bg-muted/30">
          <h3 className="mb-2 text-lg font-semibold">What This Means</h3>
          <p className="mb-4 text-muted-foreground">
            Based on your updated profile and roadmap progress, your pseudo-ranking has improved. This
            reflects better profile completeness, stronger portfolio presentation, and alignment with
            market demand.
          </p>
          <p className="text-sm text-muted-foreground">
            Remember: This is a relative insight based on your profile data, not a global ranking. Keep
            improving to maintain your competitive edge.
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/freelancer/compare")}
          >
            Compare Again
          </Button>
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate("/freelancer/dashboard")}
          >
            Back to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReEvaluationPage;
