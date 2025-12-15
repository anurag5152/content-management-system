import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import UserSidebar from "./UserSideBar";
import AddUserDrawer from "./AddUserDrawer";
import {
  fetchUsers,
  selectUsersList,
  selectUsersStatus,
} from "../store/usersSlice";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsersList);
  const status = useSelector(selectUsersStatus);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddNew = () => {
    setEditingUser(null);
    setDrawerOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user); 
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingUser(null);
  };

  const handleSuccess = () => {
    dispatch(fetchUsers()); 
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar />

      <main className="flex flex-1 relative">
        <UserSidebar />

        <div className="flex-1 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-sm font-semibold text-[#243874]">
              Admin User List
            </h1>

            <button
              onClick={handleAddNew}
              className="bg-[#243874] hover:bg-[#1f3160] text-white text-sm px-2 py-1 rounded"
            >
              + New User
            </button>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F8F8] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-1 text-left font-medium w-14">Id</th>
                  <th className="px-4 py-1 text-left font-medium">User</th>
                  <th className="px-4 py-1 text-left font-medium">Email</th>
                  <th className="px-4 py-1 text-left font-medium">Role</th>
                  <th className="px-4 py-1 text-left font-medium">Bio</th>
                  <th className="px-4 py-1 text-left font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {status === "loading" && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                )}

                {status !== "loading" && users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}

                {([...users].sort((a, b) => (a.id || 0) - (b.id || 0))).map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-4 text-sm py-1 text-slate-600">{u.id}</td>
                    <td className="px-4 text-sm py-1">{u.name || "-"}</td>
                    <td className="px-4 text-sm py-1">{u.email || "-"}</td>
                    <td className="px-4 text-sm py-1">{u.role || "-"}</td>
                    <td className="px-4 text-sm py-1 align-top">
                      <div className="max-h-20 max-w-80 border-b-2 border-slate-200 overflow-auto bg-[#F8F8F8] p-2 text-sm text-slate-700">
                        {u.bio || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-1">
                      <button
                        onClick={() => handleEdit(u)}
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
        <AddUserDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSuccess={handleSuccess}
          user={editingUser} 
        />
      </main>
    </div>
  );
};

export default Users;
