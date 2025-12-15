import React, { useEffect, useState, useMemo } from "react";
import UserSidebar from "./UserSideBar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import AddNewAccessModal from "./AddNewAccessModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, selectRolesList } from "../store/rolesSlice.js";
import { MODULES } from "../modules/modules.jsx";

const UserAccessManagement = () => {
  const dispatch = useDispatch();
  const roles = useSelector(selectRolesList);
  const [active, setActive] = useState("access");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const openCreate = () => {
    setEditingRoleId(null);
    setModalOpen(true);
  };

  const openEdit = (roleId) => {
    setEditingRoleId(roleId);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex flex-1">
        <div className="flex flex-1">
          <UserSidebar active={active} onChange={setActive} />

          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-screen">
            {active === "access" && (
              <AccessManagementView roles={roles} onCreate={openCreate} onEdit={openEdit} />
            )}

            {active === "adminList" && (
              <div className="text-slate-500 text-sm">Admin User List UI — placeholder</div>
            )}

            {active === "users" && (
              <div className="text-slate-500 text-sm">Users UI — placeholder</div>
            )}
          </div>
        </div>
      </main>

      <AddNewAccessModal open={modalOpen} onClose={() => setModalOpen(false)} initialRoleId={editingRoleId} />
    </div>
  );
};

const AccessManagementView = ({ roles = [], onCreate, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const labelMap = MODULES.reduce((acc, m) => {
    acc[m.id] = m.label;
    return acc;
  }, {});

  const renderPagesText = (modules) => {
    if (!modules || modules.length === 0) return "—";
    if (modules.length === MODULES.length) return "All Pages";
    return modules.map((m) => labelMap[m] || m).join(", ");
  };

  const filteredRoles = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearch) {
      return roles;
    }

    return roles.filter((role) => {
      const idMatch = String(role.id).toLowerCase().includes(lowerCaseSearch);
      const nameMatch = role.name.toLowerCase().includes(lowerCaseSearch);
      return idMatch || nameMatch;
    });
  }, [roles, searchTerm]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-800">User Access Management</h2>

        <div className="flex items-center gap-3">
          <div className="relative bg-[#EAEAEA]">
            <input
              type="text"
              placeholder="Search by ID or Role"
              className="border border-slate-300 rounded-md pl-3 pr-8 py-1.5 text-xs w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-2 top-1.5 text-slate-400 text-xs">🔍</span>
          </div>

          <button
            onClick={onCreate}
            className="bg-[#243874] hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md"
          >
            + New Access
          </button>
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="min-w-full text-xs">
          <thead className="bg-[#F8F8F8] border-b border-slate-200">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-600 w-12">ID</th>
              <th className="px-3 py-2 text-left font-medium text-slate-600 w-28">Role</th>
              <th className="px-3 py-2 text-left font-medium text-slate-600">Pages</th>
              <th className="px-3 py-2 text-left font-medium text-slate-600 w-20">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRoles.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-3 py-8 text-center text-slate-500">
                  {searchTerm ? `No roles found for "${searchTerm}"` : "No roles yet"}
                </td>
              </tr>
            ) : (
              filteredRoles.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                  <td className="px-3 py-2 text-sky-700 font-medium">{r.id}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2 text-slate-700">{renderPagesText(r.modules)}</td>
                  <td className="px-3 py-2">
                    <button onClick={() => onEdit(r.id)} className="text-xs text-blue-600 hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAccessManagement;