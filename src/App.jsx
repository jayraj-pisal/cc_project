import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FillForm from "./pages/FillForm";
import Preview from "./pages/Preview";
import AdminUpload from "./pages/AdminUpload";  
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/fill/:id" element={<FillForm/>}/>
        <Route path="/preview" element={<Preview/>}/>
        <Route path="/admin/upload" element={<AdminUpload/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;