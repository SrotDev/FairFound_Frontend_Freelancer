import { apiFetch } from "../api";

export const getFeedback = () =>
  apiFetch("/api/sentiment/me/feedback/");

export const addFeedback = (data: any) =>
  apiFetch("/api/sentiment/me/feedback/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteFeedback = (uuid: string) =>
  apiFetch(`/api/sentiment/me/feedback/${uuid}/`, {
    method: "DELETE",
  });

export const deleteAllFeedback = () =>
  apiFetch("/api/sentiment/me/feedback/bulk-delete/", {
    method: "DELETE",
  });

export const getAggregateFeedback = () =>
  apiFetch("/api/sentiment/me/feedback/aggregate/");

export const exportFeedback = () =>
  apiFetch("/api/sentiment/me/feedback/export/?format=csv");

export const analyzeFeedback = (data: { text: string }) =>
  apiFetch("/api/sentiment/me/feedback/analyze/", {
    method: "POST",
    body: JSON.stringify(data),
  });
