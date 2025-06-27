
import { apiFetch } from "./AllData";

// ✅ GET all sliders
export const getDashboardContent = () =>
  apiFetch("Dashboard/GetDashBoardContent");

// ✅ POST - Add new slider
export const postDashboardContent = (data) =>
  apiFetch("Dashboard/AddContent", {
    method: "POST",
    body: data,
  });

// ✅ PUT - Update existing slider by ID
export const updateDashboardContent = (data) =>
  apiFetch(`Dashboard/UpdateContent`, {
    method: "PUT",
    body: data,
  });

// ✅ DELETE - Delete slider by ID
export const deleteDashboardContent = (id) =>
  apiFetch(`Dashboard/contents/${id}`, {
    method: "DELETE",
  });
