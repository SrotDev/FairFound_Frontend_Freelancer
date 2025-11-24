import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/context/AppContext";
import { ArrowRight, CheckCircle2, Circle, Clock } from "lucide-react";

const CareerRoadmapPage = () => {
  const navigate = useNavigate();
  const { roadmapMilestones, toggleMilestone, calculatePseudoRanking, savePreviousRanking } = useAppContext();

  const completedCount = roadmapMilestones.filter((m) => m.completed).length;
  const progress = (completedCount / roadmapMilestones.length) * 100;
  const currentRanking = calculatePseudoRanking();
  const projectedRanking = Math.min(100, currentRanking + (4 - completedCount) * 4);

  const handleReEvaluate = () => {
    savePreviousRanking();
    // Simulate profile improvements
    navigate("/freelancer/re-evaluation");
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
              Estimated pseudo-ranking after completing all milestones
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
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mb-8 p-6 bg-muted/30">
          <h3 className="mb-2 text-lg font-semibold">Profile Update Reminder</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Once you've made progress on these milestones and updated your actual freelance profile,
            come back here to re-evaluate and see your improved pseudo-ranking.
          </p>
          <p className="text-sm text-muted-foreground">
            For this demo, clicking "See your new ranking" will simulate the effect of completing
            your milestones on your pseudo-ranking score.
          </p>
        </Card>

        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleReEvaluate}
            disabled={completedCount === 0}
          >
            See Your New Ranking
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
