import { apiFetch } from "../api";

export const getRoadmap = () =>
  apiFetch("/api/freelancers/me/roadmap/");

export const createRoadmap = (data: any) =>
  apiFetch("/api/freelancers/me/roadmap/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateRoadmap = (uuid: string, data: any) =>
  apiFetch(`/api/freelancers/me/roadmap/${uuid}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteRoadmap = (uuid: string) =>
  apiFetch(`/api/freelancers/me/roadmap/${uuid}/`, {
    method: "DELETE",
  });

export const toggleRoadmap = (uuid: string) =>
  apiFetch(`/api/freelancers/me/roadmap/${uuid}/toggle/`, {
    method: "POST",
  });

export const getDashboard = () =>
  apiFetch("/api/freelancers/me/dashboard/");
