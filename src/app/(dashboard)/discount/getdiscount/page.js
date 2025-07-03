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
  getDiscount,
  postDiscountid,
  updateDiscountid,
  deleteDiscountid,
} from "../../../data/AllDiscountApi";

function CustomNoRowsOverlay() {
  return (
    <GridOverlay>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body1">🚫 No Discount data found.</Typography>
      </Box>
    </GridOverlay>
  );
}

export default function DiscountManagementTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    discountDetails: "",
    discountAmountType: "",
    discount: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDiscount();
      console.log("API Response:", res); // ✅ Debugging
      const data = res?.data?.map((item) => ({
        id: item.mrDiscountId,
        discountDetails: item.discountDetails || "",
        discountAmountType: item.discountAmountType || "",
        discount: item.discount || 0,
        isActive: item.isActive ?? true,
      }));
      setRows(data || []);
    } catch (err) {
      alert("Failed to fetch Discounts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    setFormData({
      discountDetails: "",
      discountAmountType: "",
      discount: 0,
      isActive: true,
    });
    setIsEditing(false);
    setEditDialogOpen(true);
    setErrors({});
  };

  const toInputDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const handleEditClick = (row) => {
    setFormData({
      ...row,
      startDate: toInputDateTime(row.startDate),
      endDate: toInputDateTime(row.endDate),
    });
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
      await deleteDiscountid(deleteId);
      setDeleteDialogOpen(false);
      fetchData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.discountDetails?.trim()) newErrors.discountDetails = "Details required.";
    if (!formData.discountAmountType?.trim()) newErrors.discountAmountType = "Amount type required.";

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
      discount: parseFloat(formData.discount),
    };

    try {
      if (isEditing) {
        await updateDiscountid(payload);
      } else {
        await postDiscountid(payload);
      }
      setEditDialogOpen(false);
      fetchData();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "discount" ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const columns = [
    { field: "discountDetails", headerName: "Details", width: 250 },
    { field: "discountAmountType", headerName: "Amount Type", width: 250 },
    { field: "discount", headerName: "Discount", width: 250 },

    {
      field: "isActive",
      headerName: "Active",
      width: 200,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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
        <Typography variant="h5">Discount Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
          Add Discount
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
        <DialogTitle>{isEditing ? "Edit Discount" : "Add Discount"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Details"
            name="discountDetails"
            value={formData.discountDetails}
            onChange={handleChange}
            error={!!errors.discountDetails}
            helperText={errors.discountDetails}
            fullWidth
          />
          <TextField
            label="Amount Type"
            name="discountAmountType"
            value={formData.discountAmountType}
            onChange={handleChange}
            error={!!errors.discountAmountType}
            helperText={errors.discountAmountType}
            fullWidth
          />
          <TextField
            label="Discount"
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this discount?</Typography>
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
