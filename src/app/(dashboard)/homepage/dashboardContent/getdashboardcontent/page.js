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
  deleteDashboardContent
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

  const [isEditing, setIsEditing] = useState(false); // Track if editing or adding

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

  // 🗑️ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDashboardContent(id);
      fetchData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // ✏️ Edit
  const handleEditClick = (item) => {
    setFormData(item);
    setIsEditing(true);
    setEditDialogOpen(true);
  };

  // ➕ Add
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
        await updateDashboardContent(formData.id, formData);
      } else {
        await postDashboardContent(formData);
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
            {data.map((item,index) => (
              <TableRow key={item.id || index}>
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
                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
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
    </>
  );
}
