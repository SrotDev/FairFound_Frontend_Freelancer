import { useEffect, useMemo, useState, useCallback } from "react";
import { FreelancerMetrics } from "@/types/domain";
import { getComparisons, deleteComparison, deleteAllComparisons, createComparison } from "@/lib/endpoints/comparison";

export interface ComparisonHistoryEntry {
  id: string;
  createdAt: string; // ISO
  role: string;
  userMetrics: FreelancerMetrics;
  topFreelancersAverage?: Partial<FreelancerMetrics>;
  userScore?: number;
  competitorUrl?: string;
}
// Derive default role from any persisted profile or fallback value
function getDefaultRole() {
  try {
    const raw = localStorage.getItem("freelancerProfile");
    if (raw) {
      const profile = JSON.parse(raw);
      if (profile?.role) return String(profile.role);
    }
  } catch {}
  return "web-developer";
}

export const useComparisonHistory = () => {
  const [entries, setEntries] = useState<ComparisonHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const role = useMemo(() => getDefaultRole(), []);

  const normalize = (item: any): ComparisonHistoryEntry => {
    const snapshot = item.snapshot || {};
    const snapUserMetrics = snapshot.userMetrics || snapshot.user_metrics || {};
    return {
      id: item.id || item.uuid,
      createdAt: item.created_at || item.createdAt || new Date().toISOString(),
      role: item.competitor_role || item.role || role,
      userScore: item.pseudo_ranking ?? item.user_score ?? item.userScore,
      competitorUrl: item.competitor_identifier || item.competitor_url || item.competitorUrl,
      userMetrics: (snapUserMetrics as FreelancerMetrics) || (item.user_metrics as FreelancerMetrics) || (item.userMetrics as FreelancerMetrics) || ({} as FreelancerMetrics),
      topFreelancersAverage: snapshot.topFreelancersAverage || snapshot.top_freelancers_average,
    };
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getComparisons(role);
      const list = Array.isArray(data) ? data.map(normalize) : [];
      setEntries(list);
    } catch (e) {
      console.error("Failed to fetch comparisons", e);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    load();
  }, [load]);

  const clearAll = useCallback(async () => {
    try {
      await deleteAllComparisons();
      setEntries([]);
    } catch (e) {
      console.error("Failed to clear comparisons", e);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      await deleteComparison(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error("Failed to delete comparison", e);
    }
  }, []);

  const seedDemo = useCallback(async () => {
    const demoItems = [
      {
        competitor_identifier: "https://example.com/freelancer/jane-doe",
        competitor_role: role,
        pseudo_ranking: 66,
        snapshot: {
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
        },
      },
      {
        competitor_identifier: "https://example.com/freelancer/mary-roe",
        competitor_role: role,
        pseudo_ranking: 58,
        snapshot: {
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
        },
      },
    ];
    try {
      for (const item of demoItems) {
        await createComparison(item);
      }
      await load();
    } catch (e) {
      console.error("Failed to seed demo", e);
    }
  }, [role, load]);

  const groupedByRole = useMemo(() => {
    return entries.reduce<Record<string, ComparisonHistoryEntry[]>>((acc, e) => {
      const key = (e.role || role).toLowerCase();
      (acc[key] = acc[key] || []).push(e);
      return acc;
    }, {});
  }, [entries, role]);

  return { entries, clearAll, remove, groupedByRole, seedDemo, loading, reload: load };
};
