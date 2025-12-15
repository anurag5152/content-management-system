import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import UserAccessManagement from "./User/UserAccessManagement";
import Users from "../src/User/Users";
import User from "./User/User";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/UserAccessManagement" element={<UserAccessManagement />} />
      <Route path="/Users" element={<Users />} />
      <Route path="/User" element={<User />} />
    </Routes>
  );
}

export default App;
