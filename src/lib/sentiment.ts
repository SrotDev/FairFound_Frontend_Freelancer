import { SentimentReview, SentimentLabel } from "@/types/domain";

// Basic lexicon-based sentiment + category extraction.
const positiveWords = [
  "great","excellent","fantastic","positive","responsive","quick","helpful","professional","clear","fast","amazing","love","good","outstanding","perfect","recommend"
];
const negativeWords = [
  "bad","poor","slow","confusing","late","unprofessional","negative","issue","problem","bug","delay","frustrating","terrible","worst","hate","expensive"
];

// Category keyword mapping
const categoryMap: Record<string,string> = {
  communication: "communication",
  respond: "responsiveness",
  responsive: "responsiveness",
  speed: "timeliness",
  slow: "timeliness",
  late: "timeliness",
  deadline: "timeliness",
  quality: "quality",
  bug: "quality",
  issue: "quality",
  design: "quality",
  ui: "quality",
  price: "pricing",
  expensive: "pricing",
  cost: "pricing",
  professional: "professionalism",
  unprofessional: "professionalism",
  clear: "clarity",
  confusing: "clarity",
};

const suggestionLibrary: Record<string,string[]> = {
  communication: [
    "Set clearer edsadssaxpectations at project start",
    "Provide structured progress updates (daily or milestone-based)",
    "Confirm understanding by summarizing client requests"
  ],
  responsiveness: [
    "Acknowledge messages within agreed SLA (e.g., 4h)",
    "Use templated quick replies for common queries",
    "Clarify availability windows in your profile"
  ],
  timeliness: [
    "Break tasks into smaller deliverables with mini-deadlines",
    "Proactively flag delays before they happen",
    "Add buffer time to estimates (10-15%)"
  ],
  quality: [
    "Introduce a pre-delivery QA checklist",
    "Use automated linting/testing before handoff",
    "Ask for a brief quality score after each milestone"
  ],
  pricing: [
    "Offer tiered package options to align expectations",
    "Explain ROI of your rate with outcome metrics",
    "Review competitor positioning quarterly"
  ],
  professionalism: [
    "Maintain consistent tone: concise + courteous",
    "Document decisions and agreements clearly",
    "Set boundaries for scope changes early"
  ],
  clarity: [
    "Use bullets & headers in proposals/deliverables",
    "Provide loom/video walkthroughs for complex parts",
    "Ask targeted clarification questions instead of assuming"
  ]
};

function normalizeScore(raw: number, totalTokens: number): number {
  if (totalTokens === 0) return 0;
  const scaled = raw / totalTokens; // crude normalization
  // clamp to [-1,1]
  return Math.max(-1, Math.min(1, scaled));
}

function labelFromScore(score: number): SentimentLabel {
  if (score > 0.15) return "positive";
  if (score < -0.15) return "negative";
  return "neutral";
}

export function analyzeSentiment(text: string): Omit<SentimentReview, "id" | "createdAt"> {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  let rawScore = 0;
  const foundCategories = new Set<string>();

  tokens.forEach((t) => {
    if (positiveWords.includes(t)) rawScore += 1;
    if (negativeWords.includes(t)) rawScore -= 1;
    if (categoryMap[t]) foundCategories.add(categoryMap[t]);
  });

  // intensifiers
  const intensifiers = tokens.filter((t) => ["very","extremely","highly"].includes(t)).length;
  rawScore += intensifiers * 0.5 * Math.sign(rawScore || 1); // push polarity stronger

  const score = normalizeScore(rawScore, tokens.length);
  const label = labelFromScore(score);

  // suggestions based on categories and polarity
  const suggestions: string[] = [];
  foundCategories.forEach((cat) => {
    const lib = suggestionLibrary[cat];
    if (lib) {
      // If positive, choose one reinforcement suggestion; if negative/neutral choose all improvement suggestions.
      if (label === "positive") {
        suggestions.push(`Maintain strength in ${cat}: ${lib[0]}`);
      } else {
        suggestions.push(...lib);
      }
    }
  });

  // Deduplicate suggestions
  const uniqueSuggestions = Array.from(new Set(suggestions));

  return {
    text,
    score,
    label,
    categories: Array.from(foundCategories),
    suggestions: uniqueSuggestions,
  };
}

export function aggregateReviews(reviews: SentimentReview[]) {
  if (!reviews.length) return { avgScore: 0, positives: 0, negatives: 0, neutrals: 0, topCategories: [] as string[] };
  const positives = reviews.filter(r => r.label === "positive").length;
  const negatives = reviews.filter(r => r.label === "negative").length;
  const neutrals = reviews.filter(r => r.label === "neutral").length;
  const avgScore = reviews.reduce((a,r)=>a+r.score,0)/reviews.length;
  const categoryCount: Record<string, number> = {};
  reviews.forEach(r => r.categories.forEach(c => { categoryCount[c] = (categoryCount[c]||0)+1; }));
  const topCategories = Object.entries(categoryCount).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c])=>c);
  return { avgScore, positives, negatives, neutrals, topCategories };
}
