"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Link, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Tooltip
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

import {
  getDashboardContent,
  postDashboardContent,
  updateDashboardContent,
 
} from "../../../../data/DashboardContentApi";

export default function DashboardContentTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    middleHighLightedContent: "",
    middleMainContent: "",
    middleDescription: "",
    middleLinkName: "",
    middleLink: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const result = await getDashboardContent();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
  try {
    const res = await fetch(`https://apex-dev-api.aitechustel.com/api/Dashboard/DeleteContent/${deleteId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete content");
    }

    setDeleteDialogOpen(false);
    fetchData();
  } catch (err) {
    alert("Delete failed: " + err.message);
  }
};


  const handleEditClick = (item) => {
    setFormData(item);
    setIsEditing(true);
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setFormData({
      middleHighLightedContent: "",
      middleMainContent: "",
      middleDescription: "",
      middleLinkName: "",
      middleLink: "",
    });
    setIsEditing(false);
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
  try {
    if (isEditing) {
      await updateDashboardContent({
        dashboardContentId: formData.dashboardContentId, // 👈 make sure this is included
        middleHighLightedContent: formData.middleHighLightedContent,
        middleMainContent: formData.middleMainContent,
        middleDescription: formData.middleDescription,
        middleLinkName: formData.middleLinkName,
        middleLink: formData.middleLink,
      });
    } else {
      await postDashboardContent({
        middleHighLightedContent: formData.middleHighLightedContent,
        middleMainContent: formData.middleMainContent,
        middleDescription: formData.middleDescription,
        middleLinkName: formData.middleLinkName,
        middleLink: formData.middleLink,
      });
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

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={5} maxWidth={1200} mx="auto">
        <Typography variant="h5">Dashboard Content</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
          Add Content
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2, maxWidth: 1200, mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Highlighted</strong></TableCell>
              <TableCell><strong>Main</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Link Name</strong></TableCell>
              <TableCell><strong>Link URL</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((item, index) => (
              <TableRow key={item.dashboardContentId || index}>
                <TableCell>{item.middleHighLightedContent}</TableCell>
                <TableCell>{item.middleMainContent}</TableCell>
                <TableCell>{item.middleDescription}</TableCell>
                <TableCell>
                  <Link href={item.middleLink} target="_blank" underline="hover">
                    {item.middleLinkName}
                  </Link>
                </TableCell>
                <TableCell>{item.middleLink}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEditClick(item)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteClick(item.dashboardContentId)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {data?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No content found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Content" : "Add Content"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Highlighted Content"
            name="middleHighLightedContent"
            value={formData.middleHighLightedContent}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Main Content"
            name="middleMainContent"
            value={formData.middleMainContent}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="middleDescription"
            value={formData.middleDescription}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Link Name"
            name="middleLinkName"
            value={formData.middleLinkName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Link URL"
            name="middleLink"
            value={formData.middleLink}
            onChange={handleChange}
            fullWidth
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
          <Typography>Are you sure you want to delete this content?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
