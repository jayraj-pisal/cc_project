const router = require("express").Router();
const db = require("../db");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

// =============================
// Submit Form + Generate PDF
// =============================
router.post("/", async (req, res) => {
  try {
    const { form_id, user_id, data } = req.body;

    if (!form_id || !user_id || !data) {
      return res.status(400).json({ msg: "Missing data" });
    }

    const [forms] = await db.query(
      "SELECT * FROM forms WHERE id = ?",
      [form_id]
    );

    if (forms.length === 0) {
      return res.status(404).json({ msg: "Form not found" });
    }

    const form = forms[0];

    const pdfPath = path.join(__dirname, "..", "uploads", form.filename);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ msg: "PDF not found" });
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    page.drawText(`${data.name || ""}`, { x: 280, y: 400, size: 12, font });
    page.drawText(`${data.department || ""}`, { x: 280, y: 365, size: 12, font });
    page.drawText(`${data.DivRoll || ""}`, { x: 280, y: 340, size: 12, font });
    page.drawText(`${data.NameOfInternship || ""}`, { x: 280, y: 310, size: 12, font });
    page.drawText(`${data.ExternalGuide || ""}`, { x: 280, y: 200, size: 12, font });

    const pdfBytes = await pdfDoc.save();

    const filledDir = path.join(__dirname, "..", "filled");
    if (!fs.existsSync(filledDir)) {
      fs.mkdirSync(filledDir);
    }

    const filename = `filled-${Date.now()}.pdf`;
    const filePath = path.join(filledDir, filename);

    fs.writeFileSync(filePath, pdfBytes);

    await db.query(
      "INSERT INTO submissions (user_id, form_id, data, filled_pdf) VALUES (?, ?, ?, ?)",
      [user_id, form_id, JSON.stringify(data), filename]
    );

    res.json({
      msg: "Form submitted successfully",
      file: filename
    });

  } catch (err) {
    console.log("Submit Error:", err);
    res.status(500).json({ msg: "Submit failed" });
  }
});


// =============================
// Get Submissions
// =============================
router.get("/", async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT 
        s.id,
        s.user_id,
        s.form_id,
        s.data,
        s.filled_pdf,
        s.created_at,
        f.filename
      FROM submissions s
      JOIN forms f ON s.form_id = f.id
      ORDER BY s.created_at DESC
    `);

    const parsed = rows.map(r => ({
      ...r,
      data: JSON.parse(r.data || "{}")
    }));

    res.json(parsed);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Fetch error" });
  }
});

module.exports = router;
