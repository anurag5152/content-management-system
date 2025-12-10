// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear tokens / localStorage later if you add auth
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-60 bg-slate-900 text-slate-100 min-h-screen">
      {/* Logo area */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="relative w-10 h-10">
          {/* top image */}
          <img
            src="/assets/logo-part-1.png"
            alt="logo part 1"
            className="absolute inset-0 w-full h-full object-contain"
          />
          {/* second image slightly shifted – replace both with yours */}
          <img
            src="/assets/logo-part-2.png"
            alt="logo part 2"
            className="absolute inset-0 w-full h-full object-contain translate-x-1 translate-y-1"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs tracking-[0.25em] uppercase text-slate-400">
            Uttar Pradesh
          </span>
          <span className="text-sm font-semibold tracking-wide">
            TIMES CMS
          </span>
        </div>
      </div>

      {/* Main menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-slate-800 text-white"
          onClick={() => navigate("/dashboard")}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Dashboard</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/70"
          onClick={() => navigate("/dashboard/story")}
        >
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>Story Management</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/70"
          onClick={() => navigate("/dashboard/priority")}
        >
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>Priority Management</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/70"
          onClick={() => navigate("/dashboard/tools")}
        >
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>Tools</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/70"
          onClick={() => navigate("/dashboard/users")}
        >
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>User Management</span>
        </button>
      </nav>

      {/* Logout at bottom */}
      <div className="px-4 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm"
        >
          <span>Logout</span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-semibold">
            SB
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
