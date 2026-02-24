import { useRef } from "react"; // 1. Add useRef
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const AppBreadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // 2. Create a ref for the constraint boundary
  const constraintsRef = useRef(null);

  const mouseX = useMotionValue(20);
  const mouseY = useMotionValue(20);

  const springConfig = { damping: 40, stiffness: 200 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  if (!import.meta.env.DEV) return null;

  return (
    /* 3. Wrap in a div that covers the viewport to act as the boundary */
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-9999"
    >
      <motion.div
        drag
        // 4. Link the drag constraints to the ref
        dragConstraints={constraintsRef}
        dragMomentum={true}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
        style={{ x: dx, y: dy }}
        // 5. Ensure pointer-events-auto so the child is still clickable/draggable
        className="pointer-events-auto absolute bg-black/80 text-white rounded-xl shadow-2xl select-none border border-white/10 touch-none"
      >
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing px-3 py-1.5 text-[9px] font-black bg-white/10 rounded-t-xl flex items-center justify-between gap-1 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            DEV TOOL
          </div>
          <div className="opacity-40 text-[8px]">DRAG ME</div>
        </div>

        {/* Breadcrumb Content */}
        <div className="px-4 py-2">
          <Breadcrumbs
            size="sm"
            itemClasses={{
              item: "text-white/70 data-[current=true]:text-white text-sm font-medium transition-all hover:scale-105",
              separator: "text-white/30 px-2",
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
                  className={"cursor-pointer"}
                >
                  {segment}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumbs>
        </div>
      </motion.div>
    </div>
  );
};
