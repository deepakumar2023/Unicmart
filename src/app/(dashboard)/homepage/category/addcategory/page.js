"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { postCategoryid } from "../../../../data/CategoryApi";

const fixedUserId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

export default function CategoryForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    mrCategoryId: fixedUserId,
    categoryDetails: "",
    desription: "",
    title: "",
    imagePath: "",
    link: "",
    isActive: true,
    createdOn: new Date().toISOString(),
    createdBy: fixedUserId,
    modifiedBy: fixedUserId,
    modifiedOn: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
    };

    try {
      await postCategoryid(payload);
      alert("✅ Category added successfully!");
      if (onSuccess) onSuccess(); // refresh parent if provided
    } catch (error) {
      console.error("❌ Error posting category:", error);
      alert("Failed to add category");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" mb={2}>
        Add New Category
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          name="categoryDetails"
          label="Category Details"
          value={formData.categoryDetails}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          name="desription"
          label="Description"
          value={formData.desription}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          name="imagePath"
          label="Image Path"
          value={formData.imagePath}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          name="link"
          label="Link"
          value={formData.link}
          onChange={handleChange}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          }
          label="Is Active"
        />
        <Box mt={2}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
