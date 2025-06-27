

import { apiFetch } from "./AllData";

// GET all
export const GetInquiry = () =>
  apiFetch("Inquiry/getAll");

// POST new
export const postInquiry = (data) =>
  apiFetch("Inquiry/insert", {
    method: "POST",
    body: data,
  });

// ✅ UPDATE: no ID in URL, just send body with promoCodeId
export const updateInquiry = (data) =>
  apiFetch("Inquiry/update", {
    method: "PUT",
    body: data,
  });

// DELETE
export const deleteInquiry= (id) =>
  apiFetch(`Inquiry/delete/${id}`, {
    method: "DELETE",
  });

  // ✅ ✅ NEW: GET category by ID
export const getInquiryById = (id) =>
  apiFetch(`Inquiry/get/${id}`, {
    method: "GET",
  });


