import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SentimentReview } from "@/types/domain";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility: Export sentiment feedback as CSV and trigger download
export function exportSentimentCSV(reviews: SentimentReview[]) {
  if (!reviews || reviews.length === 0) return;
  const headers = ["id", "createdAt", "label", "score", "categories", "suggestions", "text"];
  const escape = (v: string) => '"' + v.replace(/"/g, '""') + '"';
  const rows = reviews.map(r => {
    return [
      r.id,
      r.createdAt.toISOString(),
      r.label,
      r.score.toFixed(4),
      r.categories.join("; "),
      r.suggestions.join("; "),
      r.text.replace(/\r?\n/g, " ").trim(),
    ].map(v => escape(String(v))).join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sentiment_feedback_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
