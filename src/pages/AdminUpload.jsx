import { useState } from "react";
import axios from "axios";

export default function AdminUpload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("pdf", file);   

    try {
      await axios.post("/api/forms/upload", formData);
      alert("PDF Uploaded!");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="container">
      <h2>Upload Internship Form PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br/><br/>
      <button onClick={handleUpload}>Upload PDF</button>
    </div>
  );
}