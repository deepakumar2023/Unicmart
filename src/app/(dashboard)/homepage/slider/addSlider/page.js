"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function DashboardSliderForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    smallNameOfSlider: "",
    nameOfSlider: "",
    sliderDescription: "",
    linkNameOfPage: "",
    link: "",
    pathOfImage: "", // Will be set by file upload
    metaDescription: "",
  });

  const [file, setFile] = useState(null); // file state
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const form = new FormData();

      // Append all text fields
      form.append("SmallNameOfSlider", formData.smallNameOfSlider);
      form.append("NameOfSlider", formData.nameOfSlider);
      form.append("SliderDescription", formData.sliderDescription);
      form.append("LinkNameOfPage", formData.linkNameOfPage);
      form.append("Link", formData.link);
      form.append("MetaDescription", formData.metaDescription);

      // Optional: append PathOfImage if it's a URL
      if (formData.pathOfImage) {
        form.append("PathOfImage", formData.pathOfImage);
      }

      // Append the image file if selected
      if (file) {
        form.append("file", file); // Backend expects "file"
      }

      const response = await fetch(
        "https://apex-dev-api.aitechustel.com/api/Dashboard/AddSlider",
        {
          method: "POST",
          body: form, // do not set Content-Type
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit");
      }

      const result = await response.json();
      console.log("Submitted:", result);
      setMessage("✅ Data submitted successfully!");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/homepage/slider/getSlider");
      }, 1000);

    } catch (error) {
      console.error("Submit Error:", error.message);
      setMessage("❌ Error: " + error.message);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 4 }}>
      <Typography variant="h5" mb={3}>
        Add Dashboard Slider
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Small Name of Slider"
          name="smallNameOfSlider"
          value={formData.smallNameOfSlider}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Name of Slider"
          name="nameOfSlider"
          value={formData.nameOfSlider}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Slider Description"
          name="sliderDescription"
          value={formData.sliderDescription}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Link Name of Page"
          name="linkNameOfPage"
          value={formData.linkNameOfPage}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Link URL"
          name="link"
          value={formData.link}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Meta Description"
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          margin="normal"
        />

        {/* File Upload */}
        <Box mt={2}>
          <Typography variant="body1" gutterBottom>
            Upload Image
          </Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Box>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>
      </form>

      {message && (
        <Typography mt={2} color={message.includes("✅") ? "green" : "error"}>
          {message}
        </Typography>
      )}
    </Paper>
  );
}
