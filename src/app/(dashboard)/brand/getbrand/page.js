"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Link,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tooltip,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { getBrand, postBrandid, updateBrandid } from "../../../data/AllbrandApi";

// ✅ Custom No Rows Overlay
function CustomNoRowsOverlay() {
  return (
    <GridOverlay>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body1">🚫 No content found.</Typography>
      </Box>
    </GridOverlay>
  );
}

export default function DashboardContentTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    middleHighLightedContent: "",
    middleMainContent: "",
    middleDescription: "",
    middleLinkName: "",
    middleLink: "",
    brandDetails: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getBrand();
      const mapped = result?.data?.map((item, idx) => ({
        ...item,
        id: item.dashboardContentId || idx,
      }));
      setRows(mapped || []);
    } catch (err) {
      alert("Error loading data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    setFormData({
      middleHighLightedContent: "",
      middleMainContent: "",
      middleDescription: "",
      middleLinkName: "",
      middleLink: "",
      brandDetails: "",
      description: "",
      isActive: true,
    });
    setErrors({});
    setIsEditing(false);
    setEditDialogOpen(true);
  };

  const handleEditClick = (row) => {
    setFormData(row);
    setErrors({});
    setIsEditing(true);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `https://apex-dev-api.aitechustel.com/api/Brand/${deleteId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete content");
      setDeleteDialogOpen(false);
      fetchData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.middleHighLightedContent.trim()) newErrors.middleHighLightedContent = "Highlighted content is required.";
    if (!formData.middleMainContent.trim()) newErrors.middleMainContent = "Main content is required.";
    if (!formData.middleDescription.trim()) newErrors.middleDescription = "Description is required.";
    if (!formData.middleLinkName.trim()) newErrors.middleLinkName = "Link name is required.";
    if (!formData.middleLink.trim()) newErrors.middleLink = "Link URL is required.";
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      if (isEditing) {
        await updateBrandid({
          dashboardContentId: formData.dashboardContentId,
          ...formData,
        });
      } else {
        await postBrandid(formData);
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
    { field: "middleHighLightedContent", headerName: "Highlighted", width: 180 },
    { field: "middleMainContent", headerName: "Main Content", width: 180 },
    { field: "middleDescription", headerName: "Content Description", width: 200 },
    {
      field: "middleLinkName",
      headerName: "Link Name",
      width: 180,
      renderCell: (params) => (
        <Link href={params.row.middleLink} target="_blank" underline="hover">
          {params.row.middleLinkName}
        </Link>
      ),
    },
    { field: "middleLink", headerName: "Link URL", width: 200 },
    { field: "brandDetails", headerName: "Brand Details", width: 180 },
    { field: "description", headerName: "Brand Description", width: 200 },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      type: "boolean",
    },
    {
      field: "createdOn",
      headerName: "Created On",
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    { field: "createdBy", headerName: "Created By", width: 220 },
    { field: "modifiedBy", headerName: "Modified By", width: 220 },
    { field: "mrBrandId", headerName: "Brand ID", width: 220 },
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
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row.dashboardContentId)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box mt={5} maxWidth={1300} mx="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Dashboard Content</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
          Add Content
        </Button>
      </Box>

      <Paper sx={{ height: "auto", width: "100%" }}>
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
          pageSizeOptions={[10, 20, 30]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          checkboxSelection
          loading={loading}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Content" : "Add Content"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Highlighted Content" name="middleHighLightedContent" value={formData.middleHighLightedContent} onChange={handleChange} error={!!errors.middleHighLightedContent} helperText={errors.middleHighLightedContent} fullWidth />
          <TextField label="Main Content" name="middleMainContent" value={formData.middleMainContent} onChange={handleChange} error={!!errors.middleMainContent} helperText={errors.middleMainContent} fullWidth />
          <TextField label="Description" name="middleDescription" value={formData.middleDescription} onChange={handleChange} error={!!errors.middleDescription} helperText={errors.middleDescription} fullWidth />
          <TextField label="Link Name" name="middleLinkName" value={formData.middleLinkName} onChange={handleChange} error={!!errors.middleLinkName} helperText={errors.middleLinkName} fullWidth />
          <TextField label="Link URL" name="middleLink" value={formData.middleLink} onChange={handleChange} error={!!errors.middleLink} helperText={errors.middleLink} fullWidth />
          <TextField label="Brand Details" name="brandDetails" value={formData.brandDetails} onChange={handleChange} fullWidth />
          <TextField label="Brand Description" name="description" value={formData.description} onChange={handleChange} fullWidth />
          <FormControlLabel control={<Checkbox checked={formData.isActive || false} onChange={handleCheckboxChange} name="isActive" />} label="Is Active" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{isEditing ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this content?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
