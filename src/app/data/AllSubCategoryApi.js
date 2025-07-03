// Import base fetch utility
import { apiFetch } from "./AllData";

// ✅ GET all SubCategory
export const getSubCategory = () => apiFetch('SubCategory');

// ✅ POST new SubCategory
export const postSubCategoryid = (formData) =>
  apiFetch("SubCategory", {
    method: "POST",
    body: formData ,
  });

// ✅ PUT update existing SubCategory by ID
export const updatSubCategoryid = (formData) =>
  apiFetch(`SubCategory/Update`, {
    method: "PUT",
    body: formData,
  });

// ✅ DELETE SubCategory by ID
export const deleteSubCategoryid = (id) =>
  apiFetch(`SubCategory/${id}`, {
    method: "DELETE",
  });

// ✅ ✅ NEW: GET SubCategory by ID
export const getCategoryById = (id) =>
  apiFetch(`Category/${id}`, {
    method: "GET",
  });
