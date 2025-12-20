import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import UserAccessManagement from "./User/UserAccessManagement";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setModules, fetchModulesByRole } from './store/modulesSlice';
import Users from "../src/User/Users";
import User from "./User/User";
import AddStory from '../src/story/AddStory';
import ViewStory from '../src/story/ViewStory';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const storedModules = localStorage.getItem("cms_modules") || sessionStorage.getItem("cms_modules");
      if (storedModules) {
        const mods = JSON.parse(storedModules);
        dispatch(setModules(mods));
      } else {
        // if user exists but no modules present, trigger fetch
        const storedUser = localStorage.getItem("cms_user") || sessionStorage.getItem("cms_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user?.role) {
            dispatch(fetchModulesByRole(user.role));
          }
        }
      }
    } catch (e) {
      console.error("Failed to initialize modules from storage", e);
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/UserAccessManagement" element={<UserAccessManagement />} />
      <Route path="/Users" element={<Users />} />
      <Route path="/User" element={<User />} />
      <Route path="/AddStory" element={<AddStory />} />
      <Route path="/ViewStory" element={<ViewStory />} />
    </Routes>
  );
}

export default App;
