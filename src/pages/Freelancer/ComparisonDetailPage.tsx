import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useComparisonHistory } from "@/hooks/use-comparison-history";
import { useAppContext } from "@/context/AppContext";
import { TrendingUp, TrendingDown, ExternalLink, ArrowLeft, RotateCcw } from "lucide-react";

const ComparisonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entries, addEntry } = useComparisonHistory();
  const { freelancerProfile } = useAppContext();

  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="container py-12">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card className="p-8 text-center">Comparison not found.</Card>
      </div>
    );
  }

  const top = {
    profileCompleteness: entry.topFreelancersAverage?.profileCompleteness ?? 92,
    proposalSuccessRate: entry.topFreelancersAverage?.proposalSuccessRate ?? 35,
    portfolioItems: entry.topFreelancersAverage?.portfolioItems ?? 15,
    hourlyRate: entry.topFreelancersAverage?.hourlyRate ?? 75,
    repeatClientsRate: entry.topFreelancersAverage?.repeatClientsRate ?? 45,
  };

  const calcScore = (m: typeof freelancerProfile) =>
    Math.round(
      (m.profileCompleteness * 0.3 + m.proposalSuccessRate * 2 + m.portfolioItems * 2 + m.repeatClientsRate * 0.5) / 2
    );

  const userScore = entry.userScore ?? calcScore(entry.userMetrics as any);

  const recompare = () => {
    const newScore = calcScore(freelancerProfile);
    const newEntry = addEntry({
      role: entry.role,
      userMetrics: freelancerProfile,
      topFreelancersAverage: entry.topFreelancersAverage,
      userScore: newScore,
      competitorUrl: entry.competitorUrl,
    });
    navigate(`/freelancer/comparison-history/${newEntry.id}`);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 lg:px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl md:text-4xl font-bold">Comparison Details</h1>
          <div className="flex items-center gap-3 text-muted-foreground">
            <p>
              {new Date(entry.createdAt).toLocaleString()} • {entry.role.replace("-", " ")}
            </p>
            <Badge variant="secondary" className="px-2.5">Score {userScore}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button className="bg-accent text-accent-foreground" onClick={recompare}>
            <RotateCcw className="h-4 w-4 mr-2" /> Recompare
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden mb-6 rounded-xl">
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-6">
          <h3 className="text-xl font-bold">You vs. Top Freelancers</h3>
          {entry.competitorUrl && (
            <a
              href={entry.competitorUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm text-accent hover:underline mt-1"
            >
              View competitor <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
        <div className="p-6 space-y-6">
          <ComparisonRow label="Profile Completeness" userValue={entry.userMetrics.profileCompleteness} topValue={top.profileCompleteness} unit="%" />
          <ComparisonRow label="Proposal Success Rate" userValue={entry.userMetrics.proposalSuccessRate} topValue={top.proposalSuccessRate} unit="%" />
          <ComparisonRow label="Portfolio Depth" userValue={entry.userMetrics.portfolioItems} topValue={top.portfolioItems} unit=" projects" />
          <ComparisonRow label="Hourly Rate" userValue={entry.userMetrics.hourlyRate} topValue={top.hourlyRate} unit="$/hr" prefix="$" />
          <ComparisonRow label="Repeat Clients" userValue={entry.userMetrics.repeatClientsRate} topValue={top.repeatClientsRate} unit="%" />
        </div>
      </Card>

      <Card className="p-6 rounded-xl">
        <h3 className="mb-4 text-lg font-semibold">Relative Position</h3>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Emerging</span>
              <span className="font-medium">Competitive</span>
              <span className="font-medium">Top-tier</span>
            </div>
            <div className="relative h-8 rounded-full bg-gradient-to-r from-warning/20 via-secondary/20 to-success/20">
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-accent border-4 border-background shadow-lg flex items-center justify-center"
                style={{ left: `${userScore}%` }}
              >
                <span className="text-xs font-bold text-accent-foreground">{userScore}</span>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 text-xs text-muted-foreground">
              <span>0-59</span>
              <span className="text-center">60-79</span>
              <span className="text-right">80-100</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ComparisonRow = ({
  label,
  userValue,
  topValue,
  unit,
  prefix = "",
}: {
  label: string;
  userValue: number;
  topValue: number;
  unit: string;
  prefix?: string;
}) => {
  const difference = userValue - topValue;
  const isPositive = difference >= 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span className={`text-sm font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : ""}
            {difference.toFixed(0)}
            {unit}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg bg-accent/10 p-3">
          <div className="text-xs text-muted-foreground">You</div>
          <div className="mt-1 text-lg font-bold text-accent">
            {prefix}
            {userValue}
            {unit}
          </div>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <div className="text-xs text-muted-foreground">Top Freelancers</div>
          <div className="mt-1 text-lg font-bold">
            {prefix}
            {topValue}
            {unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonDetailPage;
