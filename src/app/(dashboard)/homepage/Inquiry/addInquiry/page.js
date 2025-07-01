'use client';

import React, { useState } from 'react';
import {
    Box, Button, TextField, Typography
} from '@mui/material';
import { postInquiry } from '../../../../data/InquiryApi';

const InquiryForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        city: '',
        message: '',
        inquiryType: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

   const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await postInquiry(formData); // already parsed JSON

    if (result?.isSuccess) {
      setStatus('Inquiry submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        city: '',
        message: '',
        inquiryType: ''
      });
      
    } else {
      setStatus(result?.message || 'Submission failed.');
      console.log(result?.errors); // optional
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    setStatus('An error occurred. Please try again.');
  }
};


    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
            <Typography variant="h5" mb={2}>Inquiry Form</Typography>

            <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                label="Message"
                name="message"
                multiline
                rows={3}
                value={formData.message}
                onChange={handleChange}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                label="Inquiry Type"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
            />

            <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
                Submit
            </Button>

            {status && (
                <Typography mt={2} color={status.includes('success') ? 'green' : 'red'}>
                    {status}
                </Typography>
            )}
        </Box>
    );
};

export default InquiryForm;
