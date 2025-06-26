// import the API fetch utility

import { apiFetch } from "./AllData";

// ✅ GET all sliders
export const getSlider = () =>
  apiFetch("Dashboard/GetSliderData");

// ✅ POST
export const addSlider = (formData) =>
  apiFetch("Dashboard/AddSlider", {
    method: "POST",
    body: formData, // FormData object
  });

// ✅ PUT
export const updateSlider = (formData) =>
  apiFetch("Dashboard/UpdateSlider", {
    method: "PUT",
    body: formData, // FormData object with DashboardSliderId
  });

// ✅ DELETE - Delete slider by ID
export const deleteSlider = (id) =>
  apiFetch(`Dashboard/DeleteSlider/${id}`, {
    method: "DELETE",
  });
