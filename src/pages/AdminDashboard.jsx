import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [adminName] = useState("Admin");
  const [file, setFile] = useState(null);
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // =========================
  // Load Uploaded Forms
  // =========================
  const loadForms = async () => {
    try {
      const res = await axios.get("/api/forms");
      setForms(res.data);
    } catch (err) {
      console.log("Load Forms Error:", err);
    }
  };

  // =========================
  // Load Submitted Forms
  // =========================
  const loadSubmissions = async () => {
    try {
      const res = await axios.get("/api/submit");
      setSubmissions(res.data);
    } catch (err) {
      console.log("Load Submissions Error:", err);
    }
  };

  useEffect(() => {
    loadForms();
    loadSubmissions();
  }, []);

  // =========================
  // Upload PDF
  // =========================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await axios.post(
        "/api/forms/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("PDF Uploaded Successfully");
      setFile(null);
      loadForms();

    } catch (err) {
      console.log("Upload Error:", err);
      alert("Upload failed");
    }
  };

  // =========================
  // Delete PDF
  // =========================
  const deleteForm = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this form?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/forms/${id}`);
      alert("Form deleted successfully");
      loadForms();

    } catch (err) {
      console.log("Delete Error:", err);
      alert("Delete failed");
    }
  };

  // =========================
  // Logout
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">

      {/* LEFT SIDE MAIN DASHBOARD */}
      <div className="admin-main">

        {/* HEADER */}
        <div className="admin-header">
          <h2>Admin Dashboard</h2>

          <div className="admin-info">
            <span>👤 {adminName}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {/* DASHBOARD STATS */}
        <div className="dashboard-cards">
          <div className="card">
            <h3>Total Forms</h3>
            <p>{forms.length}</p>
          </div>

          <div className="card">
            <h3>Total Submissions</h3>
            <p>{submissions.length}</p>
          </div>

          <div className="card">
            <h3>Status</h3>
            <p>Active</p>
          </div>
        </div>

        {/* UPLOAD SECTION */}
        <div className="upload-section">
          <h3>Upload New PDF Form</h3>

          <form onSubmit={handleUpload}>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button type="submit">
              Upload PDF
            </button>
          </form>
        </div>

        {/* FORM LIST */}
        <div className="form-list">
          <h3>Uploaded Forms</h3>

          {forms.length === 0 ? (
            <p>No forms uploaded yet</p>
          ) : (
            <ul>
              {forms.map((form) => (
                <li key={form.id}>
                  <span>📄 {form.originalname || form.filename}</span>

                  <button
                    className="delete-btn"
                    onClick={() => deleteForm(form.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* RIGHT SIDE STUDENT SUBMISSIONS PANEL */}
      <div className="student-panel">
        <h3>Student Submissions</h3>

        {submissions.map((sub) => (
  <div className="submission-card" key={sub.id}>

    <p><b>Name:</b> {sub.data?.name || "N/A"}</p>
    <p><b>Form:</b> {sub.filename}</p>

    <a
      href={`${API_BASE}/filled/${sub.filled_pdf}`}
      target="_blank"
      rel="noreferrer"
      className="view-btn"
    >
      View PDF
    </a>

  </div>
))}

      </div>

    </div>
  );
}

export default AdminDashboard;