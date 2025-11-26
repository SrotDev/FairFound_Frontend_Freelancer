import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { aggregateReviews } from "@/lib/sentiment";
import { exportSentimentCSV } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react";

const SentimentInsightsPage: React.FC = () => {
  const { clientFeedback, addClientFeedback, deleteClientFeedback } = useAppContext();
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!newText.trim()) return;
    setAdding(true);
    addClientFeedback(newText.trim());
    setNewText("");
    setAdding(false);
  };

  const agg = aggregateReviews(clientFeedback);

  // Collect aggregated actionable suggestions (dedupe) from all reviews
  const allSuggestions = Array.from(new Set(clientFeedback.flatMap(r => r.suggestions)));

  return (
    <div className="container py-12 max-w-6xl">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Client Sentiment Insights</h1>
          <p className="text-muted-foreground max-w-xl">
            Paste client feedback (reviews, messages, comments). We analyze sentiment, surface patterns, and generate actionable improvements.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">{clientFeedback.length} feedback entries</Badge>
          <Button
            variant="outline"
            size="sm"
            disabled={clientFeedback.length === 0}
            onClick={() => {
              exportSentimentCSV(clientFeedback);
              toast({ title: "Exported CSV", description: "Sentiment feedback downloaded." });
            }}
          >Export CSV</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: input + list */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Add Feedback</h3>
            <Textarea
              placeholder="Paste a client comment or review here..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={adding || !newText.trim()} className="gap-2">
                <Plus className="h-4 w-4"/> Analyze & Save
              </Button>
              {newText && (
                <Button variant="outline" onClick={() => setNewText("")}>Clear</Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">We run lightweight on-device analysis (no data leaves your browser).</p>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Analyzed Feedback</h3>
            {clientFeedback.length === 0 && (
              <p className="text-sm text-muted-foreground">No feedback yet. Add your first entry above.</p>
            )}
            <div className="space-y-4">
              {clientFeedback.map((r) => (
                <div key={r.id} className="rounded-lg border border-border/50 p-4 space-y-3 bg-muted/30">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm leading-relaxed whitespace-pre-line">{r.text}</p>
                    <Button variant="ghost" size="sm" onClick={() => deleteClientFeedback(r.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant={r.label === 'positive' ? 'default' : r.label === 'negative' ? 'destructive' : 'secondary'}>
                      {r.label.toUpperCase()} ({(r.score*100).toFixed(0)})
                    </Badge>
                    {r.categories.map(c => (
                      <Badge key={c} variant="outline" className="uppercase tracking-wide">{c}</Badge>
                    ))}
                  </div>
                  {r.suggestions.length > 0 && (
                    <div className="text-xs bg-accent/10 rounded-md p-3 space-y-1">
                      <p className="font-semibold text-accent">Suggestions:</p>
                      <ul className="list-disc ml-4 space-y-1">
                        {r.suggestions.map(s => <li key={s}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: summary & aggregate suggestions */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Sentiment Summary</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-md border p-3 flex flex-col items-center">
                <span className="text-[10px] tracking-wide font-semibold text-muted-foreground">POSITIVE</span>
                <span className="mt-1 text-xl font-bold">{agg.positives}</span>
              </div>
              <div className="rounded-md border p-3 flex flex-col items-center">
                <span className="text-[10px] tracking-wide font-semibold text-muted-foreground">NEUTRAL</span>
                <span className="mt-1 text-xl font-bold">{agg.neutrals}</span>
              </div>
              <div className="rounded-md border p-3 flex flex-col items-center">
                <span className="text-[10px] tracking-wide font-semibold text-muted-foreground">NEGATIVE</span>
                <span className="mt-1 text-xl font-bold">{agg.negatives}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Average sentiment score: <span className="font-semibold">{(agg.avgScore*100).toFixed(1)}</span> (−100 to 100 scale)
            </div>
            {agg.topCategories.length > 0 && (
              <div className="text-xs">
                <p className="font-semibold mb-1">Top recurring themes:</p>
                <div className="flex flex-wrap gap-2">
                  {agg.topCategories.map(c => <Badge key={c} variant="outline" className="uppercase tracking-wide">{c}</Badge>)}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> Actionable Next Steps</h3>
            {allSuggestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add more feedback to see targeted improvement actions.</p>
            ) : (
              <ul className="list-disc ml-4 space-y-2 text-sm">
                {allSuggestions.map(s => <li key={s}>{s}</li>)}
              </ul>
            )}
            {allSuggestions.length > 0 && (
              <p className="text-xs text-muted-foreground">Focus on 2–3 items this week; mark improvements in your roadmap.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SentimentInsightsPage;
