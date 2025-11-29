import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfile as getFreelancerProfile } from "@/lib/endpoints/freelancer";

import type { FreelancerMetrics } from "@/types/domain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useComparisonHistory } from "@/hooks/use-comparison-history";
import { createComparison } from "@/lib/endpoints/comparison";
import { getMyRanking } from "@/lib/endpoints/ranking";
import { toast } from "@/components/ui/use-toast";

const ProfileComparisonPage = () => {
  const navigate = useNavigate();
  const { freelancerProfile } = useAppContext();
  useComparisonHistory();
  const [apiProfile, setApiProfile] = useState<any | null>(null);
 

  useEffect(() => {
    (async () => {
      try {
        const p = await getFreelancerProfile();
        if (p && typeof p === 'object') {
          // Normalize snake_case -> camelCase for internal usage
          const normalized: FreelancerMetrics = {
            profileCompleteness: p.profile_completeness ?? freelancerProfile.profileCompleteness,
            profileViews: p.profile_views ?? freelancerProfile.profileViews,
            proposalSuccessRate: p.proposal_success_rate ?? freelancerProfile.proposalSuccessRate,
            jobInvitations: p.job_invitations ?? freelancerProfile.jobInvitations,
            hourlyRate: p.hourly_rate ?? freelancerProfile.hourlyRate,
            skills: Array.isArray(p.skills) ? p.skills : freelancerProfile.skills,
            portfolioItems: p.portfolio_items ?? freelancerProfile.portfolioItems,
            repeatClientsRate: p.repeat_clients_rate ?? freelancerProfile.repeatClientsRate,
          };
          setApiProfile(normalized);
        } else {
          setApiProfile(null);
        }
      } catch (e) {
        setApiProfile(null);
      }
    })();
  }, []);
 
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [selectedRole, setSelectedRole] = useState("web-developer");
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(
    null
  );
  const [comparisonStarted, setComparisonStarted] = useState(false);
   // server profile state
    const [serverProfile, setServerProfile] =
      useState<FreelancerMetrics | null>(null);
  
    const [loadingProfile, setLoadingProfile] = useState(false);

  // Backend ranking state
  const [backendScore, setBackendScore] = useState<number | null>(null);

  // ----------------------------
  // Load backend ranking
  // ----------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await getMyRanking();
        if (res && typeof res.score === "number") setBackendScore(res.score);
        // We intentionally do not use backend breakdown for charts since it's weighted, not raw metrics
      } catch (e) {
        console.warn("Failed to load backend ranking", e);
      }
    })();
  }, []);

  // ----------------------------
  // Suggested competitors
  // ----------------------------
  const suggestedCompetitors = (
    role: string
  ): { tier: "Top" | "Mid" | "Low"; name: string; url: string }[] => {
    const base = role.replace(/-/g, " ");
    const make = (tier: "Top" | "Mid" | "Low", i: number) => ({
      tier,
      name: `${base} Freelancer ${i + 1}`,
      url: `https://marketplace.example/${role}/${tier.toLowerCase()}-${i + 1}`,
    });
    return [
      ...Array.from({ length: 2 }, (_, i) => make("Top", i)),
      ...Array.from({ length: 2 }, (_, i) => make("Mid", i)),
      ...Array.from({ length: 2 }, (_, i) => make("Low", i)),
    ];
  };

  // ----------------------------
  // Default benchmark
  // ----------------------------
  const topFreelancersAverage = {
    profileCompleteness: 92,
    proposalSuccessRate: 35,
    portfolioItems: 15,
    hourlyRate: 75,
    repeatClientsRate: 45,
  };

  // ----------------------------
  // Tier label
  // ----------------------------
  const getTier = (score: number): { label: string; color: string } => {
    if (score >= 80) return { label: "Top-tier ready", color: "bg-success" };
    if (score >= 60) return { label: "Competitive", color: "bg-secondary" };
    return { label: "Emerging", color: "bg-warning" };
  };

  // ----------------------------
  // User score — backend preferred
  // ----------------------------
  const userScore =
    backendScore ??
    Math.round(
      (freelancerProfile.profileCompleteness * 0.3 +
        freelancerProfile.proposalSuccessRate * 2 +
        freelancerProfile.portfolioItems * 2 +
        freelancerProfile.repeatClientsRate * 0.5) /
        2
    );

  const userTier = getTier(userScore);

  // ----------------------------
  // Chart + Comparison data
  // ----------------------------
  const m= apiProfile || freelancerProfile;

  const comparisonData = [
    { metric: "Completeness", You: m?.profile_completeness, Top: 92 },
    { metric: "Proposals", You: m?.proposal_success_rate, Top: 35 },
    { metric: "Portfolio", You: m?.portfolio_items, Top: 15 },
    { metric: "Hourly $", You: m?.hourly_rate, Top: 75 },
    { metric: "Repeat %", You: m?.repeat_clients_rate, Top: 45 },
  ];

  // ----------------------------
  // UI
  // ----------------------------
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
          {/* SIDEBAR */}
          <Card className="p-6 lg:col-span-1 space-y-6">
            {/* Role selector */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Market / Role</h3>
              <Select
                value={selectedRole}
                onValueChange={(v) => {
                  setSelectedRole(v);
                  setSelectedCompetitor(null);
                }}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-developer">Web Developer</SelectItem>
                  <SelectItem value="graphic-designer">
                    Graphic Designer
                  </SelectItem>
                  <SelectItem value="content-writer">Content Writer</SelectItem>
                  <SelectItem value="marketing">
                    Marketing Specialist
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Suggested competitors */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Suggested Competitors</h3>
              <div className="space-y-3">
                {(["Top", "Mid", "Low"] as const).map((tier) => (
                  <div key={tier}>
                    <div className="mb-2 text-xs font-medium text-muted-foreground">
                      {tier} tier
                    </div>
                    <div className="grid gap-2">
                      {suggestedCompetitors(selectedRole)
                        .filter((c) => c.tier === tier)
                        .map((c) => (
                          <button
                            key={c.url}
                            className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                              selectedCompetitor === c.url
                                ? "border-accent bg-accent/10"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => setSelectedCompetitor(c.url)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm truncate">{c.name}</span>
                              <span className="text-xs text-muted-foreground">
                                Select
                              </span>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual URL */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Or Compare via URL</h3>
              <Input
                placeholder="https://marketplace.com/profile/username"
                value={competitorUrl}
                onChange={(e) => {
                  setCompetitorUrl(e.target.value);
                  if (e.target.value) setSelectedCompetitor(null);
                }}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Paste a public profile URL to compare directly.
              </p>
            </div>

            {/* User tier */}
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="mb-2 text-sm font-semibold">Your Current Standing</h4>
              <Badge className={userTier.color}>{userTier.label}</Badge>
            </div>

            {/* Start comparison */}
            <Button
              className="w-full"
              onClick={async () => {
                const chosenUrl =
                  selectedCompetitor ?? (competitorUrl || undefined);
                setComparisonStarted(true);
                try {
                  await createComparison({
                    competitor_identifier:
                      chosenUrl || `suggested:${selectedRole}`,
                    competitor_role: selectedRole,
                    pseudo_ranking: userScore,
                    snapshot: {
                      userMetrics: {
                        ...m,
                        skills: (freelancerProfile as any).skills || [],
                      },
                    },
                  });

                  toast({
                    title: "Comparison saved",
                    description: "Added to your comparison history.",
                  });
                } catch (e) {
                  console.error("Failed to save comparison entry", e);
                  toast({
                    title: "Failed to save comparison",
                    description: "Please try again.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Start Comparison
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {!comparisonStarted ? (
              <Card className="p-8 text-center">
                <h3 className="mb-2 text-xl font-semibold">No comparison yet</h3>
                <p className="text-muted-foreground">
                  Choose a competitor or paste a URL, then click Start Comparison.
                </p>
              </Card>
            ) : (
              <>
                {/* Results */}
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-6">
                    <h3 className="text-xl font-bold">Comparison Results</h3>
                    <p className="text-sm text-muted-foreground">
                      You vs. Top Freelancers in{" "}
                      {selectedRole.replace("-", " ")}
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    <ComparisonRow
                      label="Profile Completeness"
                      userValue={m.profileCompleteness}
                      topValue={92}
                      unit="%"
                    />
                    <ComparisonRow
                      label="Proposal Success Rate"
                      userValue={m.proposalSuccessRate}
                      topValue={35}
                      unit="%"
                    />
                    <ComparisonRow
                      label="Portfolio Depth"
                      userValue={m.portfolioItems}
                      topValue={15}
                      unit=" projects"
                    />
                    <ComparisonRow
                      label="Hourly Rate"
                      userValue={m.hourlyRate}
                      topValue={75}
                      unit="$/hr"
                      prefix="$"
                    />
                    <ComparisonRow
                      label="Repeat Clients"
                      userValue={m.repeatClientsRate}
                      topValue={45}
                      unit="%"
                    />
                  </div>
                </Card>

                {/* Charts */}
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Visualizations</h3>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Bar chart */}
                    <ChartContainer
                      config={{
                        You: { label: "You", color: "hsl(var(--chart-1))" },
                        Top: { label: "Top Avg", color: "hsl(var(--chart-2))" },
                      }}
                      className="aspect-[4/3]"
                    >
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="You"
                          fill="var(--color-You)"
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar
                          dataKey="Top"
                          fill="var(--color-Top)"
                          radius={[6, 6, 0, 0]}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                      </BarChart>
                    </ChartContainer>

                    {/* Radar chart */}
                    <ChartContainer
                      config={{
                        You: { label: "You", color: "hsl(var(--chart-1))" },
                        Top: { label: "Top Avg", color: "hsl(var(--chart-2))" },
                      }}
                      className="aspect-[4/3]"
                    >
                      <RadarChart data={comparisonData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis />
                        <Radar
                          name="You"
                          dataKey="You"
                          stroke="var(--color-You)"
                          fill="var(--color-You)"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Top"
                          dataKey="Top"
                          stroke="var(--color-Top)"
                          fill="var(--color-Top)"
                          fillOpacity={0.3}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                      </RadarChart>
                    </ChartContainer>
                  </div>
                </Card>

                <Button
                  size="lg"
                  className="mt-4 w-full"
                  onClick={() => navigate("/freelancer/insights")}
                >
                  View Insights
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {/* Relative position */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Relative Position</h3>

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
                    <span className="text-xs font-bold text-accent-foreground">
                      {userScore}
                    </span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-3 text-xs text-muted-foreground">
                  <span>0-59</span>
                  <span className="text-center">60-79</span>
                  <span className="text-right">80-100</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------
// SMALL COMPONENT
// -----------------------------------
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
