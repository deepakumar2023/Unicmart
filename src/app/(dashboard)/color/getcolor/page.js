"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import {
  getColor,
  postColorid,
  updateColorid,
  deleteColorid,
} from "../../../data/AllColorApi";

function CustomNoRowsOverlay() {
  return (
    <GridOverlay>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body1">🚫 No color data found.</Typography>
      </Box>
    </GridOverlay>
  );
}

export default function ColorManagementTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    colorName: "",
    colorCode: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getColor();
      const data = res?.data?.map((item) => ({
        id: item.mrColorId,
        ...item,
      }));
      setRows(data || []);
    } catch (err) {
      alert("Failed to fetch colors: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    setFormData({
      colorName: "",
      colorCode: "",
      description: "",
      isActive: true,
    });
    setIsEditing(false);
    setEditDialogOpen(true);
    setErrors({});
  };

  const handleEditClick = (row) => {
    setFormData(row);
    setIsEditing(true);
    setEditDialogOpen(true);
    setErrors({});
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteColorid(deleteId);
      setDeleteDialogOpen(false);
      fetchData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.colorName.trim()) newErrors.colorName = "Color name is required.";
    if (!formData.colorCode.trim()) newErrors.colorCode = "Color code is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
    };

    try {
      if (isEditing) {
        await updateColorid(payload);
      } else {
        await postColorid(payload);
      }
      setEditDialogOpen(false);
      fetchData();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const columns = [
    { field: "colorName", headerName: "Color Name", width: 250 },
    { field: "colorCode", headerName: "Color Code", width: 250 },
    { field: "description", headerName: "Description", width: 250 },
    {
      field: "isActive",
      headerName: "Active",
      width: 250,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    // {
    //   field: "createdOn",
    //   headerName: "Created On",
    //   width: 180,
    //   valueFormatter: (params) =>
    //     params.value ? new Date(params.value).toLocaleString(),
    // },
    // {
    //   field: "modifiedOn",
    //   headerName: "Modified On",
    //   width: 180,
    //   valueFormatter: (params) =>
    //     params.value ? new Date(params.value).toLocaleString() : "",
    // },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDeleteClick(params.row.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box mt={5} maxWidth={1200} mx="auto">
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Color Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
          Add Color
        </Button>
      </Box>

      <Paper>
        <DataGrid
          rows={rows}
          columns={columns}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            }
          }}
          loading={loading}
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Color" : "Add Color"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Color Name"
            name="colorName"
            value={formData.colorName}
            onChange={handleChange}
            error={!!errors.colorName}
            helperText={errors.colorName}
            fullWidth
          />
          <TextField
            label="Color Code"
            name="colorCode"
            value={formData.colorCode}
            onChange={handleChange}
            error={!!errors.colorCode}
            helperText={errors.colorCode}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                name="isActive"
              />
            }
            label="Is Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this color?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
