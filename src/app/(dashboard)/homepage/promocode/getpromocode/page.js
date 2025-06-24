'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Switch, FormControlLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

import {
  GetPromoCode,
  postPromoCode,
  updatePromoCode,
} from '../../../../data/promocodeApi';

export default function PromoCodeTable() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPromo, setEditingPromo] = useState({
    promoCodeDetails: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // For modal confirm

  const fetchPromoCodes = async () => {
    try {
      const data = await GetPromoCode();
      setPromoCodes(data);
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
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingPromo({
      promoCodeDetails: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setOpenDialog(true);
  };

  const handleFormSubmit = async () => {
    const payload = {
      promoCodeDetails: editingPromo.promoCodeDetails,
      startDate: new Date(editingPromo.startDate).toISOString(),
      endDate: new Date(editingPromo.endDate).toISOString(),
      isActive: editingPromo.isActive,
    };

    try {
      if (editingPromo.promoCodeId) {
        await updatePromoCode(editingPromo.promoCodeId, payload);
      } else {
        await postPromoCode(payload);
      }

      setOpenDialog(false);
      fetchPromoCodes();
    } catch (error) {
      console.error('Submit Error:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`https://apex-dev-api.aitechustel.com/api/PromoCode/${deleteId}`, {
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

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>Promo Codes</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add Promo Code
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Active</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promoCodes.map((promo) => (
              <TableRow key={promo.promoCodeId}>
                <TableCell>{promo.promoCodeDetails}</TableCell>
                <TableCell>{promo.startDate?.split('T')[0]}</TableCell>
                <TableCell>{promo.endDate?.split('T')[0]}</TableCell>
                <TableCell>{promo.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => handleEdit(promo)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteClick(promo.promoCodeId)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!promoCodes.length && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">No promo codes found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} maxWidth="sm" onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle sx={{fontWeight:"bold"}}>{editingPromo?.promoCodeId ? 'Edit Promo Code' : 'Add Promo Code'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Promo Code Details"
            fullWidth
            value={editingPromo.promoCodeDetails}
            onChange={(e) => setEditingPromo((prev) => ({
              ...prev,
              promoCodeDetails: e.target.value,
            }))}
          />
          <TextField
            margin="normal"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editingPromo.startDate}
            onChange={(e) => setEditingPromo((prev) => ({
              ...prev,
              startDate: e.target.value,
            }))}
          />
          <TextField
            margin="normal"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editingPromo.endDate}
            onChange={(e) => setEditingPromo((prev) => ({
              ...prev,
              endDate: e.target.value,
            }))}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editingPromo.isActive}
                onChange={(e) => setEditingPromo((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))}
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this promo code?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
