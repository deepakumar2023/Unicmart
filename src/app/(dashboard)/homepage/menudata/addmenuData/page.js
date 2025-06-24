"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem
} from "@mui/material";
import { postmenudataid } from "../../../../data/Menudata";

const menuTypes = ["CounterTop", "Cabinet", "Appliance", "Sink"];

const initialFormData = {
  title: "",
  urlSlug: "",
  displayOrder: 0,
  isActive: true,
  tags: "",
  metaDescription: "",
  menuType: "CounterTop",
  childMenus: [] // clean, valid empty array
};

export default function AddMenuForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      console.log("Sending:", [formData]); // for debug
      await postmenudataid(formData); // API expects array
      setSuccess("Menu submitted successfully!");
      setFormData(initialFormData);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" p={3}>
      <Typography variant="h5" mb={2}>Add Menu</Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          name="title"
          label="Title"
          fullWidth
          margin="normal"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <TextField
          name="urlSlug"
          label="URL Slug"
          fullWidth
          margin="normal"
          value={formData.urlSlug}
          onChange={handleChange}
          required
        />

        <TextField
          name="displayOrder"
          label="Display Order"
          type="number"
          fullWidth
          margin="normal"
          value={formData.displayOrder}
          onChange={handleChange}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          }
          label="Is Active"
        />

        <TextField
          name="tags"
          label="Tags"
          fullWidth
          margin="normal"
          value={formData.tags}
          onChange={handleChange}
        />

        <TextField
          name="metaDescription"
          label="Meta Description"
          fullWidth
          margin="normal"
          value={formData.metaDescription}
          onChange={handleChange}
        />

        <TextField
          select
          name="menuType"
          label="Menu Type"
          fullWidth
          margin="normal"
          value={formData.menuType}
          onChange={handleChange}
        >
          {menuTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <Box mt={2}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>

        {success && <Typography color="success.main" mt={2}>{success}</Typography>}
        {error && <Typography color="error.main" mt={2}>{error}</Typography>}
      </form>
    </Box>
  );
}
