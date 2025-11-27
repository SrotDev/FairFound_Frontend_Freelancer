import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ShoppingBag, Code, Building2, ArrowRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Industry } from "@/types/domain";

const IndustryDashboardPage = () => {
  const navigate = useNavigate();
  const { setSelectedIndustry } = useAppContext();

  const handleIndustrySelect = (industry: Industry) => {
    setSelectedIndustry(industry);
    navigate("/register");
  };

  const industries = [
    {
      icon: Briefcase,
      title: "Freelancer",
      description: "Profile comparison, AI career coach, and portfolio insights to win more clients and grow your freelance business.",
      available: true,
      value: "Freelancer" as const,
      features: ["Profile scoring", "Competitor analysis", "Career roadmap"],
    },
    {
      icon: ShoppingBag,
      title: "E-commerce Seller",
      description: "Product comparison, pricing recommendations, and sentiment analysis to optimize your online store performance.",
      available: false,
      value: "E-commerce" as const,
      features: ["Product insights", "Price optimization", "Review analysis"],
    },
    {
      icon: Code,
      title: "Developer",
      description: "GitHub analysis, skill mapping, and project insights to level up your technical career and land better opportunities.",
      available: false,
      value: "Developer" as const,
      features: ["GitHub stats", "Skill gaps", "Project showcase"],
    },
    {
      icon: Building2,
      title: "Business Owner",
      description: "Performance metrics, customer sentiment, and market trends analysis to make data-driven business decisions.",
      available: false,
      value: "Business" as const,
      features: ["KPI tracking", "Market analysis", "Growth insights"],
    },
  ];

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Choose your industry</h1>
          <p className="text-lg text-muted-foreground">
            We'll tailor your insights and roadmap based on what you do
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((industry) => (
            <Card
              key={industry.title}
              className={`group relative p-6 transition-all ${
                industry.available
                  ? "hover:shadow-xl hover:border-accent cursor-pointer"
                  : "opacity-60"
              }`}
            >
              <div className="mb-4">
                <div
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
                    industry.available
                      ? "bg-accent/10 group-hover:bg-accent/20"
                      : "bg-muted"
                  }`}
                >
                  <industry.icon
                    className={`h-7 w-7 ${
                      industry.available ? "text-accent" : "text-muted-foreground"
                    }`}
                  />
                </div>
                {!industry.available && (
                  <span className="inline-block rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                    Coming Soon
                  </span>
                )}
              </div>

              <h3 className="mb-2 text-2xl font-bold">{industry.title}</h3>
              <p className="mb-4 text-muted-foreground">{industry.description}</p>

              <ul className="mb-6 space-y-2">
                {industry.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-muted-foreground">
                    <ArrowRight className="mr-2 h-4 w-4 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              {industry.available ? (
                <Button
                  className="w-full hover:bg-cyan-700 dark:hover:text-white transition-colors"
                  onClick={() => handleIndustrySelect(industry.value)}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  Coming Soon
                </Button>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">Don't see your industry?</h3>
          <p className="text-muted-foreground">
            We're constantly expanding. Join our waitlist to be notified when your industry is added.
          </p>
          <Button variant="outline" className="mt-4 bg-cyan-700 text-slate-100 hover:bg-cyan-800 dark:hover:bg-cyan-600">
            Join Waitlist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndustryDashboardPage;
