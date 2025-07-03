"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, FormControlLabel, Switch, Typography, Paper, IconButton, Tooltip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Image from "next/image";

import {
  getCategory,
  getCategoryById,
  postCategoryid,
  updatCategoryid,
  deleteCategoryid,
} from "../../../../data/CategoryApi"; // Adjust path based on your project structure

export default function CategoryManager() {
  const [data, setData] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    categoryDetails: "",
    description: "",
    title: "",
    link: "",
    isShowingOnDashBoard: false,
    isActive: true,
    imagePath: "",
  });
  const [file, setFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    const res = await getCategory();
    setData(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.categoryDetails) errors.categoryDetails = "Category Details is required";
    if (!formData.title) errors.title = "Title is required";
    if (!formData.link) errors.link = "Link is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const openAddForm = () => {
    setEditId(null);
    setFormData({
      categoryDetails: "",
      description: "",
      title: "",
      link: "",
      isShowingOnDashBoard: false,
      isActive: true,
      imagePath: "",
    });
    setFormErrors({});
    setFile(null);
    setFormOpen(true);
  };

  const openEditForm = async (id) => {
    const result = await getCategoryById(id);
    const item = result.data;

    setFormData({
      categoryDetails: item.categoryDetails || "",
      description: item.description || item.desription || "",
      title: item.title || "",
      link: item.link || "",
      isShowingOnDashBoard: item.isShowingOnDashBoard ?? false,
      isActive: item.isActive ?? true,
      imagePath: item.imagePath || "",
    });
    setEditId(item.categoryId);
    setFile(null);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const form = new FormData();
      form.append("CategoryDetails", formData.categoryDetails);
      form.append("Description", formData.description || "null");
      form.append("Title", formData.title);
      form.append("Link", formData.link);
      form.append("IsShowingOnDashBoard", formData.isShowingOnDashBoard);
      form.append("IsActive", formData.isActive);

      const now = new Date().toISOString();
      form.append("ModifiedOn", now);
      form.append("ModifiedBy", "00000000-0000-0000-0000-000000000000");

      if (file) {
        form.append("File", file);
      } else if (formData.imagePath) {
        form.append("ImagePath", formData.imagePath);
      }

      if (editId) {
        form.append("MrCategoryId", editId);
        await updatCategoryid(form);
      } else {
        form.append("CreatedOn", now);
        form.append("CreatedBy", "00000000-0000-0000-0000-000000000000");
        await postCategoryid(form);
      }

      await fetchData();
      setFormOpen(false);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCategoryid(deleteId);
      await fetchData();
    } catch (err) {
      alert("Error deleting category: " + err.message);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    { field: "id", headerName: "#", width: 70 },
    { field: "categoryDetails", headerName: "Category Details", width: 200 },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      renderCell: (params) => params.value || "no data found",
    },
    { field: "title", headerName: "Title", width: 150 },
    { field: "link", headerName: "Link", width: 200 },
    {
      field: "imagePath", headerName: "ImagePath", width: 200,
      renderCell: (params) =>
        params.value ? (
          <Image
            src={`https://apex-dev-api.aitechustel.com/unmoved/${params.value}`}
            alt="category"
            width={60}
            height={60}
            style={{ objectFit: "contain" }}
          />
        ) : "No Image",
    },
    {
      field: "isShowingOnDashBoard",
      headerName: "Dashboard",
      width: 130,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => openEditForm(params.row.categoryId)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => {
              setDeleteId(params.row.categoryId);
              setDeleteDialogOpen(true);
            }}>
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const rows = data.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Category Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openAddForm}>Add Category</Button>
      </Box>

      <Paper sx={{ height: 'auto', width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.categoryId}
          sx={{
            "& .MuiDataGrid-columnHeaders": { fontWeight: "bold" },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          }}
          checkboxSelection
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
        />
      </Paper>

      {/* Form and Delete dialogs below... (unchanged from your version) */}

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm" sx={{ mt: 10 }}>
        <DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Category Details" name="categoryDetails" margin="normal"
            value={formData.categoryDetails} onChange={handleInputChange}
            error={!!formErrors.categoryDetails} helperText={formErrors.categoryDetails}
          />
          <TextField fullWidth label="Description" name="description" margin="normal"
            value={formData.description} onChange={handleInputChange}
          />
          <TextField fullWidth label="Title" name="title" margin="normal"
            value={formData.title} onChange={handleInputChange}
            error={!!formErrors.title} helperText={formErrors.title}
          />
          <TextField fullWidth label="Link" name="link" margin="normal"
            value={formData.link} onChange={handleInputChange}
            error={!!formErrors.link} helperText={formErrors.link}
          />
          <FormControlLabel
            control={<Switch checked={formData.isShowingOnDashBoard} onChange={handleInputChange} name="isShowingOnDashBoard" />}
            label="Show on Dashboard"
          />
          <FormControlLabel
            control={<Switch checked={formData.isActive} onChange={handleInputChange} name="isActive" />}
            label="Is Active"
          />
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>Upload Image</Typography>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Selected"
                  style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }} />
              ) : formData.imagePath ? (
                <img src={`https://apex-dev-api.aitechustel.com/unmoved/${formData.imagePath}`} alt="Current"
                  style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }} />
              ) : null}
              <Box>
                <input accept="image/*" style={{ display: "none" }} id="image-upload" type="file" onChange={handleFileChange} />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span">
                    {file || formData.imagePath ? "Change Image" : "Choose Image"}
                  </Button>
                </label>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editId ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
