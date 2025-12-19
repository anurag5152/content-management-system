import { NavLink } from "react-router-dom";

const StorySidebar = () => {
  const items = [
    { label: "Add Story", to: "/AddStory" },
    { label: "View Story", to: "/ViewStory" },
    { label: "View Schedule Story", to: "/Dashboard/story/scheduled" },
    { label: "E-Paper PDF List", to: "/Dashboard/story/epaper" },
    { label: "Create Poll", to: "/Dashboard/story/poll" },
    { label: "Video List", to: "/Dashboard/story/videos" },
    { label: "Contact List", to: "/Dashboard/story/contacts" },
  ];

  return (
    <aside className="w-48 bg-[#1E1E1E] text-slate-200 py-6 px-2">
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-xs px-3 py-2 rounded-md ${
                isActive
                  ? "bg-[#3A3D45] text-white"
                  : "text-slate-300 hover:bg-[#313338]"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default StorySidebar;
