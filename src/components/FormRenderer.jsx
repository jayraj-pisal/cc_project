export default function FormRenderer({ fields = [], formData, setFormData }) {

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // If no fields available
  if (!fields || fields.length === 0) {
    return <p>No fields available for this form.</p>;
  }

  return (
    <div>
      {fields.map((field, i) => (
        <div key={i} style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            {field.label}
          </label>

          <input
            type={field.type || "text"}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
        </div>
      ))}
    </div>
  );
}