import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  // 🔥 Example user (later take from JWT/localStorage)
  const user = {
    name: "Jayraj",
    profilePic: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAACUCAMAAADxqtj8AAAASFBMVEX6+vqPj4+Li4v////x8fGioqKHh4f39/elpaWWlpbg4ODu7u6SkpKfn5/p6emDg4PV1dW4uLiysrLAwMCsrKzNzc3Hx8d8fHySRURAAAAEDklEQVR4nO2c2XasIBBFkVImFXH+/z+9kGR10qNC21DexX7IS162taoZjxKSyWQymUwmk8lkMv878E1qDX+sNK+1cuian+sRgGgzDqKVTdPIVgyj0afxBz4LWVBL4aCU0aadZnIGf+CjNS5usE/SLOj9oRw7dqv+A2Mzx+wPRMnuibuja1VqxefYwrO7nrlpoAVr+aGeXrt/+Q8lSn0o2215qy8wVh/4Rtdc9GVq1XuAN/vk7djTppa9g+/o+Yv+kNr2lnG/vG2eGVXrg/Jwt0iFSb8UPqV34yZPrfwLzK9m2Ed0Bk/xS7/KF6iGTRifLczOUHzwLr1FIrEH4196W3yNQx9EgHxRDCjsoW6C7HH8bsEEyRcNihkLxjD7YsFgT4aQIccO+T0Ge99VwsV+Sm3u0Lu2VA/sRZla3S0vZZB8QSud2v0d+xbBfBVsX5zaHknt22D71O7W/tRjzhvjPYrdocdZyJU9ikUm9GH2xYjCfg6Tx7HGJHXYkClRtD2BKkQeR9tb+yWk8TscjUMID9mVUyTyBAL2JwzFiOOA0vcg0JY+tfQv/odpbE7t/Idaep4hVxjWOBdmz85Hc4r5hc/FjztOSO17Dfj0DkV37Qb6PlrxTL7Bd+EMZqc+bRDsCO8As6t5aItliXCN3Z/vyClg2Is/xG5xt2atDmVK4YetSZfhuma+BbR4+uOlzVSjlnfxKDM0D9IilMnBoA+mubSIGiW7egDasXZUiDv+L0BqtQi6rp1jXalYVHmCul9RKmWMUdotJ0+m7jhtDjmTySAECC+PgCcYleyMuvRT9T5TP6vY0wGowa0GjoAx2cdd88PieYDzEkplzBMS6EPOXV/B4gVGYFwPli+KNVb1QR1deQeL1Ps8LIe2QaTAS2iSa4s4t3DBN5wb0Cj3EXXg3fimfYy7c9ChiZYt+6qOYB+cx9myj3HKlu2zPTb7Koa9DkxybdqLCGMOqatPjfcxbkH9rgc97OO8BxSYmt60j7JSgOUj8kUT5WYCVNi7DlvIOPFM/plBR8TZnYDXG5F7oZF2tqA/sjOMdbUCHxjxWbT3OED7Z6E27SO5k5Of5/hnobagbdSslG8WagsTU56QQ3snfrzxwLVa/FAv8Oqo6rMEr40BF8fop5B3CdjhCH3Wp0myAw94n/wGStOFYkHtDgI+kZcpc14Awxv+tOkTpxhADU1Y/zA5pA/YATd9EfA9haaPftH5EBeGKjqfBmKdHDWaqBQQbsS68wHouk6Ko6j7BQAwk7Q/Yfr8Gb7+JXuFMnFkpfTcu68Dfn1d7+o63H2rrq2m3tQo1b9xaqUy89j3wySEqCr7R0xDPy6z0SVi8wvfWTRe1hbt/pScnDGgdkbnTCaTyWQymUwmkwngH2PFNCAGvIXdAAAAAElFTkSuQmCC" // temp image
  };

  useEffect(() => {
    axios.get("/api/forms")
      .then(res => setForms(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🔓 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");   // if you are using JWT
    navigate("/");                      // go to login page
  };

  return (
    <div className="container">

      {/* ===== Header ===== */}
      <div className="dashboard-header">

        <div className="profile-section">
          <img src={user.profilePic} alt="Profile" className="profile-pic" />
          <span className="username">{user.name}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* ===== Title ===== */}
      <h2 className="dashboard-title">📄 Available Forms</h2>

      {/* ===== Forms List ===== */}
      {forms.length === 0 ? (
        <p>No forms available</p>
      ) : (
        <div className="forms-grid">
          {forms.map(form => (
            <div key={form.id} className="form-card">
              <p>{form.filename}</p>

              <button
                onClick={() => navigate(`/fill/${form.id}`)}
                className="fill-btn"
              >
                Fill Form
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}