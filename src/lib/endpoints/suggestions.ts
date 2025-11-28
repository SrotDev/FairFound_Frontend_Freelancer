import { apiFetch } from "../api";

export const getSuggestions = (role: string, limit: number = 5) =>
  apiFetch(`/api/core/freelancers/suggestions/?role=${role}&limit=${limit}`);
