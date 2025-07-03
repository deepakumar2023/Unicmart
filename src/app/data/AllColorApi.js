
// Import base fetch utility
import { apiFetch } from "./AllData";

// ✅ GET all color
export const getColor = () => apiFetch('Color');

// ✅ POST new Color
export const postColorid = (formData) =>
  apiFetch("Color", {
    method: "POST",
    body: formData ,
  });

// ✅ PUT update existing Color by ID
export const updateColorid = (formData) =>
  apiFetch(`Color`, {
    method: "PUT",
    body: formData,
  });

// ✅ DELETE Color by ID
export const deleteColorid = (id) =>
  apiFetch(`Color/${id}`, {
    method: "DELETE",
  });

// ✅ ✅ NEW: GET Color by ID
export const getColorById = (id) =>
  apiFetch(`Color/${id}`, {
    method: "GET",
  });
