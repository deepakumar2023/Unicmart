'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Tooltip, Switch, FormControlLabel
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';

import {
  GetPromoCode,
  postPromoCode,
  updatePromoCode,
} from '../../../../data/promocodeApi';

export default function PromoCodeTable() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const [editingPromo, setEditingPromo] = useState({
    promoCodeId: null,
    promoCodeDetails: '',
    locationOfPromoCode: '',
    locationEnum: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const fetchPromoCodes = async () => {
    try {
      const data = await GetPromoCode();
      setPromoCodes(data?.data || []);
    } catch (error) {
      console.error('Error fetching promo codes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleEdit = (promo) => {
    setEditingPromo({
      ...promo,
      startDate: promo.startDate?.split('T')[0] || '',
      endDate: promo.endDate?.split('T')[0] || '',
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingPromo({
      promoCodeId: null,
      promoCodeDetails: '',
      locationOfPromoCode: '',
      locationEnum: 'Dashboard_Center',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editingPromo.promoCodeDetails) newErrors.promoCodeDetails = 'Promo Code Details is required';
    if (!editingPromo.locationOfPromoCode) newErrors.locationOfPromoCode = 'Location is required';
    if (!editingPromo.startDate) newErrors.startDate = 'Start Date is required';
    if (!editingPromo.endDate) newErrors.endDate = 'End Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    const isEditing = !!editingPromo.promoCodeId;

    const payload = {
      promoCodeId: isEditing ? editingPromo.promoCodeId : undefined,
      promoCodeDetails: editingPromo.promoCodeDetails,
      locationOfPromoCode: editingPromo.locationOfPromoCode,
      locationEnum: editingPromo.locationEnum,
      startDate: new Date(editingPromo.startDate).toISOString(),
      endDate: new Date(editingPromo.endDate).toISOString(),
      isActive: editingPromo.isActive,
    };

    try {
      if (isEditing) {
        await updatePromoCode(payload);
      } else {
        await postPromoCode(payload);
      }

      setOpenDialog(false);
      fetchPromoCodes();
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`https://apex-dev-api.aitechustel.com/api/PromoCode/Delete/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to delete promo code');

      setDeleteDialogOpen(false);
      setDeleteId(null);
      fetchPromoCodes();
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };

  const columns = [
    { field: 'promoCodeDetails', headerName: 'Details', width: 300 },
    { field: 'locationOfPromoCode', headerName: 'Location', width: 250 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 150,
      // valueGetter: (params) => params.value?.split('T')[0],
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 150,
      // valueGetter: (params) => params.value?.split('T')[0],
    },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 150,
      renderCell: (params) => params.value ? 'Yes' : 'No',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(params.row.promoCodeId)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const rows = promoCodes.map((item, index) => ({
    id: item.promoCodeId || index,
    ...item,
  }));

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Promo Codes</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>Add Promo Code</Button>
      </Box>

      <Paper sx={{ height:"auto", width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
          loading={loading}
          checkboxSelection
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} maxWidth="sm" fullWidth onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingPromo.promoCodeId ? 'Edit Promo Code' : 'Add Promo Code'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Promo Code Details"
            fullWidth
            value={editingPromo.promoCodeDetails}
            onChange={(e) => setEditingPromo((prev) => ({ ...prev, promoCodeDetails: e.target.value }))}
            error={!!errors.promoCodeDetails}
            helperText={errors.promoCodeDetails}
          />
          <TextField
            margin="normal"
            label="Location of Promo Code"
            fullWidth
            value={editingPromo.locationOfPromoCode}
            onChange={(e) => setEditingPromo((prev) => ({ ...prev, locationOfPromoCode: e.target.value }))}
            error={!!errors.locationOfPromoCode}
            helperText={errors.locationOfPromoCode}
          />
          <TextField
            margin="normal"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editingPromo.startDate}
            onChange={(e) => setEditingPromo((prev) => ({ ...prev, startDate: e.target.value }))}
            error={!!errors.startDate}
            helperText={errors.startDate}
          />
          <TextField
            margin="normal"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editingPromo.endDate}
            onChange={(e) => setEditingPromo((prev) => ({ ...prev, endDate: e.target.value }))}
            error={!!errors.endDate}
            helperText={errors.endDate}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editingPromo.isActive}
                onChange={(e) => setEditingPromo((prev) => ({ ...prev, isActive: e.target.checked }))}
              />
            }
            label="Is Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this promo code?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
