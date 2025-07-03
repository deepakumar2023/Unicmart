
// Import base fetch utility
import { apiFetch } from "./AllData";

// ✅ GET all Discount
export const getDiscount = () => apiFetch('Discount');

// ✅ POST new Discount
export const postDiscountid = (formData) =>
  apiFetch("Discount", {
    method: "POST",
    body: formData ,
  });

// ✅ PUT update existing Discount by ID
export const updateDiscountid = (formData) =>
  apiFetch(`Discount`, {
    method: "PUT",
    body: formData,
  });

// ✅ DELETE Discount by ID
export const deleteDiscountid = (id) =>
  apiFetch(`Discount/${id}`, {
    method: "DELETE",
  });

// ✅ ✅ NEW: GET Discount by ID
export const getDiscountById = (id) =>
  apiFetch(`Discount/${id}`, {
    method: "GET",
  });
