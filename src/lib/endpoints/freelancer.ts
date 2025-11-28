import { apiFetch } from "../api";

export const getProfile = () =>
  apiFetch("/api/freelancers/me/profile/");

export const updateProfile = (data: any) =>
  apiFetch("/api/freelancers/me/profile/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
