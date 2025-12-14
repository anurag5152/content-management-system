// src/User/AddUserDrawer.jsx
import NewUserForm from "./NewUserForm";

const AddUserDrawer = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[520px] bg-white h-full shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            Add New User
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="p-5">
          <NewUserForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default AddUserDrawer;
