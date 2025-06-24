"use client";

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  CircularProgress, Box, Link, IconButton,
  Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getSlider, addSlider, updateSlider, deleteSlider } from "../../../../data/GetSliderData";

export default function SliderTable() {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSliderData();
  }, []);

  const fetchSliderData = async () => {
    setLoading(true);
    try {
      const data = await getSlider();
      setSliderData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open Add or Edit Dialog
  const handleDialogOpen = (slider = null) => {
    if (slider) {
      setFormData(slider);
      setEditId(slider.dashboardSliderId);
    } else {
      setFormData({});
      setEditId(null);
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setFormData({});
    setEditId(null);
    setOpenDialog(false);
  };

  // Submit Form
  const handleSubmit = async () => {
    try {
      const payload = { ...formData };

      if (editId) {
        await updateSlider(editId, payload);
      } else {
        await addSlider(payload);
      }

      await fetchSliderData();
      handleDialogClose();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Delete Logic

  
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this slider?")) {
      await deleteSlider(id);
      await fetchSliderData();
    }
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
    <TableContainer component={Paper}>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h6" sx={{fontWeight:"bolder"}}>Dashboard Slider Table</Typography>
        <Tooltip title="Add Slider">
          <Button variant="contained" startIcon={<Add />} onClick={() => handleDialogOpen()} color="primary">
            add Slider
          </Button>
        </Tooltip>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontWeight:"bold"}}>No</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Small Name</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Name</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Description</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Meta</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Link Name</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Link</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Image</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sliderData.map((item, index) => (
            <TableRow key={item.dashboardSliderId}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.smallNameOfSlider}</TableCell>
              <TableCell>{item.nameOfSlider}</TableCell>
              <TableCell>{item.sliderDescription}</TableCell>
              <TableCell>{item.metaDescription}</TableCell>
              <TableCell>{item.linkNameOfPage}</TableCell>
              <TableCell>
                <Link href={item.link} target="_blank" rel="noopener">
                  {item.link}
                </Link>
              </TableCell>
              <TableCell>
                <img
                  src={item.pathOfImage}
                  alt={item.nameOfSlider}
                  width={60}
                  height={60}
                  style={{ objectFit: "contain" }}
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleDialogOpen(item)} color="primary">
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(item.dashboardSliderId)} color="error">
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth className=" mt-15">
        <DialogTitle>{editId ? "Edit Slider" : "Add Slider"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Small Name"
            fullWidth
            margin="normal"
            value={formData.smallNameOfSlider || ""}
            onChange={(e) => setFormData({ ...formData, smallNameOfSlider: e.target.value })}
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.nameOfSlider || ""}
            onChange={(e) => setFormData({ ...formData, nameOfSlider: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={formData.sliderDescription || ""}
            onChange={(e) => setFormData({ ...formData, sliderDescription: e.target.value })}
          />
          <TextField
            label="Meta Description"
            fullWidth
            margin="normal"
            value={formData.metaDescription || ""}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          />
          <TextField
            label="Link Name"
            fullWidth
            margin="normal"
            value={formData.linkNameOfPage || ""}
            onChange={(e) => setFormData({ ...formData, linkNameOfPage: e.target.value })}
          />
          <TextField
            label="Link"
            fullWidth
            margin="normal"
            value={formData.link || ""}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
          <TextField
            label="Image Path (URL)"
            fullWidth
            margin="normal"
            value={formData.pathOfImage || ""}
            onChange={(e) => setFormData({ ...formData, pathOfImage: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
