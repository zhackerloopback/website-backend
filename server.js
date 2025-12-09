const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// DB connect
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// Posts routes  👇 NEW
app.use("/api/posts", require("./routes/postRoutes"));

