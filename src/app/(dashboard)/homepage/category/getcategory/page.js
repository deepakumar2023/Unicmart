"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  getCategory,
  updatCategoryid,
  postCategoryid,
} from "../../../../data/CategoryApi";

const fixedUserId = "3fa85f64-5717-4562-b3fc-2c963f6";

const initialFormData = {
  mrCategoryId: "",
  categoryDetails: "",
  desription: "",
  title: "",
  imagePath: "",
  link: "",
  isActive: true,
};

export default function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategory();
      setCategories(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const selectedCategory = categories.find(cat => cat.mrCategoryId === id);
    if (selectedCategory) {
      setFormData(selectedCategory);
      setOpenDialog(true);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await fetch(`https://apex-dev-api.aitechustel.com/api/Category/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      await fetchCategories();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete category");
    }
  };

  const handleAdd = () => {
    setFormData(initialFormData);
    setOpenDialog(true);
  };

  const handleFormSubmit = async () => {
    try {
      const timestamp = new Date().toISOString();

      const isEditing = categories.some(
        (cat) => cat.mrCategoryId === formData.mrCategoryId
      );

      if (isEditing) {
        const updatePayload = {
          ...formData,
          modifiedBy: fixedUserId,
          modifiedOn: timestamp,
        };
        await updatCategoryid(formData.mrCategoryId, updatePayload);
      } else {
        const newPayload = {
          ...formData,
          mrCategoryId: fixedUserId,
          createdBy: fixedUserId,
          modifiedBy: fixedUserId,
          createdOn: timestamp,
          modifiedOn: timestamp,
        };
        await postCategoryid(newPayload);
      }

      setOpenDialog(false);
      fetchCategories();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Category Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Details</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Link</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Active</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.mrCategoryId}>
                <TableCell>{cat.title}</TableCell>
                <TableCell>{cat.categoryDetails}</TableCell>
                <TableCell>{cat.desription}</TableCell>
                <TableCell>{cat.link}</TableCell>
                <TableCell>{cat.imagePath}</TableCell>
                <TableCell>{cat.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(cat.mrCategoryId)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(cat.mrCategoryId)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{formData.mrCategoryId && categories.some(cat => cat.mrCategoryId === formData.mrCategoryId) ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth />
          <TextField label="Details" name="categoryDetails" value={formData.categoryDetails} onChange={handleChange} fullWidth />
          <TextField label="Description" name="desription" value={formData.desription} onChange={handleChange} fullWidth />
          <TextField label="Image Path" name="imagePath" value={formData.imagePath} onChange={handleChange} fullWidth />
          <TextField label="Link" name="link" value={formData.link} onChange={handleChange} fullWidth />
          <FormControlLabel
            control={<Switch checked={formData.isActive} onChange={handleChange} name="isActive" />}
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
