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
  const router = useRouter(); // 👈 Add router hook

  const [formData, setFormData] = useState({
    smallNameOfSlider: "",
    nameOfSlider: "",
    sliderDescription: "",
    linkNameOfPage: "",
    link: "",
    pathOfImage: "",
    metaDescription: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://apex-dev-api.aitechustel.com/api/Dashboard/sliders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit");
      }

      const result = await response.json();
      console.log("Submitted:", result);
      setMessage("✅ Data submitted successfully!");

      // Redirect after short delay (optional)
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
          label="Image Path URL"
          name="pathOfImage"
          value={formData.pathOfImage}
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

        <Box mt={2}>
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
