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
