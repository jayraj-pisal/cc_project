import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import { API_BASE } from "../config";

function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password, role, code });

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if(res.data.role === "Admin"){
        navigate("/AdminDashboard");
      }else{
        navigate("/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>{role === "Admin" ? "Admin Login" : "Student Login"}</h2>

       <div className="role-toggle">

  <div className={`slider ${role === "Admin" ? "right" : ""}`}></div>

  <button
    type="button"
    className={role === "Student" ? "active" : ""}
    onClick={() => setRole("Student")}
  >
    Student
  </button>

  <button
    type="button"
    className={role === "Admin" ? "active" : ""}
    onClick={() => setRole("Admin")}
  >
    Admin
  </button>

</div>
        <form onSubmit={handleLogin}>

          <div>
            <label>Email</label><br/>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label><br/>

            <div className="password-wrapper">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <span
                className="toggle-password"
                onClick={() => setShow(!show)}
              >
                {show ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          {/* ADMIN CODE FIELD (only when admin selected) */}
          {role === "Admin" && (
            <div>
              <label>Admin Code</label><br/>
              <input
                type="text"
                value={code}
                onChange={(e)=>setCode(e.target.value)}
                placeholder="Enter Admin Code"
                required
              />
            </div>
          )}

          <button type="submit">
            Login
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?
          <span
            className="signup-link"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;