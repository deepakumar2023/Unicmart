// Import base fetch utility
import { apiFetch } from "./AllData";

// ✅ GET all categories
export const getCategory = () => apiFetch('Category');

// ✅ POST new category
export const postCategoryid = (formData) =>
  apiFetch("Category", {
    method: "POST",
    body: formData ,
  });

// ✅ PUT update existing category by ID
export const updatCategoryid = (formData) =>
  apiFetch(`Category/Update`, {
    method: "PUT",
    body: formData,
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
