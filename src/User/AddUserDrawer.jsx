import NewUserForm from "./NewUserForm";

const AddUserDrawer = ({
  open,
  onClose,
  user = null,
  onSuccess,
}) => {
  if (!open) return null;

  const isEdit = Boolean(user);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <div className="relative w-[480px] bg-white h-full shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-[#243874]">
            {isEdit ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 text-xl leading-none hover:text-slate-800"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          <NewUserForm
            onClose={onClose}
            onSuccess={onSuccess}
            user={user} 
          />
        </div>
      </div>
    </div>
  );
};

export default AddUserDrawer;
