import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

/**
 * Props:
 * - onClose(): close drawer
 * - onSuccess(): refetch users list
 * - user: existing user object (ONLY for edit, null for create)
 */
const NewUserForm = ({ onClose, onSuccess, user = null }) => {
  const isEdit = Boolean(user);

  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    role_id: user?.role_id || "",
    reporting_manager_id: user?.reporting_manager_id || "",
    designation: user?.designation || "",
    job_type: user?.job_type || "",
    bio: user?.bio || "",
  });

  const [profileImage, setProfileImage] = useState(null);

  // When editing, fetch full user details (list view returns limited fields)
  useEffect(() => {
    if (!isEdit) return;

    const loadUser = async () => {
      try {
        setLoadingUser(true);
        const res = await axios.get(`${API}/api/users/${user.id}`);
        const u = res.data || {};

        setForm((prev) => ({
          ...prev,
          first_name: u.first_name || "",
          last_name: u.last_name || "",
          email: u.email || "",
          phone: u.phone || "",
          role_id: u.role_id || "",
          reporting_manager_id: u.reporting_manager_id || "",
          designation: u.designation || "",
          job_type: u.job_type || "",
          bio: u.bio || "",
        }));
      } catch (err) {
        console.error(err);
        setError("Failed to load user details");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [isEdit, user?.id]);

  /* ==========================
     FETCH ROLES & MANAGERS
  ========================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesRes, managersRes] = await Promise.all([
          axios.get(`${API}/api/roles`),
          axios.get(`${API}/api/users/managers`),
        ]);

        setRoles(rolesRes.data || []);
        setManagers(managersRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load roles or managers");
      }
    };

    loadData();
  }, []);

  /* ==========================
     INPUT HANDLER
  ========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ==========================
     SUBMIT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "role_id",
      "reporting_manager_id",
      "designation",
      "job_type",
    ];

    // Password required only when creating
    if (!isEdit) requiredFields.push("password");

    for (const field of requiredFields) {
      if (!form[field]) {
        setError("Please fill all required fields");
        return;
      }
    }

    try {
      setLoading(true);

      if (isEdit) {
        /* ========= EDIT USER ========= */
        await axios.put(`${API}/api/users/${user.id}`, {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          bio: form.bio || null,
          designation: form.designation,
          job_type: form.job_type,
          reporting_manager_id: form.reporting_manager_id,
          role_id: form.role_id,
          is_active: 1,
        });
      } else {
        /* ========= CREATE USER ========= */
        const fd = new FormData();

        fd.append("username", form.email); // backend rule
        fd.append("password", form.password);
        fd.append("first_name", form.first_name);
        fd.append("last_name", form.last_name);
        fd.append("email", form.email);
        fd.append("phone", form.phone);
        fd.append("bio", form.bio || "");
        fd.append("designation", form.designation);
        fd.append("job_type", form.job_type);
        fd.append("reporting_manager_id", form.reporting_manager_id);
        fd.append("role_id", form.role_id);

        if (profileImage) {
          fd.append("profile_image", profileImage);
        }

        await axios.post(`${API}/api/users`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err?.response?.data?.error || "Operation failed");
    }
  };

  /* ==========================
     UI
  ========================== */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* NAME */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="first_name"
          placeholder="First Name *"
          className="border p-2 rounded"
          value={form.first_name}
          onChange={handleChange}
        />
        <input
          name="last_name"
          placeholder="Last Name *"
          className="border p-2 rounded"
          value={form.last_name}
          onChange={handleChange}
        />
      </div>

      {/* EMAIL & PHONE */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email *"
          className="border p-2 rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone / WhatsApp *"
          className="border p-2 rounded"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      {/* PASSWORD (CREATE ONLY) */}
      {!isEdit && (
        <input
          name="password"
          type="password"
          placeholder="Password *"
          className="border p-2 rounded w-full"
          value={form.password}
          onChange={handleChange}
        />
      )}

      {/* ROLE & MANAGER */}
      <div className="grid grid-cols-2 gap-4">
        <select
          name="role_id"
          className="border p-2 rounded"
          value={form.role_id}
          onChange={handleChange}
        >
          <option value="">Select Role *</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <select
          name="reporting_manager_id"
          className="border p-2 rounded"
          value={form.reporting_manager_id}
          onChange={handleChange}
        >
          <option value="">Reporting Manager *</option>
          {managers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* DESIGNATION & JOB TYPE */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="designation"
          placeholder="Designation *"
          className="border p-2 rounded"
          value={form.designation}
          onChange={handleChange}
        />
        <input
          name="job_type"
          placeholder="Job Type *"
          className="border p-2 rounded"
          value={form.job_type}
          onChange={handleChange}
        />
      </div>

      {/* PROFILE IMAGE (CREATE ONLY) */}
      {!isEdit && (
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Profile Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </div>
      )}

      {/* BIO */}
      <textarea
        name="bio"
        placeholder="Profile Summary (Optional)"
        className="border p-2 rounded w-full"
        rows={3}
        value={form.bio}
        onChange={handleChange}
      />

      {error && <div className="text-sm text-red-600">{error}</div>}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-slate-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || loadingUser}
          className={`px-6 py-2 rounded text-white ${
            loading || loadingUser
              ? "bg-slate-400"
              : "bg-[#243874] hover:bg-[#1f3160]"
          }`}
        >
          {loading || loadingUser ? (loading ? "Saving..." : "Loading...") : isEdit ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default NewUserForm;
