import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import UserAccessManagement from "./User/UserAccessManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/UserAccessManagement" element={<UserAccessManagement />} />
    </Routes>
  );
}

export default App;
