import { useState } from "react";
import Sidebar from "../components/Sidebar";
import published from "../assets/Dash-logos/published-logo.png";
import pending from "../assets/Dash-logos/pending-logo.png";
import planned from "../assets/Dash-logos/planned-logo.png";
import rejected from "../assets/Dash-logos/reject-logo.png";

const Dashboard = () => {
    const [startDate, setStartDate] = useState("2024-01-01");
    const [endDate, setEndDate] = useState("2024-01-30");

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

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
        <div className="min-h-screen bg-[#fffff] flex">
            <Sidebar />

            <main className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search by Text or ID"
                            className="border border-slate-300 rounded-md px-3 py-2 text-sm w-72 bg-[#EAEAEA]"
                        />
                        <select className="border border-slate-300 rounded-md px-3 py-2 text-sm w-36 bg-[#EAEAEA]">
                            <option>Mandal</option>
                            <option>All</option>
                        </select>
                        <select className="border border-slate-300 rounded-md px-3 py-2 text-sm w-36 bg-[#EAEAEA]">
                            <option>District</option>
                            <option>Another District</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-end gap-3 mb-6">
                    <div className="flex flex-col">
                        <label className="text-xs font-medium text-slate-600 mb-1">
                            Start Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white opacity-0 absolute inset-0 cursor-pointer w-full"
                            />
                            <div className="w-76 border border-slate-300 rounded-md px-3 py-2 text-sm bg-[#F8F8F8] pointer-events-none flex items-center justify-between w-44">
                                <span>{formatDateDisplay(startDate)}</span>
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-medium text-slate-600 mb-1">
                            End Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white opacity-0 absolute inset-0 cursor-pointer w-full"
                            />
                            <div className="w-76 border border-slate-300 rounded-md px-3 py-2 text-sm bg-[#F8F8F8] pointer-events-none flex items-center justify-between w-44">
                                <span>{formatDateDisplay(endDate)}</span>
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-medium text-slate-600 mb-1">
                            Product Type
                        </label>
                        <select className="w-76 border border-slate-300 rounded-md px-3 py-2 text-sm bg-[#F8F8F8] w-44">
                            <option>Story</option>
                            <option>Video</option>
                            <option>E-paper</option>
                        </select>
                    </div>

                    <button className="bg-[#243874] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md">
                        Get Data
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <SummaryCard label="Published" value={240} color="bg-emerald-500/30" Icon={<img src={published} alt="Published Count" className="h-8 w-8" />} />
                    <SummaryCard label="Pending" value={16} color="bg-amber-400/30" Icon={<img src={pending} alt="Pending Count" className="h-8 w-8" />} />
                    <SummaryCard label="Planned" value={12} color="bg-sky-500/30" Icon={<img src={planned} alt="Planned Count" className="h-8 w-8" />} />
                    <SummaryCard label="Hold / Reject" value={0} color="bg-red-500/30" Icon={<img src={rejected} alt="Rejected Count" className="h-8 w-8" />} />
                </div>

                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-[#F8F8F8] border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 font-medium text-slate-600">ID</th>
                                <th className="px-4 py-3 font-medium text-slate-600">Title</th>
                                <th className="px-4 py-3 font-medium text-slate-600">Time Stamp</th>
                                <th className="px-4 py-3 font-medium text-slate-600">Provided By</th>
                                <th className="px-4 py-3 font-medium text-slate-600">Edited By</th>
                                <th className="px-4 py-3 font-medium text-slate-600">Desk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3 text-sky-700 font-medium">
                                        {row.id}
                                    </td>
                                    <td className="px-4 py-3">{row.title}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {row.timestamp}
                                    </td>
                                    <td className="px-4 py-3">{row.providedBy}</td>
                                    <td className="px-4 py-3">{row.editedBy}</td>
                                    <td className="px-4 py-3">{row.desk}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

const SummaryCard = ({ label, value, color, Icon }) => {
    return (
        <div className="flex items-center gap-3 bg-white border border-[#EDEDED] rounded-lg px-4 py-4">
            <div
                className={`${color} w-14 h-14 rounded-md flex items-center justify-center`}
            >
                {Icon}
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