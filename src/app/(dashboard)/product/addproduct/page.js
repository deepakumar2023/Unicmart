'use client';
import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography, Grid
} from '@mui/material';
import { postProductid } from '../../../data/AllproductApi';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    metaTitle: 'Sample Meta Title',
    metaDescription: 'Sample Meta Description',
    name: 'Product Name',
    productURL: '/product-url',
    shortInfo: 'Short Info here',
    description: 'Full product description here',
    price: 1000,
    subcategoryId: '', // ⛔ Send only if required by backend
    categoryId: '',
    productType: '',
    mrPurchaseId: '',
    stocks: [{ quantity: 10 }], // ✅ No ID
    purchaseDetails: [{ purchaseDate: new Date().toISOString() }],
    saleDetails: [{ saleDate: new Date().toISOString() }],
    attachments: [{ fileName: 'brochure.pdf', url: 'https://example.com/file.pdf' }],
    productColorDetails: [{ color: 'Black' }],
    productDiscounts: [{ discountPercent: 15 }],
    productImages: [{ imageUrl: 'https://example.com/image.jpg' }],
    productPrices: [{ amount: 999, effectiveDate: new Date().toISOString() }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (e, key, index, nestedKey) => {
    const value = e.target.value;
    const updatedList = [...formData[key]];
    updatedList[index][nestedKey] = value;
    setFormData((prev) => ({
      ...prev,
      [key]: updatedList
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postProductid(formData);
      console.log("API Response:", res);
      alert(res?.message || "Product Created Successfully!");
    } catch (err) {
      alert("Failed to post product: " + err.message);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Add Product</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}><TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Meta Title" name="metaTitle" value={formData.metaTitle} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Meta Description" name="metaDescription" value={formData.metaDescription} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Product URL" name="productURL" value={formData.productURL} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Short Info" name="shortInfo" value={formData.shortInfo} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={12}><TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} /></Grid>
          <Grid item xs={6}><TextField label="Price" name="price" value={formData.price} onChange={handleChange} type="number" fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Category ID" name="categoryId" value={formData.categoryId} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Subcategory ID" name="subcategoryId" value={formData.subcategoryId} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Product Type" name="productType" value={formData.productType} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="MR Purchase ID" name="mrPurchaseId" value={formData.mrPurchaseId} onChange={handleChange} fullWidth /></Grid>

          {/* Stock Example */}
          <Grid item xs={6}><TextField label="Stock Quantity" type="number" value={formData.stocks[0].quantity} onChange={(e) => handleNestedChange(e, 'stocks', 0, 'quantity')} fullWidth /></Grid>
        </Grid>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">Submit</Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProductForm;
