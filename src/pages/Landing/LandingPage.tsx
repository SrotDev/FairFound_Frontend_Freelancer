import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Lightbulb, 
  Briefcase, 
  ShoppingBag, 
  Code, 
  Building2,
  
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const LandingPage = () => {
  const { setSelectedIndustry } = useAppContext();

  const handleIndustryPreselect = (industry: "Freelancer" | "E-commerce" | "Developer" | "Business") => {
    setSelectedIndustry(industry);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-cyan-400 to-cyan-600 dark:from-gray-300 dark:via-cyan-300 dark:to-sky-900 py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm dark:bg-slate-200 dark:text-slate-700">
              <BarChart3 className="h-4 w-4 dark:text-slate-700" />
              Data-driven career growth
            </div>
            <h1 className="mb-6 text-4xl font-bold text-white lg:text-6xl dark:text-slate-800">
              See where you stand.
              <br />
              <span className="text-cyan-600 dark:text-cyan-700">Grow where it counts.</span>
            </h1>
            <p className="mb-8 text-lg text-white/90 lg:text-xl dark:text-gray-100">
              FairFound helps freelancers and professionals compare their profiles, get AI-powered insights, and improve across industries. Get the data you need to grow today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-accent-foreground font-semibold">
                  Start your journey
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">How it works</h2>
            <p className="text-muted-foreground">
              Four simple steps to unlock your potential
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Target,
                title: "Choose your industry",
                description: "Select your professional path from freelancing, e-commerce, development, or business",
              },
              {
                icon: TrendingUp,
                title: "Connect your profile",
                description: "Link or input your professional data for accurate comparison",
              },
              {
                icon: BarChart3,
                title: "Compare & get insights",
                description: "See how you stack up and get AI-powered SWOT analysis",
              },
              {
                icon: Lightbulb,
                title: "Follow your roadmap",
                description: "Implement personalized recommendations to improve your standing",
              },
            ].map((step, index) => (
              <Card key={index} className="p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <step.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is FairFound For */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Who is FairFound for?</h2>
            <p className="text-muted-foreground">
              Tailored insights for every professional path
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Briefcase,
                title: "Freelancer",
                description: "Profile comparison, AI career coach, and portfolio insights to win more clients",
                industry: "Freelancer" as const,
                available: true,
              },
              {
                icon: ShoppingBag,
                title: "E-commerce Seller",
                description: "Product comparison, pricing recommendations, and sentiment analysis",
                industry: "E-commerce" as const,
                available: false,
              },
              {
                icon: Code,
                title: "Developer",
                description: "GitHub analysis, skill mapping, and project insights to level up",
                industry: "Developer" as const,
                available: false,
              },
              {
                icon: Building2,
                title: "Business Owner",
                description: "Performance metrics, customer sentiment, and market trends analysis",
                industry: "Business" as const,
                available: false,
              },
            ].map((industry, index) => (
              <Card 
                key={index} 
                className={`group p-6 transition-all ${
                  industry.available 
                    ? 'hover:shadow-xl hover:border-accent cursor-pointer' 
                    : 'opacity-60'
                }`}
              >
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
                  industry.available 
                    ? 'bg-accent/10 group-hover:bg-accent/20' 
                    : 'bg-muted'
                }`}>
                  <industry.icon className={`h-7 w-7 ${industry.available ? 'text-accent' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{industry.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{industry.description}</p>
                {industry.available ? (
                  <Link to="/register" onClick={() => handleIndustryPreselect(industry.industry)}>
                    <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled className="w-full">
                    Coming Soon
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-cyan-200 to-blue-700">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Ready to discover your potential?
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Join professionals who are using data to drive their career growth
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-sky-700 hover:bg-sky-800 text-accent-foreground font-semibold dark:bg-cyan-700 dark:hover:bg-cyan-800">
                Start for free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
