// Import base fetch utility
import { apiFetch } from "./AllData";

// ✅ GET all categories
export const getCategory = () => apiFetch('Category');

// ✅ POST new category
export const postCategoryid = (data) =>
  apiFetch("Category", {
    method: "POST",
    body: data,
  });

// ✅ PUT update existing category by ID
export const updatCategoryid = (id, data) =>
  apiFetch(`Category/${id}`, {
    method: "PUT",
    body: data,
  });

// ✅ DELETE category by ID
export const deleteCategoryid = (id) =>
  apiFetch(`Category/${id}`, {
    method: "DELETE",
  });

// ✅ ✅ NEW: GET category by ID
export const getCategoryById = (id) =>
  apiFetch(`Category/${id}`, {
    method: "GET",
  });
