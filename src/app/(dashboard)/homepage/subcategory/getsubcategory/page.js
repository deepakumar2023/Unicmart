"use client";
import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Tooltip,
    FormControlLabel,
    Checkbox,
    MenuItem,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Image from "next/image";
import {
    getSubCategory,
    postSubCategoryid,
    updatSubCategoryid,
    deleteSubCategoryid,
    getCategoryById, // You can use this if you want to show more category info
} from "../../../../data/AllSubCategoryApi";

import {getCategory} from '../../../../data/CategoryApi'

export default function SubCategoryTable() {
    const [subCategoryData, setSubCategoryData] = useState([]);
      const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);


console.log(data,"kya aa rahaha ")

     const fetchData = async () => {
        const res = await getCategory();
        setData(res.data || []);
      };

    useEffect(() => {
     fetchSubCategoryData();
     fetchData();
    }, []);

    const fetchSubCategoryData = async () => {
        setLoading(true);
        try {
            const result = await getSubCategory();
            setSubCategoryData(result?.data || []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogOpen = (data = null) => {
        setFormData(data || {});
        setEditId(data?.subCategoryId || null);
        setFile(null);
        setMessage("");
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setFormData({});
        setEditId(null);
        setFile(null);
        setMessage("");
        setFormErrors({});
    };

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const validateForm = () => {
        const errors = {};
        if (!formData.subCategoryDetails?.trim()) errors.subCategoryDetails = "SubCategoryDetails is required";
        if (!formData.categoryId?.trim()) errors.categoryId = "Category is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const payload = new FormData();
            payload.append("SubCategoryDetails", formData.subCategoryDetails || "");
            payload.append("Description", formData.description || "");
            payload.append("Title", formData.title || "");
            payload.append("Link", formData.link || "");
            payload.append("IsActive", formData.isActive || false);
            payload.append("IsShowingOnDashBoard", formData.isShowingOnDashBoard || false);
            payload.append("CategoryId", formData.categoryId);
            payload.append("ModifiedBy", "00000000-0000-0000-0000-000000000000");
            payload.append("ModifiedOn", new Date().toISOString());

            if (file) payload.append("File", file);

            if (editId) {
                payload.append("SubCategoryId", editId);
                await updatSubCategoryid(payload);
            } else {
                payload.append("CreatedBy", "00000000-0000-0000-0000-000000000000");
                payload.append("CreatedOn", new Date().toISOString());
                await postSubCategoryid(payload);
            }

            setMessage("✅ Data submitted successfully!");
            fetchSubCategoryData();
            handleDialogClose();
        } catch (err) {
            setMessage("❌ Error: " + err.message);
            console.error(err);
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteSubCategoryid(deleteId);
            fetchSubCategoryData();
        } catch (err) {
            alert("Delete failed: " + err.message);
        } finally {
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    const columns = [
        { field: "subCategoryDetails", headerName: "Details", width: 180 },
        { field: "description", headerName: "Description", width: 180 },
        { field: "title", headerName: "Title", width: 160 },
        { field: "link", headerName: "Link", width: 160 },
        {
            field: "isShowingOnDashBoard",
            headerName: "Dashboard?",
            width: 120,
            renderCell: (params) => (params.value ? "Yes" : "No"),
        },
        {
            field: "isActive",
            headerName: "Active",
            width: 100,
            renderCell: (params) => (params.value ? "✅" : "❌"),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleDialogOpen(params.row)} color="primary">
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => { setDeleteId(params.row.subCategoryId); setDeleteDialogOpen(true); }} color="error">
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">SubCategory Table</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleDialogOpen()}>Add SubCategory</Button>
            </Box>

            <DataGrid
                rows={subCategoryData}
                columns={columns}
                getRowId={(row) => row.subCategoryId}
                loading={loading}
                checkboxSelection
                pagination
                pageSizeOptions={[5, 10, 20]}
                sx={{
                    "& .MuiDataGrid-columnHeaders": { fontWeight: "bold" },
                    "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
                }}
            />

            {/* Form Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth sx={{mt:10}}>
                <DialogTitle>{editId ? "Edit SubCategory" : "Add SubCategory"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="SubCategory Details"
                        fullWidth margin="normal"
                        value={formData.subCategoryDetails || ""}
                        onChange={(e) => setFormData({ ...formData, subCategoryDetails: e.target.value })}
                        error={!!formErrors.subCategoryDetails}
                        helperText={formErrors.subCategoryDetails}
                    />
                    <TextField
                        label="Description"
                        fullWidth margin="normal"
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <TextField
                        label="Title"
                        fullWidth margin="normal"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <TextField
                        label="Link"
                        fullWidth margin="normal"
                        value={formData.link || ""}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    />
                    <TextField
                        select
                        label="Select Category"
                        fullWidth
                        margin="normal"
                        value={formData.categoryId || ""}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        error={!!formErrors.categoryId}
                        helperText={formErrors.categoryId}
                    >
                        {data?.map((category) => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                                {category.categoryId}
                            </MenuItem>
                        ))}
                    </TextField>


                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.isShowingOnDashBoard || false}
                                onChange={(e) => setFormData({ ...formData, isShowingOnDashBoard: e.target.checked })}
                            />
                        }
                        label="Show on Dashboard"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.isActive || false}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                        }
                        label="Is Active"
                    />

                    <Box mt={2}>
                        <Typography variant="subtitle1">Upload Image</Typography>
                        {file && (
                            <Box mb={1}>
                                <Image src={URL.createObjectURL(file)} alt="preview" width={120} height={80} style={{ objectFit: "cover", borderRadius: 6 }} />
                            </Box>
                        )}
                        <Button component="label" variant="outlined">
                            Choose Image
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Box>

                    {message && <Typography mt={2} color={message.startsWith("✅") ? "green" : "error"}>{message}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>{editId ? "Update" : "Add"}</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this subcategory?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
