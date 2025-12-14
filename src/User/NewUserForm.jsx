import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const NewUserForm = ({ onClose, onSuccess }) => {
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
    reporting_manager_id: "",
    designation: "",
    job_type: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  /* ==========================
     FETCH ROLES & USERS
  ========================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, usersRes] = await Promise.all([
          axios.get(`${API}/api/roles`),
          axios.get(`${API}/api/users`),
        ]);

        setRoles(rolesRes.data || []);
        setManagers(usersRes.data || []);
      } catch (err) {
        setError("Failed to load roles or users");
      }
    };

    fetchData();
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

    // Mandatory fields (as per your rule)
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "password",
      "role_id",
      "reporting_manager_id",
      "designation",
      "job_type",
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        setError("Please fill all required fields");
        return;
      }
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("username", form.email);

      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      if (profileImage) {
        fd.append("profile_image", profileImage);
      }

      await axios.post(`${API}/api/users`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.error || "Failed to create user");
    }
  };

  /* ==========================
     UI (DRAWER CONTENT ONLY)
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

      {/* PASSWORD */}
      <input
        name="password"
        type="password"
        placeholder="Password *"
        className="border p-2 rounded w-full"
        value={form.password}
        onChange={handleChange}
      />

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
              {u.name || u.email}
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

      {/* PROFILE IMAGE (OPTIONAL) */}
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

      {/* PROFILE SUMMARY (OPTIONAL) */}
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
          className="px-4 py-2 text-slate-600 hover:text-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${
            loading
              ? "bg-slate-400"
              : "bg-[#243874] hover:bg-[#1f3160]"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default NewUserForm;
