const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/forms");
const submitRoutes = require("./routes/submit");

const app = express();

// CORS — allow comma-separated list in FRONTEND_URL, or all if not set
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(s => s.trim())
  : true;

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/filled", express.static(path.join(__dirname, "filled")));

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/submit", submitRoutes);

// Health check (used by AWS ALB / App Runner)
app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || process.env.BACKEND_PORT || 3001;
// Bind to 0.0.0.0 in any cloud env (AWS, Railway, etc.) — localhost only for local dev
const HOST = (process.env.NODE_ENV === "production" ||
              process.env.RAILWAY_ENVIRONMENT ||
              process.env.AWS_EXECUTION_ENV)
  ? "0.0.0.0"
  : "localhost";

app.listen(PORT, HOST, () => {
  console.log(`Backend server running on ${HOST}:${PORT}`);
});
