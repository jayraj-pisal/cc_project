import { useLocation, useNavigate } from "react-router-dom";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { API_BASE } from "../config";

export default function Preview(){
  
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>No Data Found</h2>
          <button onClick={() => navigate("/dashboard")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { formData, form } = location.state;
 

const generatePDF = async () => {
  console.log("FULL STATE:", location.state);

  if (!form || !form.filename) {
    alert("Form PDF not found");
    return;
  }

  const pdfUrl = `${API_BASE}/uploads/${form.filename}`;

  const existingPdfBytes = await fetch(pdfUrl)
    .then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  page.drawText(`${formData.name || ""}`, { x: 280, y: 400, size: 12, font });
  page.drawText(`${formData.department || ""}`, { x: 280, y: 365, size: 12, font });
  page.drawText(`${formData.DivRoll || ""}`, { x: 280, y: 340, size: 12, font });
  page.drawText(`${formData.NameOfInternship || ""}`, { x: 280, y: 310, size: 12, font });
  page.drawText(`${formData.ExternalGuide || ""}`, { x: 280, y: 200, size: 12, font });
  

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  window.open(url);
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Preview & Download</h2>
        <button className="auth-btn" onClick={generatePDF}>
          Generate Filled PDF
        </button>
      </div>
    </div>
  );
}