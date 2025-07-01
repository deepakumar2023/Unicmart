"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, IconButton, Tooltip,
  FormControlLabel, Switch
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import {
  GetnewsLetter, postnewsLetter, updatenewsLetter, deletenewsLetter
} from "../../../../data/NewletterApi";

export default function NewsletterTable() {
  const [newsletters, setNewsletters] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm());
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  function initialForm() {
    return {
      newsletterId: "",
      emailId: "",
      ccEmilId: "string",
      isActive: true,
      createdOn: new Date().toISOString(),
      createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      modifiedOn: new Date().toISOString(),
      modifiedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    };
  }

  const fetchData = async () => {
    try {
      const res = await GetnewsLetter();
      setNewsletters(res.data);
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
    if (!formData.emailId.trim()) newErrors.emailId = "Email ID is required.";
    // if (!formData.ccEmilId.trim()) newErrors.ccEmilId = "CC Email ID is required.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const timestamp = new Date().toISOString();
    formData.modifiedOn = timestamp;

    try {
      if (editMode) {
        await updatenewsLetter(formData);
      } else {
        await postnewsLetter({
          ...formData,
          newsletterId: crypto.randomUUID(),
          createdOn: timestamp
        });
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
      await deletenewsLetter(deleteId);
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
    { field: "emailId", headerName: "Email ID", width: 350 },
    { field: "ccEmilId", headerName: "CC Email ID", width: 350,renderCell :(params) => (params.value === "null" ? <span style={{ color: "#999" }}>No data available</span> : <span>{params.value}</span>) },
    {
      field: "isActive",
      headerName: "Active",
      width: 250,
      renderCell: (params) => (params.value ? "Yes" : "No")
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
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
            <IconButton color="error" onClick={() => handleDeleteClick(params.row.newsletterId)}>
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
        <Typography variant="h6">Newsletter List</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Newsletter
        </Button>
      </Box>

      <Paper sx={{ height: "auto", width: "100%" }}>
        <DataGrid
          rows={newsletters}
          columns={columns}
          getRowId={(row) => row.newsletterId}
          checkboxSelection
          pageSizeOptions={[10, 20, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Add/Edit Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? "Edit Newsletter" : "Add Newsletter"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="dense" label="Email ID" name="emailId"
            value={formData.emailId} onChange={handleChange}
            error={!!errors.emailId} helperText={errors.emailId}
          />
          <TextField
            fullWidth margin="dense" label="CC Email ID" name="ccEmilId"
            value={formData.ccEmilId} onChange={handleChange}
            // error={!!errors.ccEmilId} helperText={errors.ccEmilId}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
            }
            label="Is Active"
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
          <Typography>Are you sure you want to delete this newsletter?</Typography>
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
