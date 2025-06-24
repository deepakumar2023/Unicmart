
import { apiFetch } from "./AllData";

// ✅ GET all sliders
export const GetPromoCode = () =>
  apiFetch("PromoCode/GetPromoCodeContents");

// ✅ POST - Add new slider
export const postPromoCode = (data) =>
  apiFetch("PromoCode", {
    method: "POST",
    body: data,
  });

// ✅ PUT - Update existing slider by ID
export const updatePromoCode = (id, data) =>
  apiFetch(`PromoCode/${id}`, {
    method: "PUT",
    body: data,
  });

// ✅ DELETE - Delete slider by ID
export const deletePromo = (id) =>
  apiFetch(`PromoCode/${id}`, {
    method: "DELETE",
  });
