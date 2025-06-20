"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../components/context/SidebarContext";
import { FaChevronDown } from "react-icons/fa";

// Icons
import { CiGrid41, CiViewTable } from "react-icons/ci";
import { FaWpforms } from "react-icons/fa6";

// ✅ MENU DATA
const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <CiGrid41 color="#FF6900" />,
  },
  {
    name: "HomePage", // Not clickable
    icon: <FaWpforms color="#FF6900" />,
    children: [
      {
        name: "Navbar",
        path: "/homepage/slider-settings",
        icon: <CiViewTable color="#FF6900" />,
      },
      {
        name: "Banner Settings",
        path: "/homepage/banner-settings",
        icon: <CiViewTable color="#FF6900" />,
      },
      {
        name: "Footer Settings",
        path: "/homepage/#!",
        icon: <CiViewTable color="#FF6900" />,
      },
    ],
  },
  {
    name: "Tables",
    path: "/getalldata",
    icon: <CiViewTable color="#FF6900" />,
  },

  {
    name: "Admin",
    path: "/admin",
    icon: <CiViewTable color="#FF6900" />,
  },
];

// ✅ COMPONENT
export default function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleToggle = (path) => {
    setOpenSubmenu((prev) => (prev === path ? null : path));
  };

  const renderMenuItems = (items, depth = 0) => {
    return (
      <ul className={`flex flex-col gap-1 ${depth > 0 ? "ml-0" : ""}`}>
        {items.map((item) => {
          const isActive = pathname === item.path;
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openSubmenu === item.name;

          return (
            <li key={item.path || item.name}>
              {hasChildren ? (
                <>
                  <div
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click bubbling
                      handleToggle(item.name);
                    }}
                    className={`flex items-center justify-between w-full py-2 px-2 rounded transition-all hover:bg-orange-100 cursor-pointer ${isOpen ? "bg-orange-50" : ""
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && (
                        <span className="text-xl">{item.icon}</span>
                      )}
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </div>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <FaChevronDown
                        className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </div>

                  {/* Dropdown content */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "1000px" : "0px" }}
                  >
                    <div className="border-l border-gray-200">
                      {renderMenuItems(item.children, depth + 1)}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 py-2 px-2 rounded transition-all hover:bg-orange-100 ${isActive ? "bg-orange-50" : ""
                    }`}
                >
                  {item.icon && <span className="text-xl">{item.icon}</span>}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span>{item.name}</span>
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 px-5 mt-16 lg:mt-0 bg-white dark:bg-gray-900 dark:border-gray-800 border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : "..."}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
