import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import UserAccessManagement from "./User/UserAccessManagement";
import Users from "../src/User/Users";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/UserAccessManagement" element={<UserAccessManagement />} />
      <Route path="/Users" element={<Users />} />
    </Routes>
  );
}

export default App;
