// import { apiFetch } from "./AllData";

import { apiFetch } from "./AllData";



// GET /products
export const getmenudata = () => apiFetch('MenuDetails');



// // GET /products/:id
// POST /MenuDetails/insert
export const postmenudataid = (data) =>
  apiFetch("MenuDetails/insert", {
    method: "POST",
    body: data, // ✅ now data is correctly passed in
  });



// PUT /products/:id
export const updatemenudata = (id, data) =>
  apiFetch(`MenuDetails/update/${id}`, {
    method: 'PUT',
    body: data,
  });

// DELETE /products/:id
export const deleteMenuData = (id) =>
  apiFetch(`MenuDetails/delete/${id}`, {
    method: 'DELETE',
  });
