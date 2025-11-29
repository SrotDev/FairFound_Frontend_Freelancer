import { apiFetch } from "../api";

export const getMyMentorshipRequests = () =>
  apiFetch("/api/mentorship/requests/?mine=true");

export const createMentorshipRequest = (data: any) =>
  apiFetch("/api/mentorship/requests/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMentorshipRequest = (uuid: string) =>
  apiFetch(`/api/mentorship/requests/${uuid}/`);

export const updateMentorshipRequest = (uuid: string, data: any) =>
  apiFetch(`/api/mentorship/requests/${uuid}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const sendMessage = (uuid: string, text: string) =>
  apiFetch(`/api/mentorship/requests/${uuid}/messages/`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });

export const getPendingRequests = () =>
  apiFetch("/api/mentorship/dashboard/requests/?status=pending");

export const getMentorRequests = (status?: string) => {
  const base = "/api/mentorship/dashboard/requests/";
  return apiFetch(status ? `${base}?status=${status}` : base);
};

export const acceptMentorshipRequest = (uuid: string) =>
  apiFetch(`/api/mentorship/requests/${uuid}/accept/`, { method: "POST" });

export const rejectMentorshipRequest = (uuid: string) =>
  apiFetch(`/api/mentorship/requests/${uuid}/reject/`, { method: "POST" });

export const getRequestMessages = (uuid: string) =>
  apiFetch(`/api/mentorship/requests/${uuid}/messages/`);
