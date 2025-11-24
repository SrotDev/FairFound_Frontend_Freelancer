export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export type Industry = "Freelancer" | "E-commerce" | "Developer" | "Business" | null;

export interface FreelancerMetrics {
  profileCompleteness: number;
  profileViews: number;
  proposalSuccessRate: number;
  jobInvitations: number;
  hourlyRate: number;
  skills: string[];
  portfolioItems: number;
  repeatClientsRate: number;
}

export interface ComparisonResult {
  userMetrics: FreelancerMetrics;
  topFreelancersAverage: FreelancerMetrics;
  competitorMetrics?: FreelancerMetrics;
  pseudoRanking: number;
  tier: "Emerging" | "Competitive" | "Top-tier ready";
}

export interface SwotItem {
  category: "Strength" | "Weakness" | "Opportunity" | "Threat";
  title: string;
  description: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  estimatedEffort: string;
  completed: boolean;
  order: number;
}

export interface AppState {
  user: User | null;
  selectedIndustry: Industry;
  freelancerProfile: FreelancerMetrics;
  roadmapMilestones: RoadmapMilestone[];
  previousPseudoRanking: number | null;
}
