
// Import base fetch utility
import { apiFetch } from "./AllData";

// ✅ GET all categories
export const getBrand = () => apiFetch('Brand');

// ✅ POST new Brand
export const postBrandid = (formData) =>
  apiFetch("Brand", {
    method: "POST",
    body: formData ,
  });

// ✅ PUT update existing Brand by ID
export const updateBrandid = (formData) =>
  apiFetch(`Brand/update`, {
    method: "PUT",
    body: formData,
  });

// ✅ DELETE Brand by ID
export const deleteBrandid = (id) =>
  apiFetch(`Brand/${id}`, {
    method: "DELETE",
  });

// ✅ ✅ NEW: GET Brand by ID
export const getBrandById = (id) =>
  apiFetch(`Brand/${id}`, {
    method: "GET",
  });
