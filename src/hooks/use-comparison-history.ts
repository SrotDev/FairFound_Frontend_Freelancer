import { useEffect, useMemo, useState } from "react";
import { FreelancerMetrics } from "@/types/domain";

export interface ComparisonHistoryEntry {
  id: string;
  createdAt: string; // ISO
  role: string;
  userMetrics: FreelancerMetrics;
  topFreelancersAverage?: Partial<FreelancerMetrics>;
  userScore?: number;
  competitorUrl?: string;
}

const STORAGE_KEY = "ff_comparison_history";
const SEED_FLAG = "ff_comparison_history_seeded_v1";

export const useComparisonHistory = () => {
  const [entries, setEntries] = useState<ComparisonHistoryEntry[]>([]);

  const getSeedData = (): ComparisonHistoryEntry[] => [
    {
      id: "seed-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      role: "web-developer",
      competitorUrl: "https://example.com/freelancer/jane-doe",
      userScore: 66,
      userMetrics: {
        profileCompleteness: 72,
        profileViews: 120,
        proposalSuccessRate: 18,
        jobInvitations: 4,
        hourlyRate: 55,
        skills: ["React", "TypeScript", "Tailwind"],
        portfolioItems: 8,
        repeatClientsRate: 25,
      },
      topFreelancersAverage: {
        profileCompleteness: 92,
        proposalSuccessRate: 35,
        portfolioItems: 15,
        hourlyRate: 75,
        repeatClientsRate: 45,
      },
    },
    {
      id: "seed-2",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      role: "graphic-designer",
      userScore: 58,
      userMetrics: {
        profileCompleteness: 65,
        profileViews: 90,
        proposalSuccessRate: 16,
        jobInvitations: 3,
        hourlyRate: 40,
        skills: ["Figma", "Illustrator", "Branding"],
        portfolioItems: 6,
        repeatClientsRate: 22,
      },
      topFreelancersAverage: {
        profileCompleteness: 90,
        proposalSuccessRate: 32,
        portfolioItems: 14,
        hourlyRate: 60,
        repeatClientsRate: 40,
      },
    },
    {
      id: "seed-3",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      role: "marketing",
      competitorUrl: "https://example.com/freelancer/john-smith",
      userScore: 71,
      userMetrics: {
        profileCompleteness: 78,
        profileViews: 140,
        proposalSuccessRate: 22,
        jobInvitations: 5,
        hourlyRate: 50,
        skills: ["SEO", "Content", "GA4"],
        portfolioItems: 10,
        repeatClientsRate: 28,
      },
      topFreelancersAverage: {
        profileCompleteness: 91,
        proposalSuccessRate: 34,
        portfolioItems: 16,
        hourlyRate: 70,
        repeatClientsRate: 44,
      },
    },
  ];

  const seedDemo = () => {
    const seed = getSeedData();
    setEntries(seed);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      localStorage.setItem(SEED_FLAG, "1");
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        } else {
          if (!localStorage.getItem(SEED_FLAG)) {
            seedDemo();
          } else {
            setEntries([]);
          }
        }
      } else {
        if (!localStorage.getItem(SEED_FLAG)) {
          seedDemo();
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const addEntry = (partial: Omit<ComparisonHistoryEntry, "id" | "createdAt">) => {
    const entry: ComparisonHistoryEntry = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString(),
      ...partial,
    };
    setEntries((prev) => [entry, ...prev]);
    return entry;
  };

  const clearAll = () => setEntries([]);
  const remove = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const groupedByRole = useMemo(() => {
    return entries.reduce<Record<string, ComparisonHistoryEntry[]>>((acc, e) => {
      (acc[e.role] = acc[e.role] || []).push(e);
      return acc;
    }, {});
  }, [entries]);

  return { entries, addEntry, clearAll, remove, groupedByRole, seedDemo };
};
