import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import UserSidebar from "./UserSideBar";
import {
  fetchUsers,
  selectUsersList,
  selectUsersStatus,
} from "../store/usersSlice";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsersList);
  const status = useSelector(selectUsersStatus);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Global Sidebar */}
      <Sidebar />

      <main className="flex flex-1">
        {/* User Management Sidebar */}
        <UserSidebar />

        {/* Content */}
        <div className="flex-1 bg-white p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-lg font-semibold text-slate-800">
              Users
            </h1>

            <button
              className="bg-[#243874] hover:bg-[#1f3160] text-white text-sm px-4 py-2 rounded"
            >
              + New User
            </button>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F8F8] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 w-1/5">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 w-1/5">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">
                    Bio
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 w-32">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 w-24">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {status === "loading" && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                )}

                {status !== "loading" && users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}

                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-800">
                      {u.name || "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {u.email || "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-600 truncate max-w-md">
                      {u.bio || "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {u.role}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
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

export default Users;
