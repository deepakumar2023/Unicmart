"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../components/context/SidebarContext";
import { FaChevronDown } from "react-icons/fa";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

// Icons
import { CiGrid41, CiViewTable } from "react-icons/ci";
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import CategoryIcon from '@mui/icons-material/Category';

// ✅ MENU DATA
const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <CiGrid41 className="text-[#ff8b21]" />,
  },
  {
    name: "Home Page",
    icon: <HomeIcon className="text-[#ff8b21]" />,
    children: [
      {
        name: "Category",
        icon: <CategoryIcon className="text-[#ff8b21]" />,
        children: [
          {
            name: "GetCategory",
            path: "/homepage/category/getcategory",
            icon: <CiViewTable color="#FF6900" />,
          },
          //  {
          //   name: "AddCategory",
          //   path: "/homepage/category/addcategory",
          //   icon: <CiViewTable color="#FF6900" />,
          // },


        ]
      },




      {
        name: "DashBoardContent",
        icon: <DashboardCustomizeIcon className="text-[#ff8b21]" />,
        children: [
          {
            name: "GetDashBoardContent",
            path: "/homepage/dashboardContent/getdashboardcontent",
            icon: <CiViewTable color="#FF6900" />,
          },
          //  {
          //   name: "AddDashBoardContent",
          //   path: "/homepage/dashboardContent/adddashboardcontent",
          //   icon: <CiViewTable color="#FF6900" />,
          // },


        ]
      },





      {
        name: "Inquiry",
        icon: <AssignmentTurnedInIcon className="text-[#ff8b21]" />,
        children: [
          {
            name: "GetInquiry",
            path: "/homepage/Inquiry/getInquiry",
            icon: <CiViewTable color="#FF6900" />,
          },
          //  {
          //   name: "AddCategory",
          //   path: "/homepage/category/addcategory",
          //   icon: <CiViewTable color="#FF6900" />,
          // },


        ]
      },




      {
        name: "MenuData",
        icon: <MenuIcon className="text-[#ff8b21]" />,
        children: [
          {
            name: "Get Menu Data",
            path: "/homepage/menudata/getmenudata",
            icon: <CiViewTable color="#FF6900" />,
          },
          // {
          //   name: "Post Menu Data",
          //   path: "/homepage/menudata/addmenuData",
          //   icon: <CiViewTable color="#FF6900" />,
          // },

        ],
      },

      {
        name: "NewsLetters",
        icon: <NewspaperIcon className="text-[#ff8b21]" />,
        children: [
          {
            name: "Get Newsletter",
            path: "/homepage/newletter/getnewsletter",
            icon: <CiViewTable color="#FF6900" />,
          },
          // {
          //   name: "Post Menu Data",
          //   path: "/homepage/menudata/addmenuData",
          //   icon: <CiViewTable color="#FF6900" />,
          // },

        ],
      },


      {
        name: "PromoCode",

        icon: <QrCode2Icon className="text-[#ff8b21]" />,
        children: [
          {
            name: "Get PromoCode",
            path: "/homepage/promocode/getpromocode",
            icon: <CiViewTable color="#FF6900" />,
          },
          // {
          //   name: " Add Slider",
          //   path: "/homepage/promocode/addpromocode",
          //   icon: <CiViewTable color="#FF6900" />,
          // },

        ],
      },

  {
        name: "Slider",

        icon: <SlideshowIcon className="text-[#ff8b21]" />,
        children: [
          {
            name: "Get Slider",
            path: "/homepage/slider/getSlider",
            icon: <CiViewTable color="#FF6900" />,
          },
          // {
          //   name: " Add Slider",
          //   path: "/homepage/slider/addSlider",
          //   icon: <CiViewTable color="#FF6900" />,
          // },

        ],
      },



    ],
  },

];

export default function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  // ✅ State now tracks multiple open dropdowns
  const [openSubmenu, setOpenSubmenu] = useState({});

  const handleToggle = (name) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderMenuItems = (items, depth = 0) => {
    return (
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

                  {/* Dropdown */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "1000px" : "0px" }}
                  >
                    <div className="border-l border-gray-200 ">
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
              {/* <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              /> */}
              <h3 className=" font-extrabold">Apex Dashboard</h3>

            </>
          ) : (
            // <Image
            //   src="/images/logo/logo-icon.svg"
            //   alt="Logo"
            //   width={32}
            //   height={32}
            // />

            <h3 className=" font-extrabold text-[13px]">Apex Dashboard</h3>
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
