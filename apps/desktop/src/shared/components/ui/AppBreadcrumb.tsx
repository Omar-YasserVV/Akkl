import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { BiChevronDown, BiChevronUp, BiSearch } from "react-icons/bi";

export const AppBreadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false); // New State
  const pathnames = location.pathname.split("/").filter(Boolean);

  const constraintsRef = useRef(null);
  const mouseX = useMotionValue(20);
  const mouseY = useMotionValue(20);

  const springConfig = { damping: 50, stiffness: 200 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchValue.trim()) {
      const targetPath = searchValue.startsWith("/")
        ? searchValue
        : `/${searchValue}`;
      navigate(targetPath);
      setSearchValue("");
    }
  };

  if (!import.meta.env.DEV) return null;

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-9999"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={true}
        dragElastic={0.1}
        style={{ x: dx, y: dy }}
        // Added animate prop for smooth width transitions
        animate={{ width: isCollapsed ? 120 : 260 }}
        className="pointer-events-auto absolute bg-black/90 text-white rounded-xl shadow-2xl select-none border border-white/10 touch-none overflow-hidden"
      >
        {/* Drag Handle & Toggle Area */}
        <div
          className="cursor-grab active:cursor-grabbing px-3 py-1.5 text-[9px] font-black bg-white/10 rounded-t-xl flex items-center justify-between gap-1 border-b border-white/5"
          onDoubleClick={() => setIsCollapsed(!isCollapsed)} // Double click handle to toggle
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            DEV TOOL
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-white/10 p-0.5 rounded transition-colors pointer-events-auto"
          >
            {isCollapsed ? (
              <BiChevronDown size={10} />
            ) : (
              <BiChevronUp size={10} />
            )}
          </button>
        </div>

        {/* Collapsible Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Breadcrumb Content */}
              <div className="px-4 pt-2 pb-1">
                <Breadcrumbs
                  size="sm"
                  itemClasses={{
                    item: "text-white/70 data-[current=true]:text-white text-[11px] font-medium transition-all hover:scale-105",
                    separator: "text-white/30 px-1",
                  }}
                >
                  <BreadcrumbItem
                    onClick={() => navigate("/")}
                    className="cursor-pointer"
                  >
                    home
                  </BreadcrumbItem>
                  {pathnames.map((segment, index) => {
                    const isLast = index === pathnames.length - 1;
                    const path = "/" + pathnames.slice(0, index + 1).join("/");
                    return (
                      <BreadcrumbItem
                        key={path}
                        isCurrent={isLast}
                        onClick={() => !isLast && navigate(path)}
                        className="cursor-pointer"
                      >
                        {segment}
                      </BreadcrumbItem>
                    );
                  })}
                </Breadcrumbs>
              </div>

              {/* Search Input Section */}
              <div className="px-3 pb-3 pt-1">
                <div className="relative flex items-center group">
                  <BiSearch className="absolute left-2 w-3 h-3 text-white/30 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Jump to route..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full bg-white/5 border border-white/10 rounded-md py-1 pl-7 pr-2 text-[10px] focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
