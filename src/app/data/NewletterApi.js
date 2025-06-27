

import { apiFetch } from "./AllData";

// GET all
export const GetnewsLetter = () =>
  apiFetch("NewsLetter/getAll");

// POST new
export const postnewsLetter= (data) =>
  apiFetch("NewsLetter/insert", {
    method: "POST",
    body: data,
  });

// ✅ UPDATE: no ID in URL, just send body with promoCodeId
export const updatenewsLetter = (data) =>
  apiFetch("NewsLetter/update", {
    method: "PUT",
    body: data,
  });

// DELETE
export const deletenewsLetter= (id) =>
  apiFetch(`NewsLetter/delete/${id}`, {
    method: "DELETE",
  });

  // ✅ ✅ NEW: GET category by ID
export const getnewsLetterById = (id) =>
  apiFetch(`Inquiry/get/${id}`, {
    method: "GET",
  });


