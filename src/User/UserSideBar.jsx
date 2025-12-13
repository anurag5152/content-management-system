import { NavLink } from "react-router-dom";
const UserSidebar = () => {
  const items = [
    {
      id: "access",
      to: "/UserAccessManagement",
      label: "User Access Management",

    },
    {
      id: "admins",
      to: "/Users",
      label: "Admin User List",

    },
    {
      id: "users",
      to: "/dashboard/users/list",
      label: "Users",

    },
  ];

  return (
    <aside className="w-50 bg-[#1E1E1E] text-slate-100 ">

      <nav className="py-4 flex flex-col gap-2">
        {items.map((it) => (
          <NavLink
            key={it.id}
            to={it.to}
            className={({ isActive }) =>
              `w-[90%] ml-2 flex flex-col  px-4 py-3 rounded-md transition-colors ${isActive ? "bg-[#313338] text-white" : "hover:bg-[#313338] text-slate-300"
              }`
            }
          >
            <span className="text-xs ">{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default UserSidebar;
