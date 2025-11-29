import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { getProfile as getFreelancerProfile } from "@/lib/endpoints/freelancer";
import type { FreelancerMetrics } from "@/types/domain";

const ProfileComparisonPage = () => {
  const navigate = useNavigate();
  const { freelancerProfile } = useAppContext();
  useComparisonHistory();

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

  // backend ranking
  const [backendScore, setBackendScore] = useState<number | null>(null);

  // -------------------------------------------------------
  // Load Ranking
  // -------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await getMyRanking();
        if (res?.score) setBackendScore(res.score);
      } catch (e) {
        console.log("Ranking fetch failed", e);
      }
    })();
  }, []);

  // -------------------------------------------------------
  // Load Freelancer profile from API
  // -------------------------------------------------------
  useEffect(() => {
    (async () => {
      setLoadingProfile(true);
      try {
        const p = await getFreelancerProfile();
        if (!p) return;

        const normalized: FreelancerMetrics = {
          profileCompleteness:
            p.profile_completeness ?? p.profileCompleteness ?? freelancerProfile.profileCompleteness,
          profileViews:
            p.profile_views ?? p.profileViews ?? freelancerProfile.profileViews,
          proposalSuccessRate:
            p.proposal_success_rate ??
            p.proposalSuccessRate ??
            freelancerProfile.proposalSuccessRate,
          jobInvitations:
            p.job_invitations ??
            p.jobInvitations ??
            freelancerProfile.jobInvitations,
          hourlyRate:
            p.hourly_rate ?? p.hourlyRate ?? freelancerProfile.hourlyRate,
          skills: Array.isArray(p.skills) ? p.skills : freelancerProfile.skills,
          portfolioItems:
            p.portfolio_items ??
            p.portfolioItems ??
            freelancerProfile.portfolioItems,
          repeatClientsRate:
            p.repeat_clients_rate ??
            p.repeatClientsRate ??
            freelancerProfile.repeatClientsRate,
        };

        setServerProfile(normalized);
      } catch (e) {
        console.log("Failed to load profile", e);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  const metrics = serverProfile ?? freelancerProfile;

  // compute score
  const userScore =
    backendScore ??
    Math.round(
      (metrics.profileCompleteness * 0.3 +
        metrics.proposalSuccessRate * 2 +
        metrics.portfolioItems * 2 +
        metrics.repeatClientsRate * 0.5) /
        2
    );

  const getTier = (score: number) => {
    if (score >= 80) return { label: "Top-tier", color: "bg-success" };
    if (score >= 60) return { label: "Competitive", color: "bg-secondary" };
    return { label: "Emerging", color: "bg-warning" };
  };

  const userTier = getTier(userScore);

  // ----------------------------
  // Suggested competitors
  // ----------------------------
  const suggestedCompetitors = (
    role: string
  ): { tier: "Top" | "Mid" | "Low"; name: string; url: string }[] => {
    const base = role.replace(/-/g, " ");
    const make = (tier: any, i: number) => ({
      tier,
      name: `${base} Freelancer ${i + 1}`,
      url: `https://example.com/${role}/${tier}-${i + 1}`,
    });

    return [
      make("Top", 0),
      make("Top", 1),
      make("Mid", 0),
      make("Mid", 1),
      make("Low", 0),
      make("Low", 1),
    ];
  };

  // ----------------------------
  // Chart Data
  // ----------------------------
  const comparisonData = [
    { metric: "Completeness", You: metrics.profileCompleteness, Top: 92 },
    { metric: "Proposals", You: metrics.proposalSuccessRate, Top: 35 },
    { metric: "Portfolio", You: metrics.portfolioItems, Top: 15 },
    { metric: "Hourly $", You: metrics.hourlyRate, Top: 75 },
    { metric: "Repeat %", You: metrics.repeatClientsRate, Top: 45 },
  ];

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Profile Comparison</h1>
          <p className="text-muted-foreground">
            Compare your profile with top freelancers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* SIDEBAR */}
          <Card className="p-6 space-y-6">
            {/* ROLE */}
            <div>
              <h3 className="font-semibold mb-2">Market / Role</h3>

              <Select
                value={selectedRole}
                onValueChange={(v) => {
                  setSelectedRole(v);
                  setSelectedCompetitor(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="web-developer">Web Developer</SelectItem>
                  <SelectItem value="graphic-designer">
                    Graphic Designer
                  </SelectItem>
                  <SelectItem value="content-writer">
                    Content Writer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* COMPETITORS */}
            <div>
              <h3 className="font-semibold mb-2">Suggested Competitors</h3>
              {["Top", "Mid", "Low"].map((tier) => (
                <div key={tier} className="mb-3">
                  <div className="text-xs text-muted-foreground">{tier}</div>

                  <div className="mt-1 space-y-2">
                    {suggestedCompetitors(selectedRole)
                      .filter((c) => c.tier === tier)
                      .map((c) => (
                        <button
                          key={c.url}
                          className={`w-full rounded-md border px-3 py-2 text-left ${
                            selectedCompetitor === c.url
                              ? "border-accent bg-accent/10"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setSelectedCompetitor(c.url)}
                        >
                          {c.name}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* URL */}
            <div>
              <h3 className="font-semibold mb-2">Compare via URL</h3>
              <Input
                placeholder="https://marketplace.com/user"
                value={competitorUrl}
                onChange={(e) => {
                  setCompetitorUrl(e.target.value);
                  setSelectedCompetitor(null);
                }}
              />
            </div>

            {/* Tier */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Your Standing</h4>
              <Badge className={userTier.color}>{userTier.label}</Badge>
            </div>

            {/* Button */}
            <Button
              className="w-full"
              onClick={async () => {
                setComparisonStarted(true);
                try {
                  await createComparison({
                    competitor_identifier:
                      selectedCompetitor ||
                      competitorUrl ||
                      `suggested:${selectedRole}`,
                    competitor_role: selectedRole,
                    pseudo_ranking: userScore,
                    snapshot: { userMetrics: metrics },
                  });

                  toast({
                    title: "Comparison saved",
                  });
                } catch {
                  toast({
                    title: "Failed",
                    variant: "destructive",
                  });
                }
              }}
            >
              Start Comparison
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          {/* RESULTS */}
          <div className="lg:col-span-2 space-y-6">
            {!comparisonStarted ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-semibold">No Comparison Yet</h3>
                <p className="text-muted-foreground">
                  Select a competitor and start comparing.
                </p>
              </Card>
            ) : (
              <>
                {/* Comparison rows */}
                <Card className="p-6 space-y-6">
                  <ComparisonRow
                    label="Profile Completeness"
                    userValue={metrics.profileCompleteness}
                    topValue={92}
                    unit="%"
                  />
                  <ComparisonRow
                    label="Proposal Success Rate"
                    userValue={metrics.proposalSuccessRate}
                    topValue={35}
                    unit="%"
                  />
                  <ComparisonRow
                    label="Portfolio Items"
                    userValue={metrics.portfolioItems}
                    topValue={15}
                    unit=""
                  />
                  <ComparisonRow
                    label="Hourly Rate"
                    userValue={metrics.hourlyRate}
                    topValue={75}
                    unit="/hr"
                    prefix="$"
                  />
                  <ComparisonRow
                    label="Repeat Clients"
                    userValue={metrics.repeatClientsRate}
                    topValue={45}
                    unit="%"
                  />
                </Card>

                {/* CHARTS */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Visualizations</h3>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <ChartContainer
                      config={{
                        You: { label: "You", color: "hsl(var(--chart-1))" },
                        Top: { label: "Top", color: "hsl(var(--chart-2))" },
                      }}
                      className="aspect-[4/3]"
                    >
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="You" fill="var(--color-You)" />
                        <Bar dataKey="Top" fill="var(--color-Top)" />
                        <ChartLegend content={<ChartLegendContent />} />
                      </BarChart>
                    </ChartContainer>

                    <ChartContainer
                      config={{
                        You: { label: "You", color: "hsl(var(--chart-1))" },
                        Top: { label: "Top", color: "hsl(var(--chart-2))" },
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
                          fill="var(--color-You)"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Top"
                          dataKey="Top"
                          fill="var(--color-Top)"
                          fillOpacity={0.3}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                      </RadarChart>
                    </ChartContainer>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------
// ROW COMPONENT
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
  const diff = userValue - topValue;
  const positive = diff >= 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {positive ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span
            className={`text-sm font-medium ${
              positive ? "text-success" : "text-destructive"
            }`}
          >
            {diff > 0 ? "+" : ""}
            {diff} {unit}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-accent/10 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">You</div>
          <div className="text-lg font-bold text-accent">
            {prefix}
            {userValue}
            {unit}
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Top</div>
          <div className="text-lg font-bold">
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
