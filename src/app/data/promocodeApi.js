// data/promocodeApi.js

import { apiFetch } from "./AllData";

// GET all
export const GetPromoCode = () =>
  apiFetch("PromoCode/GetPromoCodeContents");

// POST new
export const postPromoCode = (data) =>
  apiFetch("PromoCode/Create", {
    method: "POST",
    body: data,
  });

// ✅ UPDATE: no ID in URL, just send body with promoCodeId
export const updatePromoCode = (data) =>
  apiFetch("PromoCode/Update", {
    method: "PUT",
    body: data,
  });

// DELETE
export const deletePromo = (id) =>
  apiFetch(`PromoCode/Delete/${id}`, {
    method: "DELETE",
  });
