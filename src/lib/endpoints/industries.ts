import { apiFetch } from "../api";

export const getIndustries = () => apiFetch("/api/industries/");
export const getFreelancerIndustries = () =>
  apiFetch("/api/industries/freelancer/");
