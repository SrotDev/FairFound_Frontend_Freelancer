import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useComparisonHistory } from "@/hooks/use-comparison-history";
import { Trash2, History, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ComparisonHistoryPage = () => {
  const { entries, clearAll, remove, groupedByRole, seedDemo } = useComparisonHistory();
  const navigate = useNavigate();

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  return (
    <div className="container mx-auto max-w-6xl px-4 lg:px-6 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold md:text-4xl">Comparison History</h1>
          <p className="text-muted-foreground">Saved snapshots of your profile comparisons.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/freelancer/compare">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Run a comparison</Button>
          </Link>
          <Button
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={clearAll}
            disabled={!entries.length}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Clear all
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <History className="mx-auto mb-4 h-7 w-7 text-muted-foreground" />
          <p className="text-muted-foreground mb-5">No history yet. Run a comparison to save it here.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/freelancer/compare">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Start comparing</Button>
            </Link>
            <Button variant="outline" onClick={seedDemo}>Load demo data</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-10 mx-auto max-w-5xl">
          {Object.entries(groupedByRole).map(([role, list]) => (
            <div key={role} className="space-y-3">
              <h2 className="text-xl font-semibold capitalize">{role.replace("-", " ")}</h2>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((entry) => (
                  <Card
                    key={entry.id}
                    className="p-5 rounded-xl border flex items-start justify-between cursor-pointer hover:shadow-lg transition-all bg-card/60 backdrop-blur-sm"
                    onClick={() => navigate(`/freelancer/comparison-history/${entry.id}`)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="px-2.5">Score {entry.userScore ?? "-"}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Skills: {entry.userMetrics.skills.slice(0, 6).join(", ")} {entry.userMetrics.skills.length > 6 ? "…" : ""}
                      </div>
                      {entry.competitorUrl && (
                        <a href={entry.competitorUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-accent hover:underline">
                          View competitor <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(entry.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComparisonHistoryPage;
