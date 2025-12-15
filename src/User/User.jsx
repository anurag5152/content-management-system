import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import UserSidebar from "../User/UserSideBar";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/users`);
        const sorted = [...res.data].sort(
          (a, b) => Number(a.id) - Number(b.id)
        );

        setUsers(sorted);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    const q = search.toLowerCase();

    return users.filter((u) => {
      return (
        String(u.id).includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  return (
    <div className="min-h-screen flex bg-[#F6F7FB]">
      <Sidebar />

      <main className="flex flex-1">
        <UserSidebar />

        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-slate-800">
              Users
            </h1>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search by Text or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#EAEAEA] border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-sm">
                🔍
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F8F8] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-1 text-left font-medium text-slate-600">
                    ID
                  </th>
                  <th className="px-4 py-1 text-left font-medium text-slate-600">
                    User
                  </th>
                  <th className="px-4 py-1 text-left font-medium text-slate-600">
                    Email
                  </th>
                  <th className="px-4 py-1 text-left font-medium text-slate-600">
                    Contact No.
                  </th>
                  <th className="px-4 py-1 text-left font-medium text-slate-600">
                    Socials
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                )}

                {!loading && filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-4 py-1 text-slate-700">
                        {u.id}
                      </td>
                      <td className="px-4 py-1 text-slate-700">
                        {u.name || "-"}
                      </td>
                      <td className="px-4 py-1 text-slate-700">
                        {u.email || "-"}
                      </td>
                      <td className="px-4 py-1 text-slate-700">
                        {u.phone || "-"}
                      </td>
                      <td className="px-4 py-1 text-slate-700">
                        {u.social || "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default User;
