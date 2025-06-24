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
  updatemenudata,
  deleteMenuData
} from "../../../../data/Menudata";

const menuTypes = ["CounterTop", "Cabinet", "Appliance", "Sink"];

function Row({ row, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {row.childMenus.length > 0 && (
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

      {row.childMenus.length > 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Child Menus
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>URL Slug</TableCell>
                      <TableCell>Order</TableCell>
                      <TableCell>Tags</TableCell>
                      <TableCell>Active</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.childMenus.map((child) => (
                      <TableRow key={child.menuId}>
                        <TableCell>{child.title}</TableCell>
                        <TableCell>{child.urlSlug}</TableCell>
                        <TableCell>{child.displayOrder}</TableCell>
                        <TableCell>{child.tags}</TableCell>
                        <TableCell>{child.isActive ? "Yes" : "No"}</TableCell>
                      </TableRow>
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

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await getmenudata();
      setMenuData(res);
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
      title: '',
      urlSlug: '',
      displayOrder: 0,
      tags: '',
      metaDescription: '',
      menuType: '',
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

  const handleDelete = async (menuId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteMenuData(menuId);
      await fetchMenu();
    } catch (error) {
      console.error("Delete error:", error);
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
        <Typography variant="h6" fontWeight="bold">Menu Details Table</Typography>
        <Button variant="contained" onClick={handleAdd}>Add Menu</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>URL Slug</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Display Order</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tags</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Active</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuData.map((row) => (
              <Row key={row.menuId} row={row} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" sx={{ overflow: 'scroll',mt:10}} fullWidth>
        <DialogTitle>{formData?.menuId ? 'Edit Menu' : 'Add Menu'}</DialogTitle>
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
    </>
  );
}



