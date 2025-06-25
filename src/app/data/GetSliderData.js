// import the API fetch utility

import { apiFetch } from "./AllData";

// ✅ GET all sliders
export const getSlider = () =>
  apiFetch("Dashboard/GetSliderData");

// ✅ POST - Add new slider
export const addSlider = (data) =>
  apiFetch("Dashboard/sliders", {
    method: "POST",
    body: data,
  });

// ✅ PUT - Update existing slider by ID
export const updateSlider = (data) =>
  apiFetch(`Dashboard/sliders`, {
    method: "PUT",
    body: data,
  });

// ✅ DELETE - Delete slider by ID
export const deleteSlider = (id) =>
  apiFetch(`Dashboard/sliders/${id}`, {
    method: "DELETE",
  });
