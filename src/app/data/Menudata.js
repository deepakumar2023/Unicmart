// import { apiFetch } from "./AllData";

import { apiFetch } from "./AllData";



// GET /products
export const getmenudata = () => apiFetch('MenuDetails/GetMenu');



// // GET /products/:id
// POST /MenuDetails/insert
export const postmenudataid = (data) =>
  apiFetch("MenuDetails/insert", {
    method: "POST",
    body: data, // ✅ now data is correctly passed in
  });



// PUT /products/:id
export const updatemenudata = (data) =>
  apiFetch(`MenuDetails/update`, {
    method: 'PUT',
    body: data,
  });

// DELETE /products/:id
export const deleteMenuData = (id) =>
  apiFetch(`MenuDetails/delete/${id}`, {
    method: 'DELETE',
  });
