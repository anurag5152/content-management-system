import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRolesList, selectRolesStatus, fetchRoles, createRole, updateRole } from "../store/rolesSlice.js";
import { MODULES } from "../modules/modules.jsx";

const AddNewAccessModal = ({ open, onClose, initialRoleId = null }) => {
    const dispatch = useDispatch();
    const roles = useSelector(selectRolesList);
    const rolesStatus = useSelector(selectRolesStatus);

    const [mode, setMode] = useState("create");
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [roleName, setRoleName] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && roles.length === 0 && rolesStatus !== "loading") {
            dispatch(fetchRoles());
        }
    }, [open, roles.length, dispatch, rolesStatus]);

    useEffect(() => {
        if (!open) return;
        setError(null);
        setSaving(false);
        if (initialRoleId) {
            const r = roles.find((x) => x.id === initialRoleId);
            if (r) {
                setSelectedRoleId(r.id);
                setRoleName(r.name);
                setSelectedModules(r.modules || []);
                setMode("edit");
            } else {
                setSelectedRoleId(null);
                setRoleName("");
                setSelectedModules([]);
                setMode("create");
            }
        } else {
            setSelectedRoleId(null);
            setRoleName("");
            setSelectedModules([]);
            setMode("create");
        }
    }, [open, initialRoleId, roles]);

    const rolesOptions = useMemo(() => {
        return [{ id: "__create", name: "Create new role" }, ...(roles || [])];
    }, [roles]);

    const toggleModule = (moduleId) => {
        setSelectedModules((prev) =>
            prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
        );
    };

    const handleRoleSelectChange = (e) => {
        const val = e.target.value;
        if (val === "__create") {
            setMode("create");
            setSelectedRoleId(null);
            setRoleName("");
            setSelectedModules([]);
            return;
        }
        const idNum = parseInt(val, 10);
        const r = roles.find((x) => x.id === idNum);
        if (r) {
            setMode("edit");
            setSelectedRoleId(r.id);
            setRoleName(r.name);
            setSelectedModules(r.modules || []);
        } else {
            setMode("create");
            setSelectedRoleId(null);
            setRoleName("");
            setSelectedModules([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (mode === "create") {
            if (!roleName.trim()) {
                setError("Role name is required.");
                return;
            }
        }
        const payloadModules = Array.from(new Set(selectedModules));

        setSaving(true);
        try {
            if (mode === "create") {
                await dispatch(createRole({ name: roleName.trim(), modules: payloadModules })).unwrap();
            } else if (mode === "edit" && selectedRoleId) {
                await dispatch(updateRole({ id: selectedRoleId, name: roleName.trim(), modules: payloadModules })).unwrap();
            } else {
                setError("Invalid action");
                setSaving(false);
                return;
            }

            await dispatch(fetchRoles());

            setSaving(false);
            onClose && onClose();
        } catch (err) {
            setSaving(false);
            const msg = typeof err === "string" ? err : err?.error || err?.message || JSON.stringify(err);
            setError(msg || "Failed to save role");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => onClose && onClose()} />

            <div className="relative w-[720px] max-w-[95%] bg-white rounded-md shadow-xl border mt-[-40px]">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h3 className="text-lg font-semibold text-slate-800">Add New Access</h3>
                    <button
                        onClick={() => onClose && onClose()}
                        className="text-slate-500 hover:text-slate-700"
                        aria-label="close"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-2">Select Role *</label>
                            <select
                                value={selectedRoleId === null ? "__create" : String(selectedRoleId)}
                                onChange={handleRoleSelectChange}
                                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                            >
                                {rolesOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-2">Role Name *</label>
                            <input
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                placeholder="e.g. Reporter"
                                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-2">Select Page Module *</label>

                            <div className="min-h-[40px] border border-slate-200 rounded p-3 bg-white">
                                <div className="flex flex-wrap gap-2">
                                    {MODULES.map((m) => {
                                        const active = selectedModules.includes(m.id);
                                        return (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => toggleModule(m.id)}
                                                className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border ${active
                                                        ? "bg-slate-200 border-slate-300 text-slate-900"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <span className="truncate">{m.label}</span>
                                                {active ? (
                                                    <span className="text-xs text-slate-500">×</span>
                                                ) : null}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {error && <div className="text-sm text-red-600">{error}</div>}
                    </div>

                    <div className="px-5 py-4 border-t flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => onClose && onClose()}
                            className="px-4 py-2 rounded bg-transparent text-sm text-slate-600 hover:text-slate-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-6 py-2 rounded text-sm text-white ${saving ? "bg-slate-400" : "bg-[#243874] hover:bg-[#1f3160]"}`}
                        >
                            {saving ? "Saving..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewAccessModal;
