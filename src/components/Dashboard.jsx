// src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  // later you’ll replace this dummy data with API data
  const rows = [
    {
      id: "1998498",
      title: "Noida Bank Employee Booked For Illicitly Transferring Rs...",
      timestamp: "12-Jan-2024 | 08:53 am",
      providedBy: "Shagun Bhardwaj",
      editedBy: "Shagun Bhardwaj",
      desk: "-",
    },
    {
      id: "1998499",
      title: "Dunki Release LIVE Updates: SRK Fans Call Film...",
      timestamp: "13-Jan-2024 | 09:03 am",
      providedBy: "Shagun Bhardwaj",
      editedBy: "Shagun Bhardwaj",
      desk: "-",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      {/* main content area */}
      <main className="flex-1 p-6">
        {/* page title */}
        <header className="mb-4">
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
        </header>

        {/* white card like in Figma */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          {/* FILTERS ROW */}
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-slate-500 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="border border-slate-300 rounded-md px-2 py-1 text-sm"
                defaultValue="2024-01-01"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-slate-500 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="border border-slate-300 rounded-md px-2 py-1 text-sm"
                defaultValue="2024-01-30"
              />
            </div>

            <div className="flex flex-col flex-1 min-w-[220px]">
              <label className="text-xs font-medium text-slate-500 mb-1">
                Search by Text or ID
              </label>
              <input
                type="text"
                placeholder="Search..."
                className="border border-slate-300 rounded-md px-3 py-1.5 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-slate-500 mb-1">
                Product Type
              </label>
              <select className="border border-slate-300 rounded-md px-2 py-1 text-sm">
                <option>Story</option>
                <option>Video</option>
                <option>E-paper</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-slate-500 mb-1">
                District
              </label>
              <select className="border border-slate-300 rounded-md px-2 py-1 text-sm">
                <option>All</option>
                <option>Mandal</option>
              </select>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md">
              Get Data
            </button>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <SummaryCard label="Published" value={240} color="bg-emerald-500" />
            <SummaryCard label="Pending" value={16} color="bg-amber-400" />
            <SummaryCard label="Planned" value={12} color="bg-sky-500" />
            <SummaryCard label="Hold / Reject" value={0} color="bg-red-500" />
          </div>

          {/* TABLE */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 font-medium text-slate-600">ID</th>
                  <th className="px-3 py-2 font-medium text-slate-600">
                    Title
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-600">
                    Time Stamp
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-600">
                    Provided By
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-600">
                    Edited By
                  </th>
                  <th className="px-3 py-2 font-medium text-slate-600">Desk</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-3 py-2 text-sky-700 font-medium">
                      {row.id}
                    </td>
                    <td className="px-3 py-2">{row.title}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.timestamp}
                    </td>
                    <td className="px-3 py-2">{row.providedBy}</td>
                    <td className="px-3 py-2">{row.editedBy}</td>
                    <td className="px-3 py-2">{row.desk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => {
  return (
    <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-3">
      <div
        className={`${color} text-white w-10 h-10 rounded-md flex items-center justify-center text-lg font-semibold`}
      >
        {/* simple icon letter – replace with SVG if you want */}
        {label[0]}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-lg font-semibold text-slate-800">
          {value}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
