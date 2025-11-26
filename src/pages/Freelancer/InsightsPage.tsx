import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, AlertCircle, Target, ShieldAlert } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ReferenceLine,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const InsightsPage = () => {
  const navigate = useNavigate();
  const { freelancerProfile } = useAppContext();

  // --- Charts data (mocked from current profile metrics) ---
  const weeks = ["W-7", "W-6", "W-5", "W-4", "W-3", "W-2", "W-1", "W0"];
  const weeklyPerformance = weeks.map((w, i) => {
    const base = 90 + i * 8;
    const proposals = 3 + (i % 4);
    const successes = Math.max(0, Math.round(proposals * (0.15 + i * 0.02)));
    const successRate = Math.round((successes / proposals) * 100);
    return { week: w, views: base + (i % 3) * 10, proposals, successRate };
  });

  const skills = freelancerProfile.skills.slice(0, 5);
  const skillSlices = skills.map((s, idx) => ({ name: s, value: 10 + (idx + 1) * 5 }));

  const hourlyBenchmark = [
    { name: "You", value: freelancerProfile.hourlyRate },
    { name: "Market Median", value: 60 },
  ];

  const repeatRate = freelancerProfile.repeatClientsRate;

  const swotData = [
    {
      category: "Strengths",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
      items: [
        "Strong React and TypeScript portfolio with modern projects",
        "Competitive hourly rate for your experience level",
        "Good profile completeness showing professionalism",
        "Diverse skill set covering frontend and UI/UX",
      ],
    },
    {
      category: "Weaknesses",
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
      items: [
        "Low proposal success rate (18%) needs improvement",
        "Portfolio depth below market leaders (8 vs 15 items)",
        "Limited backend and DevOps skills",
        "Repeat client rate could be higher (25% vs 45%)",
      ],
    },
    {
      category: "Opportunities",
      icon: Target,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20",
      items: [
        "High demand for React developers in current market",
        "Adding Next.js expertise could increase opportunities",
        "Potential to build stronger case studies",
        "Growing need for full-stack capabilities",
      ],
    },
    {
      category: "Threats",
      icon: ShieldAlert,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
      items: [
        "Increasing competition in frontend development",
        "Market shifting toward full-stack requirements",
        "AI tools impacting junior-level opportunities",
        "Price competition from global freelancers",
      ],
    },
  ];

  const suggestions = [
    {
      category: "Skills to Improve",
      items: [
        { title: "Learn Next.js", impact: "High", effort: "Medium" },
        { title: "Add Node.js/Express backend skills", impact: "High", effort: "High" },
        { title: "Basic DevOps (Docker, CI/CD)", impact: "Medium", effort: "Medium" },
      ],
    },
    {
      category: "Portfolio Improvements",
      items: [
        { title: "Create 3 detailed case studies", impact: "High", effort: "Medium" },
        { title: "Add before/after metrics to projects", impact: "Medium", effort: "Low" },
        { title: "Showcase a full-stack project", impact: "High", effort: "High" },
      ],
    },
    {
      category: "Proposal Strategy",
      items: [
        { title: "Personalize each proposal more", impact: "High", effort: "Low" },
        { title: "Lead with client benefits, not features", impact: "High", effort: "Low" },
        { title: "Include relevant portfolio samples", impact: "Medium", effort: "Low" },
      ],
    },
  ];

  const trendingSkills = [
    { name: "Next.js", demand: "Very High" },
    { name: "TypeScript", demand: "High" },
    { name: "Tailwind CSS", demand: "High" },
    { name: "Node.js", demand: "Very High" },
    { name: "PostgreSQL", demand: "Medium" },
    { name: "Docker", demand: "Medium" },
  ];

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Insights & AI Career Coach</h1>
          <p className="text-muted-foreground">
            A snapshot of your strengths, weaknesses, opportunities, and threats
          </p>
        </div>

        {/* Performance & Growth */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Profile Views (last 8 weeks)</h3>
            <ChartContainer
              config={{
                views: { label: "Views", color: "hsl(var(--chart-1))" },
              }}
              className="aspect-[4/3]"
            >
              <AreaChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="views" stroke="var(--color-views)" fill="var(--color-views)" fillOpacity={0.25} />
              </AreaChart>
            </ChartContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Proposals vs Success Rate</h3>
            <ChartContainer
              config={{
                proposals: { label: "Proposals", color: "hsl(var(--chart-2))" },
                successRate: { label: "Success %", color: "hsl(var(--chart-3))" },
              }}
              className="aspect-[4/3]"
            >
              <LineChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="proposals" stroke="var(--color-proposals)" strokeWidth={2} />
                <Line type="monotone" dataKey="successRate" stroke="var(--color-successRate)" strokeDasharray="4 3" strokeWidth={2} />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Skills & Monetization */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Skills Focus Distribution</h3>
            <ChartContainer
              config={{
                slice1: { label: skills[0], color: "hsl(var(--chart-1))" },
                slice2: { label: skills[1], color: "hsl(var(--chart-2))" },
                slice3: { label: skills[2], color: "hsl(var(--chart-3))" },
                slice4: { label: skills[3], color: "hsl(var(--chart-4))" },
                slice5: { label: skills[4], color: "hsl(var(--chart-5))" },
              }}
              className="aspect-[4/3]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={skillSlices} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                  {skillSlices.map((_, idx) => (
                    <Cell key={idx} fill={`var(--color-slice${idx + 1})`} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Hourly Rate vs Market</h3>
            <ChartContainer
              config={{
                You: { label: "You", color: "hsl(var(--chart-1))" },
                Market: { label: "Market Median", color: "hsl(var(--chart-2))" },
              }}
              className="aspect-[4/3]"
            >
              <BarChart data={hourlyBenchmark}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ReferenceLine y={85} label="Top Quartile" stroke="hsl(var(--chart-3))" strokeDasharray="4 3" />
                <Bar dataKey="value" fill="var(--color-You)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Client Repeat Rate</h3>
            <ChartContainer
              config={{
                repeat: { label: "Repeat %", color: "hsl(var(--chart-4))" },
              }}
              className="aspect-[4/3]"
            >
              <RadialBarChart startAngle={90} endAngle={-270} innerRadius={60} outerRadius={90} data={[{ name: "repeat", value: repeatRate, fill: "var(--color-repeat)" }]}> 
                <RadialBar background dataKey="value" cornerRadius={6} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadialBarChart>
            </ChartContainer>
            <p className="mt-2 text-sm text-muted-foreground">Current repeat clients: {repeatRate}%</p>
          </Card>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {swotData.map((section) => (
            <Card
              key={section.category}
              className={`p-6 ${section.bgColor} border-2 ${section.borderColor}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className={`rounded-lg bg-background p-2`}>
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <h3 className="text-xl font-bold">{section.category}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <span className="mr-2 mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="mb-8 p-6">
          <h2 className="mb-6 text-2xl font-bold">AI-Powered Suggestions</h2>
          <div className="space-y-6">
            {suggestions.map((group) => (
              <div key={group.category}>
                <h3 className="mb-3 text-lg font-semibold">{group.category}</h3>
                <div className="space-y-3">
                  {group.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                    >
                      <span className="font-medium">{item.title}</span>
                      <div className="flex gap-2">
                        <Badge
                          variant="secondary"
                          className={
                            item.impact === "High"
                              ? "bg-success/20 text-success"
                              : "bg-muted"
                          }
                        >
                          {item.impact} impact
                        </Badge>
                        <Badge variant="outline">{item.effort} effort</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-8 p-6">
          <h2 className="mb-6 text-2xl font-bold">Market Demand & Skills Mapping</h2>
          <div className="mb-4">
            <h3 className="mb-3 text-lg font-semibold">Trending Skills in Your Niche</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trendingSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <span className="font-medium">{skill.name}</span>
                  <Badge
                    variant="secondary"
                    className={
                      skill.demand === "Very High"
                        ? "bg-accent/20 text-accent"
                        : skill.demand === "High"
                        ? "bg-secondary/20 text-secondary"
                        : "bg-muted"
                    }
                  >
                    {skill.demand}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-accent/5 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Recommended focus:</strong> Prioritize Next.js and Node.js to become a full-stack developer.
              This combination has the highest market demand and will significantly improve your competitive position.
            </p>
          </div>
        </Card>

        <Button size="lg" className="w-full" onClick={() => navigate("/freelancer/roadmap")}>
          Create Your Improvement Roadmap
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InsightsPage;
