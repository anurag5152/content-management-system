
import { NavLink, useNavigate } from "react-router-dom";

import logobase from "../assets/logo_base.png";
import logotop from "../assets/logo_top.png";

import dashlogo from "../assets/Dash-logos/dash-logo.png";
import storylogo from "../assets/Dash-logos/story-logo.png";
import toolslogo from "../assets/Dash-logos/tool-logo.png";
import userlogo from "../assets/Dash-logos/users-logo.png";
import priorlogo from "../assets/Dash-logos/prior-logo.png";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-40 bg-[#1E1E1E] text-slate-100 min-h-screen">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="relative w-10 h-10">
          <img
            src={logobase}
            alt="logo base"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <img
            src={logotop}
            alt="logo top"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-wide">Uttar</span>
          <span className="text-sm font-semibold tracking-wide">Pradesh</span>
          <span className="text-sm font-semibold tracking-wide">TIMES</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 text-center text-sm">

        <NavLink
          to="/Dashboard"
          end
          className={({ isActive }) =>
            `w-full flex flex-col items-center px-3 py-2 rounded-md ${isActive
              ? "bg-[#313338] text-white"
              : "hover:bg-[#313338] text-slate-300"
            }`
          }
        >
          <div className="h-5 w-5 rounded-sm mb-1">
            <img src={dashlogo} alt="Dashboard" />
          </div>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/Dashboard/story"
          className={({ isActive }) =>
            `w-full flex flex-col items-center px-3 py-2 rounded-md ${isActive
              ? "bg-[#313338] text-white"
              : "hover:bg-[#313338] text-slate-300"
            }`
          }
        >
          <div className="h-5 w-5 rounded-sm mb-1">
            <img src={storylogo} alt="Story" />
          </div>
          <span>Story Management</span>
        </NavLink>

        <NavLink
          to="/Dashboard/priority"
          className={({ isActive }) =>
            `w-full flex flex-col items-center px-3 py-2 rounded-md ${isActive
              ? "bg-[#313338] text-white"
              : "hover:bg-[#313338] text-slate-300"
            }`
          }
        >
          <div className="h-5 w-5 rounded-sm mb-1">
            <img src={priorlogo} alt="Priority" />
          </div>
          <span>Priority Management</span>
        </NavLink>

        <NavLink
          to="/Dashboard/tools"
          className={({ isActive }) =>
            `w-full flex flex-col items-center px-3 py-2 rounded-md ${isActive
              ? "bg-[#313338] text-white"
              : "hover:bg-[#313338] text-slate-300"
            }`
          }
        >
          <div className="h-5 w-5 rounded-sm mb-1">
            <img src={toolslogo} alt="Tools" />
          </div>
          <span>Tools</span>
        </NavLink>

        <NavLink
          to="/UserAccessManagement"
          className={({ isActive }) =>
            `w-full flex flex-col items-center px-3 py-2 rounded-md ${isActive
              ? "bg-[#313338] text-white"
              : "hover:bg-[#313338] text-slate-300"
            }`
          }
        >
          <div className="h-5 w-5 rounded-sm mb-1">
            <img src={userlogo} alt="Users" />
          </div>
          <span>User Management</span>
        </NavLink>
      </nav>

      <div className="mt-auto border-t border-slate-800 px-4 py-4 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-400 text-slate-900 font-bold">
          SB
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-slate-200 hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
