import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import axios from "axios";
import "../styles/FillForm.css";
import { API_BASE } from "../config";

export default function FillForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  // 🔥 Fetch form from backend
  useEffect(() => {
    axios.get(`${API_BASE}/api/forms/${id}`)
      .then(res => {
        setForm(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);

  if (!form) {
    return <h2>Loading...</h2>;
  }

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
  `${API_BASE}/api/submit`,
  {
    form_id: form.id,
    user_id: 1,
    data: formData
  }
);

      navigate("/preview", {
        // state: { file: response.data.file }
        state: { 
        formData, 
        form   // send form also
  } 
      });

    } catch (err) {
      console.error("ERROR:", err);
      alert("Submission failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card-FillForm">
        <h2>{form.title}</h2>

        <form onSubmit={submitForm}>
          <FormRenderer
            // fields={form.fields}
            fields={[
            {"label":"Full Name","name":"name",   "type":"text"},
            {"label":"Department","name":"department","type":"text"},
            {"label":"Division and Roll no.","name":"DivRoll","type":"text"},
            {"label":"Name of Internship offering industry/institution","name":"NameOfInternship","type":"text"},
            {"label":"Industrial/institution contact person's name, designation and contact details","name":"ExternalGuide","type":"text"},
            
            ]} 
            formData={formData}
            setFormData={setFormData}
          />

          <button type="submit" className="auth-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}