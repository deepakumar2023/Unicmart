
// Import base fetch utility
import { apiFetch } from "./AllData";

// ✅ GET all Size
export const getSize = () => apiFetch('Size');

// ✅ POST new Size
export const postSizeid = (formData) =>
  apiFetch("Size", {
    method: "POST",
    body: formData ,
  });

// ✅ PUT update existing Size by ID
export const updateSizeid = (formData) =>
  apiFetch(`Size/update`, {
    method: "PUT",
    body: formData,
  });

// ✅ DELETE Size by ID
export const deleteSizeid = (id) =>
  apiFetch(`Size/delete/${id}`, {
    method: "DELETE",
  });

// ✅ ✅ NEW: GET Size by ID
export const getSizeById = (id) =>
  apiFetch(`Size/${id}`, {
    method: "GET",
  });
