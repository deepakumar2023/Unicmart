"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../components/context/SidebarContext";
import { FaChevronDown } from "react-icons/fa";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { CiGrid41, CiViewTable } from "react-icons/ci";
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import CategoryIcon from '@mui/icons-material/Category';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DiscountIcon from '@mui/icons-material/Discount';
import Crop169Icon from '@mui/icons-material/Crop169';

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <CiGrid41 className="text-[#ff8b21]" />,
  },
  
];

export default function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState({});

  const handleToggle = (name) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderMenuItems = (items, depth = 0) => (
    <ul className={`flex flex-col gap-1 ${depth > 0 ? "ml-0" : ""}`}>
      {items.map((item) => {
        const isActive = pathname === item.path;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = !!openSubmenu[item.name];

        return (
          <li key={item.path || item.name}>
            {hasChildren ? (
              <>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(item.name);
                  }}
                  className={`flex items-center justify-between w-full py-2 px-2 rounded transition-all hover:bg-orange-100 cursor-pointer ${isOpen ? "bg-orange-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-xl">{item.icon}</span>}
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </div>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  )}
                </div>
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
                className={`flex items-center gap-3 py-2 px-2 rounded transition-all hover:bg-orange-100 ${isActive ? "bg-orange-50" : ""}`}
              >
                {item.icon && <span className="text-xl">{item.icon}</span>}
                {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 px-5 pt-4 lg:pt-0 bg-white dark:bg-gray-900 dark:border-gray-800 border-r border-gray-200 transition-all duration-300 ease-in-out
        flex flex-col h-full
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
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <h3 className="font-extrabold">UnicmartDashboard</h3>
          ) : (
            <h3 className="font-extrabold text-[13px]">Unicmart</h3>
          )}
        </Link>
      </div>

      {/* Menu - Scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
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
