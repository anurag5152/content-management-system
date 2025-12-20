import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import StorySidebar from "../components/StorySidebar";
import defaultAvatar from "../uploads/users/default-avatar.svg";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const ViewStory = () => {
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${API}/api/stories`).then((res) => {
      const sorted = Array.isArray(res.data) ? [...res.data].sort((a, b) => (a.id || 0) - (b.id || 0)) : res.data;
      setStories(sorted);
    });
  }, []);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return stories;
    const q = search.toLowerCase();
    return stories.filter((s) => {
      return (
        String(s.id).includes(q) ||
        s.author?.toLowerCase().includes(q) ||
        s.short_title?.toLowerCase().includes(q)
      );
    });
  }, [stories, search]);

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex text-sm bg-[#F6F7FB]">
      <Sidebar />

      <main className="flex flex-1">
        <StorySidebar />

        <div className="flex-1 p-6 text-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-sm font-semibold text-slate-800">
              View Story
            </h1>

            <div className="relative w-44">
              <input
                type="text"
                placeholder="Search by Text or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#EAEAEA] border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2.3 text-slate-400 text-sm">
                🔍
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F8F8] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-1 text-left font-medium">ID</th>
                  <th className="px-4 py-1 text-left font-medium">Author</th>
                  <th className="px-4 py-1 text-left font-medium">Title</th>
                  <th className="px-4 py-1 text-left font-medium">
                    Approved By
                  </th>
                  <th className="px-4 py-1 text-left font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-1 text-blue-700 font-medium cursor-pointer">
                      {s.id}
                    </td>

                    <td className="px-4 py-1 flex items-center gap-3">
                      <img
                        src={defaultAvatar}
                        className="h-8 w-8 rounded-full"
                        alt="avatar"
                      />
                      <span>{s.author || "-"}</span>
                    </td>

                    <td className="px-4 py-1 text-slate-700">
                      {s.short_title || "-"}
                      <div className="text-[11px] text-slate-500 mt-1">
                        Published On : {formatDate(s.created_at)}
                        {" "}Updated On : {formatDate(s.updated_at)}
                      </div>
                    </td>

                    <td className="px-4 py-1">
                      {s.author || "-"}
                    </td>

                    <td className="px-4 py-1">
                      {s.status === "published" ? (
                        <span className="px-3 py-1 border border-slate-700 text-green-700 rounded-full text-xs">
                          ● Published
                        </span>
                      ) : (
                        <span className="px-3 py-1 border border-slate-700 text-red-700 rounded-full text-xs">
                          ● Unpublished
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No stories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewStory;
