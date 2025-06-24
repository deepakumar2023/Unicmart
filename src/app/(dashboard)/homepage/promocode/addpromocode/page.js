'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { postPromoCode } from '../../../../data/promocodeApi';

export default function PromoForm() {
  const [formData, setFormData] = useState({
    promoCodeDetails: '',
    // startDate: '',
    // endDate: '',
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      promoCodeDetails: formData.promoCodeDetails,
    //   startDate: new Date(formData.startDate).toISOString(),
    //   endDate: new Date(formData.endDate).toISOString(),
      isActive: formData.isActive,
    };

    try {
      const res = await postPromoCode(payload);

      if (res?.ok === false) throw new Error('API returned error');

      alert('Promo code created successfully!');
      console.log('Response:', res);
    } catch (error) {
      alert('Error submitting promo code');
      console.error('Submit Error:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" mb={2}>Create Promo Code</Typography>

      <TextField
        label="Promo Code Details"
        name="promoCodeDetails"
        fullWidth
        value={formData.promoCodeDetails}
        onChange={handleChange}
        margin="normal"
        required
      />

     {/* <TextField
  label="Start Date"
  name="startDate"
  type="date"
  fullWidth
  value={formData.startDate}
  onChange={handleChange}
  margin="normal"
  InputLabelProps={{ shrink: true }}
  required
  inputProps={{
    placeholder: 'yyyy-mm-dd' // optional hint
  }}
/> */}


      {/* <TextField
        label="End Date"
        name="endDate"
        type="date"
        fullWidth
        value={formData.endDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      /> */}

      <FormControlLabel
        control={
          <Switch
            checked={formData.isActive}
            onChange={handleChange}
            name="isActive"
            color="primary"
          />
        }
        label="Is Active"
      />

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
}
