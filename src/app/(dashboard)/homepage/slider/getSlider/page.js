"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Image from "next/image";

export default function SliderTable() {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchSliderData();
  }, []);

  const fetchSliderData = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://apex-dev-api.aitechustel.com/api/Dashboard/GetSliderData");
      const result = await res.json();
      setSliderData(result?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (slider = null) => {
    setFormData(slider || {});
    setEditId(slider?.dashboardSliderId || null);
    setFormErrors({});
    setFile(null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({});
    setFormErrors({});
    setFile(null);
    setEditId(null);
    setMessage("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.smallNameOfSlider?.trim()) errors.smallNameOfSlider = "Small Name is required.";
    if (!formData.nameOfSlider?.trim()) errors.nameOfSlider = "Name is required.";
    if (!formData.sliderDescription?.trim()) errors.sliderDescription = "Description is required.";
    if (!formData.metaDescription?.trim()) errors.metaDescription = "Meta Description is required.";
    if (!formData.linkNameOfPage?.trim()) errors.linkNameOfPage = "Link Name is required.";
    if (!formData.link?.trim()) errors.link = "Link is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      const form = new FormData();
      form.append("SmallNameOfSlider", formData.smallNameOfSlider);
      form.append("NameOfSlider", formData.nameOfSlider);
      form.append("SliderDescription", formData.sliderDescription);
      form.append("LinkNameOfPage", formData.linkNameOfPage);
      form.append("Link", formData.link);
      form.append("MetaDescription", formData.metaDescription);

      if (file) {
        form.append("File", file);
      } else if (formData.pathOfImage) {
        form.append("PathOfImage", formData.pathOfImage);
      }

      const now = new Date().toISOString();
      form.append("ModifiedOn", now);
      form.append("ModifiedBy", "00000000-0000-0000-0000-000000000000");

      let response;
      if (editId) {
        form.append("DashboardSliderId", editId);
        response = await fetch("https://apex-dev-api.aitechustel.com/api/Dashboard/UpdateSlider", {
          method: "PUT",
          body: form,
        });
      } else {
        form.append("CreatedOn", now);
        form.append("CreatedBy", "00000000-0000-0000-0000-000000000000");
        response = await fetch("https://apex-dev-api.aitechustel.com/api/Dashboard/AddSlider", {
          method: "POST",
          body: form,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit");
      }

      setMessage("✅ Data submitted successfully!");
      await fetchSliderData();
      handleDialogClose();
    } catch (error) {
      console.error("Submit Error:", error.message);
      setMessage("❌ Error: " + error.message);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`https://apex-dev-api.aitechustel.com/api/Dashboard/DeleteSlider/${deleteId}`, {
        method: "DELETE",
      });
      await fetchSliderData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleteId(null);
      setDeleteDialogOpen(false);
    }
  };

  const columns = [
    { field: "smallNameOfSlider", headerName: "Small Name", width: 150 },
    { field: "nameOfSlider", headerName: "Name", width: 150 },
    { field: "sliderDescription", headerName: "Description", width: 180 },
    { field: "metaDescription", headerName: "Meta", width: 150 },
    { field: "linkNameOfPage", headerName: "Link Name", width: 130 },
    {
      field: "link",
      headerName: "Link",
      width: 160,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: "pathOfImage",
      headerName: "Image",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <Image
            src={`https://apex-dev-api.aitechustel.com/unmoved/${params.value}`}
            alt="slider"
            width={60}
            height={60}
            style={{ objectFit: "contain" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => handleDialogOpen(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDeleteClick(params.row.dashboardSliderId)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Paper sx={{ width: "100%", minHeight: 600, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Dashboard Slider Table
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleDialogOpen()}>
          Add Slider
        </Button>
      </Box>

      <DataGrid
        rows={sliderData}
        columns={columns}
        getRowId={(row) => row.dashboardSliderId}
        loading={loading}
        checkboxSelection
        pagination
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          }
        }}
      />

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit Slider" : "Add Slider"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Small Name"
            fullWidth
            margin="normal"
            value={formData.smallNameOfSlider || ""}
            onChange={(e) => setFormData({ ...formData, smallNameOfSlider: e.target.value })}
            error={!!formErrors.smallNameOfSlider}
            helperText={formErrors.smallNameOfSlider}
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.nameOfSlider || ""}
            onChange={(e) => setFormData({ ...formData, nameOfSlider: e.target.value })}
            error={!!formErrors.nameOfSlider}
            helperText={formErrors.nameOfSlider}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={formData.sliderDescription || ""}
            onChange={(e) => setFormData({ ...formData, sliderDescription: e.target.value })}
            error={!!formErrors.sliderDescription}
            helperText={formErrors.sliderDescription}
          />
          <TextField
            label="Meta Description"
            fullWidth
            margin="normal"
            value={formData.metaDescription || ""}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            error={!!formErrors.metaDescription}
            helperText={formErrors.metaDescription}
          />
          <TextField
            label="Link Name"
            fullWidth
            margin="normal"
            value={formData.linkNameOfPage || ""}
            onChange={(e) => setFormData({ ...formData, linkNameOfPage: e.target.value })}
            error={!!formErrors.linkNameOfPage}
            helperText={formErrors.linkNameOfPage}
          />
          <TextField
            label="Link"
            fullWidth
            margin="normal"
            value={formData.link || ""}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            error={!!formErrors.link}
            helperText={formErrors.link}
          />

          {/* Image Upload */}
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Image
            </Typography>
            {(file || formData.pathOfImage) && (
              <Box mb={1}>
                <Image
                  src={file ? URL.createObjectURL(file) : formData.pathOfImage}
                  alt="Preview"
                  width={120}
                  height={80}
                  style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }}
                />
              </Box>
            )}
            <Button variant="outlined" component="label">
              Choose Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Box>



          {message && (
            <Typography mt={2} color={message.startsWith("✅") ? "green" : "error"}>
              {message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this slider?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
