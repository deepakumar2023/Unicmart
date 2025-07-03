import { apiFetch } from "./AllData";

export const getCategory = () => apiFetch("Category");

export const postCategoryid = (formData) =>
  apiFetch("Category", {
    method: "POST",
    body: formData,
  });

export const updatCategoryid = (formData) =>
  apiFetch("Category/Update", {
    method: "PUT",
    body: formData,
  });

export const deleteCategoryid = (id) =>
  apiFetch(`Category/${id}`, {
    method: "DELETE",
  });

export const getCategoryById = (id) =>
  apiFetch(`Category/${id}`, {
    method: "GET",
  });
