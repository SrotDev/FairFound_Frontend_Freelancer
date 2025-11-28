import { apiFetch } from "../api";

export const getUser = (id: string) =>
  apiFetch(`/api/users/${id}/`);

export const updateMe = (data: any) =>
  apiFetch("/api/users/me/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const updateIndustry = (data: any) =>
  apiFetch("/api/users/me/industry/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getMyInfo = () => apiFetch("/api/users/me/info/");
