import { NavLink } from "react-router-dom";
const UserSidebar = () => {
  const items = [
    {
      id: "access",
      to: "/UserAccessManagement",
      label: "User Access",
      
    },
    {
      id: "admins",
      to: "/dashboard/users/admins",
      label: "Admin Users",
      
    },
    {
      id: "users",
      to: "/dashboard/users/list",
      label: "Users",
      
    },
  ];

  return (
    <aside className="w-40 bg-[#1E1E1E] text-slate-100 ">

      <nav className="py-4 flex flex-col items-center gap-2">
        {items.map((it) => (
          <NavLink
            key={it.id}
            to={it.to}
            className={({ isActive }) =>
              `w-full flex flex-col items-center px-3 py-3 rounded-md transition-colors ${
                isActive ? "bg-[#313338] text-white" : "hover:bg-[#313338] text-slate-300"
              }`
            }
          >
            <span className="text-xs text-center">{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default UserSidebar;
