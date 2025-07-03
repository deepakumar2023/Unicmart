"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, IconButton, Tooltip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import {
  GetInquiry, postInquiry, updateInquiry, deleteInquiry
} from "../../../../data/InquiryApi";

export default function InquiryTable() {
  const [inquiries, setInquiries] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm());
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  function initialForm() {
    return {
      inquiryId: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      city: "",
      message: "",
      inquiryType: "",
      isActive: true,
      createdOn: new Date().toISOString(),
      createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      modifiedOn: new Date().toISOString(),
      modifiedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    };
  }

  const fetchData = async () => {
    try {
      const res = await GetInquiry();
      setInquiries(res.data);
    } catch (error) {
      console.error("Fetch Error:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = () => {
    setFormData(initialForm());
    setEditMode(false);
    setErrors({});
    setOpen(true);
  };

  const handleEdit = (row) => {
    setFormData({ ...row });
    setEditMode(true);
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialForm());
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    if (!formData.inquiryType.trim()) newErrors.inquiryType = "Inquiry Type is required.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    formData.modifiedOn = new Date().toISOString();

    try {
      if (editMode) {
        await updateInquiry(formData);
      } else {
        await postInquiry({ ...formData, inquiryId: crypto.randomUUID() });
      }
      fetchData();
      handleClose();
    } catch (error) {
      console.error("Save error:", error.message);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteInquiry(deleteId);
      fetchData();
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const columns = [
    { field: "fullName", headerName: "Full Name", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "phoneNumber", headerName: "Phone", width: 140 },
    { field: "city", headerName: "City", width: 130 },
    { field: "message", headerName: "Message", width: 200 },
    { field: "inquiryType", headerName: "Type", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDeleteClick(params.row.inquiryId)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Inquiry List</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Inquiry
        </Button>
      </Box>

      <Paper sx={{ height:'auto', width: "100%" }}>
        <DataGrid
          rows={inquiries}
          columns={columns}
            sx={{
    "& .MuiDataGrid-columnHeaders": {
      fontWeight: "bold",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: "bold",
    }
  }}
          
          getRowId={(row) => row.inquiryId}
          checkboxSelection
          pageSizeOptions={[ 5, 20,50,100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page:0} },
          }}
       
        />
      </Paper>

      {/* Add/Edit Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? "Edit Inquiry" : "Add Inquiry"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="dense" label="Full Name" name="fullName"
            value={formData.fullName} onChange={handleChange}
            error={!!errors.fullName} helperText={errors.fullName}
          />
          <TextField
            fullWidth margin="dense" label="Email" name="email"
            value={formData.email} onChange={handleChange}
            error={!!errors.email} helperText={errors.email}
          />
          <TextField
            fullWidth margin="dense" label="Phone Number" name="phoneNumber"
            value={formData.phoneNumber} onChange={handleChange}
            error={!!errors.phoneNumber} helperText={errors.phoneNumber}
          />
          <TextField
            fullWidth margin="dense" label="City" name="city"
            value={formData.city} onChange={handleChange}
            error={!!errors.city} helperText={errors.city}
          />
          <TextField
            fullWidth margin="dense" label="Message" name="message"
            value={formData.message} onChange={handleChange}
            error={!!errors.message} helperText={errors.message}
          />
          <TextField
            fullWidth margin="dense" label="Inquiry Type" name="inquiryType"
            value={formData.inquiryType} onChange={handleChange}
            error={!!errors.inquiryType} helperText={errors.inquiryType}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this inquiry?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
