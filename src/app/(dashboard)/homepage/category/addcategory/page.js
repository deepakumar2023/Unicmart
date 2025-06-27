"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, FormControlLabel, Switch, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

export default function CategoryManager() {
  const [data, setData] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    categoryDetails: "",
    description:null,
    title: "",
    link: "",
    isShowingOnDashBoard: false,
    isActive: true,
    imagePath: "",
  });
  const [file, setFile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    const res = await fetch("https://apex-dev-api.aitechustel.com/api/Category");
    const json = await res.json();
    setData(json.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    setFile(null);
    setFormOpen(true);
  };

  const openEditForm = async (id) => {
    try {
      const res = await fetch(`https://apex-dev-api.aitechustel.com/api/Category/${id}`);
      const result = await res.json();
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

      setEditId(item.mrCategoryId);
      setFormOpen(true);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const form = new FormData();
      form.append("CategoryDetails", formData.categoryDetails);
      form.append("Description", formData.description ? formData.description : "null");
      form.append("Title", formData.title);
      form.append("Link", formData.link);
      form.append("IsShowingOnDashBoard", formData.isShowingOnDashBoard);
      form.append("IsActive", formData.isActive);

      // Handle file/imagePath logic
      if (file) {
        form.append("File", file);
      } else if (formData.imagePath) {
        form.append("ImagePath", formData.imagePath);
      }

      // Audit fields
      const now = new Date().toISOString();
      form.append("ModifiedOn", now);
      form.append("ModifiedBy", "00000000-0000-0000-0000-000000000000");

      let response;

      if (editId) {
        form.append("MrCategoryId", editId);
        response = await fetch("https://apex-dev-api.aitechustel.com/api/Category/Update", {
          method: "PUT",
          body: form,
        });
      } else {
        form.append("CreatedOn", now);
        form.append("CreatedBy", "00000000-0000-0000-0000-000000000000");
        response = await fetch("https://apex-dev-api.aitechustel.com/api/Category", {
          method: "POST",
          body: form,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit");
      }

      setMessage("✅ Data submitted successfully!");
      await fetchData();
      setFormOpen(false);
      setEditId(null);
      setFile(null);
    } catch (error) {
      console.error("Submit Error:", error.message);
      setMessage("❌ Error: " + error.message);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await fetch(`https://apex-dev-api.aitechustel.com/api/Category/${deleteId}`, {
        method: "DELETE",
      });
      fetchData();
    }
    setDeleteId(null);
    setDeleteDialogOpen(false);
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Category Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openAddForm}>Add Category</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>#</b></TableCell>
              <TableCell><b>Category Details</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>ImagePath</b></TableCell>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Link</b></TableCell>
              <TableCell><b>Dashboard</b></TableCell>
              <TableCell><b>Active</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, i) => (
              <TableRow key={item.mrCategoryId}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.categoryDetails}</TableCell>
                <TableCell>{item.description ? item.description : "null"}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.imagePath}</TableCell>
                <TableCell>{item.link}</TableCell>
                <TableCell>{item.isShowingOnDashBoard ? "Yes" : "No"}</TableCell>
                <TableCell>{item.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => openEditForm(item.mrCategoryId)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => {
                      setDeleteId(item.mrCategoryId);
                      setDeleteDialogOpen(true);
                    }}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow><TableCell colSpan={8} align="center">No categories found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Category Details" name="categoryDetails" margin="normal"
            value={formData.categoryDetails} onChange={handleInputChange} />
          <TextField fullWidth label="Description" name="description" margin="normal"
            value={formData.description} onChange={handleInputChange} />
          <TextField fullWidth label="Title" name="title" margin="normal"
            value={formData.title} onChange={handleInputChange} />
          <TextField fullWidth label="Link" name="link" margin="normal"
            value={formData.link} onChange={handleInputChange} />
          <FormControlLabel control={<Switch checked={formData.isShowingOnDashBoard}
            onChange={handleInputChange} name="isShowingOnDashBoard" />} label="Show on Dashboard" />
          <FormControlLabel control={<Switch checked={formData.isActive}
            onChange={handleInputChange} name="isActive" />} label="Is Active" />

          {/* Show current image if available and no new file selected */}
          {formData.imagePath && !file && (
            <Box mt={2}>
              <Typography variant="body2">Current Image:</Typography>
              <img
                src={formData.imagePath}
                alt="Current"
                style={{ width: 100, height: "auto", marginTop: 8 }}
              />
            </Box>
          )}

          <Box mt={2}>
            <Typography>Upload Image</Typography>
            <input type="file" accept="image/*" onChange={handleFileChange} />
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
        <DialogContent><Typography>Are you sure you want to delete this category?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
