import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectModules } from "../store/modulesSlice";

const StorySidebar = () => {
  const modulesFromStore = useSelector(selectModules);
  const fallbackModules = JSON.parse(localStorage.getItem("cms_modules") || sessionStorage.getItem("cms_modules") || "[]");
  console.log("StorySidebar - modulesFromStore:", modulesFromStore, "fallbackModules:", fallbackModules);
  const modules = (modulesFromStore && modulesFromStore.length > 0) ? modulesFromStore : fallbackModules; 

  const items = [
    { label: "Add Story", to: "/AddStory", key: "add_story" },
    { label: "View Story", to: "/ViewStory", key: "view_story" },
    { label: "View Schedule Story", to: "/Dashboard/story/scheduled", key: "view_scheduled_story" },
    { label: "E-Paper PDF List", to: "/Dashboard/story/epaper", key: "epaper" },
    { label: "Create Poll", to: "/Dashboard/story/poll", key: "create_poll" },
    { label: "Video List", to: "/Dashboard/story/videos", key: "video_list" },
    { label: "Contact List", to: "/Dashboard/story/contacts", key: "contact_list" },
  ];

  const allowedItems = items.filter(item => modules.includes(item.key));



  return (
    <aside className="w-48 bg-[#1E1E1E] text-slate-200 py-6 px-2">
      <nav className="flex flex-col gap-1">
        {allowedItems.map((item) => (
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
