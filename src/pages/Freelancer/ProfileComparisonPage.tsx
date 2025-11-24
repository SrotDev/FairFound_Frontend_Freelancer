import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

const ProfileComparisonPage = () => {
  const navigate = useNavigate();
  const { freelancerProfile } = useAppContext();
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [selectedRole, setSelectedRole] = useState("web-developer");

  const topFreelancersAverage = {
    profileCompleteness: 92,
    proposalSuccessRate: 35,
    portfolioItems: 15,
    hourlyRate: 75,
    repeatClientsRate: 45,
  };

  const getTier = (score: number): { label: string; color: string } => {
    if (score >= 80) return { label: "Top-tier ready", color: "bg-success" };
    if (score >= 60) return { label: "Competitive", color: "bg-secondary" };
    return { label: "Emerging", color: "bg-warning" };
  };

  const calculateUserScore = () => {
    return Math.round(
      (freelancerProfile.profileCompleteness * 0.3 +
        freelancerProfile.proposalSuccessRate * 2 +
        freelancerProfile.portfolioItems * 2 +
        freelancerProfile.repeatClientsRate * 0.5) /
        2
    );
  };

  const userScore = calculateUserScore();
  const userTier = getTier(userScore);

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Profile Comparison</h1>
          <p className="text-muted-foreground">
            See how your skills, portfolio, pricing, and success rates compare
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-1">
            <h3 className="mb-4 text-lg font-semibold">Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Market / Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-developer">Web Developer</SelectItem>
                    <SelectItem value="graphic-designer">Graphic Designer</SelectItem>
                    <SelectItem value="content-writer">Content Writer</SelectItem>
                    <SelectItem value="marketing">Marketing Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="competitor-url">Competitor Profile URL (Optional)</Label>
                <Input
                  id="competitor-url"
                  placeholder="https://..."
                  value={competitorUrl}
                  onChange={(e) => setCompetitorUrl(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter a public profile URL to compare directly
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="mb-2 text-sm font-semibold">Your Current Standing</h4>
                <Badge className={userTier.color}>{userTier.label}</Badge>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-6">
                <h3 className="text-xl font-bold">Comparison Results</h3>
                <p className="text-sm text-muted-foreground">
                  You vs. Top Freelancers in {selectedRole.replace("-", " ")}
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <ComparisonRow
                    label="Profile Completeness"
                    userValue={freelancerProfile.profileCompleteness}
                    topValue={topFreelancersAverage.profileCompleteness}
                    unit="%"
                  />
                  <ComparisonRow
                    label="Proposal Success Rate"
                    userValue={freelancerProfile.proposalSuccessRate}
                    topValue={topFreelancersAverage.proposalSuccessRate}
                    unit="%"
                  />
                  <ComparisonRow
                    label="Portfolio Depth"
                    userValue={freelancerProfile.portfolioItems}
                    topValue={topFreelancersAverage.portfolioItems}
                    unit=" projects"
                  />
                  <ComparisonRow
                    label="Hourly Rate"
                    userValue={freelancerProfile.hourlyRate}
                    topValue={topFreelancersAverage.hourlyRate}
                    unit="$/hr"
                    prefix="$"
                  />
                  <ComparisonRow
                    label="Repeat Clients"
                    userValue={freelancerProfile.repeatClientsRate}
                    topValue={topFreelancersAverage.repeatClientsRate}
                    unit="%"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
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

            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate("/freelancer/insights")}
            >
              Get AI-Powered Insights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
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
          <span
            className={`text-sm font-medium ${
              isPositive ? "text-success" : "text-destructive"
            }`}
          >
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

export default ProfileComparisonPage;
