"use client";

import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Paper
} from "@mui/material";

export default function DashboardContentForm() {
  const [formData, setFormData] = useState({
    middleHighLightedContent: "",
    middleMainContent: "",
    middleDescription: "",
    middleLinkName: "",
    middleLink: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://apex-dev-api.aitechustel.com/api/Dashboard/contents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit");
      }

      await response.json();
      setMessage("✅ Content submitted successfully!");

      setFormData({
        middleHighLightedContent: "",
        middleMainContent: "",
        middleDescription: "",
        middleLinkName: "",
        middleLink: ""
      });
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 4 }}>
      <Typography variant="h5" mb={3}>
        Add Dashboard Content
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Highlighted Content"
          name="middleHighLightedContent"
          value={formData.middleHighLightedContent}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Main Content"
          name="middleMainContent"
          value={formData.middleMainContent}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="middleDescription"
          value={formData.middleDescription}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Link Name"
          name="middleLinkName"
          value={formData.middleLinkName}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Link URL"
          name="middleLink"
          value={formData.middleLink}
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
