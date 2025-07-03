
// Import base fetch utility
import { apiFetch } from "./AllData";

// ✅ GET all Product
export const getProduct = () => apiFetch('Product/get-all');

// ✅ POST new Product
export const postProductid = (formData) =>
  apiFetch("Product/create", {
    method: "POST",
    body: formData ,
  });

// ✅ PUT update existing Product by ID
export const updateProductid = (formData) =>
  apiFetch(`Product`, {
    method: "PUT",
    body: formData,
  });

// ✅ DELETE Product by ID
export const deleteProductid = (id) =>
  apiFetch(`Product/${id}`, {
    method: "DELETE",
  });

// ✅ ✅ NEW: GET Product by ID
export const getProductById = (id) =>
  apiFetch(`Product/${id}`, {
    method: "GET",
  });
