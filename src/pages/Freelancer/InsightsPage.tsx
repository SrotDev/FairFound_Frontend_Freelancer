import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, AlertCircle, Target, ShieldAlert } from "lucide-react";

const InsightsPage = () => {
  const navigate = useNavigate();

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
