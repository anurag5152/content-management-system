// src/pages/story/UserAccessManagement.jsx
import React, { useState } from "react";
import UserSidebar from "./UserSideBar.jsx";
import Sidebar from "../components/Sidebar.jsx"; // your global main sidebar

const UserAccessManagement = () => {
  // active tab handled by inner sidebar
  const [active, setActive] = useState("access");

  // dummy rows for UI
  const rows = [
    { id: 1, role: "Admin", pages: "All Pages" },
    {
      id: 2,
      role: "Sub Admin",
      pages:
        "Add Story, View Story, Add Breaking News, View Schedule Story, Add Priority, Contact List",
    },
    {
      id: 3,
      role: "Editor",
      pages: "Add Story, View Story, Add Breaking News, View Schedule Story",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* main left sidebar (global) */}
      <Sidebar />

      {/* main content area */}
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-4">
          User Management
        </h1>

        <div className="flex gap-6">
          {/* inner module sidebar (StorySidebar) */}
          <UserSidebar active={active} onChange={setActive} />

          {/* right content panel */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            {active === "access" && (
              <AccessManagementView rows={rows} />
            )}

            {active === "adminList" && (
              <div className="text-slate-500 text-sm">
                Admin User List UI — placeholder (create AdminUserList.jsx next)
              </div>
            )}

            {active === "users" && (
              <div className="text-slate-500 text-sm">
                Users UI — placeholder (create Users.jsx next)
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const AccessManagementView = ({ rows = [] }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-800">
          User Access Management
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Text or ID"
              className="border border-slate-300 rounded-md pl-3 pr-8 py-1.5 text-xs w-64"
            />
            <span className="absolute right-2 top-1.5 text-slate-400 text-xs">
              🔍
            </span>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md">
            + New Access
          </button>
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-600 w-12">
                ID
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-600 w-28">
                Role
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-600">
                Pages
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-600 w-20">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
              >
                <td className="px-3 py-2 text-sky-700 font-medium">{r.id}</td>
                <td className="px-3 py-2">{r.role}</td>
                <td className="px-3 py-2 text-slate-700">{r.pages}</td>
                <td className="px-3 py-2">
                  <button className="text-xs text-blue-600 hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAccessManagement;
