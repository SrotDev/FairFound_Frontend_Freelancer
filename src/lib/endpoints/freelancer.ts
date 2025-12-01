import { apiFetch } from "../api";

export const getProfile = () =>
  apiFetch("/api/freelancers/me/profile/");

export const updateProfile = (data: any) =>
  apiFetch("/api/freelancers/me/profile/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getCompetitors = (role: string, tier: "Top" | "Mid" | "Low") =>
  apiFetch(`/api/freelancers/competitors/?role=${encodeURIComponent(role)}&tier=${encodeURIComponent(tier)}`);

export const getInsights = () =>
  apiFetch("/api/freelancers/me/insights/");
