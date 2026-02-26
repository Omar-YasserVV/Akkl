import { useState } from "react";
import { Button, cn, Tooltip } from "@heroui/react";
import {
  ChevronsLeftRight,
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Warehouse,
  BarChart3,
  Settings,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Moved the logic for determining active route out of the routes array.
  const getIsActive = (routePath: string, name: string) => {
    if (name === "Overview") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(routePath);
  };

  const routes = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: <LayoutDashboard size={22} />,
    },
    {
      name: "Live Orders",
      path: "/dashboard/live-orders",
      icon: <ShoppingBag size={22} />,
    },
    {
      name: "Menu Manager",
      path: "/dashboard/menu-manager",
      icon: <UtensilsCrossed size={22} />,
    },
    {
      name: "Warehouse",
      path: "/dashboard/warehouse",
      icon: <Warehouse size={22} />,
    },
    {
      name: "Finance & Reports",
      path: "/dashboard/finance-reports",
      icon: <BarChart3 size={22} />,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={22} />,
    },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 290 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-screen flex flex-col bg-background sticky top-0 left-0"
    >
      {/* Header Section */}
      <div
        className={cn(
          "flex items-center h-20 px-4 mb-4",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.img
              key="full-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              src="/Logo.svg"
              alt="logo"
              className="h-8 w-auto"
            />
          ) : (
            <motion.img
              key="mini-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src="/fork.svg"
              alt="logo"
              className="h-8 w-auto"
            />
          )}
        </AnimatePresence>

        {!isCollapsed && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setIsCollapsed(true)}
          >
            <ChevronsLeftRight size={18} />
          </Button>
        )}
      </div>

      {/* Re-expand button when collapsed */}
      {isCollapsed && (
        <div className="flex justify-center mb-6">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => setIsCollapsed(false)}
          >
            <ChevronsLeftRight size={18} />
          </Button>
        </div>
      )}

      {/* Navigation Section */}
      <div className="flex flex-col gap-2 px-3">
        {!isCollapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-bold tracking-widest text-default-400 ml-3 mb-2"
          >
            Main
          </motion.p>
        )}

        <nav className="flex flex-col gap-1.5">
          {routes.map((route) => {
            // Compute isActive once per route using shared logic
            const isActive = getIsActive(route.path, route.name);

            const content = (
              <Button
                as={NavLink}
                to={route.path}
                variant={isActive ? "solid" : "light"}
                className={cn(
                  "w-full h-12 transition-all duration-200",
                  isActive
                    ? "font-semibold bg-primary text-white"
                    : "font-medium text-default-600",
                  isCollapsed
                    ? "min-w-0 px-0 justify-center"
                    : "px-3 justify-start gap-4",
                )}
              >
                <div className="flex items-center justify-center shrink-0">
                  {route.icon}
                </div>

                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {route.name}
                  </motion.span>
                )}
              </Button>
            );

            return isCollapsed ? (
              <Tooltip
                key={route.path}
                content={route.name}
                placement="right"
                closeDelay={0}
              >
                {content}
              </Tooltip>
            ) : (
              <div key={route.path}>{content}</div>
            );
          })}
        </nav>
      </div>

      {/* Bottom spacer/Optional Footer */}
      <div className="mt-auto p-4">
        {/* You could add a logout or user profile trigger here */}
      </div>
    </motion.div>
  );
};

export default Sidebar;
