"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "../../components/context/SidebarContext";
import { ThemeToggleButton } from "../../components/header/ThemeToggleButton";
import UserDropdown from "../../components/header/UserDropdown";

// import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
// import UserDropdown from "@/components/header/UserDropdown";

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const inputRef = useRef(null);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
          >
            {isMobileOpen ? (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.22 7.28a.75.75 0 0 1 1.06 0L12 11.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L13.06 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L12 13.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L10.94 12 6.22 7.28a.75.75 0 0 1 0-1.06Z"
                />
              </svg>
            ) : (
              <svg width="16" height="12" fill="none" viewBox="0 0 16 12">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.58 1a.75.75 0 0 1 .75-.75h13.33a.75.75 0 0 1 0 1.5H1.33A.75.75 0 0 1 0.58 1ZM0.58 11a.75.75 0 0 1 .75-.75h13.33a.75.75 0 0 1 0 1.5H1.33A.75.75 0 0 1 0.58 11ZM1.33 5.25a.75.75 0 0 0 0 1.5h6.67a.75.75 0 0 0 0-1.5H1.33Z"
                />
              </svg>
            )}
          </button>

          <Link href="/" className="lg:hidden">
            {/* <Image
              width={154}
              height={32}
              src="/images/logo/logo.svg"
              alt="Logo"
              className="dark:hidden"
            /> */}

              <h3 className=" font-extrabold">UnicmartDashboard</h3>
            {/* <Image
              width={154}
              height={32}
              src="/images/logo/logo-dark.svg"
              alt="Logo"
              className="hidden dark:block"
            /> */}
          </Link>

          <div
            // onClick={toggleApplicationMenu}
            className="flex items-center justify-center  h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            {/* <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 10.5a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 6 10.5ZM18 10.5a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 18 10.5ZM12 10.5a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 12 10.5Z"
              />
            </svg> */}
               <UserDropdown />
          </div>
          

          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04 9.37a6.33 6.33 0 1 1 12.67 0 6.33 6.33 0 0 1-12.67 0ZM9.38 1.54a7.83 7.83 0 1 0 4.98 14.68l2.82 2.82a.75.75 0 1 0 1.06-1.06l-2.82-2.82a7.83 7.83 0 0 0-6.04-13.62Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-[4.5px] text-xs text-gray-500 border border-gray-200 bg-gray-50 rounded-lg dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span>⌘</span>
                  <span>K</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none `}
         
        >
          <div className="flex items-center gap-2 2xsm:gap-3 cursor-pointer">
            {/* <ThemeToggleButton /> */}
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
