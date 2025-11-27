import { createContext, useContext, useState, ReactNode } from "react";
import { AppState, User, Industry, FreelancerMetrics, RoadmapMilestone, SentimentReview } from "@/types/domain";
import { analyzeSentiment } from "@/lib/sentiment";
import { useEffect } from "react";

const initialFreelancerProfile: FreelancerMetrics = {
  profileCompleteness: 72,
  profileViews: 135,
  proposalSuccessRate: 18,
  jobInvitations: 6,
  hourlyRate: 45,
  skills: ["React", "TypeScript", "Node.js", "UI/UX Design"],
  portfolioItems: 8,
  repeatClientsRate: 25,
};

const initialRoadmap: RoadmapMilestone[] = [
  {
    id: "1",
    title: "Fix Profile Basics",
    description: "Complete your headline, overview, and add 3 strong portfolio items",
    estimatedEffort: "2-3 days",
    completed: false,
    order: 1,
  },
  {
    id: "2",
    title: "Skill Upgrade",
    description: "Complete a course and build 1-2 showcase projects in trending skills",
    estimatedEffort: "1-2 weeks",
    completed: false,
    order: 2,
  },
  {
    id: "3",
    title: "Proposal Optimization",
    description: "Improve proposal quality, create templates, and track performance",
    estimatedEffort: "3-5 days",
    completed: false,
    order: 3,
  },
  {
    id: "4",
    title: "Build Case Studies",
    description: "Document your best projects with detailed case studies",
    estimatedEffort: "1 week",
    completed: false,
    order: 4,
  },
];

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  setSelectedIndustry: (industry: Industry) => void;
  updateFreelancerProfile: (profile: Partial<FreelancerMetrics>) => void;
  toggleMilestone: (id: string) => void;
  calculatePseudoRanking: () => number;
  savePreviousRanking: () => void;
  clientFeedback: SentimentReview[];
  addClientFeedback: (text: string) => SentimentReview;
  deleteClientFeedback: (id: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerMetrics>(() => {
    try {
      const stored = localStorage.getItem("ff_freelancer_profile");
      return stored ? { ...initialFreelancerProfile, ...JSON.parse(stored) } : initialFreelancerProfile;
    } catch {
      return initialFreelancerProfile;
    }
  });
  const [roadmapMilestones, setRoadmapMilestones] = useState<RoadmapMilestone[]>(initialRoadmap);
  const [previousPseudoRanking, setPreviousPseudoRanking] = useState<number | null>(null);
  const [clientFeedback, setClientFeedback] = useState<SentimentReview[]>(() => {
    try {
      const stored = localStorage.getItem("ff_client_feedback");
      if (stored) {
        const parsed = JSON.parse(stored) as (Omit<SentimentReview, "createdAt"> & { createdAt: string })[];
        return parsed.map(r => ({ ...r, createdAt: new Date(r.createdAt) }));
      }
    } catch {}
    return [];
  });
  

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem("ff_freelancer_profile", JSON.stringify(freelancerProfile));
    } catch {}
  }, [freelancerProfile]);

  useEffect(() => {
    try {
      localStorage.setItem("ff_client_feedback", JSON.stringify(clientFeedback));
    } catch {}
  }, [clientFeedback]);

  // Persist user when it changes (login / registration / logout)
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    } catch {}
  }, [user]);

  // Hydrate user from token if missing after hard refresh
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!user && token) {
      (async () => {
        try {
          const res = await fetch("http://localhost:8000/api/users/me/info/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser({
              id: data.id || data.uuid || data.pk || data.email || "user",
              name: data.name || data.username || (data.email ? data.email.split("@")[0] : "User"),
              email: data.email || "",
              createdAt: new Date(),
            });
          }
        } catch {}
      })();
    }
  }, [user]);

  const calculatePseudoRanking = (): number => {
    const completedMilestones = roadmapMilestones.filter((m) => m.completed).length;
    const milestoneBonus = (completedMilestones / roadmapMilestones.length) * 15;

    const ranking = Math.min(
      100,
      Math.round(
        freelancerProfile.profileCompleteness * 0.25 +
          Math.min(freelancerProfile.proposalSuccessRate * 2, 30) +
          Math.min(freelancerProfile.portfolioItems * 3, 20) +
          Math.min(freelancerProfile.repeatClientsRate, 15) +
          milestoneBonus
      )
    );

    return ranking;
  };

  const updateFreelancerProfile = (profile: Partial<FreelancerMetrics>) => {
    setFreelancerProfile((prev) => ({ ...prev, ...profile }));
  };

  const toggleMilestone = (id: string) => {
    setRoadmapMilestones((prev) =>
      prev.map((milestone) => (milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone))
    );
  };

  const savePreviousRanking = () => {
    setPreviousPseudoRanking(calculatePseudoRanking());
  };

  const addClientFeedback = (text: string): SentimentReview => {
    const analyzed = analyzeSentiment(text);
    const review: SentimentReview = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...analyzed,
    };
    setClientFeedback((prev) => [review, ...prev]);
    return review;
  };
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };
  const deleteClientFeedback = (id: string) => {
    setClientFeedback((prev) => prev.filter((r) => r.id !== id));
  };

  const value: AppContextType = {
    user,
    selectedIndustry,
    freelancerProfile,
    roadmapMilestones,
    previousPseudoRanking,
    setUser,
    setSelectedIndustry,
    updateFreelancerProfile,
    toggleMilestone,
    calculatePseudoRanking,
    savePreviousRanking,
    clientFeedback,
    addClientFeedback,
    deleteClientFeedback,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
