import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface PseudoRankingBadgeProps {
  score: number;
  size?: "sm" | "lg";
}

export const PseudoRankingBadge = ({ score, size = "lg" }: PseudoRankingBadgeProps) => {
  const getLabel = (score: number) => {
    if (score >= 80) return { text: "Top-tier ready", color: "bg-success" };
    if (score >= 60) return { text: "Competitive", color: "bg-secondary" };
    return { text: "Growing", color: "bg-warning" };
  };

  const label = getLabel(score);

  if (size === "sm") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2">
        <TrendingUp className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold">{score}/100</span>
        <Badge variant="secondary" className={label.color}>
          {label.text}
        </Badge>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Your Fair-Ranking</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-accent">{score}</span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <Badge className={`mt-3 ${label.color}`}>{label.text}</Badge>
        </div>
        <div className="rounded-full bg-accent/20 p-6">
          <TrendingUp className="h-12 w-12 text-accent" />
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        This score reflects your profile completeness, skills, and market alignment. Not a global ranking.
      </p>
    </Card>
  );
};
