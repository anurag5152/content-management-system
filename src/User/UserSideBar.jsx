// src/pages/story/StorySidebar.jsx

/**
 * Small inner sidebar used inside the "User Management" area.
 * props:
 *  - active (string) : currently active tab id
 *  - onChange(tabId)  : callback to switch tab
 */
const StorySidebar = ({ active = "access", onChange = () => {} }) => {
  const tabs = [
    { id: "access", label: "User Access Management" },
    { id: "adminList", label: "Admin User List" },
    { id: "users", label: "Users" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100">
      <div className="px-4 py-3 border-b border-slate-800 text-sm font-semibold">
        User Management
      </div>

      <nav className="py-2">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              {/* optional small icon placeholder */}
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default StorySidebar;
