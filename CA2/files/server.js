require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/projects", projectRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Student Project Submission API is running" });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (catches anything unexpected, e.g. malformed JSON body)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Unexpected server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
