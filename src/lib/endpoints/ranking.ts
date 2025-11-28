import { apiFetch } from "../api";

export const getMyRanking = () =>
  apiFetch("/api/freelancers/me/ranking/");

export const saveRanking = () =>
  apiFetch("/api/freelancers/me/ranking/save/", {
    method: "POST",
  });

export const rankingHistory = () =>
  apiFetch("/api/freelancers/me/ranking/history/");
