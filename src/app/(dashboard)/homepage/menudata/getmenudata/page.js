'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, IconButton, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, MenuItem, FormControlLabel,
  Checkbox, Tooltip, Paper
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  KeyboardArrowDown, KeyboardArrowRight,
  Edit as EditIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import {
  getmenudata,
  postmenudataid,
  updatemenudata,
  deleteMenuData
} from '../../../../data/Menudata';

const menuTypes = ['CounterTop', 'Cabinet', 'Appliance', 'Sink'];

export default function MenuTable() {
  const [menuData, setMenuData] = useState([]);
  const [rows, setRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
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
      const flatRows = flattenMenu(res.data || []);
      setMenuData(res.data || []);
      setRows(flatRows);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // 🔄 Flatten menu with level tracking
  const flattenMenu = (menus, level = 0, parentId = null) => {
    return menus.flatMap((item) => {
      const row = {
        ...item,
        id: item.menuId,
        level,
        parentId,
        hasChildren: item.childMenus?.length > 0,
      };
      const children = item.childMenus?.length ? flattenMenu(item.childMenus, level + 1, item.menuId) : [];
      return [row, ...children];
    });
  };

  const handleExpandClick = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleRows = rows.filter(
    (row) => row.level === 0 || expandedRows[row.parentId]
  );

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
        await updatemenudata(formData);
      } else {
        await postmenudataid(formData);
      }
      setEditDialogOpen(false);
      await fetchMenu();
    } catch (error) {
      console.error('Save error:', error.message);
      alert('Save failed: ' + error.message);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMenuData(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
      await fetchMenu();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const columns = [
    {
      field: 'expand',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: (params) => {
        const { row } = params;
        if (!row.hasChildren) return null;
        return (
          <IconButton size="small" onClick={() => handleExpandClick(row.menuId)}>
            {expandedRows[row.menuId] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </IconButton>
        );
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ pl: params.row.level * 2 }}>
          {params.value}
        </Box>
      ),
    },
    { field: 'urlSlug', headerName: 'URL Slug', flex: 1 },
    { field: 'displayOrder', headerName: 'Order', width: 90 },
    { field: 'tags', headerName: 'Tags', flex: 1 },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 90,
      renderCell: (params) => (params.row.isActive ? 'Yes' : 'No'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(params.row.menuId)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">Menu Management</Typography>
        <Button variant="contained" onClick={handleAdd}>Add Menu</Button>
      </Box>

      <Paper sx={{ height: "auto", width: '100%' }}>
        <DataGrid
          rows={visibleRows}
          columns={columns}
            sx={{
              border: 0 ,
    "& .MuiDataGrid-columnHeaders": {
      fontWeight: "bold",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: "bold",
    }
  }}
          getRowId={(row) => row.menuId}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          checkboxSelection
          pageSizeOptions={[5, 10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
                page: 0,
              },
            },
          }}
          pagination
         
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm" sx={{ mt: 10 }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{formData?.menuId ? 'Edit Menu' : 'Add Menu'}</DialogTitle>
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
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this menu?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
