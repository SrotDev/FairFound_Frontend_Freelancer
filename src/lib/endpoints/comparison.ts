import { apiFetch } from "../api";

export const getComparisons = (role: string) =>
  apiFetch(`/api/comparisons/me/comparisons/?role=${role}`);

export const createComparison = (data: any) =>
  apiFetch("/api/comparisons/me/comparisons/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteComparison = (uuid: string) =>
  apiFetch(`/api/comparisons/me/comparisons/${uuid}/`, {
    method: "DELETE",
  });

export const deleteAllComparisons = () =>
  apiFetch("/api/comparisons/me/comparisons/", {
    method: "DELETE",
  });
