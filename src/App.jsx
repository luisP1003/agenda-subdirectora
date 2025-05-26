import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import "./App.css";
import CalendarPage from "./pages/CalendarPage";
import Events from "./pages/Events"; // 👈 importa tu componente Events


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/events" element={<Events />} />

    </Routes>
  );
}

export default App;
