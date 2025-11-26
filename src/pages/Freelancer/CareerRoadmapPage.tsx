import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/context/AppContext";
import { ArrowRight, CheckCircle2, Circle, Clock, BookOpenCheck, CheckSquare, Target, FileText, Sparkles } from "lucide-react";

const CareerRoadmapPage = () => {
  const navigate = useNavigate();
  const { roadmapMilestones, toggleMilestone, calculatePseudoRanking, freelancerProfile } = useAppContext();

  const completedCount = roadmapMilestones.filter((m) => m.completed).length;
  const progress = (completedCount / roadmapMilestones.length) * 100;
  const currentRanking = calculatePseudoRanking();
  const projectedRanking = Math.min(100, currentRanking + (4 - completedCount) * 4);

  const handleCompareAgain = () => {
    navigate("/freelancer/compare");
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Career Roadmap</h1>
          <p className="text-muted-foreground">
            Actionable steps to improve your profile and ranking
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Current Progress</h3>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-4xl font-bold">{completedCount}</span>
              <span className="text-xl text-muted-foreground">/ {roadmapMilestones.length}</span>
            </div>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Projected Improvement</h3>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-muted-foreground">{currentRanking}</span>
              <ArrowRight className="h-5 w-5 text-accent" />
              <span className="text-4xl font-bold text-accent">{projectedRanking}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Estimated Fair-Ranking after completing all milestones
            </p>
          </Card>
        </div>

        <div className="mb-8 space-y-4">
          {roadmapMilestones.map((milestone, index) => (
            <Card
              key={milestone.id}
              className={`p-6 transition-all ${
                milestone.completed
                  ? "border-success/50 bg-success/5"
                  : "hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  {milestone.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Milestone {index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{milestone.title}</h3>
                    </div>
                    <Checkbox
                      checked={milestone.completed}
                      onCheckedChange={() => toggleMilestone(milestone.id)}
                      className="mt-1"
                    />
                  </div>

                  <p className="mb-3 text-muted-foreground">{milestone.description}</p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{milestone.estimatedEffort}</span>
                  </div>

                  {/* Detailed guidance per milestone */}
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Target className="h-4 w-4" />Objectives</div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>Define clear deliverables and success metrics.</li>
                        <li>Align changes with target client expectations.</li>
                        <li>Benchmark against top freelancers in your niche.</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><BookOpenCheck className="h-4 w-4" />Resources</div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>Course: "Advanced {"UI/UX"} for Web" or Next.js Performance.</li>
                        <li>Templates: Proposal + Case Study skeletons.</li>
                        <li>Tools: Lighthouse, WebPageTest, Notion docs.</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><CheckSquare className="h-4 w-4" />Action Checklist</div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>Update headline and overview with quantifiable impact.</li>
                        <li>Add 2–3 portfolio items with before/after metrics.</li>
                        <li>Create 1 proposal template per service offering.</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4" />Acceptance Criteria</div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>Profile completeness ≥ 85% and ratings consistent.</li>
                        <li>Portfolio includes at least 1 detailed case study.</li>
                        <li>Proposal template reviewed against 3 sample jobs.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mb-8 p-6 bg-muted/30">
          <h3 className="mb-2 text-lg font-semibold">Profile Update Reminder</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Once you've made progress on these milestones and updated your actual freelance profile,
            come back here to re-evaluate and see your improved Fair-Ranking.
          </p>
          <p className="text-sm text-muted-foreground">
            For this demo, clicking "See your new ranking" will simulate the effect of completing
            your milestones on your Fair-Ranking score.
          </p>
        </Card>

        {/* Overall guidance section */}
        <Card className="mb-8 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold">Full Guidelines & Best Practices</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-semibold">Positioning & Niching</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Pick a niche (e.g., SaaS dashboards) and write focused copy.</li>
                <li>Show outcomes: performance gains, revenue impact, usability scores.</li>
                <li>Use client-centric language and avoid technical jargon overload.</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-semibold">Portfolio & Case Studies</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Each case study: problem → approach → results with metrics.</li>
                <li>Add visuals: before/after screenshots, GIFs, short demo videos.</li>
                <li>Link to repos or live demos where possible.</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-semibold">Proposals & Outreach</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Personalize the first paragraph with client context.</li>
                <li>Outline 2–3 concrete next steps and timeline.</li>
                <li>Attach relevant samples; keep it under 300–400 words.</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-semibold">Delivery & Retention</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Set expectations with a kickoff checklist and weekly updates.</li>
                <li>Offer small post-launch support window to drive repeat clients.</li>
                <li>Ask for testimonials and referrals after successful delivery.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Probable Scenario after Completing Roadmap */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold">If You Complete This Roadmap</h2>
          </div>

          <Card className="mb-6 p-8 bg-gradient-to-br from-accent/5 to-secondary/5">
            <h3 className="mb-4 text-xl font-bold text-center">Before vs After (Projected)</h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-3 text-center text-sm font-medium text-muted-foreground">Current Ranking</p>
                <div className="rounded-xl border-2 border-muted bg-background p-6 text-center">
                  <div className="mb-2 text-5xl font-bold text-muted-foreground">{currentRanking}</div>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                </div>
              </div>
              <div>
                <p className="mb-3 text-center text-sm font-medium text-muted-foreground">Projected Ranking</p>
                <div className="rounded-xl border-2 border-accent bg-background p-6 text-center">
                  <div className="mb-2 text-5xl font-bold text-accent">{projectedRanking}</div>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-6 py-3">
                <ArrowRight className="h-5 w-5 text-success" />
                <span className="text-lg font-bold text-success">Potential +{Math.max(projectedRanking - currentRanking, 0)} points</span>
              </div>
            </div>
          </Card>

          <Card className="mb-6 p-6">
            <h3 className="mb-4 text-xl font-bold">Key Metric Shifts (Illustrative)</h3>
            {(() => {
              const projected = {
                profileCompleteness: Math.min(100, freelancerProfile.profileCompleteness + 10),
                portfolioItems: freelancerProfile.portfolioItems + 3,
                proposalSuccessRate: Math.min(100, freelancerProfile.proposalSuccessRate + 5),
              };
              const rows = [
                { label: "Profile Completeness", previous: freelancerProfile.profileCompleteness, current: projected.profileCompleteness, unit: "%" },
                { label: "Portfolio Items", previous: freelancerProfile.portfolioItems, current: projected.portfolioItems, unit: " projects" },
                { label: "Proposal Success Rate", previous: freelancerProfile.proposalSuccessRate, current: projected.proposalSuccessRate, unit: "%" },
              ];
              return (
                <div className="space-y-4">
                  {rows.map((m) => {
                    const change = m.current - m.previous;
                    const isPositive = change >= 0;
                    return (
                      <div key={m.label} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="font-medium">{m.label}</p>
                          <p className="text-sm text-muted-foreground">{m.previous}{m.unit} → {m.current}{m.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isPositive ? <ArrowRight className="h-5 w-5 text-success" /> : <ArrowRight className="h-5 w-5 text-muted-foreground" />}
                          <span className={`text-lg font-bold ${isPositive ? "text-success" : "text-muted-foreground"}`}>{isPositive ? "+" : ""}{change}{m.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </Card>

          <Card className="p-6 bg-muted/30">
            <h3 className="mb-2 text-lg font-semibold">What This Could Mean</h3>
            <p className="mb-4 text-muted-foreground">
              Completing the roadmap typically boosts perceived quality and market alignment. Expect higher profile completeness,
              clearer case studies, and improved proposal effectiveness — often translating to better visibility and win rates.
            </p>
            <p className="text-sm text-muted-foreground">
              This forecast is illustrative. Your actual outcome depends on consistency, project delivery, and client feedback.
            </p>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleCompareAgain}
          >
            Compare Again
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/freelancer/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmapPage;
