"use client";

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  Collapse, IconButton, Box, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, FormControlLabel, Checkbox
} from "@mui/material";
import {
  KeyboardArrowDown, KeyboardArrowUp,
  Edit as EditIcon, Delete as DeleteIcon
} from "@mui/icons-material";
import {
  getmenudata,
  postmenudataid,
  updatemenudata
} from "../../../../data/Menudata";

const menuTypes = ["CounterTop", "Cabinet", "Appliance", "Sink"];

// Recursive Row component
function Row({ row, onEdit, onDelete, level = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ pl: `${level * 4}px` }}>
          {row.childMenus?.length > 0 && (
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.urlSlug}</TableCell>
        <TableCell>{row.displayOrder}</TableCell>
        <TableCell>{row.tags}</TableCell>
        <TableCell>{row.isActive ? "Yes" : "No"}</TableCell>
        <TableCell>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => onEdit(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(row.menuId)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {row.childMenus?.length > 0 && (
        <TableRow>
          <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ marginLeft: level * 4, marginY: 1 }}>
                <Table size="small">
                  <TableBody>
                    {row.childMenus.map((child) => (
                      <Row
                        key={child.menuId}
                        row={child}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        level={level + 1}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function MenuTable() {
  const [menuData, setMenuData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await getmenudata();
      setMenuData(res || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleEdit = (row) => {
    setFormData(row);
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      title: "",
      urlSlug: "",
      displayOrder: 0,
      tags: "",
      metaDescription: "",
      menuType: "",
      isActive: true,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (formData.menuId) {
        await updatemenudata(formData.menuId, formData);
      } else {
        await postmenudataid(formData);
      }
      setEditDialogOpen(false);
      await fetchMenu();
    } catch (error) {
      console.error("Save error:", error.message);
      alert(error.message);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`https://apex-dev-api.aitechustel.com/api/MenuDetails/delete/${deleteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error("Failed to delete menu");

      setDeleteDialogOpen(false);
      setDeleteId(null);
      await fetchMenu();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">Menu Management</Typography>
        <Button variant="contained" onClick={handleAdd}>Add Menu</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>URL Slug</strong></TableCell>
              <TableCell><strong>Order</strong></TableCell>
              <TableCell><strong>Tags</strong></TableCell>
              <TableCell><strong>Active</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuData.length > 0 ? (
              menuData.map((row) => (
                <Row key={row.menuId} row={row} onEdit={handleEdit} onDelete={handleDeleteClick} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No menu data available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm" sx={{mt:10}}>
        <DialogTitle sx={{ fontWeight: "bold" }}>{formData?.menuId ? "Edit Menu" : "Add Menu"}</DialogTitle>
        <DialogContent>
          {formData && (
            <>
              <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth margin="normal" />
              <TextField label="URL Slug" name="urlSlug" value={formData.urlSlug} onChange={handleChange} fullWidth margin="normal" />
              <TextField label="Display Order" name="displayOrder" type="number" value={formData.displayOrder} onChange={handleChange} fullWidth margin="normal" />
              <TextField label="Tags" name="tags" value={formData.tags} onChange={handleChange} fullWidth margin="normal" />
              <TextField label="Meta Description" name="metaDescription" value={formData.metaDescription} onChange={handleChange} fullWidth margin="normal" />
              <TextField select name="menuType" label="Menu Type" fullWidth margin="normal" value={formData.menuType} onChange={handleChange}>
                {menuTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={<Checkbox name="isActive" checked={formData.isActive} onChange={handleChange} />}
                label="Is Active"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Save</Button>
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
          <Typography>Are you sure you want to delete this menu?</Typography>
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
