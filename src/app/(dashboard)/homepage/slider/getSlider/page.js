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
import {
  getSlider,
  addSlider,
  updateSlider,
  deleteSlider,
} from "../../../../data/GetSliderData";
import Image from "next/image";

export default function SliderTable() {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});
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
      const data = await getSlider();
      setSliderData(data?.data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

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
    setFile(null);
    setOpenDialog(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };



// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setMessage("");

//   try {
//     const form = new FormData();
//     form.append("SmallNameOfSlider", formData.smallNameOfSlider);
//     form.append("NameOfSlider", formData.nameOfSlider);
//     form.append("SliderDescription", formData.sliderDescription);
//     form.append("LinkNameOfPage", formData.linkNameOfPage);
//     form.append("Link", formData.link);
//     form.append("MetaDescription", formData.metaDescription);

//     if (file) {
//       form.append("file", file);
//     }

//     // 🆕 For edit, include the ID in form data
//     if (editId) {
//       form.append("DashboardSliderId", editId);
//       await updateSlider(form);
//     } else {
//       await addSlider(form);
//     }

//     setMessage("✅ Data submitted successfully!");
//     await fetchSliderData();     // Refresh the table
//     handleDialogClose();         // Close the form modal

//   } catch (error) {
//     console.error("Submit Error:", error.message);
//     setMessage("❌ Error: " + error.message);
//   }
// };



const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const form = new FormData();
    form.append("SmallNameOfSlider", formData.smallNameOfSlider);
    form.append("NameOfSlider", formData.nameOfSlider);
    form.append("SliderDescription", formData.sliderDescription);
    form.append("LinkNameOfPage", formData.linkNameOfPage);
    form.append("Link", formData.link);
    form.append("MetaDescription", formData.metaDescription);

    if (formData.pathOfImage) {
      form.append("PathOfImage", formData.pathOfImage);
    }

    if (file) {
      form.append("file", file);
    }

    let response;

    // If editId exists, call updateSlider API
    if (editId) {
      form.append("DashboardSliderId", editId); // include ID for update
      response = await fetch(
        `https://apex-dev-api.aitechustel.com/api/Dashboard/UpdateSlider`,
        {
          method: "PUT",
          body: form,
        }
      );
    } else {
      // else call AddSlider
      response = await fetch(
        "https://apex-dev-api.aitechustel.com/api/Dashboard/AddSlider",
        {
          method: "POST",
          body: form,
        }
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit");
    }

    const result = await response.json();
    console.log("Submitted:", result);
    setMessage("✅ Data submitted successfully!");

    // Refresh table and close dialog
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
      if (!deleteId) return;

      const response = await fetch(`https://apex-dev-api.aitechustel.com/api/Dashboard/DeleteSlider/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      console.log("Delete success:", result);
      await fetchSliderData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
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
        <Typography variant="h6" sx={{ fontWeight: "bolder" }}>
          Dashboard Slider Table
        </Typography>
        <Tooltip title="Add Slider">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen()}
            color="primary"
          >
            Add Slider
          </Button>
        </Tooltip>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Small Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Meta</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Link Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Link</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
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
                <Image
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
                  <IconButton
                    onClick={() => handleDeleteClick(item.dashboardSliderId)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" sx={{ mt: 10 }} fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>{editId ? "Edit Slider" : "Add Slider"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Small Name"
            fullWidth
            margin="normal"
            value={formData.smallNameOfSlider || ""}
            onChange={(e) =>
              setFormData({ ...formData, smallNameOfSlider: e.target.value })
            }
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.nameOfSlider || ""}
            onChange={(e) =>
              setFormData({ ...formData, nameOfSlider: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={formData.sliderDescription || ""}
            onChange={(e) =>
              setFormData({ ...formData, sliderDescription: e.target.value })
            }
          />
          <TextField
            label="Meta Description"
            fullWidth
            margin="normal"
            value={formData.metaDescription || ""}
            onChange={(e) =>
              setFormData({ ...formData, metaDescription: e.target.value })
            }
          />
          <TextField
            label="Link Name"
            fullWidth
            margin="normal"
            value={formData.linkNameOfPage || ""}
            onChange={(e) =>
              setFormData({ ...formData, linkNameOfPage: e.target.value })
            }
          />
          <TextField
            label="Link"
            fullWidth
            margin="normal"
            value={formData.link || ""}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />

          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Upload Image
            </Typography>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
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
    </TableContainer>
  );
}
