import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchModulesByRole } from "../store/modulesSlice";
import axios from "axios";
const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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
        if (u.profile_image) {
          setPreviewUrl(`${API}/${u.profile_image}`);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load user details");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [isEdit, user?.id]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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
        if (profileImage) {
          const fd = new FormData();
          fd.append("profile_image", profileImage);
          await axios.post(`${API}/api/users/${user.id}/photo`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        // If we edited the currently logged-in user, update their stored role and modules immediately
        try {
          const stored = localStorage.getItem("cms_user") || sessionStorage.getItem("cms_user");
          if (stored) {
            const currentUser = JSON.parse(stored);
            if (currentUser && currentUser.id === user.id) {
              // find role name from roles list
              const roleObj = roles.find((r) => String(r.id) === String(form.role_id));
              const newRoleName = roleObj ? roleObj.name : null;
              if (newRoleName) {
                currentUser.role = newRoleName;
                const storage = localStorage.getItem("cms_user") ? localStorage : sessionStorage;
                storage.setItem("cms_user", JSON.stringify(currentUser));
                console.log("Updated stored cms_user role to:", newRoleName);

                // fetch and update modules for the new role
                try {
                  await dispatch(fetchModulesByRole(newRoleName)).unwrap();
                  console.log("Updated modules after user role change for current user");
                } catch (e) {
                  console.error("Failed to fetch modules after user role change", e);
                }
              }
            }
          }
        } catch (e) {
          console.error("Failed to refresh current user's stored role/modules", e);
        }

      } else {
        const fd = new FormData();

        fd.append("username", form.email);
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

  const fileInputRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (isEdit) {
      try {
        if (!user?.id) {
          setError("Cannot upload image: missing user id");
          return;
        }
        const uploadUrl = `${API}/api/users/${user.id}/photo`;
        console.log("Uploading to:", uploadUrl);
        setUploadingImage(true);
        const fd = new FormData();
        fd.append("profile_image", file);
        const res = await axios.post(`${API}/api/users/${user.id}/photo`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setPreviewUrl(`${API}/${res.data.profile_image}`);
        setProfileImage(null);
        setError(null);
      } catch (err) {
        console.error(err);
        const status = err?.response?.status;
        const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message;
        setError(`Image upload failed${status ? ` (${status})` : ""}: ${serverMsg}`);
      } finally {
        setUploadingImage(false);
      }
    } else {
      setProfileImage(file);
    }
  };

  const triggerFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const avatarSrc = previewUrl || `${API}/uploads/users/default-avatar.svg`;

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
          <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button type="button" onClick={triggerFileDialog} className="border border-slate-300 px-3 py-1 rounded text-sm bg-white">
              Upload New Photo
            </button>
            {uploadingImage && <div className="text-sm text-slate-600">Uploading...</div>}
          </div>
          <div className="text-xs  mt-2">At least 150x150 px recommended JPG, PNG or JPEG is allowed</div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium">Basic Info</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-xs text-slate-600">First Name <span className="text-red-500">*</span></label>
            <input
              name="first_name"
              placeholder=""
              className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 w-full"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Last Name <span className="text-red-500">*</span></label>
            <input
              name="last_name"
              placeholder=""
              className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 w-full"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-xs text-slate-600">WhatsApp No. <span className="text-red-500">*</span></label>
            <input
              name="phone"
              placeholder=""
              className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 w-full"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Password { !isEdit && (<span className="text-red-500">*</span>)}</label>
            {!isEdit ? (
              <input
                name="password"
                type="password"
                placeholder=""
                className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 w-full"
                value={form.password}
                onChange={handleChange}
              />
            ) : (
              <input
                name="password-disabled"
                disabled
                placeholder="(unchanged)"
                className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 text-slate-400"
              />
            )}
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs text-slate-600">Email Address <span className="text-red-500">*</span></label>
          <input
            name="email"
            type="email"
            placeholder=""
            className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 w-full"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="text-xs text-slate-600">Profile Summary</label>
          <textarea
            name="bio"
            placeholder=""
            className="bg-[#F8F8F8] max-h-[10%] border-b-2 border-slate-200 w-full"
            rows={3}
            value={form.bio}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium">Professional Info</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-xs text-slate-600">Job Type <span className="text-red-500">*</span></label>
            <input
              name="job_type"
              placeholder=""
              className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 w-full"
              value={form.job_type}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Designation <span className="text-red-500">*</span></label>
            <input
              name="designation"
              placeholder=""
              className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 w-full"
              value={form.designation}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-xs text-slate-600">Reporting Manager <span className="text-red-500">*</span></label>
            <select
              name="reporting_manager_id"
              className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 w-full"
              value={form.reporting_manager_id}
              onChange={handleChange}
            >
              <option value=""></option>
              {managers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-600">Select Role <span className="text-red-500">*</span></label>
            <select
              name="role_id"
              className="bg-[#F8F8F8] p-1 border-b-2 border-slate-200 w-full"
              value={form.role_id}
              onChange={handleChange}
            >
              <option value=""></option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="pt-4 border-t">
        <button
          type="submit"
          disabled={loading || loadingUser}
          className={`w-full px-6 py-3 rounded text-white ${
            loading || loadingUser
              ? "bg-slate-400"
              : "bg-[#243874] hover:bg-[#1f3160]"
          }`}
        >
          {loading || loadingUser ? (loading ? "Saving..." : "Loading...") : isEdit ? "Update" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default NewUserForm;
