const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db");
const path = require("path");
const fs = require("fs");


// Storage Config
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  }
});


// =============================
// Upload PDF
// =============================

router.post("/upload", upload.single("pdf"), async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const filename = req.file.filename;
    const originalname = req.file.originalname;

    await db.query(
      "INSERT INTO forms (filename, originalname) VALUES (?, ?)",
      [filename, originalname]
    );

    res.json({
      msg: "PDF uploaded successfully",
      filename
    });

  } catch (err) {

    console.log("Upload Error:", err);
    res.status(500).json({ msg: "Upload failed" });

  }
});


// =============================
// Get All Forms
// =============================

router.get("/", async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT id, filename, originalname, created_at FROM forms ORDER BY created_at DESC"
    );

    res.json(rows);

  } catch (err) {

    console.log("Fetch Error:", err);
    res.status(500).json({ msg: "Error fetching forms" });

  }
});


// =============================
// Download PDF
// =============================

router.get("/download/:filename", (req, res) => {

  const filePath = path.join(__dirname, "..", "uploads", req.params.filename);

  res.download(filePath);

});


// =============================
// Delete Form (Admin)
// =============================

router.delete("/:id", async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT filename FROM forms WHERE id=?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Form not found" });
    }

    const filename = rows[0].filename;

    const filePath = path.join(__dirname, "..", "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.query(
      "DELETE FROM forms WHERE id=?",
      [req.params.id]
    );

    res.json({ msg: "Form deleted successfully" });

  } catch (err) {

    console.log(err);
    res.status(500).json({ msg: "Delete failed" });

  }
});


// =============================
// Get Single Form
// =============================

router.get("/:id", async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM forms WHERE id=?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Form not found" });
    }

    res.json(rows[0]);

  } catch (err) {

    console.log(err);
    res.status(500).json({ msg: "Error fetching form" });

  }
});

module.exports = router;
